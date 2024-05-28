import React, {createContext} from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import BoardStore from "./store/BoardStore"
import UserStore from "./store/UserStore"
import {WebSocketProvider} from "./utils/webSocketContext"

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
    <Context.Provider value={{
        board: new BoardStore(),
        userStore: new UserStore(),
    }}>
        <WebSocketProvider>
            <App/>
        </WebSocketProvider>
    </Context.Provider>
)
