import createSagaMiddleware from 'redux-saga';
import { initializeCurrentLocation } from 'redux-little-router';
import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
  Middleware,
} from 'redux';
import { rootSaga } from '~/state/sagas/root';
import { reducer as rootReducer } from '~/state/reducers/root';
import { routerEnhancer, routerMiddleware } from '~/routing';

const windowObj = window as any;

const sagaMiddleware = createSagaMiddleware();
const middleware: Middleware[] = [sagaMiddleware];

const hasReduxDevtools =
  typeof windowObj === 'object' &&
  (windowObj as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

const composeEnhancers = hasReduxDevtools
  ? windowObj.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
  : compose;

const enhancer = composeEnhancers(
  routerEnhancer,
  applyMiddleware(...middleware, routerMiddleware)
);

export const store = createStore(rootReducer, enhancer);

sagaMiddleware.run(rootSaga);

// Initialize location state in router
const initialRouterState = store.getState().router;
store.dispatch(initializeCurrentLocation(initialRouterState));

export type RootState = ReturnType<typeof store.getState>;