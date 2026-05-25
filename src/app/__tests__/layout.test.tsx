import { render, screen } from '@testing-library/react';
import RootLayout, { metadata } from '../layout';

describe('RootLayout', () => {
  it('should render layout children successfully', () => {
    const originalError = console.error;
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation((...args) => {
      const msg = args.map(String).join(' ');
      if (msg.includes('cannot be a child of')) return;
      originalError(...args);
    });

    render(
      <RootLayout>
        <div data-testid="test-child">Child Element</div>
      </RootLayout>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it('should export valid metadata', () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toContain('SomaPulse');
    expect(metadata.description).toContain('medical triage');
  });
});
