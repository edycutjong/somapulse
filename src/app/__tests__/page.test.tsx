import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../page';

// Define a mutable mock object
const mockSystemHealth = {
  status: "healthy",
  network: "offline",
  whisperLoaded: true,
  sapbertLoaded: true,
  dbRecords: 142,
  ramUsageMb: 1180,
  cpuModel: "Intel i5-8250U @ 1.6GHz",
};

// Mock mock-data module, using getter to allow dynamic changes
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
    // Reset to defaults
    mockSystemHealth.status = "healthy";
    mockSystemHealth.network = "offline";
    mockSystemHealth.whisperLoaded = true;
    mockSystemHealth.sapbertLoaded = true;
  });

  it('renders stats, system status, and components successfully', () => {
    render(<Home />);
    
    // Check header title
    expect(screen.getByRole('heading', { name: /SomaPulse/i })).toBeInTheDocument();
    
    // Check System Status Info
    expect(screen.getByText('NETWORK OFFLINE')).toBeInTheDocument();
    expect(screen.getByText('WHISPER ✓')).toBeInTheDocument();
    expect(screen.getByText('SAPBERT ✓')).toBeInTheDocument();
    
    // Check triage result panel default
    expect(screen.getByRole('heading', { name: /Acute Diarrhea & Dehydration Protocol/i })).toBeInTheDocument();
  });

  it('handles clicking on demo queries to select different triage results', () => {
    render(<Home />);
    
    // Select "Fever" demo query (index 1)
    const feverButton = screen.getByRole('button', { name: /Fever/i });
    fireEvent.click(feverButton);
    
    expect(screen.getByRole('heading', { name: /Severe Hyperpyrexia & Acute Tonsillitis\/Meningitis Protocol/i })).toBeInTheDocument();

    // Select "Breathing" demo query (index 2)
    const breathingButton = screen.getByRole('button', { name: /Breathing/i });
    fireEvent.click(breathingButton);
    
    expect(screen.getByRole('heading', { name: /Acute Bronchial Constriction Protocol/i })).toBeInTheDocument();
  });

  it('handles toggling voice recording state', () => {
    render(<Home />);
    
    const recordButton = screen.getByRole('button', { name: /START RECORDING/i });
    expect(recordButton).toBeInTheDocument();
    
    // Click to start recording
    fireEvent.click(recordButton);
    expect(screen.getByText(/STOP RECORDING/i)).toBeInTheDocument();
    
    // Click to stop recording
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
});
