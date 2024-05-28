import React, {useContext, useState} from 'react'
import {Button, Modal} from "react-bootstrap"
import {Context} from "../../index"

const StartModal = ({show, onHide, start}) => {
    const {board} = useContext(Context)
    const [warning, setWarning] = useState(null)
    const [showWarningModal, setShowWarningModal] = useState(false)

    const startAndWarningsCheck = async (useAvailable) => {
        const warnings = await start(useAvailable)

        if (warnings) {
            setWarning(warnings)
            setShowWarningModal(true)
        } else {
            start(useAvailable)
            onHide()
        }
    }

    const handleWarningModalClose = () => {
        setShowWarningModal(false)
    }

    return (
        <>
            <Modal show={show} onHide={onHide} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Підтвердження Запуску Алгоритму</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="algorithm-page-container">
                        <h1 className="text-center">Опис Алгоритма розподілу задач</h1>
                        Цей алгоритм розроблено для автоматичного розподілу задач проєкту за шкалою часу,
                        який працює у двух режимах:
                        <ul>
                            <li>
                                Генерації розкладу на основі кількості співробітників кожної ролі, доєднаних до
                                проєкту
                            </li>
                            <li>
                                Генерація розкладу та підбір складу команди для того, щоб завершити проєкт до
                                кінцевого терміну
                            </li>
                        </ul>
                        Обидва алгоритма враховують встановлені залежності між задачами.
                        <br/><br/>
                        <strong>
                            Перед запуском алгоритму необхідно переконатися, що:
                        </strong>
                        <ul>
                            <li>для кожної задачи встановлена роль співробітника, яка може його виконувати</li>
                            <li>для кожної задачи вставнолений приблизний час необхідний на його виконання</li>
                            <li>* для алгоритму з підбором команди - встановлений крайній термін завершення проєкту</li>
                        </ul>
                        <p>
                            Впевніться, що ви ввели всі необхідні дані. Робота алгоритму може зайняти деякий час,
                            залежно від
                            кількості задач та обраного режиму роботи алгоритму.
                            <br/>
                            Ми повідомимо вас, коли результати будуть готові.
                        </p>
                        <div className="d-flex m-auto align-items-center flex-column">
                            <Button
                                variant="primary"
                                onClick={() => startAndWarningsCheck(true)}
                                className="w-75 mb-3"
                            >
                                Згенерувати план з урахуванням доступних співробітників
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => startAndWarningsCheck(false)}
                                className="w-75"
                            >
                                Знайти рішення для завершення проєкту до дедлайну
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Відміна
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showWarningModal} onHide={handleWarningModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Відсутні необхідні дані</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {warning && (
                        <div>
                            {warning.message && <p><b>{warning.message}</b></p>}

                            {warning.body && (
                                <div>
                                    {warning.body.type === 'task' ? (
                                        <ul>
                                            {warning.body.ids.map(taskId => {
                                                const task = board.tasks.find(task => task.id === parseInt(taskId))
                                                return task ? <li key={taskId}>{task.title}</li> : null
                                            })}
                                        </ul>
                                    ) : (
                                        <ul>
                                            {warning.body.ids.map(roleId => {
                                                const role = board.roles.find(role => role.id === parseInt(roleId))
                                                return role ? <li key={roleId}>{role.name}</li> : null
                                            })}
                                        </ul>
                                    )}
                                </div>
                            )}

                            <div>Будь ласка, переконайтеся, що всі дані вказані, перш ніж запускати алгоритм</div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleWarningModalClose}>
                        Відміна
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default StartModal
