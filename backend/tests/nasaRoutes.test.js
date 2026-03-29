const request = require('supertest');
const app = require('../src/app');
const nasaService = require('../src/services/nasaService');

jest.mock('../src/services/nasaService');

describe('NASA routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/apod should return APOD data', async () => {
    nasaService.getApod.mockResolvedValue({ title: 'Test APOD' });

    const response = await request(app).get('/api/apod');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe('Test APOD');
  });

  it('GET /api/mars-photos should reject invalid rover', async () => {
    const response = await request(app).get('/api/mars-photos?rover=invalid');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('GET /api/asteroids should validate date format', async () => {
    const response = await request(app).get('/api/asteroids?start_date=2026-99-99');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
