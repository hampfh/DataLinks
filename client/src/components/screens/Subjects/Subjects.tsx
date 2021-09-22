import { useEffect } from "react"
import "./components/Switch.css"
import { connect } from "react-redux"
import { IReduxRootState } from "state/reducers"
import { IAppState } from "state/reducers/app"
import { 
	disableEditModeFlag, 
	enableEditMode, 
	IDisableEditModeFlag, 
	IEnableEditMode, 
	ISetDeadlineViewFlag, 
	ISetExtendViewFlag, 
	setDeadlineViewFlag, 
	setExtendViewFlag 
} from "state/actions/app"
import { IDimensionState } from "state/reducers/dimensions"
import { ISetTransforms, setTransforms} from "state/actions/dimensions"
import { useParams } from "react-router-dom"
import { LOGO } from "components/utilities/logos"
import { IAnimationState } from "state/reducers/animations"
import { IContentState } from "state/reducers/content"
import { DataLoader } from "functions/DataLoader"
import NotFoundPage from "../404/404"
import DefaultHeader from "components/templates/headers/DefaultHeader"
import SubjectsLayout from "./components/SubjectsLayout"

function Subjects(props: PropsForComponent) {
	const { program } = useParams<IRouterParams>()

	useEffect(() => {
		DataLoader.manageProgramContentData(program)

		// We do not allow edit mode in preview
		if (props.app.flags.editMode) {
			props.disableEditModeFlag()
		}
	})

	if (props.content.hasLoaded && props.content.activeProgramId == null)
		return <NotFoundPage />

	return (
		<div>
			<DefaultHeader program={program} menuSelect={0} pagePresenter="Workspace" />
			<SubjectsLayout subjects={props.content.activeProgramSubjects} updateSubjects={props.updateSubjects} />
		</div>
	)
}

export interface SubjectData {
	_id: string,
	name: string,
	code: string,
	description: string,
	logo: LOGO,
	color: string,
	group: Group,
	archived: boolean,
	createdAt: Date,
	updatedAt: Date,
	__v: number
}

interface PropsForComponent {
	content: IContentState,
	app: IAppState,
	dimensions: IDimensionState,
	animations: IAnimationState,
	updateSubjects: () => void,
	enableEditMode: IEnableEditMode,
	disableEditModeFlag: IDisableEditModeFlag,
	setExtendViewFlag: ISetExtendViewFlag,
	setDeadlineViewFlag: ISetDeadlineViewFlag,
	setTransforms: ISetTransforms
}

const reduxSelect = (state: IReduxRootState) => ({
	app: state.app,
	dimensions: state.dimensions,
	animations: state.animations,
	content: state.content
})

const reduxDispatch = () => ({
	enableEditMode,
	disableEditModeFlag,
	setExtendViewFlag,
	setDeadlineViewFlag,
	setTransforms
})

export default connect(reduxSelect, reduxDispatch())(Subjects)