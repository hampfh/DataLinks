import { IReduxRootState } from 'state/reducers'
import { connect, useDispatch } from "react-redux"
import Socket from "components/utilities/SocketManager"
import { ContentType } from './contentTypes'
import { addElement, deleteElement, reOrderElement, updateElement } from 'functions/updateElement'
import { IContentState } from 'state/reducers/content'
import moment from "moment"
import { SubjectData } from 'components/screens/Subjects/Subjects'

interface ISocketNewElement {
	parent: string
	id: string
	nestedId: string
	placement: string
	fieldOne: string
	fieldTwo: string
	fieldThree?: string
	type: ContentType
}

interface ISocketDeleteElement {
	parent: string,
	id: string
}

function Subscriptions(props: PropsForComponent) {

	const dispatch = useDispatch()

	return (
		<>
			<Socket subscribeTo="newElement" callback={(data: ISocketNewElement) => {
					const newSubjects = [ ...props.content.activeProgramSubjects ]

					switch(data.type) {
						case ContentType.LINK:
							addElement(newSubjects, {
								_id: data.id,
								link: {
									_id: data.nestedId,
									displayText: data.fieldOne,
									link: data.fieldTwo,
								}
							}, data.parent, parseInt(data.placement, 10))
							break
						case ContentType.TEXT:
							addElement(newSubjects, {
								_id: data.id,
								text: {
									_id: data.nestedId,
									title: data.fieldOne,
									text: data.fieldTwo,
								}
							}, data.parent, parseInt(data.placement, 10))
							break
						case ContentType.DEADLINE:
							addElement(newSubjects, {
								_id: data.id,
								deadline: {
									_id: data.nestedId,
									displayText: data.fieldOne,
									deadline: data.fieldTwo,
									start: data.fieldThree ?? moment().toString()
								}
							}, data.parent, parseInt(data.placement, 10))
							break
					}
					dispatch({ type: "SET_ALL_SUBJECTS", payload: { subjects: newSubjects }})
				}} 
			/>
			<Socket subscribeTo="updateElement" callback={(data: ISocketNewElement) => {

				const newSubjects = [ ...props.content.activeProgramSubjects ]
				switch(data.type) {
					case ContentType.LINK:
						updateElement(newSubjects, {
							_id: data.id,
							link: {
								_id: "",
								displayText: data.fieldOne,
								link: data.fieldTwo
							}
						})
						break

					case ContentType.TEXT:
						updateElement(newSubjects, {
							_id: data.id,
							text: {
								_id: "",
								title: data.fieldOne,
								text: data.fieldTwo
							}
						})
						break

					case ContentType.DEADLINE:
						updateElement(newSubjects, {
							_id: data.id,
							deadline: {
								_id: "",
								displayText: data.fieldOne,
								deadline: data.fieldTwo,
								start: data.fieldThree!
							}
						})
						break
					}
					dispatch({ type: "SET_ALL_SUBJECTS", payload: { subjects: newSubjects } })
				}} 
			/>
			<Socket subscribeTo="deleteElement" callback={(data: ISocketDeleteElement) => {
					
					const newSubjects = [ ...props.content.activeProgramSubjects ]
					deleteElement(newSubjects, data.id)

					dispatch({ type: "SET_ALL_SUBJECTS", payload: { subjects: newSubjects } })
				}}
			/>

			<Socket subscribeTo="updatePosition" callback={(data: {
				parentGroup: string,
				id: string,
				position: number
			}) => {
				const newSubjects: SubjectData[] = JSON.parse(JSON.stringify(props.content.activeProgramSubjects))

				// TODO optiize to directly find the correct parent group instead
				// TODO of brute-forcing over all subjects until the correct element is found
				reOrderElement(newSubjects, data.id, data.position)	
				dispatch({ type: "SET_ALL_SUBJECTS", payload: { subjects: newSubjects }})
			}} />
		</>
	)
}

export interface PropsForComponent {
	content: IContentState,
}

const reduxSelect = (state: IReduxRootState) => ({
	content: state.content
})

export default connect(reduxSelect)(Subscriptions);