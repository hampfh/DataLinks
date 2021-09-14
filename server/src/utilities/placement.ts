import mongoose from "mongoose"

/**
 * Overrides placements in array
 * and give placements as posititioned in array
 * @param array 
 */
export const indexify = <T extends { placement: number }>(array: T[]): T[] => {
	for (let i = 0 ; i < array.length; i++)
		array[i].placement = i
	return array
}

/**
 * Find an element in a (sorted) array and place it in another
 * position (assuming that that element exists). This method
 * DOES mutate the input reference
 * @param array 
 * @param target 
 * @param newPosition 
 */
export const rebaseInArray = <T extends { placement: number, _id: mongoose.Schema.Types.ObjectId | string }>(array: T[], target: mongoose.Schema.Types.ObjectId | string, newPosition: number): T[] => {
	const movableIndex = array.findIndex((current) => current._id.toString() === target.toString())
	if (movableIndex < 0)
		throw Error("There is no such element in the array")
	// Extract target from array
	const movable = array.splice(movableIndex, 1)[0]
	if (newPosition > array.length - 1) 
		// Append at end of array
		array.push(movable)
	else // Rebase target into new position
		array.splice(newPosition, 0, movable)
	return array
}