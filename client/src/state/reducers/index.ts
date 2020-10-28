import { combineReducers } from 'redux'
import local, { ILocalState } from './local';

export interface ActionType<T> {
	type: string,
	payload: T
}

export interface IReduxRootState {
	local: ILocalState
}

const rootReducer = combineReducers({
	local
});

export default rootReducer;