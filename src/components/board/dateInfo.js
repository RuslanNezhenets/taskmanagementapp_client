import React, {useState} from 'react'
import {formatDate, timeSince} from "../../utils/timeOperations"
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css'

const DateInfo = ({task, setEndDate, editable}) => {
    const [dueDate, setDueDate] = useState(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false)

    const handleDateChange = date => {
        const roundedDate = new Date(date)
        roundedDate.setHours(0, 0, 0, 0)

        setDueDate(roundedDate)
        setEndDate(roundedDate)
        setShowDatePicker(false)
    }

    const getTomorrow = () => {
        const today = new Date()
        today.setDate(today.getDate() + 1)
        return today
    }

    const handleShowDatePicker = () => {
        if (editable) setShowDatePicker(true)
    }

    return (
        <>
            <div>Створено <span className="created_date">{formatDate(task.createdAt)}</span></div>
            <div>Дата оновлення <span className="created_date">{timeSince(task.updatedAt)}</span></div>
            <div onClick={handleShowDatePicker} className="cursor-pointer">
                {task.endDate
                    ? <div>Зробити до <DatePicker
                        selected={dueDate}
                        onChange={handleDateChange}
                        minDate={getTomorrow()}
                        open={showDatePicker}
                        onClickOutside={() => setShowDatePicker(false)}
                        customInput={<b>{formatDate(task.endDate)}</b>}
                        showPopperArrow={false}
                    /></div>
                    : <div>Термін виконання <DatePicker
                        selected={dueDate}
                        onChange={handleDateChange}
                        minDate={getTomorrow()}
                        open={showDatePicker}
                        onClickOutside={() => setShowDatePicker(false)}
                        customInput={<b>не встановлений</b>}
                        showPopperArrow={false}
                    /></div>
                }
            </div>
        </>
    )
}

export default DateInfo