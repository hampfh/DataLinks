export function incomingVersionIsNewer(currentVersion: string, incomingVersion: string) {
    let incomingSplit: number[]
    let currentSplit: number[]

    // Convert version string into int array
    try {
        incomingSplit = incomingVersion.split(".").reduce<number[]>((prev, current) => {
            prev.push(parseInt(current))
            return prev
        }, [])
        currentSplit = currentVersion.split(".").reduce<number[]>((prev, current) => {
            prev.push(parseInt(current))
            return prev
        }, [])
    } catch (_) {
        return true
    }

    // Major is newer ? 
    if (incomingSplit[0] > currentSplit[0])
        return true
    else if (incomingSplit[0] < currentSplit[0])
        return false
    
    // Minor is older ?
    if (incomingSplit[1] > currentSplit[1])
        return true
    // Minor is newer
    else if (incomingSplit[1] < currentSplit[1])
        return false

    // Patch is older ?
    if (incomingSplit[2] > currentSplit[2])
        return true
    else if (incomingSplit[2] < currentSplit[2])
        return false
    return false
}