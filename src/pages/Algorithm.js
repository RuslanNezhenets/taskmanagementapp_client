import React, {useContext, useEffect, useState} from 'react'
import {Context} from "../index"
import {checkMatlab, fetchUserByProject, startMatlab} from "../http/boardApi"
import {observer} from "mobx-react-lite"
import FrappeGantt from "../components/FrappeGantt"
import {Button, Modal, Spinner} from "react-bootstrap"
import StartModal from "../components/modals/startModal"
import HistoryModal from "../components/modals/historyModal"
import ViewTaskModal from "../components/modals/viewTaskModal"
import {useWebSocket} from "../utils/webSocketContext"

const Algorithm = observer(() => {
    const {board, userStore} = useContext(Context)

    const [tasks, setTasks] = useState([])
    const [userProjects, setUserProjects] = useState(null)
    const {messages, clientId} = useWebSocket()
    const [showModal, setShowModal] = useState(false)
    const [showHistoryModal, setShowHistoryModal] = useState(false)
    const [useAvailable, setUseAvailable] = useState(true)

    const [isAlgorithmRunning, setIsAlgorithmRunning] = useState(false)

    useEffect(() => {
        checkMatlab().then(data => setIsAlgorithmRunning(data.busy))
    }, [])

    useEffect(() => {
        if (board.tasks.length) {
            const tasksWithDependencies = board.tasks.map(task => {
                const dependencies = board.dependencies
                    .filter(dep => dep.dependentTaskId === task.id)
                    .map(dep => dep.taskId).join(', ')
                return {...task, dependencies: dependencies}
            })

            setTasks(tasksWithDependencies)

            fetchUserByProject(board.activeProject.id).then(data => setUserProjects(data))
        }

    }, [board.tasks, board.dependencies.length])

    useEffect(() => {
        if (messages.length) {
            let message = null
            try {
                message = JSON.parse(messages.pop())
            } catch (error) {
                console.error('Error parsing message:', error)
                return
            }

            if (message.result && board.tasks.length > 0) {
                updateSolutions(message.result)
                setIsAlgorithmRunning(false)
            }

            handleCloseModal()
        }
    }, [messages])

    function updateSolutions(value) {
        let solutions = localStorage.getItem('solutions')

        if (solutions) {
            solutions = JSON.parse(solutions)
        } else {
            solutions = {}
        }

        const currentTime = new Date().toISOString()

        solutions[currentTime] = useAvailable ? {result: value.result} : value

        localStorage.setItem('solutions', JSON.stringify(solutions))
    }

    const loadData = async (useAvailable) => {
        const params = {
            projectId: board.activeProject.id,
            useAvailable: useAvailable,
            clientId
        }

        try {
            await startMatlab(params)
        } catch (e) {
            return e.response.data
        }

        setUseAvailable(useAvailable)

        handleCloseModal()
        setIsAlgorithmRunning(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const [viewTaskModal, setViewTaskModal] = useState(false)

    return (
        <div className="algorithm_page">
            <h2 className="text-center">План виконання задач</h2>
            {viewTaskModal && <ViewTaskModal
                show={viewTaskModal}
                onHide={() => {
                    setViewTaskModal(false)
                    const delay = async (ms) => await new Promise(resolve => setTimeout(resolve, ms))
                    delay(250).then(() => board.setActiveTask(null))
                }}
            />}
            {showHistoryModal &&
                <HistoryModal show={showHistoryModal} onHide={() => setShowHistoryModal(false)} setTasks={setTasks}
                              userProjects={userProjects}/>}
            {isAlgorithmRunning ?
                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <div className="text-center mt-5 mb-5">
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                        <h4 className="mt-3">Алгоритм виконується, будь ласка, зачекайте...</h4>
                    </div>
                </Modal> :
                <StartModal show={showModal} onHide={handleCloseModal} start={loadData}/>}
            {board.tasks.length ?
                <div className="gantt_block">
                    <div className="algorithm_control">
                        {userStore.isAdmin &&
                            <Button className="gantt_block_button" variant="primary" onClick={() => setShowModal(true)}>
                                Згенерувати рішення
                            </Button>}
                        {localStorage.getItem('solutions') && <Button className="gantt_block_button" variant="primary"
                                                                      onClick={() => setShowHistoryModal(true)}>История</Button>}
                    </div>
                    {tasks.length ?
                        <FrappeGantt
                            tasks={tasks}
                            roles={board.roles}
                            setViewTaskModal={(taskId) => {
                                board.setActiveTask(board.tasks.find(task => parseInt(task.id) === parseInt(taskId)))
                                setViewTaskModal(true)
                            }}
                        /> : ''}
                </div> :
                <h2 className="text-center">Ви ще не додали до проєкту жодної задачи</h2>
            }
        </div>
    )
})

export default Algorithm