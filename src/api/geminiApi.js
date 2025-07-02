import axios from "axios";

const geminiApi = axios.create({
  baseURL: "/api"
});

let lastRequestTime = 0;
let requestQueue = [];
let isProcessing = false;

// 🚦 Process requests one at a time to avoid rate limits
const processQueue = async () => {
  if (isProcessing || requestQueue.length === 0) return;
  
  isProcessing = true;
  
  while (requestQueue.length > 0) {
    const { prompt, resolve, reject } = requestQueue.shift();
    
    try {
      const result = await makeRequest(prompt);
      resolve(result);
    } catch (error) {
      reject(error);
    }
    
    // ⏱️ Wait 3 seconds between requests to respect rate limits
    if (requestQueue.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  isProcessing = false;
};

const makeRequest = async (prompt, retryCount = 0) => {
  const now = Date.now();

  // ⏱️ Throttle requests if sent too quickly (e.g. <3s apart)
  if (now - lastRequestTime < 3000) {
    const waitTime = 3000 - (now - lastRequestTime);
    await new Promise((res) => setTimeout(res, waitTime));
  }

  lastRequestTime = Date.now();

  try {
    const response = await geminiApi.post("/gemini", {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return text;
  } catch (error) {
    // 🔁 Handle 429 with exponential backoff
    if (error.response?.status === 429 && retryCount < 3) {
      const waitTime = Math.pow(2, retryCount + 1) * 2000; // Longer wait times
      await new Promise((res) => setTimeout(res, waitTime));
      return makeRequest(prompt, retryCount + 1);
    }

    // 🚫 Handle quota exceeded
    if (error.response?.status === 429) {
      const errorData = error.response?.data;
      if (errorData?.error?.message?.includes('quota') || errorData?.error?.message?.includes('RESOURCE_EXHAUSTED')) {
        return "⚠️ API quota exceeded! You've used up your daily/monthly limit. Please check your Google AI Studio dashboard or try again tomorrow.";
      }
      return "Rate limit exceeded. Please wait a few minutes before trying again.";
    }
    
    return "Oops! Something went wrong. Try again later.";
  }
};

geminiApi.gemini = async (prompt) => {
  return new Promise((resolve, reject) => {
    requestQueue.push({ prompt, resolve, reject });
    processQueue();
  });
};

export default geminiApi;
