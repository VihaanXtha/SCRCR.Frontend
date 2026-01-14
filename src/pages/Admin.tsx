import { useState } from 'react'
import AdminLogin from '../admin/AdminLogin'
import AdminMembers from '../admin/AdminMembers'
import AdminNews from '../admin/AdminNews'
import AdminGallery from '../admin/AdminGallery'
import AdminNotices from '../admin/AdminNotices'
import AdminMemories from '../admin/AdminMemories'
import '../admin/admin.css'

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState<boolean>(() => {
    try { return !!localStorage.getItem('adminToken') } catch { return false }
  })
  
  const [section, setSection] = useState<'members' | 'news' | 'gallery' | 'memories' | 'notices'>('members')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const onLogin = (token: string) => {
    localStorage.setItem('adminToken', token)
    setLoggedIn(true)
  }

  const onLogout = () => {
    localStorage.removeItem('adminToken')
    setLoggedIn(false)
  }

  if (!loggedIn) {
    return <AdminLogin onLogin={onLogin} />
  }

  return (
    <div className="admin-page">
      <button className="admin-toggle" onClick={() => setSidebarOpen(true)}>☰</button>
      
      {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Admin Panel</h2>
            <button className="admin-close-sidebar" onClick={() => setSidebarOpen(false)}>×</button>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button className={section === 'members' ? 'active' : ''} onClick={() => { setSection('members'); setSidebarOpen(false); }}>Members</button>
          <button className={section === 'news' ? 'active' : ''} onClick={() => { setSection('news'); setSidebarOpen(false); }}>News</button>
          <button className={section === 'gallery' ? 'active' : ''} onClick={() => { setSection('gallery'); setSidebarOpen(false); }}>Gallery</button>
          <button className={section === 'notices' ? 'active' : ''} onClick={() => { setSection('notices'); setSidebarOpen(false); }}>Notices</button>
          <button className={section === 'memories' ? 'active' : ''} onClick={() => { setSection('memories'); setSidebarOpen(false); }}>Memories</button>
        </nav>
        <div className="sidebar-footer">
          <button onClick={() => window.location.hash = '/'} style={{ marginBottom: 8, background: '#34495e' }}>Back to Home</button>
          <button onClick={onLogout}>Logout</button>
        </div>
      </aside>

      <main className="admin-content">
        {section === 'members' && <AdminMembers />}
        {section === 'news' && <AdminNews />}
        {section === 'gallery' && <AdminGallery />}
        {section === 'notices' && <AdminNotices />}
        {section === 'memories' && <AdminMemories />}
      </main>
    </div>
  )
}
