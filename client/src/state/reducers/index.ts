import { combineReducers } from 'redux'
import local, { ILocalState } from './local';
import app, { IAppState } from './app'
import deadlines, { IDeadlineState } from './deadlines'
import dimensions, { IDimensionState } from './dimensions'
import content, { IContentState } from './content';
import animations, { IAnimationState } from "./animations"

export interface ActionType<T> {
	type: string,
	payload: T
}

export interface IReduxRootState {
	app: IAppState,
	local: ILocalState,
	deadlines: IDeadlineState,
	dimensions: IDimensionState,
	content: IContentState,
	animations: IAnimationState
}

const rootReducer = combineReducers({
	app,
	local,
	deadlines,
	dimensions,
	content,
	animations
});

export default rootReducer;