import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { getSystemHealth } from '@/lib/data';

// Mock Supabase client to prevent createClient from crashing without env vars
jest.mock('@/lib/supabase', () => ({
  supabase: {},
}));

// Mock data fetchers to return mock data
jest.mock('@/lib/data', () => {
  const mockData = jest.requireActual('@/lib/mock-data');
  return {
    getTriageResults: jest.fn().mockResolvedValue(mockData.MOCK_TRIAGE_RESULTS),
    getSystemHealth: jest.fn().mockResolvedValue(mockData.MOCK_SYSTEM_HEALTH),
    getVocabularyGaps: jest.fn().mockResolvedValue(mockData.VOCABULARY_GAPS),
  };
});

import Home from '../page';

const mockedGetSystemHealth = getSystemHealth as jest.Mock;

describe('SomaPulse Home Page', () => {
  it('renders stats, system status, and components successfully', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /SomaPulse/i })).toBeInTheDocument();
    });
    expect(screen.getByText('NETWORK ONLINE')).toBeInTheDocument();
    expect(screen.getByText('WHISPER ✓')).toBeInTheDocument();
    expect(screen.getByText('SAPBERT ✓')).toBeInTheDocument();
  });

  it('handles clicking on demo queries to select different triage results', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Fever/i })).toBeInTheDocument();
    });

    const feverButton = screen.getByRole('button', { name: /Fever/i });
    fireEvent.click(feverButton);
    expect(screen.getByRole('heading', { name: /Severe Hyperpyrexia & Acute Tonsillitis\/Meningitis Protocol/i })).toBeInTheDocument();

    const breathingButton = screen.getByRole('button', { name: /Breathing/i });
    fireEvent.click(breathingButton);
    expect(screen.getByRole('heading', { name: /Acute Bronchial Constriction Protocol/i })).toBeInTheDocument();
  });

  it('handles toggling voice recording state', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /START RECORDING/i })).toBeInTheDocument();
    });

    const recordButton = screen.getByRole('button', { name: /START RECORDING/i });
    fireEvent.click(recordButton);
    expect(screen.getByText(/STOP RECORDING/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/STOP RECORDING/i));
    expect(screen.getByText(/START RECORDING/i)).toBeInTheDocument();
  });

  it('renders offline network status and model load failures', async () => {
    mockedGetSystemHealth.mockResolvedValueOnce({
      status: "healthy",
      network: "offline",
      whisperLoaded: false,
      sapbertLoaded: false,
      dbRecords: 142,
      ramUsageMb: 1180,
      cpuModel: "Intel i5-8250U @ 1.6GHz",
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('NETWORK OFFLINE')).toBeInTheDocument();
    });
    expect(screen.getByText('WHISPER ✗')).toBeInTheDocument();
    expect(screen.getByText('SAPBERT ✗')).toBeInTheDocument();
  });

  it('renders the SapBERT vocabulary mapping table with colloquial terms', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('SapBERT Vocabulary Mapping')).toBeInTheDocument();
    });
    expect(screen.getByText(/running stomach/i)).toBeInTheDocument();
    expect(screen.getByText(/fire in the chest/i)).toBeInTheDocument();
    expect(screen.getByText('C0018684')).toBeInTheDocument();
  });

  it('renders the pipeline benchmark section with all stages', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/Pipeline Benchmark/i)).toBeInTheDocument();
    });
    expect(screen.getByText('Whisper Transcription')).toBeInTheDocument();
    expect(screen.getByText('SapBERT Embedding')).toBeInTheDocument();
    expect(screen.getByText('sqlite-vec Query')).toBeInTheDocument();
    expect(screen.getByText('Total Pipeline')).toBeInTheDocument();
  });

  it('renders contraindication warnings for the default diarrhea protocol', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('CONTRAINDICATIONS')).toBeInTheDocument();
    });
    expect(screen.getByText(/loperamide/i)).toBeInTheDocument();
  });

  it('renders the edge-capable banner and status indicator', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/EDGE-CAPABLE/i)).toBeInTheDocument();
    });
    expect(screen.getByText('EDGE DEPLOYMENT')).toBeInTheDocument();
  });

  it('renders footer with correct offline branding', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/SomaPulse.*UOE Summer of Code 2026/i)).toBeInTheDocument();
    });
    expect(screen.getAllByText(/Whisper\.cpp.*SapBERT.*sqlite-vec/i).length).toBeGreaterThanOrEqual(1);
  });
});
