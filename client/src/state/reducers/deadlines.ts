import { ActionType } from ".";

export interface IDeadlineState {
	completed: string[],
	hasAnimated: string[]
}

const defaultState = {
	completed: [],
	/*
		"Animated" is the checkmark that appears
		on completed deadlines
	*/
	hasAnimated: []
}

const app = (state: IDeadlineState = defaultState, action: ActionType<any>) => {
	let newState = { ...state };
	switch (action.type) {
		case 'SET_COMPLETED_DEADLINES':
			newState.completed = action.payload.deadlines
			return newState
		case 'COMPLETE_DEADLINE':
			newState.completed.push(action.payload.hash)
			return newState
		case 'UN_COMPLETE_DEADLINE':
			const deadlineIdIndex = newState.completed.findIndex((hash) => hash === action.payload.hash)
			newState.completed.splice(deadlineIdIndex, 1)
			const animationIndex = newState.hasAnimated.findIndex((hash) => hash === action.payload.hash)
			newState.hasAnimated.splice(animationIndex, 1)
			return newState
		case 'HAS_ANIMATED':
			newState.hasAnimated.push(action.payload.hash)
			return newState
		case 'RESET_ANIMATED':
			const index = newState.hasAnimated.findIndex((hash) => hash === action.payload.hash)
			newState.hasAnimated.splice(index, 1)
			return newState
		default:
			return newState
	}
}

export default app;