/* eslint spaced-comment: 0 */
/* global require */

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import reducers from '../reducers';
import logger from '../logger';

export default function configureStore(initialState) {
  const rootReducer = combineReducers({ ...reducers });

  const devMiddlewares = [thunk, logger];
  const prodMiddlewares = [thunk];

  const middleware = process.env.NODE_ENV !== 'production' ?
    devMiddlewares :
    prodMiddlewares;

  const createStoreWithMiddleware = compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore);
  const store = createStoreWithMiddleware(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
