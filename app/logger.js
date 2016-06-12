import createLogger from 'redux-logger';
export default createLogger({
  level: 'log',
  predicate: (getState, action) => process.env.NODE_ENV !== 'production'
});
