import { store } from "state/reducers"
import http from "./HttpRequest"

interface IProgram {
    id: string
    name: string
    subjects: string[]
}

export class DataLoader {
    static programLoaded(programName: string): boolean {
        const { content } = store.getState()
        return (content.activeProgramId != null && content.activeProgramName === programName)
    }
    
    private static async loadProgramData(programName: string): Promise<IProgram | undefined> {
        const response = await http({
            url: "/api/v1/program",
            method: "GET",
            data: {
                name: programName
            }
        })

        if (response.programs.length <= 0)
            return

        return {
            id: response.programs[0].id,
            name: response.programs[0].name,
            subjects: response.programs[0].subjects
        }
    }
    

    /**
     * @param programName 
     * @returns Returns status code, 0 means no error
     */
    static async manageProgramContentData(programName: string): Promise<number> {

        if (this.programLoaded(programName)) {
            return 0
        }

        const program = await this.loadProgramData(programName)

        let payload: Partial<IProgram>
        let status = 0

        if (program == null) {
            // Reset program
            payload = {
                id: undefined,
                name: undefined,
                subjects: []
            }
            status = 1
        } else {
            const response = await http({
                url: "/api/v1/subject",
                method: "GET",
                data: {
                    program: program.id
                }
            })
            
            payload = {
                id: program.id,
                name: program.name,
                subjects: response.subjects
            }
        }

        store.dispatch({
            type: "SET_ACTIVE_PROGRAM",
            payload
        })

        store.dispatch({
            type: "SET_HAS_LOADED",
            payload: {
                loaded: true
            }
        })

        return status
    }

    static getActiveProgram() {
        const { content } = store.getState()
        if (content.activeProgramId == null)
            return
        return {
            id: content.activeProgramId,
            name: content.activeProgramName!
        }
    }
}