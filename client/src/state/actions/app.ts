import { SubjectData } from "../../components/screens/Subjects/Subjects"

/**
 * Checks if user has agreed
 * @param mode
 * @returns a boolean indicating if user has agreed
 */
function agreeBehavior (): boolean {
	if (localStorage.getItem("agreeBehavior") === "true")
		return true
	else {
		if (window.confirm("By entering edit mode you promise to make changes that benefit the site and the people using it. \nThis feature is trust-based and may be disabled if misused\n\nPlease note that all changes made are logged, thus inappropriate changes can be traced back to the user\n\nAlso note that this is an experimental feature thus bug reports are very much appreciated")) {
			localStorage.setItem("agreeBehavior", "true")
			return true
		}
	}
	return false
}

/**
 * Saves edit mode to local storage
 * @param mode 
 * @returns a boolean indicating if operation was successful
 */
function saveEditMode(mode: boolean): boolean {
	if (agreeBehavior()) {
		if (mode)
			localStorage.setItem("editMode", "true")
		else
			localStorage.removeItem("editMode")
		return true
	} else {
		return false
	}
}

export interface IEnableEditMode { (): void }
export const enableEditMode = (mode = true) => {

	if (!!!saveEditMode(mode)) {
		return {
			type: '',
			payload: {}
		}
	}

	return {
		type: 'ENABLE_EDIT_MODE',
		payload: {}
	}
}

export interface IDisableEditMode { (): void }
export const disableEditMode = () => {

	saveEditMode(false)

	return {
		type: 'DISABLE_EDIT_MODE',
		payload: {}
	}
}

export interface IShowSneakPeak { (subject: SubjectData): void }
export const showSneakPeak = (subject: SubjectData) => {
	return {
		type: 'SHOW_SNEAK_PEAK',
		payload: {
			subject
		}
	}
}

export interface IHideSneakPeak { (): void }
export const hideSneakPeak = () => {
	return {
		type: 'HIDE_SNEAK_PEAK',
		payload: {}
	}
}

export interface ISetSneakPeakSelectionCount { (count: number): void }
export const setSneakPeakSelectionCount = (count: number) => {
	return {
		type: "SET_SNEAK_PEAK_SELECTION_COUNT",
		payload: {
			newCount: count
		}
	}
}