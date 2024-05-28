import React, {useState, useRef, useEffect} from 'react'
import useOutsideClick from "../utils/useOutsideClick"

const EditableText = ({text, ignoreText= false,
                          outsideClick = true,
                          placeholder,
                          onTextChange,
                          className,
                          autoSelect = false,
                          autoSave = true}) => {
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState('')
    const inputRef = useRef(null)

    useEffect(() => {
        !ignoreText && setValue(text)
    }, [text])

    const handleOutsideClick = () => {
        if (isEditing) {
            if (outsideClick && value) {
                if (autoSave) onTextChange(value)
                else setValue(text)
            }

            ignoreText && setValue('')
            setIsEditing(false)
        }
    }

    useOutsideClick(inputRef, handleOutsideClick)

    useEffect(() => {
        if (isEditing && inputRef.current && autoSelect) {
            inputRef.current.select()
        }
    }, [isEditing, autoSelect])

    const handleInputChange = (e) => {
        setValue(e.target.value)
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onTextChange(e.target.value)
            setIsEditing(false)
            setValue('')
        }
    }

    return isEditing ? (
        <input
            ref={inputRef}
            autoFocus
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            className={`${className} editable-input`}
            placeholder={placeholder}
        />
    ) : (
        <div className={`${className} editable-div`} onClick={() => setIsEditing(true)}>{text || placeholder}</div>
    )
}

export default EditableText