import React, {useEffect, useRef, useState} from 'react'
import useOutsideClick from "../../utils/useOutsideClick"

const ColumnCreator = ({handleConfirm, handleCancel}) => {
    const [columnName, setColumnName] = useState('')
    const textareaRef = useRef(null)

    const columnCreatorRef = useRef(null)
    useOutsideClick(columnCreatorRef, () => {
        handleCancel()
    })

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus()
        }
    }, [])

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleConfirm(columnName)
        }
    }

    return (
        <div className="board_column_card_creator column_creator" ref={columnCreatorRef}>
            <textarea
                ref={textareaRef}
                onChange={e => setColumnName(e.target.value)}
                maxLength="28"
                onKeyDown={handleKeyPress}
            />
            <div className="form_control">
                <button className="confirm_button" onClick={() => handleConfirm(columnName)}>✓</button>
                <button className="cancel_button" onClick={handleCancel}>✕</button>
            </div>
        </div>
    )
}

export default ColumnCreator