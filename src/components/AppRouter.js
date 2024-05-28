import React, {useContext, useEffect} from 'react'
import {Routes, Route, Navigate} from "react-router-dom"
import {observer} from "mobx-react-lite"
import {authRoutes, publicRoutes} from "../routes"
import {Context} from "../index"
import SideBar from "./page/SideBar"
import {BOARD_ROUTE, LOGIN_ROUTE} from "../utils/consts"
import {fetchUsersByProject} from "../http/userApi"
import {
    fetchColumns,
    fetchDependenciesByProject,
    fetchRolesByProject,
    fetchTasksByProject,
    fetchUserProjectsByUser
} from "../http/boardApi"
import NavBar from "./page/NavBar"

const AppRouter = observer(() => {
    const {userStore, board} = useContext(Context)

    useEffect(() => {
        if (userStore.isAuth) {
            let oldBoardId = board.activeProject?.id
            if (!localStorage.getItem('activeProject') && board.projects.length) {
                board.setActiveProject(board.projects.reduce((minProject, currentProject) => {
                    return currentProject.id < minProject.id ? currentProject : minProject
                }))
            } else {
                const newActiveProject = board.projects.find(project => project.id === parseInt(localStorage.getItem('activeProject'), 10))
                board.setActiveProject(newActiveProject)
            }

            if (oldBoardId && board.activeProject?.id) {
                const activeProjectId = board.activeProject.id
                fetchUsersByProject(activeProjectId).then(data => {
                    board.setUsers(data)
                })

                fetchRolesByProject(activeProjectId).then(data => {
                    board.setRoles(data)
                })

                fetchDependenciesByProject(activeProjectId).then(data => {
                    board.setDependencies(data)
                })

                fetchColumns(activeProjectId).then(data => {
                    board.setColumns(data)
                })

                fetchTasksByProject(activeProjectId).then(data => {
                    board.setTasks(data)
                })

                fetchUserProjectsByUser(userStore.user.id).then(data => {
                    board.setUserProjects(data)
                    userStore.user.access = board.userProjects.find(up => up.projectId === board.activeProject.id).access
                })
            }
        }
    }, [board.activeProject, board.projects.length, userStore.isAuth])

    return (
        <Routes>
            {!userStore.isAuth && publicRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={
                    <>
                        {route.includeSidebar && <div className="sidebar-container"><SideBar/></div>}
                        <div className="content-container content-container-full">
                            {route.includeNavbar && <div className="navbar-container"><NavBar includeLogo={!route.includeSidebar}/></div>}
                            <div className="app-router-container">
                                <route.Component/>
                            </div>
                        </div>
                    </>
                }/>
            ))}
            {userStore.isAuth && authRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={
                    <>
                        {route.includeSidebar && <div className="sidebar-container"><SideBar/></div>}
                        <div className={`content-container${!route.includeSidebar ? ' content-container-full' : ''}`}>
                            {route.includeNavbar && <div className="navbar-container"><NavBar includeLogo={!route.includeSidebar}/></div>}
                            <div className={`app-router-container${route.includeSidebar ? ' frame' : ''}`}>
                                <route.Component/>
                            </div>
                        </div>
                    </>
                }/>
            ))}
            <Route path="*" element={<Navigate to={userStore.isAuth ? BOARD_ROUTE : LOGIN_ROUTE} replace/>}/>
        </Routes>
    )
})

export default AppRouter
