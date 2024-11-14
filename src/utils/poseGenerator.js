// src/utils/poseGenerator.js

// 模拟生成姿势数据
async function generatePose(prompt) {
    console.log(prompt)
    // 模拟异步请求
    return new Promise((resolve) => {
      setTimeout(() => {
        const examplePose = {
          "head": { "position": [0, 1, 0], "rotation": [0, 0, 0] },
          "leftArm": { "position": [-1, 0.5, 0], "rotation": [0, 0, 0] },
          "rightArm": { "position": [1, 0.5, 0], "rotation": [0, 0, 0] },
          "leftLeg": { "position": [-0.5, -1, 0], "rotation": [0, 0, 0] },
          "rightLeg": { "position": [0.5, -1, 0], "rotation": [0, 0, 0] }
        };
        resolve(examplePose);
      }, 1000);
    });
  }
  
  module.exports = generatePose;