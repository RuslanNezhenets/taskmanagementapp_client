import {$authHost, $host} from "./index"
import {jwtDecode} from 'jwt-decode'

export const registration = async (email, password) => {
    const {data} = await $host.post('api/user/registration', {email, password})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const login = async (email, password) => {
    const {data} = await $host.post('api/user/login', {email, password})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const fetchUsersByProject = async (projectId) => {
    const {data} = await $host.get('api/user/project/' + projectId)
    data.forEach(user => {
        if (user.avatar && user.avatar.data && user.avatarMimeType) {
            const blob = new Blob([new Uint8Array(user.avatar.data)], {type: user.avatarMimeType})
            user.avatar = URL.createObjectURL(blob)
        }
    })
    return data
}

export const fetchUsersByEmail = async (email) => {
    const {data} = await $host.get('api/user?email=' + email)
    data.forEach(user => {
        if (user.avatar && user.avatar.data && user.avatarMimeType) {
            const blob = new Blob([new Uint8Array(user.avatar.data)], {type: user.avatarMimeType})
            user.avatar = URL.createObjectURL(blob)
        }
    })
    return data
}

export const fetchUser = async (id) => {
    const {data} = await $host.get('api/user/' + id)
    if (data.avatar && data.avatar.data && data.avatarMimeType) {
        const blob = new Blob([new Uint8Array(data.avatar.data)], {type: data.avatarMimeType})
        data.avatar = URL.createObjectURL(blob)
    }
    return data
}

export const updateUser = async (user, avatarFile, mimeType) => {
    const formData = new FormData()

    for (const key in user) {
        if (key !== 'avatar') {
            formData.append(key, user[key])
        }
    }

    if (avatarFile) {
        formData.append('avatar', avatarFile, avatarFile.name)
        formData.append('mimeType', mimeType)
    }

    const {data} = await $host.put('api/user', formData)
    if (data.avatar && data.avatar.data && data.avatarMimeType) {
        const blob = new Blob([new Uint8Array(data.avatar.data)], {type: data.avatarMimeType})
        data.avatar = URL.createObjectURL(blob)
    }
    return data
}


export const deleteUser = async (id) => {
    const {data} = await $host.delete('api/user/' + id)
    return data
}

