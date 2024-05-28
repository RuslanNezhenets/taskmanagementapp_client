import './styles/App.scss'
import AppRouter from "./components/AppRouter"
import {BrowserRouter} from "react-router-dom"
import {useContext, useEffect, useState} from "react"
import {Context} from "./index"
import {check, fetchUser} from "./http/userApi"
import {fetchProjectsByUser} from "./http/boardApi"

function App() {
    const {userStore, board} = useContext(Context)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        check().then(async user => {
            const projects = await fetchProjectsByUser(user.id)
            board.setProjects(projects)

            const fullUser = await fetchUser(user.id)

            userStore.setUser(fullUser)
            userStore.setIsAuth(true)
        }).catch(e => {

        }).finally(() => {
            setIsLoading(false)
        })
    }, [userStore])

    return (
        <div className="App">
            <BrowserRouter>
                {!isLoading && <AppRouter/>}
            </BrowserRouter>
        </div>
    )
}

export default App
