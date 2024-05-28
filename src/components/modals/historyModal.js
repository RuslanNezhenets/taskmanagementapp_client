import React, {useContext, useEffect, useState} from 'react'
import {Button, Modal, Tab, Tabs} from "react-bootstrap"
import processingResults from "../../algorithmUtils/processingResults"
import {Context} from "../../index"
import FrappeGantt from "../FrappeGantt"
import {observer} from "mobx-react-lite"
import {updateTasks} from "../../http/boardApi"
import ConfirmModal from "./confirmModal"

const HistoryModal = observer(({show, onHide, setTasks, userProjects}) => {
    const {board} = useContext(Context)

    const [key, setKey] = useState('')
    const [solutions, setSolutions] = useState([])
    const [confirmModal, setConfirmModal] = useState(false)

    const formDate = (key) => {
        const date = new Date(key)
        return date.toLocaleString('ru-RU', {
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    }

    useEffect(() => {
        let storedSolutions = JSON.parse(localStorage.getItem('solutions'))

        if (storedSolutions) {
            const newSolutions = updateSolutions(storedSolutions)

            setSolutions(newSolutions)
            setKey(Object.keys(newSolutions)[0])
        }
    }, [board.dependencies])

    const handleSaveTasks = () => {
        updateTasks(solutions[key].tasks)
        setTasks(solutions[key].tasks)
        onHide(true)
    }

    const handleDeleteTab = (tabKey) => {
        let updatedSolutions = JSON.parse(localStorage.getItem('solutions'))
        delete updatedSolutions[tabKey]

        if (Object.keys(updatedSolutions).length === 0) {
            localStorage.removeItem('solutions')
            onHide(false)
        } else
            localStorage.setItem('solutions', JSON.stringify(updatedSolutions))

        updatedSolutions = updateSolutions(updatedSolutions)

        setSolutions(updatedSolutions)

        if (key === tabKey) {
            const remainingKeys = Object.keys(updatedSolutions)
            setKey(remainingKeys.length > 0 ? remainingKeys[0] : '')
        }
    }

    const updateSolutions = (storedSolutions) => {
        const newSolutions = {}

        const availableRoles = getAvailableRoles()

        const newAvailableRoles = {}
        let difference = {}

        Object.keys(storedSolutions).forEach(key => {
            if (storedSolutions[key].hasOwnProperty('w')) {
                let keys = Object.keys(availableRoles)
                keys.forEach((k, index) => {
                    newAvailableRoles[k] = storedSolutions[key].w[k]
                })

                for (let key in availableRoles) {
                    if (availableRoles.hasOwnProperty(key) && newAvailableRoles.hasOwnProperty(key)) {
                        difference[key] = newAvailableRoles[key] - availableRoles[key]
                    }
                }
            }

            newSolutions[key] = {
                tasks: processingResults(storedSolutions[key].result, board.tasks, board.dependencies),
                w: storedSolutions[key].hasOwnProperty('w') ? newAvailableRoles : null,
                difference: difference
            }
        })

        return newSolutions
    }

    const getAvailableRoles = () => {
        const availableRoles = {}
        board.roles.map(role => role.id)
            .filter(roleId => board.tasks.some(task => task.roleId === roleId))
            .forEach(roleId => {
                availableRoles[roleId] = userProjects.filter(up => up.roleId === roleId).length
            })

        return availableRoles
    }

    return (
        <Modal show={show} onHide={onHide} size="xl" aria-labelledby="contained-modal-title-vcenter" centered>
            <ConfirmModal
                show={confirmModal}
                onHide={setConfirmModal}
                title={`Підтвердження`}
                description="Ви впевнені, що хочете перепризначити терміни всіх задач? Ви більше не зможете відновити попередній варіант"
                onConfirm={handleSaveTasks}
                success={true}
            />
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Історія запропонованих рішень
                </Modal.Title>
            </Modal.Header>
            {Object.keys(solutions).length ?
                <>
                    <Modal.Body>
                        <Tabs
                            id="controlled-tab-example"
                            activeKey={key}
                            onSelect={(k) => setKey(k)}
                            className="mb-3"
                        >
                            {Object.keys(solutions).map(tabKey =>
                                <Tab
                                    eventKey={tabKey}
                                    title={
                                        <div className="d-flex justify-content-between align-items-center">
                                            {formDate(tabKey)}
                                            <span onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteTab(tabKey)
                                            }} className="close-tab-icon" role="button" aria-label="Close"
                                            >
                                        &times;
                                    </span>
                                        </div>
                                    }
                                    key={tabKey}
                                >
                                    {solutions[tabKey].w ?
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                Вимоги до складу команди:
                                                <ul>
                                                    {Object.keys(solutions[tabKey].w).map(key =>
                                                        <li key={key}>
                                                            {board.roles.find(role => role.id === parseInt(key)).name} - {solutions[tabKey].w[key]}
                                                        </li>)
                                                    }
                                                </ul>
                                            </div>
                                            {Object.values(solutions[tabKey].difference).every(value => value === 0) ? '' :
                                                <div className="warning-w m-3 p-3"
                                                     style={{border: '1px red solid', borderRadius: 5}}>
                                                    {Object.keys(solutions[tabKey].difference).map(key => {
                                                        const difference = solutions[tabKey].difference[key]
                                                        if (difference !== 0) {
                                                            const role = board.roles.find(role => role.id === parseInt(key))
                                                            return (
                                                                <div key={key}>
                                                                    {role ? role.name : 'Unknown Role'} - {difference > 0 ?
                                                                    `в команді не вистачає ${difference} співробітника(ів)` :
                                                                    `в команді є ${-difference} надлишковий(і) співробітник(и)`}
                                                                </div>
                                                            )
                                                        }
                                                        return null
                                                    })}
                                                </div>
                                            }

                                        </div> : ''}
                                    {key === tabKey && solutions[tabKey].tasks ?
                                        <FrappeGantt tasks={solutions[tabKey].tasks} roles={board.roles}/> :
                                        <div>Завантаження...</div>}
                                </Tab>
                            )}
                        </Tabs>
                    </Modal.Body>
                    <Modal.Footer className="justify-content-between">
                        <Button variant="success" onClick={() => setConfirmModal(true)}>Застосувати</Button>
                        <Button onClick={onHide}>Закрити</Button>
                    </Modal.Footer>
                </> :
                <Modal.Body className="text-center">
                    Немає записів в історії
                </Modal.Body>
            }
        </Modal>
    )
})

export default HistoryModal