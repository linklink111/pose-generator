<template>
    <div class="character-preview">
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script>
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default {
    mounted() {
        this.initThree();
    },
    methods: {
        initThree() {
            const container = this.$refs.canvas.parentElement;
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ canvas: this.$refs.canvas });

            // 设置渲染器背景颜色为灰色
            renderer.setClearColor(0x888888, 1);

            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);

            // 创建地面

            // 创建网格助手
            var axesHelper = new THREE.AxesHelper(12);
            scene.add(axesHelper);

            //网格线绘制
            var grid = new THREE.GridHelper(24, 24, 0xFF0000, 0x444444);
            grid.material.opacity = 0.4;
            grid.material.transparent = true;
            // grid.rotation.x = Math.PI/2.0;
            scene.add(grid);
            // 添加光照
            const ambientLight = new THREE.AmbientLight(0x404040, 1.0); // 灰色的环境光
            scene.add(ambientLight);
            // 方向光
            const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0); // 增加光照强度
            directionalLight.position.set(10, 10, 10).normalize();
            scene.add(directionalLight);

            // 加载角色模型
            const fbxLoader = new FBXLoader();
            let character; // 用于存储角色模型对象
            fbxLoader.load('/models/Ch36_nonPBR.fbx', (object) => {
                character = object;
                character.scale.set(0.05, 0.05, 0.05); // 调整模型的缩放比例
                character.position.set(0, 0, 0); // 调整模型的位置
                scene.add(character);

                // 设置动画控制器
                const mixer = new THREE.AnimationMixer(object);
                const action = mixer.clipAction(object.animations[0]);
                action.play();

                // 获取骨架
                const skeleton = new THREE.SkeletonHelper(character);
                scene.add(skeleton);
                // 操控骨架
                function manipulateSkeleton() {
                    if (character.skeleton) {
                        // 访问骨骼
                        const bones = character.skeleton.bones;
                        for (let i = 0; i < bones.length; i++) {
                            const bone = bones[i];
                            // 修改骨骼的位置和旋转
                            bone.position.y += 0.01; // 例如，稍微提高每个骨骼的高度
                            bone.rotation.y += 0.01; // 例如，稍微旋转每个骨骼
                        }
                    }
                }
                function animate() {
                    requestAnimationFrame(animate);
                    mixer.update(0.016); // 更新动画
                    manipulateSkeleton(); // 操控骨架
                    renderer.render(scene, camera);
                }
                animate();
            });
            // 假设角色模型已经加载完成
            // character.traverse((child) => {
            // if (child.isMesh) {
            //     child.material = new THREE.MeshStandardMaterial({
            //     color: 0xffffff, // 默认颜色
            //     metalness: 0.5, // 金属度
            //     roughness: 0.5  // 粗糙度
            //     });
            // }
            // });

            // 设置相机位置
            camera.position.set(0, 10, 10);
            camera.lookAt(new THREE.Vector3(0, 10, 10));
            // 添加轨道控制
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.25;
            controls.enableZoom = true;

            function animate() {
                requestAnimationFrame(animate);
                controls.update(); // 更新轨道控制
                renderer.render(scene, camera);
            }
            animate();
            // 监听窗口大小变化，调整渲染器大小
            window.addEventListener('resize', this.onWindowResize, false);
        },
        onWindowResize() {
            const container = this.$refs.canvas.parentElement;
            const camera = this.camera;
            const renderer = this.renderer;

            const aspectRatio = container.clientWidth / container.clientHeight;
            camera.aspect = aspectRatio;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
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