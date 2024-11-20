<template>
    <div class="character-preview">
        <canvas ref="canvasRef"></canvas>
    </div>
</template>

<script>
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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
            const fbxLoader = new FBXLoader();
            fbxLoader.load('/models/Ch36_nonPBR.fbx', (object) => {
                character.value = markRaw(object);
                character.value.scale.set(0.05, 0.05, 0.05); // 调整模型的缩放比例
                character.value.position.set(0, 0, 0); // 调整模型的位置
                scene.value.add(character.value);

                // 获取骨架
                const skeleton = new THREE.SkeletonHelper(character.value);
                scene.value.add(skeleton);
            });

            // 设置相机位置
            camera.value.position.set(0, 10, 10);
            camera.value.lookAt(new THREE.Vector3(0, 10, 10));

            // 添加轨道控制
            const controls = new OrbitControls(camera.value, renderer.value.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.25;
            controls.enableZoom = true;

            const animate = () => {
                requestAnimationFrame(animate);
                controls.update(); // 更新轨道控制
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
                                bone.rotation.x += op.quantity* (Math.PI / 180);
                                break;
                            case 'y':
                                bone.rotation.y += op.quantity* (Math.PI / 180);
                                break;
                            case 'z':
                                bone.rotation.z += op.quantity* (Math.PI / 180);
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