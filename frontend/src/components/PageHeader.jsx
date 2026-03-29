import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

function PageHeader({ title, subtitle }) {
  return (
    <motion.header
      className="page-header"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </motion.header>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default PageHeader;
