import { calcTimeLeft, formatNumberToClock } from 'functions/date_calculations'
import { appendsIfPlural } from 'functions/string_formatting'
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { IReduxRootState } from 'state/reducers'

import "./DeadlineColumnItem.css"
import { addCompleteDeadline, IAddCompleteDeadline } from 'state/actions/deadlines'

function DeadlineColumnItem(props: PropsForComponent) {

    const wrapper = useRef<HTMLDivElement>(null)

    const animationDuration = 0.5
    const [completeAnimation, setCompleteAnimation] = useState(false)
    let animationTimeout: NodeJS.Timeout | undefined

    const [remaining, setRemaining] = useState<{
        months: number
        weeks: number
        days: number
        hours: number
        minutes: number
        seconds: number
    }>(calcTimeLeft(props.deadlineObject.deadline))

    useEffect(() => {
        const interval = setInterval(() => {
            setRemaining(calcTimeLeft(props.deadlineObject.deadline))
        }, 1000)
        return () => {
            clearInterval(interval)
            if (animationTimeout)
                clearTimeout(animationTimeout)
        }
    }, [animationTimeout, props.deadlineObject.deadline])

    function markDeadlineAsCompleted(id: string) {
        setCompleteAnimation(true)
        animationTimeout = setTimeout(() => {
            props.addCompleteDeadline(id)
            props.completeDeadline(id)
        }, 1000 * animationDuration)
    }

    return (
        <div 
            title="Mark this deadline as done"
            ref={wrapper} 
            className="deadline-column-item-container" 
            style={{
                marginBottom: completeAnimation && wrapper.current != null ? `calc(${-wrapper.current.clientHeight}px - 1rem)` : 0,
                opacity: completeAnimation ? 0 : 1
            }
        }>
            <div className="deadline-column-item-content-container">
                <h4 className="deadline-column-item-displayText">{props.deadlineObject.displayText}</h4>
                {remaining.months + remaining.weeks + remaining.days + remaining.hours + remaining.minutes + remaining.seconds <= 0 ?
                    <div className="deadline-column-item-passed-text-container">
                        <p>Passed</p>
                    </div> : 
                    <div className="deadline-column-item-datetime-container">
                        <div className="deadline-column-item-date-container">
                            {remaining.months > 0 &&
                                <p>{`${remaining.months} ${appendsIfPlural("Month", remaining.months)}`}</p>
                            }
                            {remaining.weeks > 0 &&
                                <p>{`${remaining.weeks} ${appendsIfPlural("Week", remaining.weeks)}`}</p>
                            }
                            {remaining.days > 0 &&
                                <p>{`${remaining.days} ${appendsIfPlural("Day", remaining.days)}`}</p>
                            }
                        </div>
                        <div className="deadline-column-item-time-container">
                            <p>{`${formatNumberToClock(remaining.hours)}:${formatNumberToClock(remaining.minutes)}:${formatNumberToClock(remaining.seconds)}`}</p>
                        </div>
                    </div>
                }
            </div>
            <div className="deadline-column-item-checkmark-container">
                <button
                    className="deadline-column-item-button" 
                    onClick={() => markDeadlineAsCompleted(props.deadlineObject._id)} 
                >
                    <p>Complete</p>
                </button>
            </div>
        </div>
    )
}

interface PropsForComponent {
    deadlineObject: IDeadline
    completed: string[]
    addCompleteDeadline: IAddCompleteDeadline
    completeDeadline: (id: string) => void
}

const reduxSelect = (state: IReduxRootState) => ({
    completed: state.deadlines.completed
})

const reduxDispatch = () => ({
    addCompleteDeadline
})

export default connect(reduxSelect, reduxDispatch())(DeadlineColumnItem)