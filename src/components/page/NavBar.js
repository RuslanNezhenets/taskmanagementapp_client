import React, {useContext, useState} from 'react'
import {useNavigate} from "react-router-dom"
import defaultUserImage from '../../assets/defaultUser.jpg'
import logo from '../../assets/logo.svg'
import {Context} from "../../index"
import {observer} from "mobx-react-lite"
import {Nav, Navbar, NavDropdown} from "react-bootstrap"
import {BOARD_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE, PROJECTS_ROUTE} from "../../utils/consts"
import {createProject} from "../../http/boardApi"
import CreateProjectModal from "../modals/createProjectModal"

const NavBar = observer(({includeLogo}) => {
    const {userStore, board} = useContext(Context)
    const [showCreateProjectModal, setShowCreateProjectModal] = useState(false)
    const navigate = useNavigate()

    const handleSetActiveProject = (project) => {
        board.setActiveProject(project)
        localStorage.setItem('activeProject', project.id)
        localStorage.removeItem('solutions')
        navigate(BOARD_ROUTE)
    }

    const handleCreateProject = (projectData) => {
        const newProject = {...projectData, managerId: userStore.user.id}
        createProject(newProject).then(data => {
            board.addProject(data.project)
            handleSetActiveProject(data.project)
        })
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        userStore.setUser(null)
        userStore.setIsAuth(false)
        navigate(LOGIN_ROUTE)
    }

    return (
        <>
            <CreateProjectModal
                show={showCreateProjectModal}
                onHide={() => setShowCreateProjectModal(false)}
                onCreate={handleCreateProject}
            />
            <Navbar className="bg-body-tertiary">
                {(includeLogo && board.projects.length) ? <Navbar.Brand onClick={() => navigate(BOARD_ROUTE)} className="cursor-pointer">
                    <img
                        alt=""
                        src={logo}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{' '}
                    Повернутися до проєкту
                </Navbar.Brand> : ''}
                <Nav className="me-auto">
                    <NavDropdown title="Проєкти" id="basic-nav-dropdown">
                        {board.projects.map(project => (
                            <NavDropdown.Item onClick={() => handleSetActiveProject(project)}
                                              key={project.id}>{project.name}</NavDropdown.Item>
                        ))}
                        <hr className="m-1"/>
                        <NavDropdown.Item onClick={() => navigate(PROJECTS_ROUTE)}>
                            Показати всі проєкти
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={() => setShowCreateProjectModal(true)}>
                            Створити проєкт
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Navbar.Collapse className="justify-content-end">
                    <Nav>
                        <NavDropdown
                            title={<img src={userStore.user.avatar || defaultUserImage} alt="Profile"
                                        className="navbar_avatar"/>}
                            id="basic-nav-dropdown"
                            align="end"
                            className="custom-avatar-dropdown"
                        >
                            <NavDropdown.Item onClick={() => navigate(PROFILE_ROUTE)}>
                                Перегляд профілю
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={handleLogout}>
                                Вийти
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>

            </Navbar>
        </>
    )
})

export default NavBar