import React, {useContext, useEffect, useState} from 'react'
import {Draggable} from "react-beautiful-dnd"
import DropdownMenu from "./dropdownMenu"
import {Context} from "../../index"
import {deleteTask} from "../../http/boardApi"
import ConfirmModal from "../modals/confirmModal"
import defaultUserImage from "../../assets/defaultUser.jpg"
import DotsButton from "./dotsButton"
import {Dropdown} from "react-bootstrap"
import {observer} from "mobx-react-lite"

const TaskMiniCard = observer(({task, index}) => {
    const {board} = useContext(Context)

    const [executor, setExecutor] = useState(null)

    const [confirmModal, setConfirmModal] = useState(false)

    useEffect(() => {
        setExecutor(board.getUserById(task.executorId))
        task.status = board.getColumnById(task.columnId).status
    }, [task.executorId, board.users])

    const handleDeleteTask = () => {
        board.deleteTask(task.id)
        deleteTask(task.id).then()
    }

    const getPriorityInfo = (priority) => {
        switch (priority) {
            case 1:
                return {label: 'Високий пріоритет', className: 'priority-high'}
            case 2:
                return {label: 'Середній пріоритет', className: 'priority-medium'}
            case 3:
                return {label: 'Низький пріоритет', className: 'priority-low'}
            case 0:
            default:
                return {label: 'Пріоритет відсутній'}
        }
    }

    return (
        <>
            <ConfirmModal
                show={confirmModal}
                onHide={setConfirmModal}
                title={`Видалити "${task.title}"?`}
                description="Ви збираєтеся назавжди видалити цю задачу, а також пов'язані з ним коментарі, дані та вкладення."
                onConfirm={handleDeleteTask}
            />
            <Draggable draggableId={String(task.id)} index={index}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`taskMiniCard no-select ${snapshot.isDragging ? 'dragging' : ''}`}
                        style={{...provided.draggableProps.style}}
                    >
                        <div className="taskMiniCard_content" onClick={() => {
                            board.setActiveTask(task)
                        }}>
                            <div className="taskMiniCard_title">{task.title}</div>
                            <div className="taskMiniCard_footer">
                                {task.priority ? <div
                                    className={`priority priority-card ${getPriorityInfo(task.priority).className}`}
                                >
                                    {getPriorityInfo(task.priority).label}
                                </div> : <div></div>}
                                <div className="taskMiniCard_user">
                                    <img src={executor?.avatar || defaultUserImage} alt="Author Name"
                                         className="taskMiniCard_avatar"/>
                                </div>
                            </div>
                        </div>
                        <div className="taskMiniCard_dropdown">
                            <DropdownMenu
                                toggleComponent={<DotsButton/>}
                            >
                                <Dropdown.Item onClick={() => setConfirmModal(true)}>
                                    Видалити
                                </Dropdown.Item>
                            </DropdownMenu>
                        </div>
                    </div>
                )}
            </Draggable>
        </>
    )
})

export default TaskMiniCard