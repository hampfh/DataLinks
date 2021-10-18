import { SubjectData } from "components/screens/Subjects/Subjects"
import moment from "moment"

export function sortDeadlines(deadlines: ContentObject[]) {
    deadlines.sort((a, b) => {
        return moment(a.deadline!.deadline).diff(b.deadline!.deadline, "second")
    })
    return deadlines
}

export function getDeadlines(subjects: SubjectData[], predicate?: (subject: SubjectData, deadline: ContentObject) => boolean): ContentObject[] {
    let deadlines: ContentObject[] = []
    // Itterate through all subjects
    for (let i = 0; i < subjects.length; i++) {
        let strippedDeadlines = recursivlyGetDeadlines(subjects[i].group)

        // If predicate is defined we filter through all deadlines
        if (predicate != null)
            strippedDeadlines = strippedDeadlines.filter(deadline => predicate(subjects[i], deadline))

        if (deadlines.length <= 0)
            deadlines = strippedDeadlines
        else
            deadlines = deadlines.concat(strippedDeadlines)	
    }

    return deadlines
}

/**
 * Go through the content hierarchy and find all deadlines
 */
function recursivlyGetDeadlines(group: Group, depth?: number): ContentObject[] {
    if (group == null || (depth !== undefined && depth > 5))
        return []

    let content: ContentObject[] = []
    for (let i = 0; i < group.content.length; i++) {
        if (group.content[i].group != null) {
            const response = recursivlyGetDeadlines(group.content[i].group as Group, depth === undefined ? 1 : depth + 1)
            if (response.length > 0) {
                if (content.length <= 0)
                    content = response
                else
                    content = content.concat(response)
            }
        } else if (group.content[i].deadline?.deadline != null)
            content.push(group.content[i])
    }
    return content
}