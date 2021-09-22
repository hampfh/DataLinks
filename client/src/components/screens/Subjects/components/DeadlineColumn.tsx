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

    function removeDeadline(id: string) {
        setDeadlines(deadlines.filter((current) => current._id !== id))
    }

    function filterCompletedDeadlines(deadlines: ContentObject): boolean {
        return props.completed.find(current => current === deadlines._id) == null
    }

    return (
        <div className="deadline-column-item-wrapper">
            {deadlines.filter(filterCompletedDeadlines).map(current => 
                <DeadlineColumnItem key={current._id} completeDeadline={removeDeadline} id={current._id} deadlineObject={current.deadline!} />
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