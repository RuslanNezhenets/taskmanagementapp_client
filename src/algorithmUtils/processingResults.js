const processingResults = (solution, tasks, taskDependencies) => {
    const plannedTasksResult = tasks.map(task => {
        task.endDate = solution.find(t => t.id === task.id).deadline * 1000 * 3600 * 24
        task.startDate = (solution.find(t => t.id === task.id).deadline - task.duration) * 1000 * 3600 * 24
        return task
    })

    return plannedTasksResult.map(task => {
        const dependencies = taskDependencies
            .filter(dep => dep.dependentTaskId === task.id)
            .map(dep => dep.taskId).join(', ')
        return {...task, dependencies: dependencies}
    })
}

module.exports = processingResults