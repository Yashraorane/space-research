import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getApod } from '../api/nasaApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import PageHeader from '../components/PageHeader';
import { buildApodSummary } from '../utils/nasaTransforms';

function ApodViewer() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [apod, setApod] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const payload = await getApod();
      setApod(payload);
    } catch {
      setError('Unable to load APOD right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <LoadingSpinner label="Fetching astronomy picture..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={load} />;
  }

  return (
    <section>
      <PageHeader 
        title="Astronomy Picture of the Day" 
        subtitle="Explore today's cosmic observations with mission briefings" 
      />

      <motion.article
        className="panel"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h2 style={{ margin: '0 0 0.5rem', fontSize: 'clamp(1.3rem, 2vw, 1.8rem)' }}>
            {apod?.title}
          </h2>
          <p className="meta">
            📅 {apod?.date} • 🎬 {apod?.media_type === 'image' ? 'Image' : 'Video'}
          </p>
        </div>

        {apod?.media_type === 'image' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <img
              className="hero-image"
              src={apod.url}
              alt={apod.title}
              style={{ margin: '1.5rem 0' }}
            />
          </motion.div>
        )}

        {apod?.media_type === 'video' && (
          <motion.div
            style={{
              margin: '1.5rem 0',
              padding: '2rem',
              background: 'linear-gradient(135deg, rgba(122, 240, 255, 0.08) 0%, rgba(168, 85, 247, 0.06) 100%)',
              borderRadius: '12px',
              border: '1.5px solid rgba(122, 240, 255, 0.2)',
              textAlign: 'center',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <p style={{ margin: '0 0 1rem', color: 'var(--text-dim)', fontSize: '1.1rem' }}>
              🎬 Video Content
            </p>
            <a
              href={apod?.url}
              target="_blank"
              rel="noreferrer"
              className="primary-btn"
              style={{ textDecoration: 'none' }}
            >
              Watch on NASA →
            </a>
          </motion.div>
        )}

        <div style={{ marginTop: '1.5rem', lineHeight: 1.8 }}>
          <h3 style={{ marginBottom: '0.8rem', color: 'var(--text-main)' }}>Briefing</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>
            {apod?.explanation}
          </p>
        </div>

        <div className="button-row">
          <motion.button
            className="primary-btn"
            type="button"
            onClick={() => setShowSummary((prev) => !prev)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {showSummary ? '✓ Summary Shown' : '✨ AI Summary'}
          </motion.button>
        </div>

        {showSummary && (
          <motion.div
            className="summary"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4 style={{ margin: '0 0 0.8rem', color: 'var(--text-main)' }}>Quick Summary</h4>
            <p style={{ margin: 0 }}>{buildApodSummary(apod)}</p>
          </motion.div>
        )}
      </motion.article>
    </section>
  );
}

export default ApodViewer;
