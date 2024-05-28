import React, {useContext, useEffect, useState} from 'react'
import {createColumn} from "../http/boardApi"
import BoardColumn from "../components/board/boardColumn"
import {DragDropContext} from 'react-beautiful-dnd'
import ColumnCreator from "../components/board/columnCreator"
import {Context} from "../index"
import {observer} from "mobx-react-lite"
import ViewTaskModal from "../components/modals/viewTaskModal"
import {DropdownButton, Dropdown, Form} from "react-bootstrap"

const Board = observer(() => {
    const {board, userStore} = useContext(Context)

    const [activeModal, setActiveModal] = useState(null)
    const [viewTaskModal, setViewTaskModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeRole, setActiveRole] = useState('')

    useEffect(() => {
        if (board.activeTask) setViewTaskModal(true)
        else setViewTaskModal(false)
    }, [board.activeTask])


    const handleCreateColumn = (name) => {
        if (name) {
            const newColumn = {
                projectId: board.activeProject.id,
                name: name
            }
            createColumn(newColumn).then(column => {
                board.addColumn(column)
            })
        }

        setActiveModal(null)
    }

    const transition = (result) => {
        const {destination, source, draggableId} = result

        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index))
            return

        const draggableIdInt = parseInt(draggableId)
        const newColumnId = parseInt(destination.droppableId)
        const newPosition = destination.index + 1

        board.moveTask(draggableIdInt, newColumnId, newPosition)
    }

    if (!board.activeProject) return ''

    const filteredTasks = (tasks) => {
        let parsedActiveRole
        if (activeRole === '') parsedActiveRole = ''
        else if (activeRole === null) parsedActiveRole = null
        else parsedActiveRole = parseInt(activeRole)

        return tasks.filter(task =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (
                parsedActiveRole === '' ||
                (parsedActiveRole === null && task.roleId === null) ||
                task.roleId === parsedActiveRole
            )
        )
    }

    return (
        <div className="board_page">
            {board.activeTask &&
                <ViewTaskModal
                    show={viewTaskModal}
                    onHide={() => {
                        setViewTaskModal(false)
                        const delay = async (ms) => await new Promise(resolve => setTimeout(resolve, ms))
                        delay(250).then(() => board.setActiveTask(null))
                    }}
                    taskDetail={board.activeTask}
                />
            }
            <h1>Дошка "{board.activeProject.name}"</h1>
            <div className="board_control d-flex mb-3">
                <Form.Control
                    type="text"
                    placeholder="Пошук задач..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-25 me-3"
                />
                <DropdownButton
                    id="dropdown-basic-button"
                    title={board.roles.find(role => role.id === parseInt(activeRole))?.name || "Виберіть роль"}
                    onSelect={(eventKey) => setActiveRole(eventKey)}
                >
                    <div className="scrollable-dropdown">
                        {activeRole && <Dropdown.Item eventKey="">Усі ролі</Dropdown.Item>}
                        {Array.from(new Set(board.tasks.map(task => task.roleId)))
                            .map(roleId => {
                                const role = board.roles.find(role => role.id === roleId)
                                const roleName = role ? role.name : "Роль не знайдена"
                                return {
                                    id: roleId,
                                    name: roleId === null ? "Відсутня" : roleName
                                }
                            })
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map(role => (
                                <Dropdown.Item eventKey={role.id} key={role.id === null ? 'null' : role.id}>
                                    {role.name}
                                </Dropdown.Item>
                            ))}
                    </div>
                </DropdownButton>
            </div>
            <DragDropContext onDragEnd={transition}>
                <div>
                    <div className="board">
                        {board.columns.sort((a, b) => a.position - b.position).map((column) => (
                            <BoardColumn
                                key={column.id}
                                column={column}
                                tasks={filteredTasks(board.tasksByColumnId[column.id])}
                                showCreator={activeModal === column.id}
                                handleShowModule={setActiveModal}
                            />
                        ))}
                        {userStore.isAdmin && <div className="board_add_column">
                            {activeModal === -1 ?
                                <ColumnCreator
                                    handleConfirm={handleCreateColumn}
                                    handleCancel={() => setActiveModal(null)}
                                />
                                :
                                <div className="board_add_column_block" onClick={() => setActiveModal(-1)}>
                                    <div className="board_add_column_img"></div>
                                </div>
                            }
                        </div>}
                    </div>
                </div>
            </DragDropContext>
        </div>
    )
})

export default Board
