import { ActionType } from ".";
import { SubjectData } from "../../components/screens/Subjects/Subjects";

export interface IAppState {
	editMode: boolean,
	sneakPeak?: SubjectData,
	sneakPeakSelectionCount: number,
	extendedMode: boolean
}

const defaultState = {
	editMode: false,
	sneakPeak: undefined,
	sneakPeakSelectionCount: 0,
	extendedMode: false
}

const app = (state: IAppState = defaultState, action: ActionType<any>) => {
	let newState = { ...state };
	switch (action.type) {
		case 'ENABLE_EDIT_MODE':
			newState.editMode = true;
			return newState
		case 'DISABLE_EDIT_MODE':
			newState.editMode = false;
			return newState
		case 'SHOW_SNEAK_PEAK':
			newState.sneakPeak = action.payload.subject
			newState.sneakPeakSelectionCount = 1
			return newState
		case 'HIDE_SNEAK_PEAK':
			newState.sneakPeak = undefined
			newState.sneakPeakSelectionCount = 0
			return newState
		case 'SET_SNEAK_PEAK_SELECTION_COUNT':
			newState.sneakPeakSelectionCount = action.payload.newCount
			if (action.payload.newCount <= 0) {
				newState.sneakPeak = undefined
				newState.sneakPeakSelectionCount = 0
			}
			return newState
		case 'SET_EXTEND_MODE':
			newState.extendedMode = action.payload.mode
			return newState
		default:
			return newState
	}
}

export default app;