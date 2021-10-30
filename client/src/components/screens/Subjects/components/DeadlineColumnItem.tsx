import { calcTimeLeft, formatDate, formatNumberToClock } from 'functions/date_calculations'
import { appendsIfPlural } from 'functions/string_formatting'
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { IReduxRootState } from 'state/reducers'

import "./DeadlineColumnItem.css"
import { addCompleteDeadline, IAddCompleteDeadline } from 'state/actions/deadlines'
import moment from 'moment'

function DeadlineColumnItem(props: PropsForComponent) {

    const wrapper = useRef<HTMLDivElement>(null)

    const animationDuration = 0.5
    const [completeAnimation, setCompleteAnimation] = useState(props.completed.find(current => current === props.id) != null)
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

    function extractFirstWord(string: string): { first: string, second: string | undefined } {
        let partOne = ""
        let partTwo = ""

        const splits = string.split(" ")
        partOne = splits[0]

        if (splits.length < 2) {
            return { first: partOne, second: undefined }
        }

        for (let i = 1; i < splits.length; i++) {
            partTwo += `${splits[i]} `
        }

        return { first: partOne, second: partTwo }
    }

    const { first, second } = extractFirstWord(props.deadlineObject.displayText)

    return (
        <div 
            title="Mark this deadline as done"
            ref={wrapper} 
            className="deadline-column-item-container" 
            style={{
                marginBottom: completeAnimation && wrapper.current != null ? `calc(${-wrapper.current.clientHeight}px - 2rem)` : 0,
                opacity: completeAnimation ? 0 : 1
            }
        }>
            <div className="deadline-column-item-content-container">
                <div className="deadline-column-item-description-container">
                    <h4 className="deadline-column-item-displayText">{first}</h4>
                    {second &&
                        <h4 className="deadline-column-item-displayText small">{second}</h4>
                    }
                </div>
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
                    onClick={() => markDeadlineAsCompleted(props.id)} 
                >
                    <p>Complete</p>
                </button>
                <p className="deadline-date-text">{formatDate(props.deadlineObject.deadline)} {moment(props.deadlineObject.deadline).format("HH:mm")}</p>
            </div>
        </div>
    )
}

interface PropsForComponent {
    id: string
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