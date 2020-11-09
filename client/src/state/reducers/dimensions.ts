import { ActionType } from '.'

export type DimensionTarget = "window" | "subjects" | "content" | "toolbar"
export interface IDimension {
	width: number,
	height: number
}

export interface IDimensionState {
	window: IDimension,
	subjects: IDimension,
	content: IDimension,
	toolbar: IDimension
}

const defaultState = {
	window: {
		width: window.innerWidth,
		height: window.innerHeight
	},
	subjects: {
		width: 0,
		height: 0
	},
	content: {
		width: 0,
		height: 0
	},
	toolbar: {
		width: 0,
		height: 0
	}
}

const transform = (state: IDimensionState = defaultState, action: ActionType<any>) => {
	let newState = { ...state };
	switch (action.type) {
		case 'SET_TRANSFORM':
			newState[action.payload.target as DimensionTarget] = action.payload.transform;
			return newState
		case 'SET_TRANSFORMS':
			newState = { ...newState , ...action.payload.transforms };
			return newState
		default:
			return newState
	}
}

export default transform;