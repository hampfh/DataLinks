import { SubjectData } from "components/screens/Subjects/Subjects";
import { ContentObject } from "components/templates/RenderData";

export const updateElement = (subjects: SubjectData[], newElement: ContentObject) => {
	for (let i = 0; i < subjects.length; i++) {
		if (recursiveSearchElement(subjects[i], newElement))
			return
	}
}

export const recursiveSearchElement = (contentObject: ContentObject, newElement: ContentObject): boolean => {

	// Check if element is target
	if (contentObject._id.toString() === newElement._id.toString()) {
		contentObject.text = newElement.text
		contentObject.link = newElement.link
		contentObject.deadline = newElement.deadline
		return true
	}

	if (contentObject.group != null) {
		for (let i = 0; i < contentObject.group.content.length; i++) {
			if (recursiveSearchElement(contentObject.group.content[i], newElement))
				return true
		}
	}

	return false
}