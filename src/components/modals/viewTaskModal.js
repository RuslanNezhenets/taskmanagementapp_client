import React, {useContext, useEffect, useRef, useState} from 'react'
import useOutsideClick from "../../utils/useOutsideClick"
import {createDependency, deleteDependency, updateTask} from "../../http/boardApi"
import {Context} from "../../index"

import defaultUserImage from '../../assets/defaultUser.jpg'

import 'react-quill/dist/quill.snow.css'
import EditableText from "../../utils/editableText"

import {Dropdown, DropdownButton, Modal} from "react-bootstrap"
import DescriptionRedactor from "../../utils/descriptionRedactor"
import DropdownMenu from "../board/dropdownMenu"
import DaysInput from "../board/daysInput"
import DateInfo from "../board/dateInfo"
import {observer} from "mobx-react-lite"
import DependenciesList from "../board/dependenciesList"

const ViewTaskModal = observer(({show, onHide}) => {
    const {board, userStore} = useContext(Context)

    const [task, setTask] = useState({...board.activeTask})

    const [executor, setExecutor] = useState(null)
    const [role, setRole] = useState(null)
    const [author, setAuthor] = useState(null)
    const [parents, setParents] = useState([])

    const [users, setUsers] = useState([])

    const [isActiveTitleRedactor, setIsActiveTitleRedactor] = useState(false)
    const [isExecutorMenuVisible, setIsExecutorMenuVisible] = useState(false)

    const titleInputRef = useRef(null)
    useOutsideClick(titleInputRef, () => {
        if (isActiveTitleRedactor) {
            board.updateTask(task)
            updateTask(task).then(() => setIsActiveTitleRedactor(false))
        }
    })

    useEffect(() => {
        setExecutor(board.getUserById(task.executorId))
        setAuthor(board.getUserById(task.authorId))

        task.status = board.getColumnById(task.columnId).status

        async function loadData() {
            board.setRoles(board.roles)

            setRole(board.roles.find(role => role.id === task.roleId))
        }

        setParents(
            board.dependencies
                .filter(dep => dep.dependentTaskId === task.id)
                .map(dep => dep.taskId)
                .map(taskId => board.tasks.find(task => task.id === taskId))
        )

        loadData()
    }, [board.dependencies])

    const setNewExecutor = (newExecutorId) => {
        const updatedTask = {...task, executorId: newExecutorId}
        board.updateTask(updatedTask)
        updateTask(updatedTask).then(() => {
            setExecutor(board.getUserById(newExecutorId))
            setTask(updatedTask)
        })
    }

    const setNewRole = (newRoleId) => {
        const updatedTask = {...task, roleId: newRoleId}
        board.updateTask(updatedTask)
        updateTask(updatedTask).then(() => {
            setRole(board.roles.find(role => role.id === newRoleId))
            setTask(updatedTask)
        })
    }

    const setDuration = (newDuration) => {
        const updatedTask = {...task, duration: newDuration}
        board.updateTask(updatedTask)
        updateTask(updatedTask).then(() => {
            setTask(updatedTask)
        })
    }

    const setEndDate = (newEndDate) => {
        const updatedTask = {...task, endDate: newEndDate}
        board.updateTask(updatedTask)
        updateTask(updatedTask).then(() =>
            setTask(updatedTask)
        )
    }

    useEffect(() => {
        let usersList = board.users.map(user => ({...user}))

        usersList = usersList.filter(user => user.roleId !== null && user.roleId === task.roleId)
        if (executor) usersList.unshift({id: null, avatar: defaultUserImage, username: 'Без призначення'})

        if (executor) usersList = usersList.filter(user => user.id !== executor.id)

        setUsers(usersList)
    }, [board.users, executor, task.roleId])

    useEffect(() => {
        if (isActiveTitleRedactor) {
            titleInputRef.current.focus()
        }
    }, [isActiveTitleRedactor])

    const handleTitleChange = event => {
        const newValue = event.target.value
        setTask(prevDetails => ({...prevDetails, title: newValue}))
    }


    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            board.updateTask(task)
            updateTask(task).then(() => setIsActiveTitleRedactor(false))
        }
    }
    const toggleMenuVisibility = () => {
        setIsExecutorMenuVisible(prev => !prev)
    }

    const handleAddDependency = (avTask) => {
        setParents(prev => ([...prev, avTask]))
        const newDependency = {taskId: avTask.id, dependentTaskId: task.id}
        createDependency(newDependency).then(data => board.setDependencies([...board.dependencies, data]))
    }

    const handleRemoveDependency = (taskId) => {
        const dependency = board.dependencies.find(dep => dep.taskId === taskId && dep.dependentTaskId === task.id)
        deleteDependency(dependency.id).then(() => {
            board.setDependencies([...board.dependencies.filter(dep => dep.id !== dependency.id)])
        })
    }

    function is_array_cyclic(arr) {
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i]
            let seen = [item.dependentTaskId]

            while (true) {
                let parent = arr.find(i => i.dependentTaskId === item.taskId)
                if (parent === undefined)
                    break
                if (seen.indexOf(parent.dependentTaskId) > -1)
                    return true
                seen.push(parent.dependentTaskId)
                item = parent
            }
        }
        return false
    }

    const tasksWithoutCycle = board.tasks.filter(t => {
        if (t.id === task.id) return false

        const newDependencies = [
            ...board.dependencies,
            {taskId: t.id, dependentTaskId: task.id}
        ]

        return !is_array_cyclic(newDependencies)
    })

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

    const handlePriorityChange = (newPriority) => {
        setTask(prev => ({...prev, priority: newPriority}))
        board.updateTask({...task, priority: newPriority})
        updateTask({...task, priority: newPriority})
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="xl"
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
            centered
        >
            <Modal.Body className="viewModal">
                <div className="viewTask_left">
                    {isActiveTitleRedactor ?
                        <input
                            className="viewTask_title viewTask_title-input"
                            value={task.title}
                            ref={titleInputRef}
                            onChange={handleTitleChange}
                            onKeyDown={handleKeyPress}
                        />
                        :
                        <div className="viewTask_title viewTask_title-display"
                             onClick={() => setIsActiveTitleRedactor(true)}>
                            {task.title}
                        </div>
                    }
                    <div className="viewTask_metadata d-flex">
                        <Dropdown className="priority-dropdown">
                            <Dropdown.Toggle
                                as="span"
                                className={`priority ${getPriorityInfo(task.priority).className}`}
                            >
                                {getPriorityInfo(task.priority).label}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handlePriorityChange(0)}>
                                    Пріоритет відсутній
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handlePriorityChange(1)}>
                                    Високий пріоритет
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handlePriorityChange(2)}>
                                    Середній пріоритет
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handlePriorityChange(3)}>
                                    Низький пріоритет
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <span className="status">{task.status}</span>
                    </div>
                    <div className="viewTask_description">
                        <div className="viewTask_description_text">Опис</div>
                        <DescriptionRedactor
                            description={task.description}
                            setDescription={(newValue) => {
                                setTask(prevDetails => ({...prevDetails, description: newValue}))
                                updateTask({...task, description: newValue})
                                board.updateTask({...task, description: newValue})
                            }}
                        />
                    </div>
                    {parents.length ?
                        <DependenciesList
                            title="Батьківські задачи"
                            tasks={parents}
                            onRemoveDependency={handleRemoveDependency}
                            editable = {userStore.isAdmin}
                        /> : ''}
                    {userStore.isAdmin && <DropdownButton title="Додати залежність від задачи" className="mt-2">
                        <div className="scrollable-dropdown">
                            {tasksWithoutCycle.map(avTask => (
                                <Dropdown.Item
                                    key={avTask.id}
                                    onClick={() => handleAddDependency(avTask)}
                                >
                                    {avTask.title}
                                </Dropdown.Item>
                            ))}
                        </div>
                    </DropdownButton>}
                </div>
                <div className="viewTask_right">
                    <div className="info_card">
                        <div className="role">
                            <div className="viewTask_right_title">Роль для виконання</div>
                            {!userStore.isAdmin ?
                                <div className="viewTask_role cursor-pointer non-clickable">
                                    <EditableText
                                        className="viewTask_role_text"
                                        text={role ? role.name : 'Без призначення'}
                                        autoSelect={true}
                                        autoSave={false}
                                        onTextChange={() => {
                                        }}
                                    />
                                </div> :
                                <DropdownMenu
                                    toggleComponent={
                                        <div className="viewTask_role cursor-pointer non-clickable">
                                            <EditableText
                                                className="viewTask_role_text"
                                                text={role ? role.name : 'Без призначення'}
                                                autoSelect={true}
                                                autoSave={false}
                                                onTextChange={() => {
                                                }}
                                            />
                                        </div>
                                    }>
                                    {board.roles.filter(role => role.id !== task.roleId).map((role, index) => (
                                        <Dropdown.Item
                                            key={index}
                                            onClick={() => {
                                                if (isExecutorMenuVisible) toggleMenuVisibility()
                                                setNewRole(role.id)
                                            }}>
                                            <div className="user_name">{role.name}</div>
                                        </Dropdown.Item>
                                    ))}
                                    {task.roleId && <Dropdown.Item
                                        onClick={() => {
                                            if (isExecutorMenuVisible) toggleMenuVisibility()
                                            setNewRole(null)
                                        }}
                                    >
                                        <div className="user_name"><b>Без призначення</b></div>
                                    </Dropdown.Item>}
                                </DropdownMenu>}
                        </div>
                        <div className="executor">
                            <div className="viewTask_right_title">Виконавець</div>
                            {!userStore.isAdmin ?
                                <div className="user non-clickable">
                                    <img src={executor?.avatar || defaultUserImage} alt="Executor Name"
                                         className="user_avatar"/>
                                    <EditableText
                                        className="user_name"
                                        text={users.length ? (executor ? executor.username : 'Без призначення') : 'Немає варіантів'}
                                        autoSelect={true}
                                        autoSave={false}
                                        onTextChange={(newTitle) => {

                                        }}
                                    />
                                </div> :
                                <DropdownMenu
                                    toggleComponent={
                                        <div className="user non-clickable">
                                            <img src={executor?.avatar || defaultUserImage} alt="Executor Name"
                                                 className="user_avatar"/>
                                            <EditableText
                                                className="user_name"
                                                text={users.length ? (executor ? executor.username : 'Без призначення') : 'Немає варіантів'}
                                                autoSelect={true}
                                                autoSave={false}
                                                onTextChange={(newTitle) => {

                                                }}
                                            />
                                        </div>
                                    }>
                                    {users.map((user, index) => (
                                        <Dropdown.Item
                                            key={index}
                                            className="selectUser-button"
                                            onClick={() => {
                                                if (isExecutorMenuVisible) toggleMenuVisibility()
                                                setNewExecutor(user.id)
                                            }}>
                                            <img src={user.avatar || defaultUserImage} alt="Executor Name"
                                                 className="user_avatar"/>
                                            <div className="user_name">{user.username}</div>
                                        </Dropdown.Item>
                                    ))}
                                </DropdownMenu>}
                        </div>
                        <div className="task_duration">
                            <div className="viewTask_right_title">Час виконання задачи</div>
                            <DaysInput task={task} min={1} setDuration={setDuration} editable={userStore.isAdmin}/>
                        </div>
                        <div className="author">
                            <div className="viewTask_right_title">Автор</div>
                            <div className="user">
                                <img src={author?.avatar || defaultUserImage} alt="Author Name"
                                     className="user_avatar"/>
                                <span className="user_name">{author?.username}</span>
                            </div>
                        </div>
                    </div>
                    <div className="viewTask_dates">
                        <DateInfo task={task} setEndDate={setEndDate} editable={userStore.isAdmin}/>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
})

export default ViewTaskModal