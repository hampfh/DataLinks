import { useEffect, useState } from 'react'
import { getDeadlines, sortDeadlines } from 'components/utilities/deadline_computations'
import { connect } from 'react-redux'
import { IReduxRootState } from 'state/reducers'
import { SubjectData } from '../Subjects'
import DeadlineColumnItem from './DeadlineColumnItem'

function DeadlineColumn(props: PropsForComponent) {

    const [deadlines, setDeadlines] = useState<ContentObject[]>([])

    useEffect(() => {
        setDeadlines(sortDeadlines(getDeadlines(props.subjects)))
    }, [props.subjects])

    useEffect(() => {
        console.log("UPDATE")
    })

    function removeDeadline(id: string) {
        setDeadlines(deadlines.filter((current) => current._id !== id))
    }

    function filterCompletedDeadlines(deadlines: ContentObject): boolean {
        return props.completed.find(current => current === deadlines.deadline!._id) == null
    }

    function selectDeadlineField(total: IDeadline[], current: ContentObject): IDeadline[] {
        total.push(current.deadline!)
        return total
    }

    return (
        <div className="deadline-column-item-wrapper">
            {deadlines.filter(filterCompletedDeadlines).reduce(selectDeadlineField, []).map(current => 
                <DeadlineColumnItem key={current._id} completeDeadline={removeDeadline} deadlineObject={current} />
            )}
        </div>
    )
}

interface PropsForComponent {
    subjects: SubjectData[]
    completed: string[]
}

const reduxSelect = (state: IReduxRootState) => ({
    completed: state.deadlines.completed
})

export default connect(reduxSelect)(DeadlineColumn)