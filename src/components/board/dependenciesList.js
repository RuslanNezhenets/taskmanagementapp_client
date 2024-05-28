import React, {useContext} from 'react'
import {Button, Dropdown, DropdownButton} from "react-bootstrap"
import {Context} from "../../index"

const DependenciesList = ({title, tasks, onRemoveDependency, editable}) => {
    const {board} = useContext(Context)

    tasks = tasks.map(task => {
        return {...task, column: board.columns.find(column => column.id === task.columnId)}
    })

    const handleRemoveDependency = (taskId) => {
        onRemoveDependency(taskId)
    }

    return (
        <div className="viewTask_role_tasks">
            {title}
            <div className="tasks_done">
                <div className="tasks_done_line">
                    <div
                        className={`tasks_done_block${tasks.filter(task => task.column.done).length / tasks.length === 1 ? ' complete' : ''}`}
                        style={{width: `${tasks.filter(task => task.column.done).length / tasks.length * 100}%`}}
                    ></div>
                </div>
                <div
                    className="tasks_done_line_status">Готово {Math.round(tasks.filter(task => task.column.done).length / tasks.length * 100)}%
                </div>
            </div>
            <div className="tasksList">
                {tasks.map(task => (
                    <div className="tasksList_task" key={task.id}>
                        <div className="tasksList_task_title">{task.title}</div>
                        {editable && <Button variant="danger" onClick={() => handleRemoveDependency(task.id)} className="remove-dependency-btn">
                            Видалити
                        </Button>}
                        {editable && <div className="tasksList_task_status">
                            <DropdownButton id="dropdown-basic-button" title={task.column.name}>
                                {board.columns.filter(column => column.id !== task.columnId).map(column => (
                                    <Dropdown.Item
                                        key={column.id}
                                        onClick={() => {
                                            board.moveTask(task.id, column.id, null)
                                        }}
                                    >
                                        {column.name}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </div>}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DependenciesList;