  export function asyncFunction (k) {
    return Object.getPrototypeOf(k) === Object.getPrototypeOf(async () => {})
}
