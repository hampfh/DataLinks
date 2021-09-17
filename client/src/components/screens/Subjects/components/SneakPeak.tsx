import RenderData from "components/templates/content_rendering/RenderData"
import { SubjectData } from '../Subjects'

import "./SneakPeak.css"

export default function SneakPeak(props: PropsForComponent) {
	if (props.sneakPeakSubject.group == null) {
		console.warn("Subject " + props.sneakPeakSubject.name + " has no root")
		return null;
	}

	return (
		<div className="sneakpeak-box-wrapper">
			<div className="sneakpeak-box-about-container">
				<h3 className="sneakpeak-box-code-title">{props.sneakPeakSubject.code}</h3>
				<h4 className="sneakpeak-box-name-text">{props.sneakPeakSubject.name}</h4>
				<hr className="sneakpeak-box-separator" />
				<p className="sneakpeak-box-description-text">{props.sneakPeakSubject.description}</p>
			</div>
			<RenderData 
				ignoreGroups
				updateSubjects={props.updateSubjects}
				group={(props.sneakPeakSubject as SubjectData).group}
			/>
		</div>
	)
}

export interface PropsForComponent {
	updateSubjects: () => void,
	sneakPeakSubject: SubjectData
}