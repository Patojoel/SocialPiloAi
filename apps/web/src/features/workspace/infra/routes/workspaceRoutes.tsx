import { lazy } from 'react'

const WorkspaceSelectPage = lazy(() => import('../ui/pages/WorkspaceSelectPage'))

export const workspaceRouteDefinitions = [{ path: '/workspace-select', element: <WorkspaceSelectPage /> }]
