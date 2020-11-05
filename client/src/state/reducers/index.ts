import { combineReducers } from 'redux'
import local, { ILocalState } from './local';
import app, { IAppState } from './app'
import deadlines, { IDeadlineState } from './deadlines'

export interface ActionType<T> {
	type: string,
	payload: T
}

export interface IReduxRootState {
	app: IAppState,
	local: ILocalState,
	deadlines: IDeadlineState
}

const rootReducer = combineReducers({
	app,
	local,
	deadlines
});

export default rootReducer;