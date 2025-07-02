import axios from "axios";

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const now = Date.now();
  if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - (now - lastRequestTime);
    return res.status(429).json({
      error: "Too many requests",
      message: "Please wait a moment before sending another message",
      retryAfter: Math.ceil(waitTime / 1000),
    });
  }
  lastRequestTime = now;

  try {
    const response = await axios.post(
      process.env.GEMINI_API_URL || "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent",
      req.body,
      {
        params: {
          key: process.env.GEMINI_API_KEY,
        },
        headers: {
          "Content-Type": "application/json",
          "Referer": process.env.GEMINI_REFERER || "http://localhost:3000",
          "User-Agent": "ChatBotAssistant/1.0",
        },
        timeout: 30000,
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    if (error.response?.status === 429) {
      const errorData = error.response?.data;
      if (
        errorData?.error?.message?.includes("quota") ||
        errorData?.error?.message?.includes("RESOURCE_EXHAUSTED")
      ) {
        return res.status(429).json({
          error: "Quota exceeded",
          message:
            "You've exceeded your API quota. Please check your Google AI Studio dashboard or upgrade your plan.",
          details: errorData?.error?.message,
          retryAfter: 86400,
        });
      }
      return res.status(429).json({
        error: "Rate limit exceeded",
        message: "Gemini API rate limit reached. Please wait a few minutes.",
        retryAfter: 60,
      });
    }
    res.status(error.response?.status || 500).json({ error: error.message });
  }
} 