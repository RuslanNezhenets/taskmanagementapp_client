import {$authHost} from "./index"

// ========== Task ==========

export const createTask = async (newCard) => {
    const {data} = await $authHost.post('api/task', newCard)
    return data
}

export const fetchTasks = async () => {
    const {data} = await $authHost.get('api/task')
    return data
}

export const fetchTasksByProject = async (projectId) => {
    const {data} = await $authHost.get('api/task?projectId=' + projectId)
    return data
}

export const fetchTasksByUser = async (userId) => {
    const {data} = await $authHost.get('api/task?executorId=' + userId)
    return data
}

export const fetchTask = async (id) => {
    const {data} = await $authHost.get('api/task/' + id)
    return data
}

export const updateTask = async (task) => {
    const {data} = await $authHost.put('api/task', task)
    return data
}

export const updateTasks = async (tasks) => {
    const {data} = await $authHost.put('api/task/bulk', tasks)
    return data
}

export const deleteTask = async (id) => {
    const {data} = await $authHost.delete('api/task/' + id)
    return data
}

// ========== Task Dependency ==========

export const createDependency = async (newDependency) => {
    const {data} = await $authHost.post('api/dependency', newDependency)
    return data
}

export const fetchDependencies = async () => {
    const {data} = await $authHost.get('api/dependency')
    return data
}

export const fetchDependenciesByProject = async (projectId) => {
    const {data} = await $authHost.get('api/dependency?projectId=' + projectId)
    return data
}


export const deleteDependency = async (id) => {
    const {data} = await $authHost.delete('api/dependency/' + id)
    return data
}

// ========== Column ==========

export const createColumn = async (newColumn) => {
    const {data} = await $authHost.post('api/column', newColumn)
    return data
}

export const fetchColumns = async (projectId) => {
    const {data} = await $authHost.get('api/column' + (projectId && `?projectId=${projectId}`))
    return data
}

export const fetchColumn = async (id) => {
    const {data} = await $authHost.get('api/column/' + id)
    return data
}

export const updateColumn = async (column) => {
    const {data} = await $authHost.put('api/column', column)
    return data
}

export const deleteColumn = async (id) => {
    const {data} = await $authHost.delete('api/column/' + id)
    return data
}

// ========== Role ==========

export const createRole = async (role) => {
    const {data} = await $authHost.post('api/role', role)
    return data
}

export const fetchRoles = async () => {
    const {data} = await $authHost.get('api/role')
    return data
}

export const fetchRolesByProject = async (projectId) => {
    const {data} = await $authHost.get('api/role?projectId=' + projectId)
    return data
}

export const fetchRole = async (id) => {
    const {data} = await $authHost.get('api/role/' + id)
    return data
}

export const updateRole = async (role) => {
    const {data} = await $authHost.put('api/role', role)
    return data
}

export const deleteRole = async (id) => {
    const {data} = await $authHost.delete('api/role/' + id)
    return data
}

// ========== Project ==========

export const createProject = async (project) => {
    const {data} = await $authHost.post('api/project', project)
    return data
}

export const fetchProjects = async () => {
    const {data} = await $authHost.get('api/project')
    return data
}

export const fetchProject = async (id) => {
    const {data} = await $authHost.get('api/project/' + id)
    return data
}

export const fetchProjectsByUser = async (userId) => {
    const {data} = await $authHost.get('api/project/user/' + userId)
    return data
}

export const updateProject = async (project) => {
    const {data} = await $authHost.put('api/project', project)
    return data
}

export const deleteProject = async (id) => {
    const {data} = await $authHost.delete('api/project/' + id)
    return data
}

// ========== UserProject ==========

export const createUserProject = async (userProject) => {
    const {data} = await $authHost.post('api/userProject', userProject)
    return data
}

export const fetchUserProjects = async () => {
    const {data} = await $authHost.get('api/userProject')
    return data
}

export const fetchUserByProject = async (projectId) => {
    const {data} = await $authHost.get('api/userProject?projectId=' + projectId)
    return data
}

export const fetchUserProjectsByUser = async (userId) => {
    const {data} = await $authHost.get('api/userProject?userId=' + userId)
    return data
}

export const fetchUserProject = async (projectId, userId) => {
    const {data} = await $authHost.get('api/userProject?projectId=' + projectId + '&userId=' + userId)
    return data
}

export const updateUserProject = async (userProject) => {
    const {data} = await $authHost.put('api/userProject', userProject)
    return data
}

export const deleteUserProject = async (id) => {
    const {data} = await $authHost.delete('api/userProject/' + id)
    return data
}

// ========== Access ==========

export const fetchAccesses = async () => {
    const {data} = await $authHost.get('api/access')
    return data
}

// ========== MatLab ==========

export const checkMatlab = async () => {
    const {data} = await $authHost.get('api/matlab/check', )
    return data
}

export const startMatlab = async (variables) => {
    const {data} = await $authHost.post('api/matlab/start', variables)
    return data
}

export const checkResult = async (clientId) => {
    const {data} = await $authHost.get('api/matlab/result?clientId=' + clientId)
    return data
}