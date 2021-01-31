import { SubjectData } from "components/screens/Subjects/Subjects";
import { formatTime, getCurrentTimeZone } from "components/utilities/time";

export enum SearchStatus {
	NONE_FOUND = 0,
	ALL_OK = 1,
	DELETE_THIS = 2
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
			return SearchStatus.ALL_OK
		})) {
			console.log("FOUND it")
			return
		}
	}
	console.log("DID NOT FIND")
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
			return SearchStatus.ALL_OK
		})) {
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
			return SearchStatus.DELETE_THIS
		}) === SearchStatus.ALL_OK) {
			// Exit recursion
			return
		}
	}
}

/**
 * 
 * @param contentObject 
 * @param newElement 
 * @param action 
 * @returns 0, no element found
 * @returns 1, all ok
 * @returns 2, delete this element
 */
export const recursiveSearchElement = (
	contentObject: ContentObject, 
	newElement: ContentObject, 
	action: (contentObject: ContentObject, newElement: ContentObject
) => number): SearchStatus => {

	// Check if element is target
	if (contentObject._id.toString() === newElement._id.toString() || 
	(contentObject.group && contentObject.group._id.toString() === newElement._id.toString()))
		return action(contentObject, newElement)

	if (contentObject.group != null) {
		for (let i = 0; i < contentObject.group.content.length; i++) {
			switch (recursiveSearchElement(contentObject.group.content[i], newElement, action)) {
				case SearchStatus.ALL_OK: 
					return SearchStatus.ALL_OK
				case SearchStatus.DELETE_THIS:
					// Remove element in list
					contentObject.group.content.splice(i, 1)
					return SearchStatus.ALL_OK
				default:
					break
			}
		}
	}

	return SearchStatus.NONE_FOUND
}