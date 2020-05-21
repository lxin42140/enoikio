export const updateObject = (prevObject, newValue) => {
    return {
        ...prevObject,
        ...newValue
    }
}