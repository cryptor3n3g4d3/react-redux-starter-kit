import { put, call, all, takeLatest } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';

import { IDependencies } from 'shared/types/app';
import { IDetailedUser, IUsersSearchResults } from 'shared/types/models';
import { getErrorMsg } from 'shared/helpers';

import * as NS from '../namespace';
import * as actions from './actions';

function getSaga(deps: IDependencies) {
  const searchUserType: NS.ISearchUser['type'] = 'USER_SEARCH:SEARCH_USER';
  const loadUserDetailsType: NS.ILoadUserDetails['type'] = 'USER_SEARCH:LOAD_USER_DETAILS';
  return function* saga(): SagaIterator {
    yield all([
      takeLatest(searchUserType, executeSearchUser, deps),
      takeLatest(loadUserDetailsType, executeLoadUserDetails, deps),
    ]);
  };
}

function* executeSearchUser({ api }: IDependencies, { payload }: NS.ISearchUser) {
  try {
    const { searchString, page, ...options } = payload;
    const searchUsersResults: IUsersSearchResults = yield call(api.searchUsers, searchString, options, page);
    yield put(actions.searchUserSuccess({ ...searchUsersResults, page }));
  } catch (error) {
    yield put(actions.searchUserFail(getErrorMsg(error)));
  }
}

function* executeLoadUserDetails({ api }: IDependencies, { payload }: NS.ILoadUserDetails) {
  try {
    yield put(actions.resetUserDetails());
    const userDetails: IDetailedUser = yield call(api.loadUserDetails, payload);
    yield put(actions.loadUserDetailsSuccess(userDetails));
  } catch (error) {
    yield put(actions.loadUserDetailsFail(getErrorMsg(error)));
  }
}

export { getSaga };