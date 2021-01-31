import { SubjectData } from "components/screens/Subjects/Subjects"
import { HttpReturnType } from "./HttpRequest"
import Http from "functions/HttpRequest"

export async function fetchUpdatedSubjects() {
    const response = (await Http({
        url: "/api/v1/subject",
        method: "GET",
    })) as HttpReturnType & {
        result: Array<SubjectData>
    }

    if (response.status >= 200 && response.status < 300) 
        return response.result
    
    throw Error("Could not load data")
}