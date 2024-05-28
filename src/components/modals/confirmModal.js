import React from 'react'
import {Button, Modal} from "react-bootstrap"

const ConfirmModal = ({show, onHide, title, description, onConfirm, success=false}) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Title id="contained-modal-title-vcenter" className="m-3">{title}</Modal.Title>
            <Modal.Body>
                <div className="modal_description">{description}</div>
            </Modal.Body>
            <Modal.Footer>
                {!success ? <Button variant="danger" onClick={onConfirm}>
                    Видалити
                </Button> :
                <Button variant="success" onClick={onConfirm}>
                    Підтвердити
                </Button>}
                <Button variant="light" onClick={() => onHide(false)}>
                    Відміна
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ConfirmModal