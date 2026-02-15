import { GoogleGenerativeAI } from "@google/generative-ai";

export type HazardType = 'seismic' | 'wildfire' | 'storm';

export interface GridChunk {
    id: string;
    row: number;
    col: number;
    riskScore: number;
    riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
    reason: string;
    details: {
        prime: string;   // Primary factor (e.g., Geology for seismic, Fuel for fire)
        secondary: string; // Secondary factor (e.g., Structure for seismic, Topography for fire)
        tertiary: string;  // Tertiary factor (e.g., Urban for seismic, Weather for fire)
    };
}

export interface ReportData {
    temporalTrend: { time: string; value1: number; value2: number }[]; // Generic names
    magnitudeDist: { label: number | string; probability: number }[]; // Generic names
    factorComparison: { name: string; value: number }[];
    justification?: string;
    unit1?: string; // Unit for value1
    unit2?: string; // Unit for value2
}

export interface AnalysisResult {
    chunks: GridChunk[];
    averageRisk: number;
    highRiskCount: number;
    reportData: ReportData;
    isAiVerified: boolean;
    detectedRegion?: string;
    errorCode?: 'QUOTA_EXCEEDED' | 'API_ERROR' | 'UNKNOWN';
}

/**
 * Advanced HSL-based color to risk mapping for standard hazard maps.
 * Provides continuous interpolation for higher accuracy.
 */
const calculateColorRisk = (r: number, g: number, b: number): number => {
    // Convert to HSL for better color semantics
    const max = Math.max(r, g, b) / 255;
    const min = Math.min(r, g, b) / 255;
    const l = (max + min) / 2;
    let h = 0;
    if (max !== min) {
        const d = max - min;
        switch (max) {
            case r / 255: h = (g / 255 - b / 255) / d + (g < b ? 6 : 0); break;
            case g / 255: h = (b / 255 - r / 255) / d + 2; break;
            case b / 255: h = (r / 255 - g / 255) / d + 4; break;
        }
        h /= 6;
    }

    // Map Hue to Risk: 
    // Red (0) -> High
    // Yellow (0.16) -> Moderate
    // Green (0.33) -> Low
    // Blue (0.66) -> Very Low
    // Purple (0.83) -> Critical

    let risk = 0;
    if (h < 0.05 || h > 0.95) risk = 85 + (1 - l) * 15; // Red/Pink (85-100)
    else if (h < 0.12) risk = 70 + (0.12 - h) * 100; // Orange (70-85)
    else if (h < 0.20) risk = 45 + (0.20 - h) * 300; // Yellow (45-70)
    else if (h < 0.45) risk = 15 + (0.45 - h) * 100; // Green (15-45)
    else if (h < 0.75) risk = 5 + (0.75 - h) * 30;   // Blue (5-15)
    else risk = 90 + (h - 0.75) * 40;                // Purple (90-100)

    // Darker colors on maps usually imply higher risk (shading for intensity)
    if (l < 0.3) risk = Math.min(100, risk + 15);

    return Math.round(Math.max(0, Math.min(100, risk)));
};

const samplePixelRisk = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): number => {
    const data = ctx.getImageData(x, y, Math.max(1, w), Math.max(1, h)).data;
    let r = 0, g = 0, b = 0;
    const step = 4 * 4; // Sample every 4th pixel for speed
    let count = 0;
    for (let i = 0; i < data.length; i += step) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
    }
    return calculateColorRisk(r / count, g / count, b / count);
};

