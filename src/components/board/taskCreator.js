import React, {useContext, useRef} from 'react'
import useOutsideClick from "../../utils/useOutsideClick"
import {createTask} from "../../http/boardApi"
import {Context} from "../../index"

const TaskCreator = ({columnId, handleClose}) => {
    const {board, userStore} = useContext(Context)

    const textareaRef = useRef(null)
    const cardCreatorRef = useRef(null)

    useOutsideClick(cardCreatorRef, () => {
        handleClose()
    })

    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'inherit'
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && textareaRef.current) {
            e.preventDefault()
            const taskTitle = textareaRef.current.value.trim()
            if (taskTitle) {
                handleCreatCard(taskTitle, columnId)
                handleClose()
                textareaRef.current.value = ''
            }
        }
    }

    const handleCreatCard = (title, columnId) => {
        const newCard = {
            columnId: columnId,
            title: title,
            authorId: userStore.user.id
        }
        createTask(newCard).then(task => {
            board.addTask(task)
        })

        localStorage.removeItem('solutions')
    }

    return (
        <div className="board_column_card_creator" ref={cardCreatorRef}>
            <textarea
                ref={textareaRef}
                onChange={adjustHeight}
                onInput={adjustHeight}
                onKeyDown={handleKeyPress}
                placeholder="Что нужно сделать?"
            />
        </div>
    )
}

export default TaskCreator