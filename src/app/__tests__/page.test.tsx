import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../page';

const mockSystemHealth = {
  status: "healthy",
  network: "offline",
  whisperLoaded: true,
  sapbertLoaded: true,
  dbRecords: 142,
  ramUsageMb: 1180,
  cpuModel: "Intel i5-8250U @ 1.6GHz",
};

jest.mock('@/lib/mock-data', () => {
  const actual = jest.requireActual('@/lib/mock-data');
  return {
    ...actual,
    get MOCK_SYSTEM_HEALTH() {
      return mockSystemHealth;
    },
  };
});

describe('SomaPulse Home Page', () => {
  beforeEach(() => {
    mockSystemHealth.status = "healthy";
    mockSystemHealth.network = "offline";
    mockSystemHealth.whisperLoaded = true;
    mockSystemHealth.sapbertLoaded = true;
  });

  it('renders stats, system status, and components successfully', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { name: /SomaPulse/i })).toBeInTheDocument();
    expect(screen.getByText('NETWORK OFFLINE')).toBeInTheDocument();
    expect(screen.getByText('WHISPER ✓')).toBeInTheDocument();
    expect(screen.getByText('SAPBERT ✓')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Acute Diarrhea & Dehydration Protocol/i })).toBeInTheDocument();
  });

  it('handles clicking on demo queries to select different triage results', () => {
    render(<Home />);

    const feverButton = screen.getByRole('button', { name: /Fever/i });
    fireEvent.click(feverButton);
    expect(screen.getByRole('heading', { name: /Severe Hyperpyrexia & Acute Tonsillitis\/Meningitis Protocol/i })).toBeInTheDocument();

    const breathingButton = screen.getByRole('button', { name: /Breathing/i });
    fireEvent.click(breathingButton);
    expect(screen.getByRole('heading', { name: /Acute Bronchial Constriction Protocol/i })).toBeInTheDocument();
  });

  it('handles toggling voice recording state', () => {
    render(<Home />);

    const recordButton = screen.getByRole('button', { name: /START RECORDING/i });
    expect(recordButton).toBeInTheDocument();

    fireEvent.click(recordButton);
    expect(screen.getByText(/STOP RECORDING/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/STOP RECORDING/i));
    expect(screen.getByText(/START RECORDING/i)).toBeInTheDocument();
  });

  it('renders online network status and model load failures', () => {
    mockSystemHealth.network = "online";
    mockSystemHealth.whisperLoaded = false;
    mockSystemHealth.sapbertLoaded = false;

    render(<Home />);

    expect(screen.getByText('NETWORK ONLINE')).toBeInTheDocument();
    expect(screen.getByText('WHISPER ✗')).toBeInTheDocument();
    expect(screen.getByText('SAPBERT ✗')).toBeInTheDocument();
  });

  it('renders the SapBERT vocabulary mapping table with colloquial terms', () => {
    render(<Home />);

    expect(screen.getByText('SapBERT Vocabulary Mapping')).toBeInTheDocument();
    expect(screen.getByText(/running stomach/i)).toBeInTheDocument();
    expect(screen.getByText(/fire in the chest/i)).toBeInTheDocument();
    expect(screen.getByText('C0018684')).toBeInTheDocument();
  });

  it('renders the pipeline benchmark section with all stages', () => {
    render(<Home />);

    expect(screen.getByText(/Pipeline Benchmark/i)).toBeInTheDocument();
    expect(screen.getByText('Whisper Transcription')).toBeInTheDocument();
    expect(screen.getByText('SapBERT Embedding')).toBeInTheDocument();
    expect(screen.getByText('sqlite-vec Query')).toBeInTheDocument();
    expect(screen.getByText('Total Pipeline')).toBeInTheDocument();
  });

  it('renders contraindication warnings for the default diarrhea protocol', () => {
    render(<Home />);

    expect(screen.getByText('CONTRAINDICATIONS')).toBeInTheDocument();
    expect(screen.getByText(/loperamide/i)).toBeInTheDocument();
  });

  it('renders the offline banner and edge status indicator', () => {
    render(<Home />);

    expect(screen.getByText(/ALL NETWORK INTERFACES DISABLED/i)).toBeInTheDocument();
    expect(screen.getByText('EDGE DEPLOYMENT')).toBeInTheDocument();
  });

  it('renders footer with correct offline branding', () => {
    render(<Home />);

    expect(screen.getByText(/SomaPulse.*UOE Summer of Code 2026/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Whisper\.cpp.*SapBERT.*sqlite-vec/i).length).toBeGreaterThanOrEqual(1);
  });
});
