import { render, screen } from '@testing-library/react';
import NotFound from '../not-found';

describe('NotFound Page', () => {
  it('renders 404 error code and description', () => {
    render(<NotFound />);
    
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Signal Lost / Protocol Not Found')).toBeInTheDocument();
    expect(screen.getByText('RETURN TO TRIAGE CONSOLE')).toBeInTheDocument();
  });
});
