import express from "express";
import dotenv from 'dotenv';
dotenv.config();

import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

const router = express.Router();

// Hi-tech Constructions Business Knowledge
const businessKnowledge = {
  company: {
    name: "Hi-tech Constructions & Builders",
    experience: "25 years",
    established: "2000",
    specialties: [
      "Residential Construction",
      "Commercial Buildings",
      "Industrial Projects",
      "Interior Design",
      "Renovation & Remodeling",
      "Project Management",
    ],
  },
  services: {
    residential: ["Custom Homes", "Apartments", "Villas", "Townhouses"],
    commercial: ["Office Buildings", "Retail Spaces", "Hotels", "Hospitals"],
    industrial: ["Warehouses", "Factories", "Industrial Facilities"],
    specialServices: [
      "Architectural Design",
      "Interior Finishing",
      "Landscaping",
    ],
  },
};

// AI System Instructions
const systemPrompt = `You are an AI assistant for Hi-tech Constructions & Builders, a premium construction company with 25 years of experience (established in 2000).

COMPANY OVERVIEW:
- Founder: Ahmed Basha
- CEO & Chief Engineer: Hasan Mehadi
- Contact Numbers: +91 88259 49238, +91 98942 31759
- Email: hitechconstructions256@gmail.com.
- Office Address: Rajaji Nagar, Stadium 2nd Gate Opposite Building, 1st Floor, Krishnagiri
- Specializes in residential, commercial, duplex, and industrial construction
- Known for quality craftsmanship, innovative design, and timely project delivery
- Uses cutting-edge technology and sustainable building practices
- Serves clients nationwide with a focus on customer satisfaction
- Offers free consultations and detailed project planning
- No hiring is open for now

YOUR ROLE:
- Provide clear and helpful information about our construction services
- Help potential clients understand our capabilities and processes
- Answer questions about construction timelines, materials, and costs
- Share contact, founder, CEO, and office details when asked
- Guide users through our consultation and project planning process
- Maintain a professional, knowledgeable, and concise tone

BUSINESS KNOWLEDGE:
${JSON.stringify(businessKnowledge, null, 2)}

GUIDELINES:
1. Always be professional, courteous, and answer in max 3 lines
2. Provide specific answers about construction services
3. If asked about pricing, explain that costs vary by project and offer consultation
4. If customer asks for detailed or customized info beyond basics, encourage them to schedule a free consultation with our team
5. Emphasize our 25+ years of experience and quality commitment
6. For complex technical questions, offer to connect them with our specialists
7. If you don't know specific details, be honest and offer to have our team follow up

Remember: You represent a premium construction company with a quarter-century of excellence.`;

// Initialize AI Model
const llm = new ChatGroq({
  model: "openai/gpt-oss-120b", // Updated to a more reliable model
  temperature: 0.1,
  maxRetries: 2,
  apiKey: process.env.GROQ_API_KEY,
});

// Simple chat history storage (in production, use a proper database)
const chatHistories = new Map();

// AI Processing Function
const processChat = async (message, sessionId = "default") => {
  console.info("Processing chat request...");

  try {
    // Get or initialize chat history for this session
    if (!chatHistories.has(sessionId)) {
      chatHistories.set(sessionId, [new SystemMessage(systemPrompt)]);
    }

    const history = chatHistories.get(sessionId);
    
    // Add user message to history
    const userMessage = new HumanMessage(message);
    history.push(userMessage);

    // Get response from AI
    const response = await llm.invoke(history);
    
    // Add AI response to history
    history.push(response);

    // Limit history size to prevent excessive memory usage
    if (history.length > 20) {
      // Keep system message and last 9 exchanges (18 messages)
      const systemMsg = history[0];
      const recentHistory = history.slice(-18);
      chatHistories.set(sessionId, [systemMsg, ...recentHistory]);
    }

    return response.content;
  } catch (error) {
    console.error("Chat Processing Error:", error);
    throw new Error("Failed to process your request. Please try again.");
  }
};

// Chat API Endpoint
router.post("/chat", async (req, res) => {
  try {
    const { message, sessionId = "default" } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: "Valid message is required",
        timestamp: new Date().toISOString(),
      });
    }

    const reply = await processChat(message, sessionId);

    console.log(
      `Chat [${sessionId}]: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}" -> "${reply.substring(0, 50)}..."`
    );

    res.json({
      success: true,
      response: reply,
      sessionId: sessionId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chat Endpoint Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Sorry, I encountered an issue. Please try again.",
      timestamp: new Date().toISOString(),
    });
  }
});

// Health Check
router.get("/status", (req, res) => {
  res.json({
    service: "HI-Tech Constructions Chatbot",
    status: "operational",
    version: "1.0.0",
    company: businessKnowledge.company.name,
    experience: businessKnowledge.company.experience,
    activeSessions: chatHistories.size,
  });
});

// Clear chat history endpoint (optional)
router.post("/clear-history", (req, res) => {
  const { sessionId = "default" } = req.body;
  
  if (chatHistories.has(sessionId)) {
    chatHistories.delete(sessionId);
    res.json({
      success: true,
      message: "Chat history cleared",
      sessionId: sessionId,
    });
  } else {
    res.json({
      success: false,
      message: "No chat history found for this session",
      sessionId: sessionId,
    });
  }
});

export default router;