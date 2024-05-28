import React, {useContext, useState} from 'react'
import {Dropdown} from "react-bootstrap"
import {Context} from "../index"
import {observer} from "mobx-react-lite"
import DropdownMenu from "../components/board/dropdownMenu"
import DotsButton from "../components/board/dotsButton"
import defaultUserImage from "../assets/defaultUser.jpg"
import {useNavigate} from "react-router-dom"
import {ACCESS_ROUTE, BOARD_ROUTE, PROJECT_SETTINGS_ROUTE} from "../utils/consts"
import {deleteProject} from "../http/boardApi"
import ConfirmModal from "../components/modals/confirmModal"
import defaultProjectAvatar from '../assets/defaultProjectAvatar.svg'

const Projects = observer(() => {
    const {board} = useContext(Context)
    const navigate = useNavigate()
    const [confirmModal, setConfirmModal] = useState(false)
    const [projectToBeDeleted, setProjectToBeDeleted] = useState(null)

    const handleSetActiveProject = (project) => {
        board.setActiveProject(project)
        localStorage.setItem('activeProject', project.id)
        localStorage.removeItem('solutions')
        navigate(BOARD_ROUTE)
    }

    const handleDeleteProject = () => {
        deleteProject(projectToBeDeleted.id).then(() => {
            board.deleteProject(projectToBeDeleted.id)
            setProjectToBeDeleted(null)
            setConfirmModal(false)
        })
    }

    function formatDate(dateString) {
        const date = new Date(dateString)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()

        return `${day}.${month}.${year}`
    }

    return (
        <div className="m-5">
            <ConfirmModal
                show={confirmModal}
                onHide={setConfirmModal}
                title={`Ви впевнені, що бажаєте видалити проєкт "${projectToBeDeleted?.name}"?`}
                description="Проєкт і все, що з ним пов'язано буде безповоротно видалено!"
                onConfirm={handleDeleteProject}
                onCancel={() => setConfirmModal(false)}
            />
            {board.projects.length ?
                <table className="custom-table">
                    <thead>
                    <tr>
                        <th style={{width: "2%"}}></th>
                        <th style={{width: "18%"}}>Назва</th>
                        <th style={{width: "25%"}}>Опис</th>
                        <th style={{width: "25%"}}>Керівник</th>
                        <th style={{width: "10%"}}>Дата старту</th>
                        <th style={{width: "10%"}}>Дедлайн</th>
                        <th style={{width: "10%"}} className="text-end pe-2">Додаткові дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {board.projects.map((project, index) => (
                        <tr key={index} className="project_row">
                            <td onClick={() => handleSetActiveProject(project)} className="cursor-pointer">
                                <img
                                    src={defaultProjectAvatar}
                                    alt="Icon"
                                    className="ms-2 me-2"
                                    style={{width: '30px', height: '30px', borderRadius: '5px'}}
                                />
                            </td>
                            <td
                                className="custom-table-project-name"
                                onClick={() => handleSetActiveProject(project)}
                            >
                                {project.name}
                            </td>
                            <td>{project.description}</td>
                            <td>
                                <div className="manager_card">
                                    <img
                                        src={board.users.find(user => user.id === project.managerId)?.avatar || defaultUserImage}
                                        alt="Executor Name" className="user_avatar"/>
                                    <div
                                        className="user_name">{board.users.find(user => user.id === project.managerId)?.username}</div>
                                </div>
                            </td>
                            <td>{project.startDate ? formatDate(project.startDate) : 'Не встановлена'}</td>
                            <td>{project.deadline ? formatDate(project.deadline) : 'Не встановлений'}</td>
                            <td>
                                {board.userProjects.find(up => up.projectId === project.id)?.access.key === 'admin' &&
                                    <div className="project_dots">
                                        <div className="project_dots_button me-2">
                                            <DropdownMenu
                                                toggleComponent={<DotsButton isMenuVisible={true}/>}
                                            >
                                                <Dropdown.Item
                                                    onClick={() => navigate(PROJECT_SETTINGS_ROUTE + '/' + project.id)}>
                                                    Налаштування
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                    onClick={() => navigate(ACCESS_ROUTE + '/' + project.id)}>
                                                    Доступ
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => {
                                                    setConfirmModal(true)
                                                    setProjectToBeDeleted(project)
                                                }}>
                                                    Видалити
                                                </Dropdown.Item>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                }
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                :
                <h1 className="text-center">Відсутні проєкти</h1>}
        </div>
    )
})

export default Projects