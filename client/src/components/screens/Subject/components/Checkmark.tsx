import "./Checkmark.css"

export default function Checkmark(props: PropsForComponent) {
	return (
		<div 
			className="centerCheckmarkAligner"
		>
			<svg 
				className={`checkmark ${props.animate ? "animate" : ""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"
			>
				<circle className={`checkmark__circle ${props.animate ? "animate" : ""}`} cx="26" cy="26" r="25" fill="none" />
				<path className={`checkmark__check ${props.animate ? "animate" : ""}`} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
			</svg>
		</div>
	)
}

interface PropsForComponent {
	animate: boolean
}