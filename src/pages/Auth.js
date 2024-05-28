import React, {useContext, useState, useEffect} from 'react'
import {NavLink, useLocation, useNavigate} from "react-router-dom"
import {LOGIN_ROUTE, PROFILE_ROUTE, REGISTRATION_ROUTE} from "../utils/consts"
import {fetchUser, login, registration} from "../http/userApi"
import {observer} from "mobx-react-lite"
import {Context} from "../index"
import {fetchProjectsByUser} from "../http/boardApi"
import {Button, Form, Alert, Container, Col, Card} from 'react-bootstrap'

const Auth = observer(() => {
    const {userStore, board} = useContext(Context)
    const location = useLocation()
    const navigate = useNavigate()
    const isLogin = location.pathname === LOGIN_ROUTE
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        setEmail('')
        setPassword('')
        setError('')
    }, [location.pathname])

    const click = async () => {
        try {
            let user
            if (isLogin) {
                user = await login(email, password)
            } else {
                user = await registration(email, password)
            }

            const fullUser = await fetchUser(user.id)

            userStore.setUser(fullUser)
            userStore.setIsAuth(true)

            const projects = await fetchProjectsByUser(fullUser.id)
            board.setProjects(projects)

            navigate(PROFILE_ROUTE)
        } catch (e) {
            setError(e.response.data.message)
        }
    }

    const handleChange = setter => value => {
        setError('')
        setter(value)
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            click()
        }
    }

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{height: '100vh'}}>
            <Card style={{width: '25rem'}} className="p-3">
                <Col className="ms-3 me-3">
                    <h2 className="text-center mb-4">{isLogin ? 'Авторизація' : 'Реєстрація'}</h2>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="email"
                                placeholder="Введіть ваш email..."
                                value={email}
                                onChange={e => handleChange(setEmail)(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="password"
                                placeholder="Введіть ваш пароль..."
                                value={password}
                                onChange={e => handleChange(setPassword)(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                        </Form.Group>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Button variant="primary" onClick={click} className="w-100">
                            {isLogin ? "Увійти" : "Реєстрація"}
                        </Button>
                        <div className="text-center mt-3">
                            {isLogin ?
                                <p>
                                    Немає аккаунту? <NavLink to={REGISTRATION_ROUTE}>Зареєструйтесь!</NavLink>
                                </p>
                                :
                                <p>
                                    Є аккаунт? <NavLink to={LOGIN_ROUTE}>Увійдіть!</NavLink>
                                </p>
                            }
                        </div>
                    </Form>
                </Col>
            </Card>
        </Container>
    )
})

export default Auth
