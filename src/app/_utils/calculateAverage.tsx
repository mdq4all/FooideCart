type star = {
    star: number
}

export const calculateRating = (array: star[]) => {
    let total = 0
    let count = 0
    array.forEach(item => {
        total += item.star
        count++
    })
    return (total / count).toFixed(1)
}