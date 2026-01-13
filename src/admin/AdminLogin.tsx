import { useState } from 'react'

interface AdminLoginProps {
  onLogin: (token: string) => void
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('vihaan')
  const [password, setPassword] = useState('doramon12')
  
  type EnvMeta = { env?: { VITE_API_BASE?: string } }
  const base = (import.meta as unknown as EnvMeta).env?.VITE_API_BASE || 'http://localhost:8081'

  const login = async () => {
    try {
      const res = await fetch(base + '/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      if (!res.ok) throw new Error('bad')
      const data = await res.json()
      onLogin(data.token)
    } catch {
      alert('Login failed')
    }
  }

  return (
    <div className="page">
      <section className="section">
        <h3>Admin Login</h3>
        <form className="form" onSubmit={e => { e.preventDefault(); login() }}>
          <div className="form-row">
            <input 
              placeholder="Username" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
          </div>
          <button className="btn">Login</button>
        </form>
      </section>
    </div>
  )
}
