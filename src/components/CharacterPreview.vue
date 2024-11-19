<template>
    <div class="character-preview">
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script>
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';

export default {
    data() {
        return {
            scene: null,
            camera: null,
            renderer: null,
            character: null,
        };
    },
    mounted() {
        this.initThree();
        // 监听窗口大小变化
        window.addEventListener('resize', this.onWindowResize, false);
    },
    beforeUnmount() {
        // 移除监听器
        window.removeEventListener('resize', this.onWindowResize);
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

                // 获取骨架
                const skeleton = new THREE.SkeletonHelper(character);
                scene.add(skeleton);
                // 获取模型的骨架信息
                console.log(skeleton);

                // 查找名为 "MoxamoRig1LeftArm" 的骨骼
                function findBoneByName(bones, name) {
                    for (let i = 0; i < bones.length; i++) {
                        if (bones[i].name === name) {
                            return bones[i];
                        }
                    }
                    return null;
                }

                // 获取骨骼
                const bone = findBoneByName(skeleton.bones, 'mixamorig1LeftArm');

                if (bone) {
                    // 设置骨骼绕X轴旋转90度
                    // 注意: 在Three.js中，角度需要以弧度为单位
                    bone.rotation.x = Math.PI / 3; // 90度等于π/2弧度
                } else {
                    console.error('未能找到骨骼 "MoxamoRig1LeftArm"');
                }


            });



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

        },
        onWindowResize() {
            if (!this.camera || !this.renderer) return;

            const container = this.$refs.canvas.parentElement;

            const aspectRatio = container.clientWidth / container.clientHeight;
            this.camera.aspect = aspectRatio;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(container.clientWidth, container.clientHeight);
        },
    },
    setup() {
    const store = useStore();

    const skeletonOperations = computed(() => store.state.skeletonOperations);

    const applyOperation = (op) => {
      console.log(`Operation ${op.operation} Bone name ${op.boneName} Direction ${op.direction} Quantity ${op.quantity}`);
      // 这里应该有实际更新骨骼位置或旋转的代码
      
    };

    watch(skeletonOperations, (newOps) => {
      console.log('New skeleton operations:', newOps);
      newOps.forEach(op => {
        applyOperation(op);
      });
    }, { deep: true });

    onMounted(() => {
      // 初始化你的 Three.js 场景
      console.log('Three.js component mounted');
    });

    return {};
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