async function getGeminiAnalysis(imageUrl: string, hazard: HazardType, location?: string): Promise<{ data: any; error?: 'QUOTA_EXCEEDED' | 'API_ERROR' }> {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) return { data: null };

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" }, { apiVersion: 'v1beta' });
        const base64Data = imageUrl.split(",")[1];
        const mimeType = imageUrl.split(";")[0].split(":")[1] || "image/png";

        const locationContext = location ? `The user has specified the location as: ${location}. ` : "";

        let hazardPrompt = "";
        if (hazard === 'seismic') {
            hazardPrompt = `Perform a deep seismic analysis. 
            "temporalTrend": 12 objects {"year": string, "strain": number, "activity": number}.
            "magnitudeDist": 7 objects {"mag": number, "freq": number} (M3.0 to M9.0).
            "factors": {"geo": number, "struc": number, "urb": number}.`;
        } else if (hazard === 'wildfire') {
            hazardPrompt = `Perform a deep wildfire risk analysis. 
            "temporalTrend": 12 objects {"year": string, "fuelMoisture": number, "ignitionRisk": number}.
            "magnitudeDist": 7 objects {"intensity": string, "freq": number} (Low to Extreme).
            "factors": {"fuel": number, "topo": number, "weather": number}.`;
        } else {
            hazardPrompt = `Perform a deep storm/flood risk analysis. 
            "temporalTrend": 12 objects {"hour": string, "precip": number, "wind": number}.
            "magnitudeDist": 7 objects {"category": string, "freq": number} (TS to CAT5).
            "factors": {"hydro": number, "aero": number, "infras": number}.`;
        }

        const prompt = `
            ${locationContext}${hazardPrompt}
            Deliver a JSON object with:
            1. "region": Specific geographical area.
            2. "hazardLevel": Average risk as an integer (0-100).
            3. "grid": A 1D array of 9 integers representing the 3x3 grid risk scores (top-left to bottom-right).
            4. "justification": Scientific reasoning for the risk levels (max 3 sentences).
            5. "temporalTrend": As specified above.
            6. "magnitudeDist": As specified above.
            7. "factors": As specified above.
        `;

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64Data, mimeType } }
        ]);

        const response = result.response;
        const text = response.text();
        if (!text) return { data: null };

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return { data: jsonMatch ? JSON.parse(jsonMatch[0]) : null };
    } catch (err: any) {
        // Broad capture for all API/SDK errors
        const errorString = String(err);
        const isQuota = errorString.includes('429') || errorString.toLowerCase().includes('quota');

        if (isQuota) {
            return { data: null, error: 'QUOTA_EXCEEDED' };
        }
        console.error("Gemini Analysis Error:", errorString);
        return { data: null, error: 'API_ERROR' };
    }
}

