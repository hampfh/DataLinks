import { ActionType } from "./"

export enum HomeAnimationId {
    GIVE_FEEDBACK_DROP_DOWN = 0
}

export enum AnimationCategory {
    HOME = "home"
}

export interface IAnimationCategory {
    category: AnimationCategory,
    animations: number
}

export interface IAnimationState {
	categories: Array<IAnimationCategory>
}

const defaultState = {
	categories: [
        {
            category: AnimationCategory.HOME,
            animations: 0
        }
    ]
}

export const animationActive = (animationState: IAnimationState, category: AnimationCategory, animation: number) => {
    const target = animationState.categories.find((current) => current.category === category)
    if (target == null)
        return null

    return (target.animations & (1 << animation)) > 0
}

const animations = (state: IAnimationState = defaultState, action: ActionType<any>) => {
	let newState = { ...state };
	switch (action.type) {
		
        case "SET_ANIMATION_STATUS":
            if (action.payload.category === undefined || action.payload.animation === undefined || action.payload.status === undefined)
                throw new Error("No category was provided")

            const index = newState.categories.findIndex((current) => current.category === action.payload.category)
            if (index < 0)
                throw new Error("That category doesn't exist")

            // Add
            if (action.payload.status)
                newState.categories[index].animations |= 1 << action.payload.animation
            else
                newState.categories[index].animations = newState.categories[index].animations & ~(1 << action.payload.animation)
            return newState;

		default:
			return newState
	}
}

export default animations;