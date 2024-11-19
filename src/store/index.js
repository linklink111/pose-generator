// src/store/index.js
import { createStore } from 'vuex';

export default createStore({
    state: {
        skeletonOperations: [], // 存储骨骼操作的数组
    },
    mutations: {
        addOperation(state, operation) {
            state.skeletonOperations.push(operation);
        },
        clearOperations(state) {
            state.skeletonOperations = [];
        }
    },
    actions: {},
    modules: {}
});