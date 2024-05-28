import {makeAutoObservable} from "mobx"
import {updateTask} from "../http/boardApi"

export default class BoardStore {
    constructor() {
        this._tasks = []
        this._columns = []
        this._users = []
        this._roles = []
        this._projects = []
        this._dependencies = []
        this._userProjects = []

        this._activeTask = null
        this._activeProject = {}
        makeAutoObservable(this)
    }

    // ========== Tasks ==========

    get activeTask() {
        return this._activeTask
    }

    setActiveTask(task) {
        this._activeTask = task
    }

    get tasks() {
        return this._tasks.slice().sort((a, b) => {
            if (a.columnId === b.columnId) {
                return a.position - b.position
            }
            return a.columnId - b.columnId
        })
    }

    setTasks(tasks) {
        this._tasks = tasks
    }

    addTask(newTask) {
        this._tasks.push(newTask)
    }

    updateTask(updatedTask) {
        const index = this._tasks.findIndex(task => task.id === updatedTask.id)
        if (index !== -1) {
            this._tasks[index] = updatedTask
        }
    }

    deleteTask(taskId) {
        const taskToDelete = this._tasks.find(task => task.id === taskId)
        if (!taskToDelete) return

        const deletePosition = taskToDelete.position

        this._tasks = this._tasks.filter(task => task.id !== taskId)

        this._tasks = this._tasks.map(task => {
            if (task.position > deletePosition) {
                return {...task, position: task.position - 1}
            }
            return task
        })
    }

    moveTask(taskId, newColumnId, newPosition) {
        const task = this._tasks.find(task => task.id === taskId)

        if (!newPosition) {
            const maxPosition = this._tasks.filter(task => task.columnId === newColumnId).reduce((max, obj) => {
                return obj.position > max ? obj.position : max
            }, 0)
            newPosition = maxPosition + 1
        }

        if (!task) return

        if (task.columnId !== newColumnId) {
            this._tasks
                .filter(t => t.columnId === task.columnId && t.position > task.position)
                .forEach(t => t.position--)
            this._tasks
                .filter(t => t.columnId === newColumnId && t.position >= newPosition)
                .forEach(t => t.position++)
        } else {
            if (task.position > newPosition) {
                this._tasks
                    .filter(t => t.columnId === newColumnId && t.position < task.position && t.position >= newPosition)
                    .forEach(t => t.position++)
            } else {
                this._tasks
                    .filter(t => t.columnId === newColumnId && t.position > task.position && t.position <= newPosition)
                    .forEach(t => t.position--)
            }
        }

        task.columnId = newColumnId
        task.position = newPosition

        updateTask(task).then()
    }

    get tasksByColumnId() {
        return this.columns.reduce((acc, column) => {
            acc[column.id] = this.tasks.filter(task => task.columnId === column.id)
            return acc
        }, {})
    }

    // ========== Columns ==========

    get columns() {
        return this._columns.slice().sort((a, b) => a.position - b.position)
    }

    getColumnById(columnId) {
        return this._columns.find(column => column.id === columnId) || null
    }

    setColumns(columns) {
        this._columns = columns
    }

    addColumn(column) {
        this._columns.push(column)
    }

    updateColumn(updatedColumn) {
        const index = this._columns.findIndex(column => column.id === updatedColumn.id)
        if (index !== -1) {
            this._columns[index] = updatedColumn
        }
    }

    deleteColumn(columnId) {
        const columnToDelete = this._columns.find(column => column.id === columnId)
        if (!columnToDelete) return

        const deletePosition = columnToDelete.position

        this._columns = this._columns.filter(column => column.id !== columnId)

        this._columns = this._columns.map(column => {
            if (column.position > deletePosition) {
                return {...column, position: column.position - 1}
            }
            return column
        })
    }

    // ========== Users ==========

    get users() {
        return this._users
    }

    getUserById(userId) {
        return this._users.find(user => user.id === userId) || null
    }

    setUsers(users) {
        this._users = users
    }

    updateUser(updatedUser) {
        const index = this._users.findIndex(user => user.id === updatedUser.id)
        if (index !== -1) {
            this._users[index] = updatedUser
        }
    }

    addUser(user) {
        this._users.push(user)
    }

    deleteUser(userId) {
        this._users = this._users.filter(user => user.id !== userId)
    }

    // ========== Role ==========

    get roles() {
        return this._roles
    }

    setRoles(roles) {
        this._roles = roles
    }

    updateRole(updatedRole) {
        const index = this._roles.findIndex(role => role.id === updatedRole.id)
        if (index !== -1) {
            this._roles[index] = updatedRole
        }
    }

    addRole(role) {
        this._roles.push(role)
    }

    deleteRole(id) {
        this._roles = this._roles.filter(role => role.id !== id)
    }

    // ========== Project ==========

    get activeProject() {
        return this._activeProject
    }

    setActiveProject(project) {
        this._activeProject = project
    }

    get projects() {
        return this._projects
    }

    setProjects(projects) {
        this._projects = projects
    }

    addProject(newProject) {
        this._projects.push(newProject)
    }

    updateProject(updatedProject) {
        const index = this._projects.findIndex(project => project.id === updatedProject.id)
        if (index !== -1) {
            this._projects[index] = updatedProject
        }
    }

    deleteProject(id) {
        this._projects = this._projects.filter(project => project.id !== id)
    }

    // ========== Project ==========

    get dependencies() {
        return this._dependencies
    }

    setDependencies(dependencies) {
        this._dependencies = dependencies
    }

    // ========== UserProjects ========

    get userProjects() {
        return this._userProjects
    }

    setUserProjects(userProjects) {
        this._userProjects = userProjects
    }

    addUserProjects(userProjects) {
        this._userProjects.push(userProjects)
    }
}