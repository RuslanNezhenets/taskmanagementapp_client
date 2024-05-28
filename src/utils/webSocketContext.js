import React, {createContext, useContext, useEffect, useState} from 'react'
import {v4 as uuidv4} from 'uuid'

const WebSocketContext = createContext({
    webSocket: null,
    clientId: null,
    messages: [],
    send: () => {
    },
    status: 'disconnected'
})

export const WebSocketProvider = ({children}) => {
    const [webSocket, setWebSocket] = useState(null)
    const [clientId, setClientId] = useState(() => {
        const savedClientId = localStorage.getItem('clientId')
        if (savedClientId) {
            return savedClientId
        } else {
            const newClientId = uuidv4()
            localStorage.setItem('clientId', newClientId)
            return newClientId
        }
    })
    const [messages, setMessages] = useState([])
    const [status, setStatus] = useState('disconnected')

    useEffect(() => {
        const ws = new WebSocket(process.env.REACT_APP_API_URL.replace('http', 'ws'))

        ws.onopen = () => {
            console.log('WebSocket connection established')
            setStatus('connected')
            ws.send(JSON.stringify({type: 'register', clientId}))
        }

        ws.onmessage = (event) => {
            alert('Надійшли результати алгоритму!')
            setMessages(prev => [...prev, event.data])
        }

        ws.onerror = (error) => {
            console.error('WebSocket error:', error)
            setStatus('error')
        }

        ws.onclose = () => {
            console.log('WebSocket connection closed')
            setStatus('disconnected')
        }

        setWebSocket(ws)

        return () => {
            ws.close()
        }
    }, [clientId])

    const send = message => {
        if (webSocket && status === 'connected') {
            webSocket.send(JSON.stringify({...message, clientId}))
        }
    }

    return (
        <WebSocketContext.Provider value={{webSocket, clientId, messages, send, status}}>
            {children}
        </WebSocketContext.Provider>
    )
}

export const useWebSocket = () => useContext(WebSocketContext)
