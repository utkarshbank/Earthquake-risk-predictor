import { GoogleGenerativeAI } from "@google/generative-ai";
import { ReportData } from "./imageAnalysis";

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export const getSeismicChatResponse = async (
    userMessage: string,
    history: ChatMessage[],
    reportContext: ReportData,
    region?: string
): Promise<string> => {
    try {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
            return "⚠️ **Gemini API Key is missing.** Please ensure you have added `NEXT_PUBLIC_GEMINI_API_KEY` to your `.env.local` file and restarted your development server.";
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: `
                You are the "Seismic Companion", an AI expert in seismology and structural engineering.
                Your goal is to answer questions about a specific earthquake risk report provided in the context.
                
                CONTEXT DATA:
                Region: ${region || "Unknown"}
                Justification: ${reportContext.justification || "None provided"}
                Temporal Trend: ${JSON.stringify(reportContext.temporalTrend)}
                Magnitude Frequency: ${JSON.stringify(reportContext.magnitudeDist)}
                Factors: ${JSON.stringify(reportContext.factorComparison)}
                
                RULES:
                1. Always refer to the data in the context when answering.
                2. If the user asks about trends, refer to the temporalTrend data.
                3. If the user asks about magnitudes, refer to the magnitudeDist data (probabilities are incident indices).
                4. Keep answers professional, concise, and focused on safety and science.
                5. Use markdown for better readability.
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
        const response = await result.response;
        return response.text();
    } catch (error: any) {
        console.error("Seismic Chat error:", error);
        const detailedError = error.message || "Unknown error";
        return `❌ **Seismic Chat Error:** ${detailedError}\n\nThis could be a quota limit (429) or a model specific issue with gemini-2.5-flash. Please check your console for logs.`;
    }
};
