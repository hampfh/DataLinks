import { SubjectData } from "components/screens/Subjects/Subjects";
import { formatTime, getCurrentTimeZone } from "components/utilities/time";

export enum SearchStatus {
	NONE_FOUND = 0,
	ALL_OK = 1,
	DELETE_THIS = 2,
	UPDATE_POSITION = 3
}

/**
 * Add a new element to the state
 * @param subjects 
 * @param newElement 
 * @param parentGroup 
 */
export const addElement = (subjects: SubjectData[], newElement: ContentObject, parentGroup: string) => {
	for (let i = 0; i < subjects.length; i++) {
		if (recursiveSearchElement(subjects[i], { _id: parentGroup }, (contentObject, searchObject) => {
			// Add newElement to group
			contentObject.group?.content.push(newElement)
			return { status: SearchStatus.ALL_OK }
		}).status !== SearchStatus.NONE_FOUND) {
			return
		}
	}
}

/**
 * Update an element 
 * @param subjects 
 * @param newElement 
 */
export const updateElement = (subjects: SubjectData[], newElement: ContentObject) => {

	// Format deadline if it exists
	if (newElement.deadline)
		newElement.deadline.deadline = formatTime(getCurrentTimeZone(newElement.deadline.deadline))

	for (let i = 0; i < subjects.length; i++) {
		if (recursiveSearchElement(subjects[i], newElement, (contentObject, newElement) => {
			contentObject.text = newElement.text
			contentObject.link = newElement.link
			contentObject.deadline = newElement.deadline
			return { status: SearchStatus.ALL_OK }
		}).status !== SearchStatus.NONE_FOUND) {
			return
		}
	}
}

/**
 * Find a specific element and delete it from the state
 * @param subjects 
 * @param id 
 */
export const deleteElement = (subjects: SubjectData[], id: string) => {
	for (let i = 0; i < subjects.length; i++) {
		if (recursiveSearchElement(subjects[i], { _id: id }, () => {
			return { status: SearchStatus.DELETE_THIS }
		}).status === SearchStatus.ALL_OK) {
			// Exit recursion
			return
		}
	}
}

export const reOrderElement = (subjects: SubjectData[], id: string, newPosition: number) => {
	for (let i = 0; i < subjects.length; i++) {
		if (recursiveSearchElement(subjects[i], { _id: id }, () => {
			return { status: SearchStatus.UPDATE_POSITION, value: newPosition }
		}).status === SearchStatus.ALL_OK) {
			// Exit recursion
			return
		}
	}
}

/**
 * 
 * @param contentObject 
 * @param searchElement 
 * @param action 
 * @returns 0, no element found
 * @returns 1, all ok
 * @returns 2, delete this element
 * @returns 3, change position of element
 */
export const recursiveSearchElement = (
	contentObject: ContentObject, 
	searchElement: ContentObject, 
	action: (contentObject: ContentObject, searchElement: ContentObject) => { status: SearchStatus, value?: number }
): { status: SearchStatus, value?: number } => {

	// Check if element is target
	if (contentObject._id.toString() === searchElement._id.toString() || 
	(contentObject.group && contentObject.group._id.toString() === searchElement._id.toString()))
		return action(contentObject, searchElement)

	if (contentObject.group != null) {
		for (let i = 0; i < contentObject.group.content.length; i++) {
			const result = recursiveSearchElement(contentObject.group.content[i], searchElement, action)
			switch (result.status) {
				case SearchStatus.ALL_OK: 
					return { status: SearchStatus.ALL_OK }
				case SearchStatus.DELETE_THIS:
					// Remove element in list
					contentObject.group.content.splice(i, 1)
					return { status: SearchStatus.ALL_OK }
				case SearchStatus.UPDATE_POSITION:
					if (!result.value)
						throw Error("Value must be defined for position update")
						
					const reOrderElement = contentObject.group.content.splice(i, 1)[0]
					contentObject.group.content.splice(result.value, 0, reOrderElement)
					return { status: SearchStatus.ALL_OK }
				default:
					break
			}
		}
	}

	return { status: SearchStatus.NONE_FOUND }
}