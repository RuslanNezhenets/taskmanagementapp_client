import {
    ACCESS_ROUTE,
    ALGORITHM_ROUTE,
    BOARD_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE, PROJECT_SETTINGS_ROUTE, PROJECTS_ROUTE, REGISTRATION_ROUTE, ROLES_ROUTE,
} from "./utils/consts"
import Board from "./pages/Board"
import Profile from "./pages/Profile"
import Auth from "./pages/Auth"
import Algorithm from "./pages/Algorithm"
import Roles from "./pages/Roles"
import Projects from "./pages/Projects"
import Access from "./pages/Access"
import ProjectSettings from "./pages/ProjectSettings"

export const publicRoutes = [
    {path: LOGIN_ROUTE, Component: Auth},
    {path: REGISTRATION_ROUTE, Component: Auth},
]

export const authRoutes = [
    {path: BOARD_ROUTE, Component: Board, includeSidebar: true, includeNavbar: true},
    {path: ROLES_ROUTE, Component: Roles, includeSidebar: true, includeNavbar: true},
    {path: ALGORITHM_ROUTE, Component: Algorithm, includeSidebar: true, includeNavbar: true},
    {path: PROFILE_ROUTE, Component: Profile, includeSidebar: false, includeNavbar: true},
    {path: PROJECTS_ROUTE, Component: Projects, includeSidebar: false, includeNavbar: true},
    {path: PROJECT_SETTINGS_ROUTE + '/:projectId', Component: ProjectSettings, includeSidebar: false, includeNavbar: true},
    {path: ACCESS_ROUTE + '/:projectId', Component: Access, includeSidebar: false, includeNavbar: true},
]