import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axiosClient from '../api/axiosClient'
import { useAuthStore } from '../stores/authStore'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import AppsGrid from '../components/views/AppsGrid'
import UsersTable from '../components/views/UsersTable'
import UserFormDrawer from '../components/views/UserFormDrawer'
import AppFormDrawer from '../components/views/AppFormDrawer'

export default function Dashboard() {
  const navigate = useNavigate()
  const { auth, logout } = useAuthStore()
  
  const [view, setView] = useState('apps')
  const [apps, setApps] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [isSavingUser, setIsSavingUser] = useState(false)

  const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false)
  const [editingApp, setEditingApp] = useState(null)
  const [isSavingApp, setIsSavingApp] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, usersRes] = await Promise.all([
          axiosClient.get('/apps'),
          axiosClient.get('/users')
        ])
        setApps(appsRes.data)
        setUsers(usersRes.data)
      } catch (error) {
        console.error('[ERRO API]', error)
        toast.error('Falha ao carregar dados do sistema.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleToggleAppKillSwitch = async (id, currentStatus) => {
    setApps(apps.map(app => app.id === id ? { ...app, isActive: !currentStatus } : app))
    try {
      await axiosClient.put(`/apps/${id}/toggle`, { isActive: !currentStatus })
      toast.success(!currentStatus ? 'Comunicação restaurada.' : 'Conexão cortada. App em quarentena.', {
        icon: !currentStatus ? '🟢' : '🛑',
        theme: 'dark'
      })
    } catch (error) {
      console.error('[ERRO API]', error)
      setApps(apps.map(app => app.id === id ? { ...app, isActive: currentStatus } : app))
      toast.error('Erro ao acionar o protocolo de segurança.')
    }
  }

  const handleToggleUserStatus = async (id, currentStatus) => {
    setUsers(users.map(u => u.id === id ? { ...u, isActive: !currentStatus } : u))
    try {
      await axiosClient.put(`/users/${id}/toggle`, { isActive: !currentStatus })
      toast.success(!currentStatus ? 'Acesso concedido.' : 'Acesso revogado.', {
        icon: !currentStatus ? '🟢' : '🛑',
        theme: 'dark'
      })
    } catch (error) {
      console.error('[ERRO API]', error)
      setUsers(users.map(u => u.id === id ? { ...u, isActive: currentStatus } : u))
      toast.error('Erro ao atualizar usuário.')
    }
  }

  const openUserDrawerForNew = () => {
    setEditingUser(null)
    setIsUserDrawerOpen(true)
  }

  const openUserDrawerForEdit = (user) => {
    setEditingUser(user)
    setIsUserDrawerOpen(true)
  }

  const handleSaveUser = async (userData) => {
    setIsSavingUser(true)
    try {
      if (editingUser) {
        const response = await axiosClient.put(`/users/${editingUser.id}`, userData)
        setUsers(users.map(u => u.id === editingUser.id ? response.data : u))
        toast.success('Usuário atualizado com sucesso.')
      } else {
        const response = await axiosClient.post('/users', userData)
        setUsers([response.data, ...users])
        toast.success('Novo usuário criado com sucesso.')
      }
      setIsUserDrawerOpen(false)
    } catch (error) {
      console.error('[ERRO API]', error)
      toast.error(error.response?.data?.error || 'Falha ao salvar usuário.')
    } finally {
      setIsSavingUser(false)
    }
  }

  const openAppDrawerForNew = () => {
    setEditingApp(null)
    setIsAppDrawerOpen(true)
  }

  const openAppDrawerForEdit = (app) => {
    setEditingApp(app)
    setIsAppDrawerOpen(true)
  }

  const handleSaveApp = async (appData) => {
    setIsSavingApp(true)
    const formData = new FormData()
    formData.append('name', appData.name)
    formData.append('description', appData.description)
    formData.append('url', appData.url)
    formData.append('color', appData.color)
    formData.append('status', appData.status)
    if (appData.logoFile) {
      formData.append('logo', appData.logoFile)
    }

    try {
      if (editingApp) {
        const response = await axiosClient.put(`/apps/${editingApp.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setApps(apps.map(a => a.id === editingApp.id ? response.data : a))
        toast.success('Aplicativo atualizado com sucesso.')
      } else {
        const response = await axiosClient.post('/apps', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setApps([...apps, response.data])
        toast.success('Aplicativo adicionado ao cofre.')
      }
      setIsAppDrawerOpen(false)
    } catch (error) {
      console.error('[ERRO API]', error)
      toast.error(error.response?.data?.error || 'Falha ao salvar aplicativo.')
    } finally {
      setIsSavingApp(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(148,163,184,0.05),transparent_50%),linear-gradient(135deg,#050505_0%,#0f1115_100%)]" />

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        view={view} 
        setView={setView} 
        username={auth?.username} 
        onLogout={handleLogout} 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />

      <main className="relative flex min-w-0 flex-1 flex-col">
        <Topbar 
          setIsSidebarOpen={setIsSidebarOpen} 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />

        <div className="custom-scrollbar flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-white" />
            </div>
          ) : view === 'apps' ? (
            <AppsGrid 
              apps={apps} 
              searchTerm={searchTerm} 
              onToggleApp={handleToggleAppKillSwitch} 
              onAddApp={openAppDrawerForNew} 
              onEditApp={openAppDrawerForEdit}
            />
          ) : (
            <UsersTable 
              users={users} 
              searchTerm={searchTerm} 
              onToggleUser={handleToggleUserStatus} 
              onAddUser={openUserDrawerForNew}
              onEditUser={openUserDrawerForEdit}
            />
          )}
        </div>
      </main>

      <UserFormDrawer 
        isOpen={isUserDrawerOpen}
        onClose={() => setIsUserDrawerOpen(false)}
        onSave={handleSaveUser}
        userToEdit={editingUser}
        isSaving={isSavingUser}
      />

      <AppFormDrawer
        isOpen={isAppDrawerOpen}
        onClose={() => setIsAppDrawerOpen(false)}
        onSave={handleSaveApp}
        appToEdit={editingApp}
        isSaving={isSavingApp}
      />
    </div>
  )
}