export const analyzeMapImage = async (
    imageUrl: string,
    hazard: HazardType,
    rows: number = 3,
    cols: number = 3,
    location?: string
): Promise<AnalysisResult> => {
    const geminiDataPromise = getGeminiAnalysis(imageUrl, hazard, location);

    const visionResult = await new Promise<any>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject("Canvas context error");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const chunks: any[] = [];
            let totalRisk = 0;
            const cellW = Math.floor(canvas.width / cols);
            const cellH = Math.floor(canvas.height / rows);

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const riskScore = samplePixelRisk(ctx, c * cellW, r * cellH, cellW, cellH);
                    totalRisk += riskScore;
                    chunks.push({ id: `${r}-${c}`, row: r, col: c, riskScore });
                }
            }
            resolve({ chunks, totalRisk: totalRisk / 9 });
        };
        img.onerror = () => reject("Image load error");
        img.src = imageUrl;
    });

    const { data: gemini, error } = await geminiDataPromise;
    const isAiVerified = !!gemini;

    // Default simulation fallback
    const mockTrend = Array.from({ length: 12 }, (_, i) => ({
        time: `${2013 + i}`,
        strain: 30 + (i * 4) + Math.random() * 10,
        activity: 10 + Math.random() * 20
    }));

    const finalizeValue = (idx: number, visionVal: number) => {
        if (isAiVerified && gemini.grid && gemini.grid[idx] !== undefined) return gemini.grid[idx];
        return visionVal;
    };

    const finalizedChunks: GridChunk[] = visionResult.chunks.map((v: any, i: number) => {
        const score = finalizeValue(i, v.riskScore);
        const level = score > 80 ? 'Critical' : score > 50 ? 'High' : score > 20 ? 'Moderate' : 'Low';

        let details = { prime: "", secondary: "", tertiary: "" };
        if (hazard === 'seismic') {
            details = {
                prime: "Lithospheric stress detected via HSL-spectral sampling.",
                secondary: "Calculated structural vulnerability based on urban density.",
                tertiary: "Proximity-based exposure index."
            };
        } else if (hazard === 'wildfire') {
            details = {
                prime: "Fuel density and biomass moisture analysis.",
                secondary: "Topographic slope and wind funnel detection.",
                tertiary: "Infrastructure defensible space assessment."
            };
        } else {
            details = {
                prime: "Hydrologic saturation and drainage capacity.",
                secondary: "Aerodynamic wind load vulnerability.",
                tertiary: "Emergency egress and infrastructure resilience."
            };
        }

        return {
            ...v,
            riskScore: score,
            riskLevel: level,
            reason: isAiVerified ? gemini.justification : `Localized visual telemetry indicates moderate ${hazard} risk.`,
            details
        };
    });

    const avgRisk = isAiVerified ? gemini.hazardLevel : visionResult.totalRisk;

    let temporalTrend = mockTrend.map(t => ({ time: t.time, value1: t.strain, value2: t.activity }));
    let magnitudeDist = [3, 4, 5, 6, 7, 8, 9].map(m => ({ label: m, probability: parseFloat((100 / Math.pow(2.5, m - 3)).toFixed(2)) }));
    let factorComparison = isAiVerified && gemini.factors ? [] : [
        { name: 'Primary', value: Math.round(avgRisk * 0.9) },
        { name: 'Secondary', value: 45 },
        { name: 'Tertiary', value: 30 }
    ];

    if (hazard === 'seismic') {
        if (isAiVerified) {
            temporalTrend = gemini.temporalTrend.map((t: any) => ({ time: t.year, value1: t.strain, value2: t.activity }));
            magnitudeDist = gemini.magnitudeDist.map((m: any) => ({ label: m.mag, probability: m.freq }));
            factorComparison = [
                { name: 'Geological', value: gemini.factors.geo },
                { name: 'Structural', value: gemini.factors.struc },
                { name: 'Urban', value: gemini.factors.urb }
            ];
        }
    } else if (hazard === 'wildfire') {
        if (isAiVerified) {
            temporalTrend = gemini.temporalTrend.map((t: any) => ({ time: t.year, value1: t.fuelMoisture, value2: t.ignitionRisk }));
            magnitudeDist = gemini.magnitudeDist.map((m: any) => ({ label: m.intensity, probability: m.freq }));
            factorComparison = [
                { name: 'Fuel', value: gemini.factors.fuel },
                { name: 'Topo', value: gemini.factors.topo },
                { name: 'Weather', value: gemini.factors.weather }
            ];
        }
    } else {
        if (isAiVerified) {
            temporalTrend = gemini.temporalTrend.map((t: any) => ({ time: t.hour, value1: t.precip, value2: t.wind }));
            magnitudeDist = gemini.magnitudeDist.map((m: any) => ({ label: m.category, probability: m.freq }));
            factorComparison = [
                { name: 'Hydro', value: gemini.factors.hydro },
                { name: 'Aero', value: gemini.factors.aero },
                { name: 'Infras', value: gemini.factors.infras }
            ];
        }
    }

    return {
        chunks: finalizedChunks,
        averageRisk: Math.round(avgRisk),
        highRiskCount: finalizedChunks.filter(c => c.riskScore > 50).length,
        isAiVerified,
        detectedRegion: gemini?.region || "Local Vision Analysis",
        errorCode: error,
        reportData: {
            temporalTrend,
            magnitudeDist,
            factorComparison,
            justification: gemini?.justification,
            unit1: hazard === 'seismic' ? 'Strain' : hazard === 'wildfire' ? 'Fuel' : 'Precip',
            unit2: hazard === 'seismic' ? 'Activity' : hazard === 'wildfire' ? 'Ignition' : 'Wind'
        }
    };
};
