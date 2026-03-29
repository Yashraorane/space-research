import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getAsteroids } from '../api/nasaApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import PageHeader from '../components/PageHeader';
import { asteroidCountsByDate, flattenAsteroids } from '../utils/nasaTransforms';

function AsteroidsAnalytics() {
  const endDate7DaysAgo = new Date('2023-03-15').toISOString().slice(0, 10);
  const endDate = new Date('2023-03-22').toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState(endDate7DaysAgo);
  const [endDateState, setEndDateState] = useState(endDate);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [neoMap, setNeoMap] = useState({});

  const fetchData = useCallback(async (start = startDate, end = endDateState) => {
    setLoading(true);
    setError('');

    try {
      const payload = await getAsteroids({ start_date: start, end_date: end });
      setNeoMap(payload.near_earth_objects || {});
    } catch {
      setError('Could not load asteroid data.');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDateState]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const countData = useMemo(() => asteroidCountsByDate(neoMap), [neoMap]);
  const scatterData = useMemo(() => flattenAsteroids(neoMap).slice(0, 120), [neoMap]);

  return (
    <section>
      <PageHeader
        title="Near-Earth Object Analytics"
        subtitle="Track asteroid trends and orbital characteristics from NASA NeoWs"
      />

      <motion.form
        className="filters"
        onSubmit={(event) => {
          event.preventDefault();
          fetchData(startDate, endDateState);
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <label>
          <span style={{ display: 'block', marginBottom: '0.4rem' }}>📅 Start Date</span>
          <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
        </label>
        <label>
          <span style={{ display: 'block', marginBottom: '0.4rem' }}>📅 End Date</span>
          <input type="date" value={endDateState} onChange={(event) => setEndDateState(event.target.value)} />
        </label>
        <motion.button
          className="primary-btn"
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          📊 Analyze Data
        </motion.button>
      </motion.form>

      {loading ? <LoadingSpinner label="Loading asteroid telemetry..." /> : null}
      {error ? <ErrorState message={error} onRetry={() => fetchData(startDate, endDateState)} /> : null}

      {!loading && !error ? (
        <motion.div
          className="charts-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.15, delayChildren: 0.1 }}
        >
          <motion.article
            className="panel chart-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h3>📈 Asteroid Activity Over Time</h3>
            <p style={{ margin: '0 0 1rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
              Number of near-Earth objects detected per day
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={countData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(122, 240, 255, 0.1)" />
                <XAxis dataKey="date" stroke="var(--text-dim)" style={{ fontSize: '0.85rem' }} />
                <YAxis stroke="var(--text-dim)" style={{ fontSize: '0.85rem' }} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(11, 18, 38, 0.95)',
                    border: '1px solid rgba(122, 240, 255, 0.3)',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#7af0ff"
                  strokeWidth={3}
                  dot={{ fill: '#7af0ff', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.article>

          <motion.article
            className="panel chart-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <h3>🪨 Asteroid Size vs Miss Distance</h3>
            <p style={{ margin: '0 0 1rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
              Correlation between diameter and Earth miss distance
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(122, 240, 255, 0.1)" />
                <XAxis
                  type="number"
                  dataKey="diameterKm"
                  name="Diameter (km)"
                  stroke="var(--text-dim)"
                  style={{ fontSize: '0.85rem' }}
                />
                <YAxis
                  type="number"
                  dataKey="missDistanceKm"
                  name="Miss Distance (km)"
                  stroke="var(--text-dim)"
                  style={{ fontSize: '0.85rem' }}
                />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(11, 18, 38, 0.95)',
                    border: '1px solid rgba(255, 138, 92, 0.3)',
                    borderRadius: '8px',
                  }}
                  cursor={{ strokeDasharray: '3 3' }}
                />
                <Scatter data={scatterData} fill="#ff8a5c" />
              </ScatterChart>
            </ResponsiveContainer>
          </motion.article>
        </motion.div>
      ) : null}

      {!loading && !error && countData.length > 0 && (
        <motion.div
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(122, 240, 255, 0.08) 0%, rgba(168, 85, 247, 0.06) 100%)',
            border: '1.5px solid rgba(122, 240, 255, 0.2)',
            borderRadius: '16px',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-main)' }}>📊 Summary</h3>
          <p style={{ margin: 0, color: 'var(--text-dim)', lineHeight: 1.6 }}>
            Total asteroids detected: <strong style={{ color: 'var(--accent)' }}>{scatterData.length}</strong> •
            Time period: <strong style={{ color: 'var(--accent)' }}>{countData.length} days</strong> •
            Average per day: <strong style={{ color: 'var(--accent)' }}>
              {(scatterData.length / countData.length).toFixed(1)}
            </strong>
          </p>
        </motion.div>
      )}
    </section>
  );
}

export default AsteroidsAnalytics;
