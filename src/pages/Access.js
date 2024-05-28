import React, {useContext, useEffect, useState} from 'react'
import {Context} from "../index"
import {
    createUserProject,
    deleteUserProject,
    fetchAccesses,
    fetchUserByProject,
    updateUserProject
} from "../http/boardApi"
import {observer} from "mobx-react-lite"
import defaultUserImage from "../assets/defaultUser.jpg"
import DropdownMenu from "../components/board/dropdownMenu"
import DotsButton from "../components/board/dotsButton"
import {Button, Dropdown} from "react-bootstrap"
import AddUserModal from "../components/modals/addUserModal"
import {fetchUsersByEmail, fetchUsersByProject} from "../http/userApi"
import {useParams} from "react-router-dom"

const Access = observer(() => {
    const {userStore, board} = useContext(Context)
    const [userProjects, setUserProjects] = useState([])
    const [accesses, setAccesses] = useState([])
    const [showAddUserModal, setShowAddUserModal] = useState(false)
    const [users, setUsers] = useState([])
    const {projectId} = useParams()

    useEffect(() => {
        fetchUserByProject(projectId).then(data => setUserProjects(data))
        fetchAccesses().then(data => setAccesses(data))
        fetchUsersByProject(projectId).then(data => {
            setUsers(data)
        })
    }, [projectId])

    const addUser = (email, accessId) => {
        fetchUsersByEmail(email).then(user => {
            createUserProject({
                projectId: projectId,
                userId: user[0].id,
                accessId: accessId
            }).then(data => {
                setUserProjects(prev => [...prev, data])
                setUsers(prev => [...prev, user[0]])
                board.addUserProjects(data)
            }).catch(error => {
                alert(error.response.data.message)
            })
        }).catch(error => {
            alert(error.response.data.message)
        })
    }

    const changeAccess = (userProject, newAccessId) => {
        const newAccesses = accesses.find(access => access.id === newAccessId)
        const newUserProject = {
            ...userProject,
            accessId: newAccessId,
            access: {key: newAccesses.key, description: newAccesses.description}
        }
        updateUserProject(newUserProject).then(() => {
            setUserProjects(prev => [...prev.filter(up => up.userId !== newUserProject.userId), newUserProject])
        })
    }

    const deleteAccess = (userId) => {
        const userProject = userProjects.find(up => up.userId === userId)

        if (!userProject) {
            console.log("UserProject not found for user:", userId)
            return
        }

        const userProjectId = userProject.id

        deleteUserProject(userProjectId).then(() => {
            setUserProjects(prev => prev.filter(up => up.id !== userProjectId))
            setUsers(prev => [...prev.filter(user => user.id !== userId)])
        }).catch(error => {
            console.error("Failed to delete UserProject:", error)
        })
    }

    return (
        <div className="m-5">
            <div className="admin_header d-flex justify-content-between mb-5">
                <h3>Доступ до проєкту "{board.projects.find(project => project.id === parseInt(projectId)).name}"</h3>
                <Button onClick={() => setShowAddUserModal(true)}>Дадати користувача</Button>
                <AddUserModal
                    show={showAddUserModal}
                    onHide={() => setShowAddUserModal(false)}
                    accesses={accesses}
                    addUser={addUser}
                />
            </div>
            <div className="admin_body">
                <table className="custom-table w-50 m-auto">
                    <thead>
                    <tr>
                        <th style={{width: "30%"}}>Ім'я</th>
                        <th style={{width: "35%"}}>Електронна пошта</th>
                        <th style={{width: "25%"}}>Роль</th>
                        <th style={{width: "10%"}} className="text-end">Дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.sort((a, b) => a.username.localeCompare(b.username)).map((user, index) => (
                        <tr key={index} className="m-5">
                            <td>
                                <div className="manager_card">
                                    <img
                                        src={user.avatar || defaultUserImage}
                                        alt="Executor Name" className="user_avatar"/>
                                    <div
                                        className="user_name">{user.username}</div>
                                </div>
                            </td>
                            <td>{user.email}</td>
                            <td>
                                {user.id !== userStore.user.id ? <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        {userProjects.find(up => up.userId === user.id)?.access.description}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {accesses.filter(acc => acc.id !== userProjects.find(up => up.userId === user.id)?.accessId)
                                            .map(access => (
                                                <Dropdown.Item key={access.id}
                                                               onClick={() => changeAccess(userProjects.find(up => up.userId === user.id), access.id)}>
                                                    {access.description}
                                                </Dropdown.Item>
                                            ))}
                                    </Dropdown.Menu>
                                </Dropdown> : userProjects.find(up => up.userId === user.id)?.access?.description}
                            </td>
                            <td>
                                {user.id !== userStore.user.id && <div className="project_dots">
                                    <div className="project_dots_button">
                                        <DropdownMenu toggleComponent={<DotsButton isMenuVisible={true}/>}>
                                            <Dropdown.Item onClick={() => deleteAccess(user.id)}>
                                                Видалити
                                            </Dropdown.Item>
                                        </DropdownMenu>
                                    </div>
                                </div>}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
})

export default Access