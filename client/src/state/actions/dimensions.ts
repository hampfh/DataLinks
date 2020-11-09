import { IDimension, IDimensionState, DimensionTarget } from "state/reducers/dimensions";

export interface ISetTransform { (target: DimensionTarget, transform: IDimension): void }
export const setTransform = (target: DimensionTarget, transform: IDimension) => {
	return {
		type: 'SET_TRANSFORM',
		payload: {
			target,
			transform
		}
	}
}

export interface ISetTransforms { (transforms: Partial<IDimensionState>): void }
export const setTransforms = (transforms: Partial<IDimensionState>) => {
	return {
		type: 'SET_TRANSFORMS',
		payload: {
			transforms
		}
	}
}