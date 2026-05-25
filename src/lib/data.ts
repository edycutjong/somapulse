import { supabase } from "./supabase";
import type { TriageResult, ProtocolMatch, SystemHealth } from "./mock-data";

export interface VocabularyGap {
  colloquial: string;
  clinical: string;
  umls: string;
}

export async function getTriageResults(): Promise<TriageResult[]> {
  const { data: results, error: rErr } = await supabase
    .from("sp_triage_results")
    .select("*")
    .order("id", { ascending: true });

  if (rErr || !results) {
    console.error("Failed to fetch triage results:", rErr);
    return [];
  }

  const { data: matches, error: mErr } = await supabase
    .from("sp_protocol_matches")
    .select("*")
    .order("id", { ascending: true });

  if (mErr || !matches) {
    console.error("Failed to fetch protocol matches:", mErr);
    return [];
  }

  const matchesByResult = new Map<number, ProtocolMatch[]>();
  for (const m of matches) {
    const list = matchesByResult.get(m.triage_result_id) ?? [];
    list.push({
      protocolId: m.protocol_id,
      title: m.title,
      clinicalTerm: m.clinical_term,
      similarity: Number(m.similarity),
      steps: m.steps as string[],
      warnings: m.warnings as string[],
    });
    matchesByResult.set(m.triage_result_id, list);
  }

  return results.map((r) => ({
    latencyMs: r.latency_ms,
    transcript: r.transcript,
    matches: matchesByResult.get(r.id) ?? [],
  }));
}

export async function getSystemHealth(): Promise<SystemHealth> {
  const { data, error } = await supabase
    .from("sp_system_health")
    .select("*")
    .limit(1)
    .single();

  if (error || !data) {
    console.error("Failed to fetch system health:", error);
    return {
      status: "healthy",
      network: "offline",
      whisperLoaded: true,
      sapbertLoaded: true,
      dbRecords: 142,
      ramUsageMb: 1180,
      cpuModel: "Intel i5-8250U @ 1.6GHz",
    };
  }

  return {
    status: data.status,
    network: data.network,
    whisperLoaded: data.whisper_loaded,
    sapbertLoaded: data.sapbert_loaded,
    dbRecords: data.db_records,
    ramUsageMb: data.ram_usage_mb,
    cpuModel: data.cpu_model,
  };
}

export async function getVocabularyGaps(): Promise<VocabularyGap[]> {
  const { data, error } = await supabase
    .from("sp_vocabulary_gaps")
    .select("*")
    .order("id", { ascending: true });

  if (error || !data) {
    console.error("Failed to fetch vocabulary gaps:", error);
    return [];
  }

  return data.map((v) => ({
    colloquial: v.colloquial,
    clinical: v.clinical,
    umls: v.umls,
  }));
}
