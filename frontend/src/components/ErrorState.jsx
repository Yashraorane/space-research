import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

function ErrorState({ message, onRetry }) {
  return (
    <motion.div
      className="error-state"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3>⚠️ Unable to Load Data</h3>
      <p>{message || 'Something went wrong. Please try again.'}</p>
      {onRetry ? (
        <motion.button
          type="button"
          onClick={onRetry}
          className="primary-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🔄 Try Again
        </motion.button>
      ) : null}
    </motion.div>
  );
}

ErrorState.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func,
};

export default ErrorState;
