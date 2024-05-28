import React, {useContext, useState} from 'react'
import {Droppable} from 'react-beautiful-dnd'
import TaskMiniCard from './taskMiniCard'
import DropdownMenu from "./dropdownMenu"
import ConfirmModal from "../modals/confirmModal"
import TaskCreator from "./taskCreator"
import {deleteColumn, updateColumn} from "../../http/boardApi"
import {Context} from "../../index"
import EditableText from "../../utils/editableText"
import DotsButton from "./dotsButton"
import {Dropdown} from "react-bootstrap"
import {observer} from "mobx-react-lite"

const BoardColumn = observer(({column, tasks, showCreator, handleShowModule}) => {
    const {board, userStore} = useContext(Context)

    const [confirmModal, setConfirmModal] = useState(false)

    const handleDeleteColumn = () => {
        deleteColumn(column.id).then()
        board.deleteColumn(column.id)
        setConfirmModal(false)
    }

    const handleUpdateColumn = (column) => {
        updateColumn(column).then(() =>
            board.updateColumn(column)
        )
    }

    const handleMoveColumn = (direction) => {
        const delta = direction ? 1 : -1

        const findColumn = board.columns.find(c => c.position === column.position + delta)

        if (!findColumn) return

        const updatedColumns = [
            {...column, position: column.position + delta},
            {...findColumn, position: findColumn.position - delta}
        ]

        updateColumn(updatedColumns).then(() => {
            board.updateColumn(updatedColumns[0])
            board.updateColumn(updatedColumns[1])
        })
    }

    return (
        <>
            <ConfirmModal
                show={confirmModal}
                onHide={setConfirmModal}
                title={`Ви впевнені, що хочете видалити стовпець "${column.name}"?`}
                description="Всі задачи, що знаходяться в даному стовпці, будуть видалені"
                onConfirm={handleDeleteColumn}
                onCancel={() => setConfirmModal(false)}
            />
            <Droppable droppableId={String(column.id)}>
                {(provided) => (
                    <div
                        className="board_column"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        <div className="board_column_header">
                            <EditableText
                                className="board_column_title"
                                text={column.name}
                                onTextChange={(newName) => {
                                    handleUpdateColumn({...column, name: newName})
                                }}
                            />
                            <DropdownMenu
                                toggleComponent={<DotsButton/>}
                            >
                                {column.position !== Math.min(...board.columns.map(column => column.position)) &&
                                    <Dropdown.Item onClick={() => handleMoveColumn(false)} className="text-wrap">
                                        ← Пересунути вліво
                                    </Dropdown.Item>}
                                {column.position !== Math.max(...board.columns.map(column => column.position)) &&
                                    <Dropdown.Item onClick={() => handleMoveColumn(true)} className="text-wrap">
                                        Пересунути вправо →
                                    </Dropdown.Item>}
                                <Dropdown.Item onClick={() => setConfirmModal(true)}>
                                    Видалити
                                </Dropdown.Item>
                            </DropdownMenu>
                        </div>

                        <div className="board_column_content">
                            {tasks.map((task, index) => (
                                <TaskMiniCard
                                    key={task.id}
                                    task={task}
                                    index={index}
                                />
                            ))}
                            {provided.placeholder}
                        </div>

                        {showCreator
                            ?
                            <TaskCreator columnId={column.id} handleClose={() => handleShowModule(null)}/>
                            :
                            <div className="board_column_card_create" onClick={() => handleShowModule(column.id)}>
                                + Створити задачу
                            </div>
                        }
                    </div>
                )}
            </Droppable>
        </>
    )
})

export default BoardColumn
