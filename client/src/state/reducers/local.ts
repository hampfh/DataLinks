import { ContentType } from '../../App';
import { IEditLocalObject } from '../actions/local';
import { ActionType } from './'

export interface AddedElement {
	parentId: string,
	id?: string,
	fieldOne: string,
	fieldTwo: string,
	fieldThree: string,
	type: ContentType
}

export interface ILocalState {
	added: AddedElement[],
	deleted: string[]
}

const defaultState = {
	added: [],
	deleted: []
}

/**
 * Returns index of local item or -1 if doesn't exist
 * @param localState 
 * @param id 
 */
export const indexOfLocal = (localState: ILocalState, id: string): number => {
	return localState.added.findIndex((current) => current.id?.toString() === id.toString())
}

const local = (state: ILocalState = defaultState, action: ActionType<any>) => {
	let newState = { ...state };
	switch (action.type) {
		case 'ADD_LOCAL':
			newState.added.push(action.payload)
			return newState
		case 'EDIT_LOCAL': 
		{
			let localElement = newState.added.find((current) => current.id?.toString() === action.payload.id.toString())
			// If element can't be found then return
			if (localElement == null)
				return newState

			const object = action.payload.object as IEditLocalObject
			localElement.fieldOne = object.title ?? object.displayText ?? localElement.fieldOne
			localElement.fieldTwo = object.text ?? object.link ?? object.deadline ?? localElement.fieldOne
			localElement.fieldThree = object.start ?? localElement.fieldThree
			return newState
		}
		case 'DELETE_LOCALLY':
			
			// Check if this is a local item
			const index = newState.added.findIndex((current) => current.id?.toString() === action.payload.id.toString())
			if (index >= 0) // Remove item locally
				newState.added.splice(index, 1)
			else 
				newState.deleted.push(action.payload.id)
			return newState
		default:
			return newState
	}
}

export default local;