export const COMPLETED_DEADLINES_KEY = "completedDeadlines"
export type LOCALSTORAGE_OPERATION = "ADD" | "REMOVE"

export function saveCompletedDeadlines(operation: LOCALSTORAGE_OPERATION, hash: string) {

	function initializeDeadlineStorage(hash: string) {
		localStorage.setItem(COMPLETED_DEADLINES_KEY, JSON.stringify([
			hash
		]))
	}

	// Check if flag target exists
	const target = localStorage.getItem(COMPLETED_DEADLINES_KEY)
	if (target == null) {
		if (operation === "ADD")
			initializeDeadlineStorage(hash)
		return
	}
	else {
		try {
			// Add the new flag to the already existing ones
			let completed = JSON.parse(target) as string[]
			// If mode is false then remove the flag from the object
			if (operation === "REMOVE") {
				const index = completed.findIndex((completedId) => completedId === hash)
				completed.splice(index, 1)
			} else
				completed.push(hash)
			localStorage.setItem(COMPLETED_DEADLINES_KEY, JSON.stringify(completed))
		} catch (error) {
			// If fail the override localstorage with the new setting
			if (operation === "ADD")
				initializeDeadlineStorage(hash)
		}
	}
}

export function loadCompletedDeadlines(): string[] {
	const localStorageResult = localStorage.getItem(COMPLETED_DEADLINES_KEY)
	if (localStorageResult === null)
		return []
	else {
		try {
			return JSON.parse(localStorageResult) as string[]
		} catch (error) {
			return []
		}
	}
}

export interface ISetCompletedDeadlines { (deadlines: string[]): void }
export const setCompletedDeadlines = (deadlines: string[]) => {
	return {
		type: "SET_COMPLETED_DEADLINES",
		payload: {
			deadlines
		}
	}
}

export interface IAddCompleteDeadline { (hash: string): void }
export const addCompleteDeadline = (hash: string) => {
	saveCompletedDeadlines("ADD", hash)
	return {
		type: "COMPLETE_DEADLINE",
		payload: {
			hash
		}
	}
}

export interface IRemoveCompleteDeadline { (hash: string): void }
export const removeCompleteDeadline = (hash: string) => {
	saveCompletedDeadlines("REMOVE", hash)
	return {
		type: "UN_COMPLETE_DEADLINE",
		payload: {
			hash
		}
	}
}