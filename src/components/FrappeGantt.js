import React, {useEffect, useRef, useState} from 'react'
import Gantt from "frappe-gantt"
import 'frappe-gantt/dist/frappe-gantt.css'

const FrappeGantt = ({tasks, roles, setViewTaskModal}) => {
    const ganttRef = useRef(null)
    const [loadedTasks, setLoadedTasks] = useState([])

    const injectStyles = (roles) => {
        const styleElement = document.createElement("style")
        document.head.appendChild(styleElement)
        const styleSheet = styleElement.sheet

        roles.forEach(role => {
            const colorClass = `cc-${role.color.replace('#', '')}`
            const rule = `.${colorClass} g rect { fill: ${role.color} !important; }`
            styleSheet.insertRule(rule, styleSheet.cssRules.length)
        })
    }

    const formDate = (milliseconds) => {
        const date = new Date(milliseconds)

        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()

        const formattedMonth = month < 10 ? `0${month}` : month
        const formattedDay = day < 10 ? `0${day}` : day

        return `${year}-${formattedMonth}-${formattedDay}`
    }

    useEffect(() => {
        //tasks = tasks.filter(task => task.duration !== null)

        function sortTasks(tasks) {
            let noDependencies = []
            let independentWithEarliestStart = []
            let otherIndependent = []
            let dependentTasks = []

            let minStartDate = Infinity

            tasks.forEach(task => {
                let dependenciesEmpty = task.dependencies === ""
                let noDependents = true

                tasks.forEach(other => {
                    if (other.dependencies.split(', ').map(Number).includes(task.id)) {
                        noDependents = false
                    }
                })

                if (dependenciesEmpty && noDependents) {
                    noDependencies.push(task)
                    if (task.startDate < minStartDate) {
                        minStartDate = task.startDate
                    }
                } else {
                    dependentTasks.push(task)
                }
            })

            noDependencies.forEach(task => {
                if (task.startDate === minStartDate || !task.startDate) {
                    independentWithEarliestStart.push(task)
                } else {
                    otherIndependent.push(task)
                }
            })

            otherIndependent.sort((a, b) => a.startDate - b.startDate)

            return {
                independentWithEarliestStart: independentWithEarliestStart,
                otherIndependent: otherIndependent,
                dependentTasks: dependentTasks
            }
        }

        function topologicalSort(tasks) {
            let graph = new Map()
            let inDegree = new Map()
            let zeroInDegree = []
            let sorted = []

            tasks.forEach(task => {
                graph.set(task.id, [])
                inDegree.set(task.id, 0)
            })

            tasks.forEach(task => {
                if (task.dependencies) {
                    let dependencies = task.dependencies.split(', ').map(Number)
                    dependencies.forEach(dep => {
                        graph.get(dep).push(task.id)
                        inDegree.set(task.id, inDegree.get(task.id) + 1)
                    })
                }
            })

            inDegree.forEach((deg, id) => {
                if (deg === 0) zeroInDegree.push(id)
            })

            while (zeroInDegree.length > 0) {
                let current = zeroInDegree.pop()
                sorted.push(current)
                graph.get(current).forEach(neighbour => {
                    inDegree.set(neighbour, inDegree.get(neighbour) - 1)
                    if (inDegree.get(neighbour) === 0) {
                        zeroInDegree.push(neighbour)
                    }
                })
            }

            if (sorted.length !== tasks.length) {
                throw new Error("Detected a cycle in the tasks dependencies!")
            }

            return sorted.map(id => tasks.find(task => task.id === id))
        }

        const sortedTasks = sortTasks(tasks)

        const newSortedTasks = [...sortedTasks.independentWithEarliestStart, ...topologicalSort(sortedTasks.dependentTasks), ...sortedTasks.otherIndependent]

        const newTasks = newSortedTasks.map(task => {
            const color = roles.find(role => role.id === task.roleId) ? roles.find(role => role.id === task.roleId).color : '#8a8aff'
            const endDate = task.endDate ?
                new Date(new Date(task.endDate).getTime() - 24 * 60 * 60 * 1000).getTime() :
                new Date(Date.now() + task.duration * 24 * 60 * 60 * 1000 - 24 * 60 * 60 * 1000).getTime()
            return {
                id: task.id.toString(),
                name: `${task.title}`,
                start: formDate(endDate - (task.duration - 1) * 86400000),
                end: formDate(endDate),
                dependencies: task.dependencies,
                progress: 100,
                custom_class: `cc-${color.replace('#', '')}`,
            }
        })

        setLoadedTasks(newTasks)

        injectStyles(roles)
    }, [tasks])

    useEffect(() => {
        const ganttElement = ganttRef.current
        if (!ganttElement || !loadedTasks.length) return

        const handleClick = (event) => {
            const button = event.target.closest('.details-container-button')
            if (button) {
                const taskId = button.getAttribute('data-task-id')
                setViewTaskModal(taskId)

                document.querySelectorAll('.popup-wrapper').forEach(popup => {
                    if (!popup.closest('.gantt')) {
                        popup.remove()
                    }
                })
            }
        }

        ganttElement.addEventListener('click', handleClick)

        return () => ganttElement.removeEventListener('click', handleClick)
    }, [loadedTasks, ganttRef.current])


    useEffect(() => {
        if (!loadedTasks.length) return

        const gantt = new Gantt(ganttRef.current, loadedTasks, {
            on_click: (task) => {
                //console.log("Task clicked:", task)
            },
            on_view_change: (mode) => {
                // console.log("View mode change:", mode)
            },
            custom_popup_html: (task) => {
                const options = {month: 'short', day: '2-digit'}
                const startDate = new Date(task.start)
                const start = startDate.toLocaleDateString('uk-UA', options)

                const endDate = new Date(task.end)
                endDate.setDate(endDate.getDate() + 1)
                const end = endDate.toLocaleDateString('uk-UA', options)

                return `<div class='details-container'>
                <div class="details-container-name">${task.name}</div>
                <div class="details-container-time">Термін: ${start} - ${end}</div>
                <div class="details-container-button" data-task-id="${task.id}">Детальніше</div>
            </div>`
            },
            padding: 10,
            bar_height: 30,
        })

        gantt.change_view_mode('Day')

        const disableDragAndResize = () => {
            const handles = document.querySelectorAll('.handle-group')
            handles.forEach(handle => {
                handle.style.pointerEvents = 'none'
            })

            const bars = document.querySelectorAll('.bar-wrapper')
            bars.forEach(bar => {
                bar.addEventListener('mousedown', (event) => {
                    event.stopPropagation()
                }, true)
            })
        }

        disableDragAndResize()

        const bars = document.querySelectorAll('.bar-wrapper')
        bars.forEach(bar => {
            bar.addEventListener('mouseenter', () => {
                const taskId = bar.getAttribute('data-id')
                highlightArrows(taskId, true)
            })
            bar.addEventListener('mouseleave', () => {
                const taskId = bar.getAttribute('data-id')
                highlightArrows(taskId, false)
            })
        })

        function highlightArrows(taskId, highlight) {
            const arrows = document.querySelectorAll('.arrow path')
            arrows.forEach(arrow => {
                if (arrow.getAttribute('data-from') === taskId || arrow.getAttribute('data-to') === taskId) {
                    if (highlight) {
                        arrow.style.strokeWidth = '3'
                    } else {
                        arrow.style.strokeWidth = ''
                    }
                }
            })
        }
    }, [loadedTasks])

    return <div ref={ganttRef} style={{width: '100%', maxWidth: 'calc(100vw - 370px)'}}/>
}

export default FrappeGantt