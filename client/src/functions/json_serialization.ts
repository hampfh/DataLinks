// This code is copied from: https://stackoverflow.com/a/56150320

export function json_replacer<T, K>(key: string, value: Map<T, K>) {
    if (value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries()), // or with spread: value: [...value]
        }
    }

    return value
  }

export function json_reviver(key: string, value: {
    dataType: string
    value: any
}) {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value)
        }
    }
    return value
}