import { combineReducers } from 'redux'
import local, { ILocalState } from './local';
import app, { IAppState } from './app'

export interface ActionType<T> {
	type: string,
	payload: T
}

export interface IReduxRootState {
	app: IAppState,
	local: ILocalState
}

const rootReducer = combineReducers({
	app,
	local
});

export default rootReducer;