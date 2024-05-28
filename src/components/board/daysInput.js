import React, {useState} from 'react'

const DaysInput = ({task, min = 0, setDuration, editable}) => {
    const [days, setDays] = useState(task.duration)
    const [editing, setEditing] = useState()

    const handleIncrement = (value) => {
        setDuration(days + value)
        setDays(prevDays => prevDays + value)
    }

    const handleDecrement = (value) => {
        if (days - value > 0) {
            setDuration(days - value)
            setDays(prevDays => prevDays - value)
        }
    }

    const convertDaysToReadable = (days) => {
        if (isNaN(parseInt(days))) return ''

        const years = Math.floor(days / 365)

        if (years > 0)
            days -= years * 365

        const months = Math.floor(days / 30)

        if (months > 0)
            days -= months * 30

        const weeks = Math.floor(days / 7)

        if (weeks > 0)
            days -= weeks * 7

        const pluralizeYear = (years) => {
            return years === 1 ? 'рік' : years >= 2 && years <= 4 ? 'роки' : 'років'
        }

        const pluralizeMonth = (months) => {
            return months === 1 ? 'місяць' : months >= 2 && months <= 4 ? 'місяці' : 'місяців'
        }

        const pluralizeWeek = (weeks) => {
            return weeks === 1 ? 'тиждень' : weeks >= 2 && weeks <= 4 ? 'тижні' : 'недель'
        }

        const pluralizeDay = (days) => {
            return days === 1 ? 'день' : days >= 2 && days <= 4 ? 'дні' : 'днів'
        }

        let text = ''
        if (years > 0) text += `${years} ${pluralizeYear(years)} `
        if (months > 0) text += `${months} ${pluralizeMonth(months)} `
        if (weeks > 0) text += `${weeks} ${pluralizeWeek(weeks)} `
        if (days > 0) text += `${days} ${pluralizeDay(days)} `

        return text
    }

    const handleInputChange = (event) => {
        let value = null
        if (event.target.value !== '')
            value = parseInt(event.target.value)
        else value = event.target.value
        setDays(isNaN(value) ? min : value)
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            const value = parseInt(event.target.value)
            setDays(isNaN(value) || value < min ? min : value)
            setDuration(days)
        }
    }

    const handleBlur = (event) => {
        const value = parseInt(event.target.value)
        setDays(isNaN(value) || value < min ? min : value)
        setDuration(days)
    }

    const handleChangeEditing = () => {
        if (editable) setEditing(prev => !prev)
    }

    return (
        <div className="days_input">
            <div className="days_input_title" onClick={handleChangeEditing}>
                {days ? convertDaysToReadable(days) : 'Не вказаний'}
            </div>
            {editing &&
                <div className="days_input_body">
                    <div className="days_input_button" onClick={() => handleIncrement(1)}>+1 д.</div>
                    <div className="days_input_button" onClick={() => handleIncrement(7)}>+1 т</div>
                    <div className="days_input_button" onClick={() => handleIncrement(30)}>+1 м.</div>
                    <div className="days_input_button" onClick={() => handleIncrement(365)}>+1 р.</div>
                    <input
                        type="text"
                        value={days}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        onBlur={handleBlur}
                    />
                    <div className="days_input_button" onClick={() => handleDecrement(1)}>-1 д.</div>
                    <div className="days_input_button" onClick={() => handleDecrement(7)}>-1 т.</div>
                    <div className="days_input_button" onClick={() => handleDecrement(30)}>-1 міс.</div>
                    <div className="days_input_button" onClick={() => handleDecrement(365)}>-1 р.</div>
                </div>
            }
        </div>
    )
}

export default DaysInput