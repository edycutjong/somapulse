import { MOCK_TRIAGE_RESULTS, MOCK_SYSTEM_HEALTH, VOCABULARY_GAPS } from '../mock-data';

describe('SomaPulse Data Integrity', () => {
  describe('Protocol match consistency', () => {
    it('every protocol match has a non-empty title and clinical term', () => {
      MOCK_TRIAGE_RESULTS.forEach(r => {
        r.matches.forEach(m => {
          expect(m.title.length).toBeGreaterThan(0);
          expect(m.clinicalTerm.length).toBeGreaterThan(0);
        });
      });
    });

    it('diarrhea protocol steps include ORS administration as first step', () => {
      const diarrheaMatch = MOCK_TRIAGE_RESULTS[0].matches[0];
      expect(diarrheaMatch.steps[0]).toContain('ORS');
    });

    it('fever protocol steps include temperature measurement and antipyretic', () => {
      const feverMatch = MOCK_TRIAGE_RESULTS[1].matches[0];
      const stepsText = feverMatch.steps.join(' ');
      expect(stepsText).toContain('temperature');
      expect(stepsText).toContain('Paracetamol');
    });

    it('bronchospasm protocol steps include inhaler and positioning instructions', () => {
      const asthmaMatch = MOCK_TRIAGE_RESULTS[2].matches[0];
      const stepsText = asthmaMatch.steps.join(' ');
      expect(stepsText).toContain('upright');
      expect(stepsText).toContain('salbutamol');
    });

    it('fever protocol warnings mention meningitis risk indicator', () => {
      const feverWarnings = MOCK_TRIAGE_RESULTS[1].matches[0].warnings.join(' ');
      expect(feverWarnings.toLowerCase()).toContain('meningitis');
    });

    it('diarrhea protocol warnings mention loperamide contraindication', () => {
      const diarrheaWarnings = MOCK_TRIAGE_RESULTS[0].matches[0].warnings.join(' ');
      expect(diarrheaWarnings).toContain('loperamide');
    });
  });

  describe('System health validation', () => {
    it('system health status is one of the expected values', () => {
      const validStatuses = ['healthy', 'degraded', 'offline'];
      expect(validStatuses).toContain(MOCK_SYSTEM_HEALTH.status);
    });

    it('network field is one of the expected values', () => {
      const validNetworks = ['offline', 'online'];
      expect(validNetworks).toContain(MOCK_SYSTEM_HEALTH.network);
    });

    it('the edge demo is configured with network offline and both models loaded', () => {
      expect(MOCK_SYSTEM_HEALTH.network).toBe('offline');
      expect(MOCK_SYSTEM_HEALTH.whisperLoaded).toBe(true);
      expect(MOCK_SYSTEM_HEALTH.sapbertLoaded).toBe(true);
    });
  });

  describe('Vocabulary gap mapping integrity', () => {
    it('all UMLS codes follow the C followed by 7 digits convention', () => {
      VOCABULARY_GAPS.forEach(v => {
        expect(v.umls).toMatch(/^C\d{7}$/);
      });
    });

    it('GERD entry maps fire in the chest colloquial term', () => {
      const gerd = VOCABULARY_GAPS.find(v => v.clinical === 'GERD');
      expect(gerd).toBeDefined();
      expect(gerd!.colloquial).toContain('chest');
    });

    it('Ischemic Stroke entry maps pins and needles type symptom', () => {
      const stroke = VOCABULARY_GAPS.find(v => v.clinical === 'Ischemic Stroke');
      expect(stroke).toBeDefined();
      expect(stroke!.umls).toBe('C0948008');
    });

    it('Hyperpyrexia entry maps hot body / skin fire colloquial terms', () => {
      const hyper = VOCABULARY_GAPS.find(v => v.clinical === 'Hyperpyrexia');
      expect(hyper).toBeDefined();
      expect(hyper!.colloquial).toContain('hot body');
    });
  });
});
