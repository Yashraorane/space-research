import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <motion.div
      className="loader-wrap"
      role="status"
      aria-live="polite"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="loader" />
      <p className="loader-text">{label}</p>
    </motion.div>
  );
}

LoadingSpinner.propTypes = {
  label: PropTypes.string,
};

export default LoadingSpinner;
