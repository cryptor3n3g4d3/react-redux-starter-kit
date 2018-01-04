import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { compose, applyMiddleware, combineReducers, createStore, Reducer, Middleware, Store } from 'redux';
import { reducer as multiConnectReducer } from 'shared/helpers/redux/multiConnect';
import { composeReducers } from 'shared/helpers/redux';

import { IAppReduxState } from 'shared/types/app';
import { ReducersMap } from 'shared/types/redux';

interface IStoreData {
  store: Store<IAppReduxState>;
  runSaga: SagaMiddleware['run'];
}

function configureStore(): IStoreData {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares: Middleware[] = [sagaMiddleware];

  const composeEnhancers = process.env.NODE_ENV === 'development' ? composeWithDevTools({}) : compose;

  const store: Store<IAppReduxState> = createStore(
    (state: IAppReduxState) => state,
    composeEnhancers(applyMiddleware(...middlewares)),
  );

  return {
    store,
    runSaga: sagaMiddleware.run,
  };
}

function createReducer(reducers: ReducersMap<IAppReduxState>): Reducer<IAppReduxState> {
  return composeReducers<IAppReduxState>([
    multiConnectReducer as Reducer<IAppReduxState>,
    combineReducers<IAppReduxState>(reducers),
  ]);
}

export { createReducer, IStoreData };
export default configureStore;
