import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950">
      <Sidebar />

      {/* Push content right of the fixed sidebar on desktop */}
      <div className="flex flex-1 flex-col overflow-hidden md:pl-72">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
