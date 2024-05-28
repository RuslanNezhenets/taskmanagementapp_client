import React, {useEffect, useState} from 'react'
import {Button, Form, Modal} from "react-bootstrap"

const AddUserModal = ({show, onHide, accesses, addUser}) => {
    const [email, setEmail] = useState('')
    const [selectedAccessId, setSelectedAccessId] = useState('')

    useEffect(() => {
        const defaultAccess = accesses.find(access => access.key === 'user')
        if (defaultAccess) {
            setSelectedAccessId(defaultAccess.id)
        }
    }, [accesses])

    const handleSubmit = () => {
        addUser(email, selectedAccessId)
        setEmail('')
        onHide()
    }

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Додати користувача</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Email адрес</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Введіть email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Роль</Form.Label>
                        <Form.Select
                            value={selectedAccessId}
                            onChange={(e) => setSelectedAccessId(e.target.value)}
                        >
                            {accesses.map(access => (
                                <option key={access.id} value={access.id}>{access.description}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Відміна</Button>
                <Button variant="primary" onClick={handleSubmit}>Додати</Button>
            </Modal.Footer>
        </Modal>
    )
}


export default AddUserModal