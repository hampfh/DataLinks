import { SubjectData } from "../../components/screens/Subjects/Subjects"

export const APP_FLAG_KEY = "flags"

export interface IFlagInterface {
	editMode: boolean,
	extendedView: boolean,
	deadlineView: boolean
}

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
		saveFlags("editMode", mode)
		return true
	} else
		return false
}

function saveFlags(settingName: string, mode: boolean) {

	function setFlag(settingName: string, mode: boolean) {
		localStorage.setItem(APP_FLAG_KEY, JSON.stringify({
			[settingName]: mode
		}))
	}

	// Check if flag target exists
	const target = localStorage.getItem(APP_FLAG_KEY)
	if (target == null) {
		setFlag(settingName, mode)
		return
	}
	else {
		try {
			// Add the new flag to the already existing ones
			let flags = JSON.parse(target)
			// If mode is false then remove the flag from the object
			if (!!!mode) {
				let { [settingName]: exclude, ...other } = flags
				flags = other
			} else 
				flags[settingName] = mode
			localStorage.setItem(APP_FLAG_KEY, JSON.stringify(flags))
		} catch (error) {
			// If fail the override localstorage with the new setting
			setFlag(settingName, mode)
		}
	}
}

export function loadFlags(): IFlagInterface | null  {
	const target = localStorage.getItem(APP_FLAG_KEY)
	if (target == null)
		return null
	
	try {
		const flags = JSON.parse(target)
		return flags
	} catch (error) { return null }
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

export interface IDisableEditModeFlag { (): void }
export const disableEditModeFlag = () => {

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

export interface ISetExtendViewFlag { (enableExtend: boolean): void }
export const setExtendViewFlag = (enableExtend: boolean) => {
	saveFlags("extendedView", enableExtend)
	return {
		type: "SET_EXTEND_VIEW_FLAG",
		payload: {
			mode: enableExtend
		}
	}
}

export interface ISetDeadlineViewFlag { (deadlineViewMode: boolean): void }
export const setDeadlineViewFlag = (deadlineViewMode: boolean) => {
	saveFlags("deadlineView", deadlineViewMode)
	return {
		type: "SET_DEADLINE_VIEW_FLAG",
		payload: {
			mode: deadlineViewMode
		}
	}
}