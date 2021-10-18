import { useEffect } from "react"
import { IAppState } from "state/reducers/app"
import { 
    disableEditModeFlag,
} from "state/actions/app"
import { useParams } from "react-router-dom"
import { LOGO } from "components/utilities/logos"
import { IContentState } from "state/reducers/content"
import { DataLoader } from "functions/DataLoader"
import NotFoundPage from "../404/404"
import DefaultHeader from "components/templates/headers/DefaultHeader"
import { useDispatch, useSelector } from "react-redux"
import { IReduxRootState } from "state/reducers"
import DeadlinesLayoutContainer from "./DeadlinesLayoutContainer"

export default function Deadlines() {
	const { program } = useParams<IRouterParams>()

    const app = useSelector<IReduxRootState, IAppState>(state => state.app)
    const content = useSelector<IReduxRootState, IContentState>(state => state.content)
    const dispatch = useDispatch()

	useEffect(() => {
		DataLoader.manageProgramContentData(program)

		// We do not allow edit mode in preview
		if (app.flags.editMode)
            dispatch(disableEditModeFlag)
	})

	if (content.hasLoaded && content.activeProgramId == null)
		return <NotFoundPage />

	return (
		<div>
			<DefaultHeader program={program} menuSelect={1} pagePresenter="Deadlines" />
            <DeadlinesLayoutContainer />
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