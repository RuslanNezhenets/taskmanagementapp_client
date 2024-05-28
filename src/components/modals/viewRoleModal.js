import React, {useContext, useEffect, useRef, useState} from 'react'
import {Modal, Dropdown, DropdownButton, Button} from "react-bootstrap"
import {deleteRole, fetchUserByProject, updateRole, updateUserProject} from "../../http/boardApi"
import useOutsideClick from "../../utils/useOutsideClick"
import {Context} from "../../index"
import TaskDescription from "../../utils/descriptionRedactor"
import {observer} from "mobx-react-lite"
import DropdownMenu from "../board/dropdownMenu"
import DotsButton from "../board/dotsButton"
import DependenciesList from "../board/dependenciesList"
import defaultUserImage from "../../assets/defaultUser.jpg"

const ViewRoleModal = observer(({show, onHide, role, setRole}) => {
    const {board} = useContext(Context)
    const [isActiveTitleRedactor, setIsActiveTitleRedactor] = useState(false)
    const [tasks, setTasks] = useState([])

    const [userProject, setUserProject] = useState([])

    useEffect(() => {
        if (board.activeProject.id) {
            fetchUserByProject(board.activeProject.id)
                .then(data => setUserProject(data))
                .catch(error => console.error('Error fetching users by project:', error))
        }
    }, [board.activeProject.id, board.userProjects])

    const titleInputRef = useRef(null)
    useOutsideClick(titleInputRef, () => {
        if (isActiveTitleRedactor) {
            board.updateRole(role)
            updateRole(role).then(() => setIsActiveTitleRedactor(false))
        }
    })

    useEffect(() => {
        setTasks(board.tasks.filter(task => task.roleId === role.id).sort((a, b) => a.title.localeCompare(b.title)))
    }, [board.tasks])

    useEffect(() => {
        if (isActiveTitleRedactor)
            titleInputRef.current.focus()
    }, [isActiveTitleRedactor])

    const handleTitleChange = event => {
        const newValue = event.target.value
        setRole(prevDetails => ({...prevDetails, name: newValue}))
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            updateRole(role).then(() => {
                board.updateRole(role)
                setIsActiveTitleRedactor(false)
            })
        }
    }

    const handleSetDescription = (newValue) => {
        setRole(prevDetails => ({...prevDetails, description: newValue}))
        updateRole({...role, description: newValue})
        board.updateRole({...role, description: newValue})
    }

    const handleRoleChange = (user) => {
        const updatedUserProject = {
            ...userProject.find(uP => uP.userId === user.id),
            roleId: role.id
        }
        updateUserProject(updatedUserProject)
            .then(() => {
                board.updateUser({...user, roleId: role.id})
                setUserProject(prev => prev.map(uP => uP.userId === user.id ? updatedUserProject : uP))
            })
            .catch(error => console.error('Error updating user project:', error))
    }

    const handleDeleteRole = () => {
        deleteRole(role.id).then(() => {
        })
        onHide(false)
        board.deleteRole(role.id)
    }

    const handleDeleteUserRole = (user) => {
        const up = userProject.find(uP => uP.userId === user.id)
        up.roleId = null
        setUserProject(prev => [...prev, up])
        updateUserProject(up)
    }

    if (!role) return

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
            centered
        >
            <Modal.Body className="viewModal">
                <div className="viewModal_body">
                    <div className="taskMiniCard_dropdown w-50 m-2">
                        <DropdownMenu
                            toggleComponent={<DotsButton isMenuVisible={true}/>}
                        >
                            <Dropdown.Item onClick={handleDeleteRole}>
                                Видалити
                            </Dropdown.Item>
                        </DropdownMenu>
                    </div>
                    {isActiveTitleRedactor ?
                        <input
                            className="viewTask_title viewTask_title-input w-75"
                            value={role.name}
                            ref={titleInputRef}
                            onChange={handleTitleChange}
                            onKeyDown={handleKeyPress}
                        />
                        :
                        <div className="viewTask_title viewTask_title-display w-75"
                             onClick={() => setIsActiveTitleRedactor(true)}>
                            {role.name}
                        </div>
                    }
                    <div className="viewTask_description">
                        <div className="viewTask_description_text">Опис</div>
                        <TaskDescription
                            description={role.description}
                            setDescription={handleSetDescription}
                        />
                    </div>
                    {tasks.length > 0 && <DependenciesList title="Батьківські задачи" tasks={tasks}/>}
                    {board.userProjects.find(up => up.projectId === board.activeProject?.id).access?.key === 'admin' &&
                        <>
                            <div className="executor mt-3 w-50">
                                <DropdownMenu
                                    toggleComponent={
                                        <Button>
                                            Додати роль користувачеві
                                        </Button>
                                    }>
                                    {board.users.filter(user => {
                                        if (userProject.find(up => up.userId === user.id)?.roleId === null) return true
                                    }).map((user, index) => (
                                        <Dropdown.Item
                                            key={index}
                                            className="selectUser-button "
                                            onClick={() => {
                                                handleRoleChange(user)
                                            }}>
                                            <img src={user.avatar || defaultUserImage} alt="Executor Name"
                                                 className="user_avatar"/>
                                            <div className="user_name">{user.username}</div>
                                        </Dropdown.Item>
                                    ))}
                                </DropdownMenu>
                            </div>
                            <div className="admin_users">
                                {board.users.filter(user => {
                                    if (userProject.filter(up => up.roleId === role.id)
                                        .map(up => up.userId)
                                        .includes(user.id))
                                        return user
                                }).map((user, index) => (
                                    <div className="admin_user_card d-flex justify-content-between" key={index}>
                                        <div className="admin_user_card_body">
                                        <img src={user.avatar || defaultUserImage} alt="Executor Name"
                                             className="user_avatar"/>
                                        <div className="user_name">{user.username}</div>
                                        </div>
                                        <Button variant="danger" onClick={() => handleDeleteUserRole(user)}>Видалити роль</Button>
                                    </div>
                                ))}
                            </div>
                        </>}
                </div>
            </Modal.Body>
        </Modal>
    )
})

export default ViewRoleModal