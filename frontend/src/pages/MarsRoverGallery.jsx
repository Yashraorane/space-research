import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getMarsPhotos } from '../api/nasaApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import PageHeader from '../components/PageHeader';

const ROVERS = ['curiosity', 'opportunity', 'spirit', 'perseverance'];

function MarsRoverGallery() {
  const [rover, setRover] = useState('curiosity');
  const [date, setDate] = useState('2023-03-15');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (nextRover = rover, nextDate = date) => {
    setLoading(true);
    setError('');

    try {
      const payload = await getMarsPhotos({ rover: nextRover, date: nextDate });
      setPhotos(payload.photos || []);
    } catch (err) {
      setError(err.message || 'Unable to load rover photos for this date.');
    } finally {
      setLoading(false);
    }
  }, [rover, date]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section>
      <PageHeader
        title="Mars Rover Gallery"
        subtitle="Explore stunning imagery from Martian rovers across missions"
      />

      <motion.form
        className="filters"
        onSubmit={(event) => {
          event.preventDefault();
          load(rover, date);
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <label>
          <span style={{ display: 'block', marginBottom: '0.4rem' }}>🤖 Select Rover</span>
          <select value={rover} onChange={(event) => setRover(event.target.value)}>
            {ROVERS.map((item) => (
              <option key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span style={{ display: 'block', marginBottom: '0.4rem' }}>📅 Observation Date</span>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>

        <motion.button
          className="primary-btn"
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🔍 Search Photos
        </motion.button>
      </motion.form>

      {loading ? <LoadingSpinner label="Querying rover feed..." /> : null}
      {error ? <ErrorState message={error} onRetry={() => load(rover, date)} /> : null}

      {!loading && !error ? (
        <div>
          {photos.length > 0 && (
            <motion.p
              style={{
                margin: '1.5rem 0 1rem',
                color: 'var(--text-dim)',
                fontSize: '0.95rem',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Found {photos.length} photos • Showing {Math.min(24, photos.length)}
            </motion.p>
          )}

          <motion.div
            className="gallery-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.02, delayChildren: 0.1 }}
          >
            {photos.slice(0, 24).map((photo, index) => (
              <motion.article
                key={photo.id}
                className="image-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.02, 0.3) }}
                whileHover={{ y: -4 }}
              >
                <img src={photo.img_src} alt={`Mars shot by ${photo.rover.name}`} loading="lazy" />
                <div>
                  <h4>🔴 {photo.rover.name}</h4>
                  <p>{photo.camera.full_name}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {!photos.length && (
            <motion.div
              className="panel"
              style={{ textAlign: 'center', padding: '3rem 1.5rem' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p style={{ margin: 0, color: 'var(--text-dim)', fontSize: '1rem' }}>
                No photos found for {rover} on {date}. Try a different date! 📸
              </p>
            </motion.div>
          )}
        </div>
      ) : null}
    </section>
  );
}

export default MarsRoverGallery;
