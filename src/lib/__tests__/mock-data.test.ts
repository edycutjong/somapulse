import { MOCK_TRIAGE_RESULTS, MOCK_SYSTEM_HEALTH, VOCABULARY_GAPS } from '../mock-data';

describe('SomaPulse Mock Data', () => {
  it('should export mock data correctly', () => {
    expect(MOCK_TRIAGE_RESULTS).toBeDefined();
    expect(MOCK_TRIAGE_RESULTS.length).toBe(3);
    expect(MOCK_TRIAGE_RESULTS[0].latencyMs).toBe(118);
    expect(MOCK_TRIAGE_RESULTS[0].matches[0].protocolId).toBe(12);

    expect(MOCK_SYSTEM_HEALTH).toBeDefined();
    expect(MOCK_SYSTEM_HEALTH.status).toBe('healthy');
    expect(MOCK_SYSTEM_HEALTH.network).toBe('offline');

    expect(VOCABULARY_GAPS).toBeDefined();
    expect(VOCABULARY_GAPS.length).toBe(5);
    expect(VOCABULARY_GAPS[0].colloquial).toBe('running stomach');
  });
});
