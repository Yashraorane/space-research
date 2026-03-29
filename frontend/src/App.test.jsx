import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from './App';

vi.mock('./api/nasaApi', () => ({
  getApod: vi.fn().mockResolvedValue({ title: 'Mock APOD', media_type: 'image' }),
  getMarsPhotos: vi.fn().mockResolvedValue({ photos: [] }),
  getAsteroids: vi.fn().mockResolvedValue({ near_earth_objects: {} }),
}));

vi.mock('./pages/Dashboard', () => ({
  default: () => <div>Dashboard Page</div>,
}));

vi.mock('./pages/ApodViewer', () => ({
  default: () => <div>APOD Page</div>,
}));

vi.mock('./pages/MarsRoverGallery', () => ({
  default: () => <div>Mars Page</div>,
}));

vi.mock('./pages/AsteroidsAnalytics', () => ({
  default: () => <div>Asteroids Page</div>,
}));

describe('App shell', () => {
  it('renders primary navigation links', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('APOD')).toBeInTheDocument();
    expect(screen.getByText('Mars Gallery')).toBeInTheDocument();
    expect(screen.getByText('Asteroids')).toBeInTheDocument();
  });
});
