import React, {useState} from 'react'
import {Button, Form, Modal} from "react-bootstrap"

const CreateProjectModal = ({show, onHide, onCreate}) => {
    const [projectName, setProjectName] = useState('')
    const [description, setDescription] = useState('')

    const submitHandler = () => {
        onCreate({name: projectName, description: description || null})
        setProjectName('')
        setDescription('')
        onHide()
    }

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Створити проєкт</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Назва проєкту</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Введіть назву"
                            value={projectName}
                            onChange={e => setProjectName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Опис</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Введіть опис"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Відміна</Button>
                <Button variant="primary" onClick={submitHandler}>Створити</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CreateProjectModal
