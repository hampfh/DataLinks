import { ActionType } from ".";

export interface IDeadlineState {
	completed: string[],
}

const defaultState = {
	completed: [],
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
			return newState
		default:
			return newState
	}
}

export default app;