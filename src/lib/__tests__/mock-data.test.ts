import { MOCK_TRIAGE_RESULTS, MOCK_SYSTEM_HEALTH, VOCABULARY_GAPS } from '../mock-data';

describe('SomaPulse Mock Data', () => {
  describe('MOCK_TRIAGE_RESULTS', () => {
    it('should export exactly 3 triage results', () => {
      expect(MOCK_TRIAGE_RESULTS).toBeDefined();
      expect(MOCK_TRIAGE_RESULTS.length).toBe(3);
    });

    it('should have the diarrhea protocol as the first result', () => {
      expect(MOCK_TRIAGE_RESULTS[0].latencyMs).toBe(118);
      expect(MOCK_TRIAGE_RESULTS[0].matches[0].protocolId).toBe(12);
      expect(MOCK_TRIAGE_RESULTS[0].matches[0].clinicalTerm).toBe('Gastroenteritis');
    });

    it('should have the fever/hyperpyrexia protocol as the second result', () => {
      expect(MOCK_TRIAGE_RESULTS[1].matches[0].clinicalTerm).toBe('Hyperpyrexia / Sepsis');
    });

    it('should have the bronchospasm protocol as the third result', () => {
      expect(MOCK_TRIAGE_RESULTS[2].matches[0].clinicalTerm).toBe('Asthma / Bronchospasm');
    });

    it('should have all latencies under 200ms (pipeline target)', () => {
      MOCK_TRIAGE_RESULTS.forEach(r => {
        expect(r.latencyMs).toBeLessThan(200);
        expect(r.latencyMs).toBeGreaterThan(0);
      });
    });

    it('should have similarity scores between 0 and 1 for all matches', () => {
      MOCK_TRIAGE_RESULTS.forEach(r => {
        r.matches.forEach(m => {
          expect(m.similarity).toBeGreaterThan(0);
          expect(m.similarity).toBeLessThanOrEqual(1);
        });
      });
    });

    it('should have at least one action step for every protocol match', () => {
      MOCK_TRIAGE_RESULTS.forEach(r => {
        r.matches.forEach(m => {
          expect(m.steps.length).toBeGreaterThan(0);
          m.steps.forEach(s => expect(typeof s).toBe('string'));
        });
      });
    });

    it('should have at least one contraindication warning for every protocol', () => {
      MOCK_TRIAGE_RESULTS.forEach(r => {
        r.matches.forEach(m => {
          expect(m.warnings.length).toBeGreaterThan(0);
        });
      });
    });

    it('should have non-empty transcripts', () => {
      MOCK_TRIAGE_RESULTS.forEach(r => {
        expect(typeof r.transcript).toBe('string');
        expect(r.transcript.length).toBeGreaterThan(0);
      });
    });

    it('should have unique protocol IDs across all results', () => {
      const ids = MOCK_TRIAGE_RESULTS.flatMap(r => r.matches.map(m => m.protocolId));
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    });
  });

  describe('MOCK_SYSTEM_HEALTH', () => {
    it('should be configured as edge-capable deployment', () => {
      expect(MOCK_SYSTEM_HEALTH).toBeDefined();
      expect(MOCK_SYSTEM_HEALTH.status).toBe('healthy');
      expect(MOCK_SYSTEM_HEALTH.network).toBe('online');
    });

    it('should have Whisper and SapBERT loaded', () => {
      expect(MOCK_SYSTEM_HEALTH.whisperLoaded).toBe(true);
      expect(MOCK_SYSTEM_HEALTH.sapbertLoaded).toBe(true);
    });

    it('should have a realistic RAM footprint for edge hardware (< 8GB)', () => {
      expect(MOCK_SYSTEM_HEALTH.ramUsageMb).toBeGreaterThan(0);
      expect(MOCK_SYSTEM_HEALTH.ramUsageMb).toBeLessThan(8192);
    });

    it('should have at least 100 pre-seeded protocols', () => {
      expect(MOCK_SYSTEM_HEALTH.dbRecords).toBeGreaterThanOrEqual(100);
    });

    it('should have a non-empty CPU model string', () => {
      expect(typeof MOCK_SYSTEM_HEALTH.cpuModel).toBe('string');
      expect(MOCK_SYSTEM_HEALTH.cpuModel.length).toBeGreaterThan(0);
    });
  });

  describe('VOCABULARY_GAPS', () => {
    it('should export exactly 5 vocabulary gap entries', () => {
      expect(VOCABULARY_GAPS).toBeDefined();
      expect(VOCABULARY_GAPS.length).toBe(5);
    });

    it('should map running stomach to Gastroenteritis', () => {
      expect(VOCABULARY_GAPS[0].colloquial).toBe('running stomach');
      expect(VOCABULARY_GAPS[0].clinical).toBe('Gastroenteritis');
      expect(VOCABULARY_GAPS[0].umls).toBe('C0018684');
    });

    it('should have valid UMLS concept IDs (C + 7 digits) for all entries', () => {
      VOCABULARY_GAPS.forEach(v => {
        expect(v.umls).toMatch(/^C\d{7}$/);
      });
    });

    it('should map all 5 colloquial terms to distinct clinical concepts', () => {
      const clinicals = VOCABULARY_GAPS.map(v => v.clinical);
      const unique = new Set(clinicals);
      expect(unique.size).toBe(5);
    });

    it('should have all 5 colloquial terms be distinct', () => {
      const colloquials = VOCABULARY_GAPS.map(v => v.colloquial);
      const unique = new Set(colloquials);
      expect(unique.size).toBe(5);
    });

    it('should include GERD and Bronchospasm mappings', () => {
      const clinicals = VOCABULARY_GAPS.map(v => v.clinical);
      expect(clinicals).toContain('GERD');
      expect(clinicals).toContain('Bronchospasm');
    });
  });
});
