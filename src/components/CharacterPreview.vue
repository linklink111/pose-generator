<template>
    <div class="character-preview">
        <canvas ref="canvasRef"></canvas>
    </div>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CCDIKSolver, CCDIKHelper } from 'three/examples/jsm/animation/CCDIKSolver.js';
import {TransformControls} from 'three/examples/jsm/controls/TransformControls.js';
import { computed, onMounted, onBeforeUnmount, shallowRef, markRaw, watch } from 'vue';
import { useStore } from 'vuex';

export default {
    setup() {
        const store = useStore();
        const canvasRef = shallowRef(null);
        const scene = shallowRef(null);
        const camera = shallowRef(null);
        const renderer = shallowRef(null);
        const character = shallowRef(null);
        const initialRotations = {}; // 用于存储初始旋转值
        const IKSolver = shallowRef(null);
        const orbitControls = shallowRef(null); // 定义 orbitControls 变量

        const skeletonOperations = computed(() => store.state.skeletonOperations);

        const initThree = () => {
            const container = canvasRef.value.parentElement;

            scene.value = markRaw(new THREE.Scene());
            camera.value = markRaw(new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000));
            renderer.value = markRaw(new THREE.WebGLRenderer({ canvas: canvasRef.value }));

            // 设置渲染器背景颜色为灰色
            renderer.value.setClearColor(0x888888, 1);
            renderer.value.setSize(container.clientWidth, container.clientHeight);

            // 创建网格助手
            const axesHelper = new THREE.AxesHelper(12);
            scene.value.add(axesHelper);

            // 网格线绘制
            const grid = new THREE.GridHelper(24, 24, 0xFF0000, 0x444444);
            grid.material.opacity = 0.4;
            grid.material.transparent = true;
            scene.value.add(grid);

            // 添加光照
            const ambientLight = new THREE.AmbientLight(0x404040, 1.0); // 灰色的环境光
            scene.value.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0); // 增加光照强度
            directionalLight.position.set(10, 10, 10).normalize();
            scene.value.add(directionalLight);



            // 加载角色模型
            const gltfLoader = new GLTFLoader();
            gltfLoader.load('/models/character.glb', (object) => {
                character.value = markRaw(object.scene);
                character.value.scale.set(4, 4, 4); // 调整模型的缩放比例
                // character.value.position.set(0, 0, 0); // 调整模型的位置
                scene.value.add(character.value);
                // 获取骨架
                const skeleton = new THREE.SkeletonHelper(character.value);
                scene.value.add(skeleton);
                // 记录初始旋转值
                saveInitialRotations(character.value);

                const rightHandBone = character.value.getObjectByName('mixamorig1RightHandTarget');
                console.log(rightHandBone);

                // 设置 IK 解算器
                setupIKSolver();

                // 创建 TransformControls
                const transformControls = new TransformControls(camera.value, renderer.value.domElement);
                transformControls.size = 0.75;
                transformControls.space = 'world';
                transformControls.attach(rightHandBone);
                scene.value.add(transformControls.getHelper());
                // disable orbitControls while using transformControls
                transformControls.addEventListener( 'mouseDown', () => orbitControls.value.enabled = false );
                transformControls.addEventListener( 'mouseUp', () => orbitControls.value.enabled = true );
            });
            
            // 设置相机位置
            camera.value.position.set(0, 10, 10);
            camera.value.lookAt(new THREE.Vector3(0, 10, 10));

            // 添加轨道控制
            orbitControls.value = new OrbitControls(camera.value, renderer.value.domElement); // 赋值给 orbitControls
            orbitControls.value.enableDamping = true;
            orbitControls.value.dampingFactor = 0.25;
            orbitControls.value.enableZoom = true;

            const animate = () => {
                requestAnimationFrame(animate);
                orbitControls.value.update(); // 更新轨道控制
                
                // console.log(IKSolver.value);
                if (IKSolver.value) {
                    IKSolver.value.update();
                    // console.log("IKSolver updated")
                }
                renderer.value.render(scene.value, camera.value);
            };
            animate();
        };

        const onWindowResize = () => {
            if (!camera.value || !renderer.value) return;

            const container = canvasRef.value.parentElement;
            const aspectRatio = container.clientWidth / container.clientHeight;

            camera.value.aspect = aspectRatio;
            camera.value.updateProjectionMatrix();
            renderer.value.setSize(container.clientWidth, container.clientHeight);
        };

        const applyOperation = (op) => {
            const bone = findBoneByName(character.value, op.boneName);

            if (bone) {
                console.log(`Operation ${op.operation} Bone name ${op.boneName} Direction ${op.direction} Quantity ${op.quantity}`);

                switch (op.operation.toLowerCase()) {
                    case 'move':
                        // 移动骨骼
                        switch (op.direction.toLowerCase()) {
                            case 'x':
                                bone.position.x += op.quantity;
                                break;
                            case 'y':
                                bone.position.y += op.quantity;
                                break;
                            case 'z':
                                bone.position.z += op.quantity;
                                break;
                            default:
                                console.error('Invalid direction for move operation.');
                        }
                        break;
                    case 'reset':
                        // 遍历所有骨骼并重置其旋转到T姿势
                        resetBonesToTPose(character.value);
                        break;
                    case 'translate': // 移动
                        switch (op.direction.toLowerCase()) {
                            case 'x':
                                bone.position.x += op.quantity;
                                break;
                            case 'y':
                                bone.position.y += op.quantity;
                                break;
                            case 'z':
                                bone.position.z += op.quantity;
                                break;
                            default:
                                console.error('Invalid direction for translate operation.');
                        }
                        break;

                    case 'rotate': // 旋转
                        switch (op.direction.toLowerCase()) {
                            case 'x':
                                bone.rotation.x += op.quantity * (Math.PI / 180);
                                break;
                            case 'y':
                                bone.rotation.y += op.quantity * (Math.PI / 180);
                                break;
                            case 'z':
                                bone.rotation.z += op.quantity * (Math.PI / 180);
                                break;
                            default:
                                console.error('Invalid direction for rotate operation.');
                        }
                        break;

                    default:
                        console.error('Invalid operation type.');
                }

                // 更新场景
                renderer.value.render(scene.value, camera.value);
            } else {
                console.error(`Bone with name ${op.boneName} not found.`);
            }
        };

        const saveInitialRotations = (object) => {
            if (object.isBone) {
                initialRotations[object.name] = {
                    x: object.rotation.x,
                    y: object.rotation.y,
                    z: object.rotation.z
                };
            }

            object.children.forEach(child => {
                saveInitialRotations(child);
            });
        };

        const resetBonesToTPose = (object) => {
            if (object.isBone) {
                const initialRotation = initialRotations[object.name];
                if (initialRotation) {
                    object.rotation.set(initialRotation.x, initialRotation.y, initialRotation.z);
                }
            }

            object.children.forEach(child => {
                resetBonesToTPose(child);
            });
        };

        const findBoneByName = (object, name) => {
            if (object.isBone && object.name === name) {
                return object;
            }

            for (let i = 0; i < object.children.length; i++) {
                const child = object.children[i];
                const foundBone = findBoneByName(child, name);
                if (foundBone) {
                    return foundBone;
                }
            }

            return null;
        };

        const setupIKSolver = () => {
            let mesh = null;
            character.value.traverse((child) => {
                if (child.isSkinnedMesh) {
                    mesh = child;
                    console.log('SkinnedMesh found:', mesh);
                    console.log('Skeleton:', mesh.skeleton);
                    console.log('Bones:', mesh.skeleton.bones);

                    // 添加 SkeletonHelper 到场景中
                    const skeletonHelper = new THREE.SkeletonHelper(mesh);
                    scene.value.add(skeletonHelper);
                }
            });

            // 创建一个球体并attach到右手骨骼上(index 36)
            // const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
            // const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            // const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            // sphere.position.set(0, 0, 0); // 设置球体的初始位置为右手骨骼的位置
            // scene.value.add(sphere);

            // 设置IK解算器
            const iks = [
                {
                    target: 65, // 目标骨骼：右手
                    effector: 34, // 效果器骨骼
                    links: [
                        {
                            index: 33, // 右前臂
                            rotationMin: new THREE.Vector3(-1.57, -1.57, -1.57),
                            rotationMax: new THREE.Vector3(1.57, 1.57, 1.57)
                        },
                        {
                            index: 32, // 右上臂
                            rotationMin: new THREE.Vector3(-1.57, -1.57, -1.57),
                            rotationMax: new THREE.Vector3(1.57, 1.57, 1.57)
                        }
                    ]
                }
            ];
            
            // 遍历加载的模型，查找 SkinnedMesh 和 Skeleton
            scene.value.add(mesh);
            // scene.value.add(mesh.skeleton.bones[0]);
            IKSolver.value = new CCDIKSolver(mesh, iks);
            const ccdikhelper = new CCDIKHelper(mesh, iks, 0.1);
            scene.value.add(ccdikhelper);
        };

        watch(skeletonOperations, (newOps) => {
            console.log('New skeleton operations:', newOps);
            newOps.forEach(op => {
                applyOperation(op);
            });
        }, { deep: true });

        onMounted(() => {
            initThree();
            window.addEventListener('resize', onWindowResize, false);
        });

        onBeforeUnmount(() => {
            window.removeEventListener('resize', onWindowResize);
        });

        return {
            canvasRef
        };
    }
};
</script>

<style scoped>
.character-preview {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
}

.character-preview canvas {
    display: block;
    width: 100%;
    height: 100%;
}
</style>