// @/utils/poseGenerator.js
import axios from 'axios';

export default async function generatePose(prompt, model) {
  try {
    const response = await axios.post(
      'http://localhost:5000/chat', // 假设Flask服务器运行在本地5000端口
      {
        prompt: prompt,
        model: model,
      }
    );

    // 返回助手的回复
    return response.data.response;
  } catch (error) {
    throw new Error(`API request failed: ${error.message}`);
  }
}