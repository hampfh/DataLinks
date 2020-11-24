import { SubjectData } from "components/screens/Subjects/Subjects";
import { ContentObject } from "components/templates/RenderData";

export const sortSubjects = (subjects: SubjectData[]) => {
	for (let i = 0; i < subjects.length; i++) {
		for (let j = 0; j < subjects[i].group.content.length; j++) 
			recursiveSortGroup(subjects[i].group.content[j])
	}
}

/**
 * Recursivly sorts all data on placement context
 * @param current 
 */
export const recursiveSortGroup = (current: ContentObject) => {
	if (current.group == null) 
		return
	
	for (let i = 0; i < current.group.content.length; i++) {
		if (current.group.content[i].group != null)
			recursiveSortGroup(current.group.content[i])
	}

	current.group.content.sort((a: ContentObject, b: ContentObject) => {
		return b.placement - a.placement
	})
}