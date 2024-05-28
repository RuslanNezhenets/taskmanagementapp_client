import React, {useContext, useState} from 'react'
import {Context} from "../index"
import {Button, Card} from "react-bootstrap"
import {observer} from "mobx-react-lite"
import {createRole, updateRole} from "../http/boardApi"
import ViewRoleModal from "../components/modals/viewRoleModal"
import ColumnCreator from "../components/board/columnCreator"

const Roles = observer(() => {
    const {board} = useContext(Context)

    const [showModal, setShowModal] = useState(false)
    const [activeRole, setActiveRole] = useState(null)
    const [showCreateModal, setShowCreateModal] = useState(false)

    const handleColorSelection = (event, role) => {
        board.updateRole({...role, color: event.target.value})
    }

    const handleColorChange = (event, role) => {
        updateRole({...role, color: event.target.value})
    }

    const handleOpenDetails = (role) => {
        setShowModal(true)
        setActiveRole(role)
    }

    const handleCloseDetails = () => {
        setShowModal(false)
        const delay = async (ms) => await new Promise(resolve => setTimeout(resolve, ms))
        delay(250).then(() => setActiveRole(null))
    }

    const addNewRole = (name = null) => {
        createRole({projectId: board.activeProject.id, name: name})
            .then(newRole => board.addRole(newRole))
            .catch(e => alert(e.response.data.message))
        setShowCreateModal(false)
    }

    return (
        <div className="roles_page">
            {showModal &&
                <ViewRoleModal show={showModal} onHide={handleCloseDetails} role={activeRole} setRole={setActiveRole}/>}
            <div className="role_cards">
                {board.roles.map(role =>
                    <Card className="role_card" key={role.id} onClick={() => handleOpenDetails(role)}>
                        <Card.Body className="role_card_body">
                            <div>
                                <Card.Title className="text-center">{role.name}</Card.Title>
                                <Card.Text>
                                    <div dangerouslySetInnerHTML={{__html: role.description}}/>
                                </Card.Text>
                            </div>
                            <input
                                type="color"
                                className="role_card_color"
                                onChange={(event) => handleColorSelection(event, role)}
                                onBlur={(event) => handleColorChange(event, role)}
                                onClick={event => event.stopPropagation()}
                                value={role.color || '#ffffff'}
                                readOnly
                            />
                        </Card.Body>
                    </Card>
                )}
                {board.roles.length ? (
                    showCreateModal ? (
                        <div className="mt-2">
                            <ColumnCreator handleConfirm={addNewRole} handleCancel={() => setShowCreateModal(false)}/>
                        </div>
                    ) : (
                        <div className="board_add_column_block mt-3" onClick={() => setShowCreateModal(true)}>
                            <div className="board_add_column_img"></div>
                        </div>
                    )
                ) : (
                    <div className="d-flex flex-column">
                        <h2 className="mb-3">Ви не створили жодної ролі</h2>
                        <Button onClick={() => addNewRole()}>Створити нову роль</Button>
                    </div>
                )}
            </div>
        </div>
    )
})

export default Roles