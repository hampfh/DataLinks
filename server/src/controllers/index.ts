import SubjectController from "./Subject"
import ContentController from "./Content"
import GroupController from "./Group"
import ProgramController from "./Program"
import MetaTagPopulatorController from "./MetaTagPopulator"
import UserController from "./User"

export const Program = new ProgramController()
export const Subject = new SubjectController()
export const Content = new ContentController()
export const Group = new GroupController()
export const MetaTagPopulator = new MetaTagPopulatorController()
export const User = new UserController()