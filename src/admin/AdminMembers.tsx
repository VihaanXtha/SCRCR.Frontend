import { useEffect, useState } from 'react'
import type { Member } from '../types/members'
import { fetchMembers, updateMember, deleteMember, createMember, reorderMembers } from '../services/members'
import { uploadImage } from '../services/content'

export default function AdminMembers() {
  const [type, setType] = useState<'Founding' | 'Lifetime' | 'Senior-Citizen' | 'donation' | 'helper'>('Founding')
  const [members, setMembers] = useState<Member[]>([])
  const [editing, setEditing] = useState<Member | null>(null)
  const [creating, setCreating] = useState<Omit<Member, '_id'> & { type: 'Founding' | 'Lifetime' | 'Senior-Citizen' | 'donation' | 'helper' }>({
    name: '',
    img: '',
    details: {},
    type: 'Founding'
  })

  // Drag state
  const [draggedItem, setDraggedItem] = useState<Member | null>(null)

  useEffect(() => {
    fetchMembers(type).then(setMembers).catch(() => setMembers([]))
  }, [type])

  const onSave = async () => {
    if (!editing || !editing._id) return
    try {
      const updated = await updateMember(editing._id, editing)
      setMembers(ms => ms.map(m => m._id === updated._id ? updated : m))
      setEditing(null)
    } catch {
      alert('Update failed. Are you authorized?')
    }
  }

  const onDelete = async (m: Member) => {
    if (!m._id) return
    try {
      await deleteMember(m._id)
      setMembers(ms => ms.filter(x => x._id !== m._id))
    } catch {
      alert('Delete failed. Are you authorized?')
    }
  }

  const onCreate = async () => {
    try {
      const created = await createMember(creating)
      if (created.type === type) setMembers(ms => [...ms, created]) // Add to end now
      setCreating({ name: '', img: '', details: {}, type })
    } catch {
      alert('Create failed. Are you authorized?')
    }
  }

  // Drag Handlers
  const onDragStart = (e: React.DragEvent, member: Member) => {
    setDraggedItem(member)
    e.dataTransfer.effectAllowed = 'move'
    // Optional: set ghost image
  }

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    const draggedOverItem = members[index]
    if (draggedItem === draggedOverItem) return
    
    // Reorder locally
    const items = members.filter(item => item !== draggedItem)
    items.splice(index, 0, draggedItem!)
    setMembers(items)
  }

  const onDragEnd = async () => {
    setDraggedItem(null)
    const updates = members.map((m, i) => ({ id: m._id!, rank: i })).filter(u => u.id)
    try {
      await reorderMembers(updates)
    } catch (e: any) {
      console.error(e)
      alert(e.message || 'Failed to save order')
    }
  }

  return (
    <div className="admin-section">
      <h3>Manage Members</h3>
      <div className="tabs">
        <button className={`tab ${type === 'Founding' ? 'active' : ''}`} onClick={() => setType('Founding')}>Founding</button>
        <button className={`tab ${type === 'Lifetime' ? 'active' : ''}`} onClick={() => setType('Lifetime')}>Lifetime</button>
        <button className={`tab ${type === 'Senior-Citizen' ? 'active' : ''}`} onClick={() => setType('Senior-Citizen')}>Senior-Citizen Citizen</button>
        <button className={`tab ${type === 'donation' ? 'active' : ''}`} onClick={() => setType('donation')}>Donation</button>
        <button className={`tab ${type === 'helper' ? 'active' : ''}`} onClick={() => setType('helper')}>Helping</button>
      </div>

      <div className="admin-grid">
        <div className="form-card">
          <h4>Add New Member</h4>
          <input 
            placeholder="Name" 
            value={creating.name} 
            onChange={e => setCreating({ ...creating, name: e.target.value })} 
          />
          <div className="form-group">
            <label>Image</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={async e => {
                if (e.target.files?.[0]) {
                  try {
                    const { url } = await uploadImage(e.target.files[0])
                    setCreating({ ...creating, img: url })
                  } catch {
                    alert('Upload failed')
                  }
                }
              }} 
            />
            {creating.img && <img src={creating.img} alt="Preview" style={{ height: 60, marginTop: 5, objectFit: 'cover' }} />}
          </div>
          <>
            <input 
              placeholder="Occupation" 
              value={creating.details?.occupation || ''} 
              onChange={e => setCreating({ ...creating, details: { ...creating.details, occupation: e.target.value } })} 
            />
            <input 
              placeholder="Phone" 
              value={creating.details?.phone || ''} 
              onChange={e => setCreating({ ...creating, details: { ...creating.details, phone: e.target.value } })} 
            />
            <input 
              placeholder="Email" 
              value={creating.details?.email || ''} 
              onChange={e => setCreating({ ...creating, details: { ...creating.details, email: e.target.value } })} 
            />
            <input 
              placeholder="Permanent Address" 
              value={creating.details?.permanentAddress || ''} 
              onChange={e => setCreating({ ...creating, details: { ...creating.details, permanentAddress: e.target.value } })} 
            />
            <input 
              placeholder="Temporary Address" 
              value={creating.details?.temporaryAddress || ''} 
              onChange={e => setCreating({ ...creating, details: { ...creating.details, temporaryAddress: e.target.value } })} 
            />
            <input 
              placeholder="Date of Birth" 
              value={creating.details?.dateOfBirth || ''} 
              onChange={e => setCreating({ ...creating, details: { ...creating.details, dateOfBirth: e.target.value } })} 
            />
            <input 
              placeholder="Father's Name" 
              value={creating.details?.father || ''} 
              onChange={e => setCreating({ ...creating, details: { ...creating.details, father: e.target.value } })} 
            />
            <input 
              placeholder="Mother's Name" 
              value={creating.details?.mother || ''} 
              onChange={e => setCreating({ ...creating, details: { ...creating.details, mother: e.target.value } })} 
            />
            <input 
              placeholder="Grandfather's Name" 
              value={creating.details?.grandfather || ''} 
              onChange={e => setCreating({ ...creating, details: { ...creating.details, grandfather: e.target.value } })} 
            />
            <input 
              placeholder="Grandmother's Name" 
              value={creating.details?.grandmother || ''} 
              onChange={e => setCreating({ ...creating, details: { ...creating.details, grandmother: e.target.value } })} 
            />
            <input 
              placeholder="Spouse" 
              value={creating.details?.spouse || ''} 
              onChange={e => setCreating({ ...creating, details: { ...creating.details, spouse: e.target.value } })} 
            />
            <input 
              placeholder="Donation Amount" 
              value={creating.details?.donationAmount || ''} 
              onChange={e => setCreating({ ...creating, details: { ...creating.details, donationAmount: e.target.value } })} 
            />
          </>
          <button className="btn sm" onClick={onCreate}>Create</button>
        </div>

        <div className="list-card">
          <h4>Member List</h4>
          {members.map((m, index) => (
            <div 
              key={m._id} 
              className="list-item"
              draggable={!editing}
              onDragStart={(e) => onDragStart(e, m)}
              onDragOver={(e) => onDragOver(e, index)}
              onDragEnd={onDragEnd}
              style={{ cursor: editing ? 'default' : 'move', opacity: draggedItem === m ? 0.5 : 1 }}
            >
              {editing?._id === m._id ? (
                <div className="edit-form">
                  <input value={editing?.name || ''} onChange={e => setEditing({ ...editing!, name: e.target.value })} />
                  <select value={editing?.type || ''} onChange={e => setEditing({ ...editing!, type: e.target.value as 'Founding' | 'Lifetime' | 'Senior-Citizen' | 'donation' | 'helper' })}>
                    <option value="Founding">Founding</option>
                    <option value="Lifetime">Lifetime</option>
                    <option value="Senior-Citizen">Senior-Citizen</option>
                    <option value="donation">Donation</option>
                    <option value="helper">Helping</option>
                  </select>
                  <div className="form-group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={async e => {
                        if (e.target.files?.[0]) {
                          try {
                            const { url } = await uploadImage(e.target.files[0])
                            setEditing({ ...editing!, img: url })
                          } catch {
                            alert('Upload failed')
                          }
                        }
                      }} 
                    />
                    {editing?.img && <img src={editing.img} alt="Preview" style={{ height: 40, marginTop: 5 }} />}
                  </div>
                  <input placeholder="Occupation" value={editing?.details?.occupation || ''} onChange={e => setEditing({ ...editing!, details: { ...(editing?.details || {}), occupation: e.target.value } })} />
                  <input placeholder="Phone" value={editing?.details?.phone || ''} onChange={e => setEditing({ ...editing!, details: { ...(editing?.details || {}), phone: e.target.value } })} />
                  <input placeholder="Email" value={editing?.details?.email || ''} onChange={e => setEditing({ ...editing!, details: { ...(editing?.details || {}), email: e.target.value } })} />
                  <input placeholder="Permanent Address" value={editing?.details?.permanentAddress || ''} onChange={e => setEditing({ ...editing!, details: { ...(editing?.details || {}), permanentAddress: e.target.value } })} />
                  <input placeholder="Temporary Address" value={editing?.details?.temporaryAddress || ''} onChange={e => setEditing({ ...editing!, details: { ...(editing?.details || {}), temporaryAddress: e.target.value } })} />
                  <input placeholder="Date of Birth" value={editing?.details?.dateOfBirth || ''} onChange={e => setEditing({ ...editing!, details: { ...(editing?.details || {}), dateOfBirth: e.target.value } })} />
                  <input placeholder="Father's Name" value={editing?.details?.father || ''} onChange={e => setEditing({ ...editing!, details: { ...(editing?.details || {}), father: e.target.value } })} />
                  <input placeholder="Mother's Name" value={editing?.details?.mother || ''} onChange={e => setEditing({ ...editing!, details: { ...(editing?.details || {}), mother: e.target.value } })} />
                  <input placeholder="Grandfather's Name" value={editing?.details?.grandfather || ''} onChange={e => setEditing({ ...editing!, details: { ...(editing?.details || {}), grandfather: e.target.value } })} />
                  <input placeholder="Grandmother's Name" value={editing?.details?.grandmother || ''} onChange={e => setEditing({ ...editing!, details: { ...(editing?.details || {}), grandmother: e.target.value } })} />
                  <input placeholder="Spouse" value={editing?.details?.spouse || ''} onChange={e => setEditing({ ...editing!, details: { ...(editing?.details || {}), spouse: e.target.value } })} />
                  <input placeholder="Donation Amount" value={editing?.details?.donationAmount || ''} onChange={e => setEditing({ ...editing!, details: { ...(editing?.details || {}), donationAmount: e.target.value } })} />
                  <div className="actions">
                    <button className="btn sm" onClick={onSave}>Save</button>
                    <button className="btn sm secondary" onClick={() => setEditing(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="view-item">
                  <img src={m.img} alt={m.name} className="thumb" />
                  <span>{m.name}</span>
                  <div className="actions">
                    <button className="btn sm" onClick={() => setEditing(m)}>Edit</button>
                    <button className="btn sm danger" onClick={() => onDelete(m)}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
