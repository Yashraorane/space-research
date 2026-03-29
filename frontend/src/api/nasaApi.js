import client from './client';

function extractErrorMessage(error, fallback) {
  const apiMessage = error?.response?.data?.error;
  return apiMessage || fallback;
}

export async function getApod() {
  try {
    const { data } = await client.get('/api/apod');
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Unable to load astronomy picture.'));
  }
}

export async function getMarsPhotos({ rover, date }) {
  try {
    const { data } = await client.get('/api/mars-photos', {
      params: { rover, date },
    });
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Unable to load rover photos for this date.'));
  }
}

export async function getAsteroids({ start_date, end_date }) {
  try {
    const { data } = await client.get('/api/asteroids', {
      params: { start_date, end_date },
    });
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Unable to load asteroid data.'));
  }
}
