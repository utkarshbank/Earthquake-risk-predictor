const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

const envPath = path.join(process.cwd(), ".env.local");
let apiKey = "";
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    const match = envContent.match(/NEXT_PUBLIC_GEMINI_API_KEY=(.*)/);
    if (match) apiKey = match[1].trim();
}

if (!apiKey) {
    console.error("❌ NEXT_PUBLIC_GEMINI_API_KEY is missing!");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName, apiVersion = 'v1beta') {
    console.log(`\n--- Testing ${modelName} (${apiVersion}) ---`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName }, { apiVersion });
        const result = await model.generateContent("Hello, are you operational?");
        const response = await result.response;
        console.log(`✅ Success: ${response.text().substring(0, 50)}...`);
        return true;
    } catch (error) {
        console.error(`❌ Error for ${modelName}:`, error.message);
        return false;
    }
}

async function runAll() {
    console.log("Starting Gemini Diagnostics...");
    const models = [
        { name: "gemini-2.5-flash", version: 'v1beta' },
        { name: "gemini-2.0-flash", version: 'v1beta' },
        { name: "gemini-1.5-flash", version: 'v1beta' },
        { name: "gemini-1.5-flash", version: 'v1' },
        { name: "gemini-1.5-pro", version: 'v1' }
    ];

    for (const m of models) {
        await testModel(m.name, m.version);
    }
}

runAll();
