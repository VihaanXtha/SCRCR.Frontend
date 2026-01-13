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
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <button className={section === 'members' ? 'active' : ''} onClick={() => setSection('members')}>Members</button>
          <button className={section === 'news' ? 'active' : ''} onClick={() => setSection('news')}>News</button>
          <button className={section === 'gallery' ? 'active' : ''} onClick={() => setSection('gallery')}>Gallery</button>
          <button className={section === 'notices' ? 'active' : ''} onClick={() => setSection('notices')}>Notices</button>
          <button className={section === 'memories' ? 'active' : ''} onClick={() => setSection('memories')}>Memories</button>
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
