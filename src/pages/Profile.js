import React, {useContext, useEffect, useRef, useState} from 'react'
import {Context} from "../index"
import {observer} from "mobx-react-lite"
import {fetchUser, updateUser} from "../http/userApi"
import defaultUserImage from "../assets/defaultUser.jpg"
import EditableText from "../utils/editableText"
import {Card, Col, Container, ListGroup, Row} from "react-bootstrap"
import {fetchTasksByUser} from "../http/boardApi"
import defaultProjectAvatar from "../assets/defaultProjectAvatar.svg"
import {BOARD_ROUTE} from "../utils/consts"
import {useNavigate} from "react-router-dom"

const Profile = observer(() => {
    const {userStore, board} = useContext(Context)
    const [userData, setUserData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const fileInputRef = useRef(null)
    const [tasksAtWork, setTasksAtWork] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        setIsLoading(true)
        fetchUser(userStore.user.id).then(user => {
            setUserData(user)
            setIsLoading(false)
        })
        fetchTasksByUser(userStore.user.id).then(data => {
            setTasksAtWork(data)
        })
    }, [userStore.user.id])

    const handleSetActiveProject = (project) => {
        board.setActiveProject(project)
        localStorage.setItem('activeProject', project.id)
        localStorage.removeItem('solutions')
        navigate(BOARD_ROUTE)
    }

    const updateUserData = (field, value) => {
        setUserData(prev => ({...prev, [field]: value}))
        updateUser({...userData, [field]: value})
    }

    const handleAvatarClick = () => {
        fileInputRef.current.click()
    }

    const handleAvatarChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]

            try {
                const updatedUserData = await updateUser(userData, file, file.type)
                setUserData(updatedUserData)
                userStore.setUser(updatedUserData)
            } catch (error) {
                alert("Помилка при оновленні аватара: " + (error.response?.data.message || error.message))
            }
        }
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <Container>
            <Row className="mt-4">
                <Col md={4}>
                    <Card className="profile_info">
                        <div className="profile-avatar-wrapper">
                            <img src={userData.avatar || defaultUserImage} className="profile-avatar-img"
                                 alt="avatar"/>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                                style={{display: 'none'}}
                                accept="image/jpeg,image/png"
                            />
                            <i onClick={handleAvatarClick} className="fas fa-camera profile-avatar-icon"></i>
                        </div>
                        <Card.Body>
                            <Card.Title><EditableText
                                className="profile_info_input profile_info_input-big"
                                text={userData.username}
                                placeholder="Ім'я"
                                onTextChange={(value) => {
                                    updateUserData('username', value)
                                }}
                            /></Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>Ваша посада: <EditableText
                                    className="profile_info_input"
                                    text={userData.position}
                                    placeholder="Назва посади"
                                    onTextChange={(value) => {
                                        updateUserData('position', value)
                                    }}
                                /></ListGroup.Item>
                                <ListGroup.Item>Ваш відділ: <EditableText
                                    className="profile_info_input"
                                    text={userData.department}
                                    placeholder="Назва відділу"
                                    onTextChange={(value) => {
                                        updateUserData('department', value)
                                    }}
                                /></ListGroup.Item>
                                <ListGroup.Item>Ваша організації: <EditableText
                                    className="profile_info_input"
                                    text={userData.organization}
                                    placeholder="Назва організації"
                                    onTextChange={(value) => {
                                        updateUserData('organization', value)
                                    }}/></ListGroup.Item>
                                <ListGroup.Item>Контактні дані: {userData.email}</ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card>
                        <Card.Body>
                            <Card.Title>{tasksAtWork.length ? 'Призначенні задачі' : 'Відсутні призначені задачі'}</Card.Title>
                            <ListGroup>
                                {tasksAtWork.map(task => (
                                    <ListGroup.Item key={task.id} className="profile_task">
                                        <div className="profile_task_title">{task.title} ({task.column.project.name})
                                        </div>
                                        <div className="profile_task_column">{task.column.name}</div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            {/*<Button variant="primary" className="mt-3">Переглянути всі</Button>*/}
                        </Card.Body>
                    </Card>
                    <Card className="mt-3">
                        <Card.Body>
                            <Card.Title>{board.projects.length ? 'Проєкти, над якими ви працюєте' : 'Відсутні проєкти'}</Card.Title>
                            <ListGroup variant="flush">
                                {board.projects.map(project => (
                                    <ListGroup.Item key={project.id} className="d-flex">
                                        <img
                                            src={defaultProjectAvatar}
                                            alt="Icon"
                                            className="me-2"
                                            style={{width: '30px', height: '30px', borderRadius: '5px'}}
                                        />
                                        <div
                                            className="profile_project_name"
                                            onClick={() => handleSetActiveProject(project)}
                                        >{project.name}</div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
})

export default Profile
