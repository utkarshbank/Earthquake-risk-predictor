export interface GridChunk {
    id: string;
    row: number;
    col: number;
    riskScore: number; // 0-100
    riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
}

export interface AnalysisResult {
    chunks: GridChunk[];
    averageRisk: number;
    highRiskCount: number;
}

export const analyzeMapImage = async (
    imageUrl: string,
    rows: number = 10,
    cols: number = 10
): Promise<AnalysisResult> => {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const chunks: GridChunk[] = [];
    let totalRisk = 0;
    let highRiskCount = 0;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            // Generate a mock risk score. 
            // In a real app, this would query a model with the image data at this location.
            // We'll use Math.random() modulated by some "perlin-like" noise if possible, 
            // but simple random with some clustering logic is better for a demo.

            // clustered random: tendency to be similar to neighbors (not implemented for simplicity here)
            // just pure random for now to prove the grid works.
            const riskScore = Math.floor(Math.random() * 100);

            let riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Low';
            if (riskScore > 80) riskLevel = 'Critical';
            else if (riskScore > 50) riskLevel = 'High';
            else if (riskScore > 20) riskLevel = 'Moderate';

            if (riskScore > 50) highRiskCount++;
            totalRisk += riskScore;

            chunks.push({
                id: `${r}-${c}`,
                row: r,
                col: c,
                riskScore,
                riskLevel,
            });
        }
    }

    return {
        chunks,
        averageRisk: Math.round(totalRisk / (rows * cols)),
        highRiskCount,
    };
};
