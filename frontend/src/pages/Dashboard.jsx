import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getApod, getAsteroids } from '../api/nasaApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import PageHeader from '../components/PageHeader';

function Dashboard() {
  const [state, setState] = useState({ loading: true, error: '', apod: null, asteroidCount: 0 });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: '' }));

    try {
      const [apod, asteroidFeed] = await Promise.all([
        getApod(),
        getAsteroids({}),
      ]);

      const asteroidCount = Object.values(asteroidFeed.near_earth_objects || {}).reduce(
        (acc, arr) => acc + arr.length,
        0,
      );

      setState({ loading: false, error: '', apod, asteroidCount });
    } catch {
      setState({ loading: false, error: 'Failed to load dashboard data.', apod: null, asteroidCount: 0 });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (state.loading) {
    return <LoadingSpinner label="Building mission dashboard..." />;
  }

  if (state.error) {
    return <ErrorState message={state.error} onRetry={load} />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section>
      <PageHeader
        title="Space Research Dashboard"
        subtitle="Real-time NASA data streams and cosmic observations"
      />

      {/* Hero Banner with Featured APOD */}
      <motion.article
        className="hero-banner"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <h2>Today&apos;s Featured Observation</h2>
        <p>{state.apod?.title}</p>

        {state.apod?.media_type === 'image' && (
          <div className="featured-image">
            <img src={state.apod.url} alt={state.apod.title} />
          </div>
        )}

        {state.apod?.media_type === 'video' && (
          <div className="featured-image" style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ margin: 0, color: 'var(--text-dim)' }}>📹 Video Content Available</p>
            <a
              href={state.apod.url}
              target="_blank"
              rel="noreferrer"
              className="primary-btn"
              style={{ marginTop: '1rem', display: 'inline-block', textDecoration: 'none' }}
            >
              Watch Video →
            </a>
          </div>
        )}
      </motion.article>

      {/* Key Metrics Grid */}
      <motion.div
        className="stats-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.article className="stat-card" variants={itemVariants}>
          <h3>🔭 Media Type</h3>
          <p>{state.apod?.media_type === 'image' ? 'Image' : 'Video'}</p>
          <span className="stat-meta">Today&apos;s observation format</span>
        </motion.article>

        <motion.article className="stat-card" variants={itemVariants}>
          <h3>📅 Observation Date</h3>
          <p>{state.apod?.date}</p>
          <span className="stat-meta">APOD release date</span>
        </motion.article>

        <motion.article className="stat-card" variants={itemVariants}>
          <h3>🪨 Near-Earth Objects</h3>
          <p>{state.asteroidCount}</p>
          <span className="stat-meta">Active asteroids today</span>
        </motion.article>

        <motion.article className="stat-card" variants={itemVariants}>
          <h3>✨ Features Available</h3>
          <p>4</p>
          <span className="stat-meta">Explore Mars, APOD, Asteroids</span>
        </motion.article>
      </motion.div>

      {/* Quick Description */}
      {state.apod?.explanation && (
        <motion.div
          className="panel"
          style={{ marginTop: '1.5rem' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h3 style={{ margin: '0 0 1rem' }}>About Today&apos;s Image</h3>
          <p style={{ margin: 0, lineHeight: 1.7, color: 'var(--text-muted)' }}>
            {state.apod.explanation.substring(0, 300)}...
          </p>
          <a
            href="/apod"
            className="primary-btn"
            style={{ marginTop: '1rem', display: 'inline-block', textDecoration: 'none' }}
          >
            Read Full Story →
          </a>
        </motion.div>
      )}
    </section>
  );
}

export default Dashboard;
