export function appendsIfPlural(string: string, value: number) {
    return `${string}${value > 1 ? "s" : ""}`
}