import SubjectController from "./Subject"
import ContentController from "./Content"
import GroupController from "./Group"
import ContributorsController from "./Contributors"
import ProgramController from "./Program"
import MetaTagPopulatorController from "./MetaTagPopulator"

export const Program = new ProgramController()
export const Subject = new SubjectController()
export const Content = new ContentController()
export const Group = new GroupController()
export const Contributors = new ContributorsController()
export const MetaTagPopulator = new MetaTagPopulatorController()