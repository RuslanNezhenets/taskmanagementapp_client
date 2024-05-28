function formatDate(isoString, withTime = true) {
    const date = new Date(isoString)
    const options = withTime ? {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // Используйте 24-часовой формат времени
    } : {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }

    return date.toLocaleDateString('uk-UA', options)
}

function timeSince(dateString) {
    function russianPlural(number, one, two, five) {
        let n = Math.abs(number)
        n %= 100
        if (n >= 5 && n <= 20) {
            return five
        }
        n %= 10
        if (n === 1) {
            return one
        }
        if (n >= 2 && n <= 4) {
            return two
        }
        return five
    }

    const date = new Date(dateString)
    const seconds = Math.floor((new Date() - date) / 1000)

    const intervals = [
        {seconds: 31536000, one: 'рік', two: 'роки', five: 'років'},
        {seconds: 2592000, one: 'місяць', two: 'місяці', five: 'місяців'},
        {seconds: 86400, one: 'день', two: 'дні', five: 'днів'},
        {seconds: 3600, one: 'година', two: 'години', five: 'годин'},
        {seconds: 60, one: 'хвилина', two: 'хвилини', five: 'хвилин'},
        {seconds: 1, one: 'секунда', two: 'секунди', five: 'секунд'},
    ]

    for (let i = 0; i < intervals.length; i++) {
        const interval = intervals[i]
        const count = Math.floor(seconds / interval.seconds)
        if (count >= 1) {
            const label = russianPlural(count, interval.one, interval.two, interval.five)
            return `${count} ${label} тому`
        }
    }
}

export {formatDate, timeSince}