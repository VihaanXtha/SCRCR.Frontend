import type { Member } from '../types/members'

type EnvMeta = { env?: { VITE_API_BASE?: string } }
const base = (import.meta as unknown as EnvMeta).env?.VITE_API_BASE || 'https://scrcr-backend.vercel.app'

/**
 * Fetches members of a specific type (e.g., Founding, Lifetime).
 * @param type - The category of members to fetch.
 */
export async function fetchMembers(type: 'Founding' | 'Lifetime' | 'Senior-Citizen' | 'donation' | 'helper'): Promise<Member[]> {
  const res = await fetch(`${base}/api/members/${type}`)
  if (!res.ok) throw new Error('Failed to fetch members')
  return res.json()
}

// Helper to get admin token for authorized requests
function getToken(): string | undefined {
  try {
    return localStorage.getItem('adminToken') ?? undefined
  } catch {
    return undefined
  }
}

/**
 * Updates an existing member's information.
 * Requires admin authentication.
 */
export async function updateMember(id: string, body: Partial<Member>): Promise<Member> {
  const res = await fetch(`${base}/api/members/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { 'x-admin-token': getToken()! } : {})
    },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error('Failed to update member')
  return res.json()
}

export async function deleteMember(id: string): Promise<Member> {
  const res = await fetch(`${base}/api/members/${id}`, {
    method: 'DELETE',
    headers: {
      ...(getToken() ? { 'x-admin-token': getToken()! } : {})
    }
  })
  if (!res.ok) throw new Error('Failed to delete member')
  return res.json()
}

export async function createMember(member: Omit<Member, '_id'> & { type: 'Founding' | 'Lifetime' | 'Senior-Citizen' | 'donation' | 'helper' }): Promise<Member> {
  const res = await fetch(`${base}/api/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { 'x-admin-token': getToken()! } : {})
    },
    body: JSON.stringify(member)
  })
  if (!res.ok) throw new Error('Failed to create member')
  return res.json()
}

export async function reorderMembers(updates: { id: string; rank: number }[]): Promise<void> {
  const res = await fetch(`${base}/api/members/reorder`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { 'x-admin-token': getToken()! } : {})
    },
    body: JSON.stringify({ updates })
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to reorder members')
  }
  return res.json()
}
