export interface GridChunk {
    id: string;
    row: number;
    col: number;
    riskScore: number; // 0-100
    riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
    reason: string;
    details: {
        geological: string;
        structural: string;
        urban: string;
    };
}

export interface AnalysisResult {
    chunks: GridChunk[];
    averageRisk: number;
    highRiskCount: number;
}

const GEOLOGICAL_FACTORS = [
    "Located near active fault lines with high tectonic stress.",
    "Loose, sandy soil prone to significant liquefaction.",
    "Unstable slope composition with potential for landslides.",
    "Soft alluvial deposits that amplify seismic waves.",
    "Stable granite bedrock with minimal wave amplification.",
    "Inland plateau with low historical seismic strain."
];

const STRUCTURAL_FACTORS = [
    "Pre-code masonry structures with minimal reinforcement.",
    "High-rise buildings lacking modern dampers.",
    "Critical infrastructure nearing design life capacity.",
    "Mixed-age building stock with varying compliance.",
    "Seismically retrofitted facilities with reinforced cores.",
    "State-of-the-art base isolation systems implemented."
];

const URBAN_FACTORS = [
    "High population density with narrow evacuation routes.",
    "Critical proximity to hazardous storage facilities.",
    "Limited accessibility for emergency rescue services.",
    "Moderate urban density with planned open spaces.",
    "Low-density suburban area with wide clearance zones.",
    "Well-mapped emergency zones and rapid response hubs."
];

interface SeismicProfile {
    baselineRisk: number; // 0-100
    description: string;
    geologicalFactors: string[];
    structuralThemes: string[];
}

const SEISMIC_KNOWLEDGE_BASE: Record<string, SeismicProfile> = {
    "sicily": {
        baselineRisk: 85,
        description: "High seismic zone (Zone 1) with active tectonic processes.",
        geologicalFactors: [
            "Located near the African-Eurasian plate collision zone.",
            "High concentration of active fault lines in eastern Sicily.",
            "Volcanic soil from Etna can amplify certain seismic frequencies."
        ],
        structuralThemes: [
            "Historical masonry structures with high seismic vulnerability.",
            "Dense urban centers with narrow, high-risk arterial roads.",
            "Variable compliance with modern anti-seismic building codes."
        ]
    },
    "italy": {
        baselineRisk: 70,
        description: "Mediterranean tectonic activity zone with variable risk levels.",
        geologicalFactors: [
            "Complex fault systems throughout the Apennines.",
            "Soft sediment basins that amplify ground motion."
        ],
        structuralThemes: [
            "Aging infrastructure requiring seismic retrofitting.",
            "Rich architectural heritage with unique preservation challenges."
        ]
    },
    "upington": {
        baselineRisk: 12,
        description: "Stable intraplate region with low natural seismicity.",
        geologicalFactors: [
            "Located on the stable Kaapvaal Craton foundation.",
            "Dry, consolidated soil with low liquefaction potential.",
            "Minimal historical records of major tectonic events."
        ],
        structuralThemes: [
            "Predominantly low-rise structures with standard masonry.",
            "Wide open spaces reducing secondary urban risk factors."
        ]
    },
    "south africa": {
        baselineRisk: 25,
        description: "Intraplate region with moderate risk, often mining-induced.",
        geologicalFactors: [
            "Generally stable geological basement rocks.",
            "Local risks primarily associated with deep-level mining."
        ],
        structuralThemes: [
            "Modern urban centers following updated safety guidelines.",
            "Variable structural resilience in older mining districts."
        ]
    },
    "san francisco": {
        baselineRisk: 90,
        description: "Major plate boundary zone with frequent activity.",
        geologicalFactors: [
            "Direct proximity to the San Andreas Fault system.",
            "Significant areas of reclaimed land prone to liquefaction."
        ],
        structuralThemes: [
            "Advanced seismic engineering in high-rise districts.",
            "Older soft-story buildings requiring mandatory retrofitting."
        ]
    }
};

export const analyzeMapImage = async (
    imageUrl: string,
    rows: number = 3,
    cols: number = 3,
    location?: string
): Promise<AnalysisResult> => {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const normalizedLoc = location?.toLowerCase().trim();
    let profile: SeismicProfile | undefined;

    // Direct match or partial match for better accuracy
    if (normalizedLoc) {
        for (const key in SEISMIC_KNOWLEDGE_BASE) {
            if (normalizedLoc.includes(key)) {
                profile = SEISMIC_KNOWLEDGE_BASE[key];
                break;
            }
        }
    }

    const baseline = profile?.baselineRisk ?? 45; // Default moderate risk if unknown
    const chunks: GridChunk[] = [];
    let totalRisk = 0;
    let highRiskCount = 0;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            // Adjust risk around the baseline with some local variation (+/- 15%)
            const variation = (Math.random() * 30) - 15;
            const riskScore = Math.max(5, Math.min(99, Math.round(baseline + variation)));

            let riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Low';
            if (riskScore > 80) riskLevel = 'Critical';
            else if (riskScore > 50) riskLevel = 'High';
            else if (riskScore > 20) riskLevel = 'Moderate';

            if (riskScore > 50) highRiskCount++;
            totalRisk += riskScore;

            // Pick reasons based on profile if available, otherwise use defaults
            const geoReason = profile
                ? profile.geologicalFactors[Math.floor(Math.random() * profile.geologicalFactors.length)]
                : GEOLOGICAL_FACTORS[Math.floor(Math.random() * GEOLOGICAL_FACTORS.length)];

            const strReason = profile
                ? profile.structuralThemes[Math.floor(Math.random() * profile.structuralThemes.length)]
                : STRUCTURAL_FACTORS[Math.floor(Math.random() * STRUCTURAL_FACTORS.length)];

            const urbReason = URBAN_FACTORS[Math.floor(Math.random() * URBAN_FACTORS.length)];

            chunks.push({
                id: `${r}-${c}`,
                row: r,
                col: c,
                riskScore,
                riskLevel,
                reason: geoReason,
                details: {
                    geological: geoReason,
                    structural: strReason,
                    urban: urbReason
                }
            });
        }
    }

    return {
        chunks,
        averageRisk: Math.round(totalRisk / (rows * cols)),
        highRiskCount,
    };
};
