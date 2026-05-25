// ── Mock data for SomaPulse offline medical triage console ──

export interface ProtocolMatch {
  protocolId: number;
  title: string;
  clinicalTerm: string;
  similarity: number;
  steps: string[];
  warnings: string[];
}

export interface TriageResult {
  latencyMs: number;
  transcript: string;
  matches: ProtocolMatch[];
}

export interface SystemHealth {
  status: "healthy" | "degraded" | "offline";
  network: "offline" | "online";
  whisperLoaded: boolean;
  sapbertLoaded: boolean;
  dbRecords: number;
  ramUsageMb: number;
  cpuModel: string;
}

export const MOCK_TRIAGE_RESULTS: TriageResult[] = [
  {
    latencyMs: 118,
    transcript: "having severe watery stool and cramping for two days",
    matches: [
      {
        protocolId: 12,
        title: "Acute Diarrhea & Dehydration Protocol",
        clinicalTerm: "Gastroenteritis",
        similarity: 0.912,
        steps: [
          "Administer 200ml Oral Rehydration Salt (ORS) immediately.",
          "Check skin turgor and capillary refill time.",
          "Verify child's age for zinc supplement dosage.",
          "Monitor fluid intake every 30 minutes.",
        ],
        warnings: [
          "Do NOT administer antimotility drugs (e.g., loperamide) if bloody stool is observed.",
          "Check for signs of severe dehydration (sunken eyes, lethargy).",
        ],
      },
    ],
  },
  {
    latencyMs: 94,
    transcript: "my child has a hot body shaking skin and cannot swallow water we are at a high elevation camp",
    matches: [
      {
        protocolId: 7,
        title: "Severe Hyperpyrexia & Acute Tonsillitis/Meningitis Protocol",
        clinicalTerm: "Hyperpyrexia / Sepsis",
        similarity: 0.887,
        steps: [
          "Measure core body temperature immediately (target: identify >40°C).",
          "Check for neck rigidity — URGENT meningitis indicator.",
          "Administer antipyretic (Paracetamol 15mg/kg) if temperature >39°C.",
          "Begin rapid cooling: remove clothing, apply wet cloths to groin and axillae.",
          "HIGH ELEVATION WARNING: Accelerated neurological swelling risk.",
        ],
        warnings: [
          "Do NOT administer aspirin to children under 16 (Reye's Syndrome risk).",
          "If neck rigidity present, treat as MENINGITIS until ruled out.",
          "Transport to nearest medical facility IMMEDIATELY if seizures occur.",
        ],
      },
    ],
  },
  {
    latencyMs: 102,
    transcript: "tight breathing heavy lung chest whistle sound for three hours",
    matches: [
      {
        protocolId: 15,
        title: "Acute Bronchial Constriction Protocol",
        clinicalTerm: "Asthma / Bronchospasm",
        similarity: 0.856,
        steps: [
          "Sit patient upright — never lay flat during bronchospasm.",
          "Administer salbutamol inhaler (2 puffs via spacer) if available.",
          "Monitor respiratory rate (normal adult: 12-20 breaths/min).",
          "Count time between inhale cycles — decreasing intervals = worsening.",
        ],
        warnings: [
          "If SpO2 drops below 92%, begin supplemental oxygen immediately.",
          "Do NOT use sedatives — they suppress respiratory drive.",
        ],
      },
    ],
  },
];

export const MOCK_SYSTEM_HEALTH: SystemHealth = {
  status: "healthy",
  network: "offline",
  whisperLoaded: true,
  sapbertLoaded: true,
  dbRecords: 142,
  ramUsageMb: 1180,
  cpuModel: "Intel i5-8250U @ 1.6GHz",
};

export const VOCABULARY_GAPS = [
  { colloquial: "running stomach", clinical: "Gastroenteritis", umls: "C0018684" },
  { colloquial: "fire in the chest", clinical: "GERD", umls: "C0017168" },
  { colloquial: "chest whistle", clinical: "Bronchospasm", umls: "C0004096" },
  { colloquial: "hot body / skin fire", clinical: "Hyperpyrexia", umls: "C0020672" },
  { colloquial: "pins in hand / half-body sleep", clinical: "Ischemic Stroke", umls: "C0948008" },
];
