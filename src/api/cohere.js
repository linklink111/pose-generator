// src/api/cohere.js
import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: process.env.VUE_APP_COHERE_API_KEY,
});

export const chatStream = async (message, model = "command") => {
  const stream = await cohere.chatStream({
    model,
    message,
  });

  return stream;
};