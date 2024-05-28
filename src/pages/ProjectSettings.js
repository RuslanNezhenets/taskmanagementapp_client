import React, {useContext, useState, useEffect} from 'react'
import {Context} from "../index"
import defaultUserImage from "../assets/defaultUser.jpg"
import defaultProjectAvatar from '../assets/defaultProjectAvatar.svg'
import {useParams} from "react-router-dom"
import {observer} from "mobx-react-lite"
import {Button} from "react-bootstrap"
import {updateProject} from "../http/boardApi"
import DatePicker from "react-datepicker"

const ProjectSettings = observer(() => {
    const {board} = useContext(Context)
    const [activeProject, setActiveProject] = useState({})
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [startDate, setStartDate] = useState(null)
    const [deadline, setDeadline] = useState(null)
    const [isChanged, setIsChanged] = useState(false)
    const {projectId} = useParams()

    useEffect(() => {
        setIsChanged(name !== activeProject.name
            || description !== activeProject.description
            || startDate !== activeProject.startDate
            || deadline !== activeProject.deadline)
    }, [name, description, startDate, deadline])

    useEffect(() => {
        const findProject = board.projects.find(project => project.id === parseInt(projectId))
        if (findProject) {
            setActiveProject({...findProject, description: findProject.description || ''})
            setName(findProject.name || '')
            setDescription(findProject.description || '')
            setStartDate(findProject.startDate)
            setDeadline(findProject.deadline)
        }
    }, [projectId, board.projects])

    const handleSaveChange = () => {
        updateProject({...activeProject, name: name, description: description || '', startDate: startDate, deadline: deadline}).then(data => {
            setActiveProject({...data, description: data.description || ''})
            board.updateProject(data)
            if (activeProject.id === board.activeProject.id) {
                board.setActiveProject(data)
            }
            setIsChanged(false)
        })
    }

    return (
        <div className="m-5">
            <h2 className="container mt-4 mb-4 w-75">Подробиці проєкту "{activeProject.name}"</h2>
            <div className="container w-25">
                <div className="text-center mb-4">
                    <img src={defaultProjectAvatar} alt="Icon" className="img-thumbnail"
                         style={{width: '150px', height: '150px'}}/>
                    {/*<div>*/}
                    {/*    <button className="btn btn-secondary mt-2">Змінити зображення</button>*/}
                    {/*</div>*/}
                </div>
                <form>
                    <div className="form-group mb-2">
                        <label>Назва</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Введіть назву"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div className="form-group mb-2">
                        <label>Опис</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Введіть опис"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Керівник проєкту</label>
                        <div className="d-flex align-items-center">
                            <div className="manager_card manager_card-border">
                                <img
                                    src={board.users.find(user => user.id === activeProject.managerId)?.avatar || defaultUserImage}
                                    alt="Manager Name" className="user_avatar"/>
                                <div
                                    className="user_name">{board.users.find(user => user.id === activeProject.managerId)?.username}</div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group mb-2 d-flex">
                        <label className="me-3 w-50">Старт проєкту:</label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            placeholderText="Виберіть дату"
                            minDate={new Date()}
                            maxDate={deadline}
                        />
                    </div>
                    <div className="form-group mb-2 d-flex">
                        <label className="me-3 w-50">Дедлайн проекту:</label>
                        <DatePicker
                            selected={deadline}
                            onChange={(date) => setDeadline(date)}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            placeholderText="Виберіть дату"
                            minDate={startDate || new Date()}
                        />
                    </div>
                    <Button
                        className="btn btn-primary mt-2"
                        disabled={!isChanged}
                        onClick={handleSaveChange}
                    >
                        Зберегти
                    </Button>
                </form>
            </div>
        </div>
    )
})

export default ProjectSettings
