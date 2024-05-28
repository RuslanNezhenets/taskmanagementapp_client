import React, {useContext} from 'react'
import {ALGORITHM_ROUTE, BOARD_ROUTE, ROLES_ROUTE} from "../../utils/consts"
import {useNavigate} from "react-router-dom"
import {Context} from "../../index"
import {observer} from "mobx-react-lite"
import logo from '../../assets/logo.svg'
import defaultProjectAvatar from '../../assets/defaultProjectAvatar.svg'

const SideBar = observer(() => {
    const {board, userStore} = useContext(Context)
    const navigate = useNavigate()

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <img
                    alt=""
                    src={logo}
                    width="150"
                    height="150"
                    className="sidebar-logo-img"
                    onClick={() => navigate(BOARD_ROUTE)}
                />
            </div>
            <div className="sidebar_project d-flex align-items-center">
                <img src={defaultProjectAvatar} alt="Icon" className="sidebar_project_img"/>
                <div className="sidebar_project_text">
                    <div className="sidebar_project_name">{board.activeProject?.name || 'Не обрано'}</div>
                    <div className="sidebar_project_description">{board.activeProject?.description}</div>
                </div>
            </div>
            <div className="sidebar-item" onClick={() => navigate(BOARD_ROUTE)}>Дошка</div>
            {userStore.isAdmin && <div className="sidebar-item" onClick={() => navigate(ROLES_ROUTE)}>Ролі</div>}
            <div className="sidebar-item" onClick={() => navigate(ALGORITHM_ROUTE)}>План виконання задач</div>
        </div>
    )
})

export default SideBar