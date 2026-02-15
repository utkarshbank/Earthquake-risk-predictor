import { GoogleGenerativeAI } from "@google/generative-ai";
import { ReportData } from "./imageAnalysis";

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

import { HazardType } from "./imageAnalysis";

export const getHazardChatResponse = async (
    userMessage: string,
    history: ChatMessage[],
    reportContext: ReportData,
    hazard: HazardType,
    region?: string
): Promise<string> => {
    try {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
            return "⚠️ **Gemini API Key is missing.**";
        }

        const personae = {
            seismic: 'the "Seismic Companion", an AI expert in seismology and structural engineering',
            wildfire: 'the "Ember Intelligence", an AI expert in wildfire behavior and forestry resilience',
            storm: 'the "Torrent Analyst", an AI expert in meteorology and hydrologic infrastructure'
        };

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
            systemInstruction: `
                You are ${personae[hazard]}.
                Your goal is to answer questions about a specific ${hazard} risk report provided in the context.
                
                CONTEXT DATA:
                Region: ${region || "Unknown"}
                Hazard Type: ${hazard}
                Justification: ${reportContext.justification || "None provided"}
                Temporal Trend: ${JSON.stringify(reportContext.temporalTrend)}
                Risk Distribution: ${JSON.stringify(reportContext.magnitudeDist)}
                Factors: ${JSON.stringify(reportContext.factorComparison)}
                
                RULES:
                1. Always refer to the data in the context when answering.
                2. Professional, concise, and focused on safety/science.
                3. Use markdown for better readability.
            `
        }, { apiVersion: 'v1beta' });

        const chat = model.startChat({
            history: history
                .filter((msg, index) => !(index === 0 && msg.role === 'assistant'))
                .map(msg => ({
                    role: msg.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: msg.content }]
                })),
        });

        const result = await chat.sendMessage(userMessage);
        const response = result.response;
        return response.text();
    } catch (error: any) {
        console.error("Hazard Chat error:", error);

        const errorString = String(error);
        const isQuota = errorString.includes('429') || errorString.toLowerCase().includes('quota');

        if (isQuota) {
            // "Low Power Mode" fallback
            const summary = reportContext.justification
                ? `Based on active telemetry: ${reportContext.justification}`
                : `I'm operating on low-power local vision telemetry. I can see current ${hazard} risk factors: ${JSON.stringify(reportContext.factorComparison)}.`;

            return `⚠️ **SATELLITE LINK SATURATED (QUOTA EXCEEDED)**\n\nAI verification node is temporarily offline. Switching to **Local Intelligence Mode**.\n\n${summary}\n\n*Please retry your specific query in ~20 seconds for full neural analysis.*`;
        }

        return `❌ **TRANSMISSION ERROR:** Secondary node failure (${error.message || "Uplink server error"}). Please refresh uplink.`;
    }
};
