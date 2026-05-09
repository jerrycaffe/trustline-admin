import React, { useState } from 'react'
import '../css/Settings.css'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'

import { IoMdAdd, IoMdClose  } from "react-icons/io";
import { FiEdit2 } from 'react-icons/fi'
import { RiDeleteBin6Line } from 'react-icons/ri'

const INITIAL_PERMISSIONS = [
  'View Reports',
  'Manage Reports',
  'Manage Incident Types',
  'Manage Users',
  'Manage Chats',
  'Manage Settings',
]

const initialRoles = [
  { id: 1, name: 'Super Admin', permissions: [...INITIAL_PERMISSIONS] },
  { id: 2, name: 'Case Reviewer', permissions: ['View Reports', 'Manage Reports', 'Manage Chats'] },
  { id: 3, name: 'Support Admin', permissions: ['Manage Users', 'Manage Chats'] },
]

const initialAdminUsers = [
  {
    id: 1,
    name: 'Jessica Wang',
    email: 'jessicawang96@yahoo.com',
    unit: 'Gender-based Violence Unit',
    gender: 'Female',
    dateJoined: '12th August, 2024',
    status: 'Active',
    role: 'Super Admin',
  },
  {
    id: 2,
    name: 'Michael Ade',
    email: 'michael.ade@trustline.org',
    unit: 'Case Review Unit',
    gender: 'Male',
    dateJoined: '22nd October, 2024',
    status: 'Active',
    role: 'Case Reviewer',
  },
]

const initialActivities = [
  {
    id: 1,
    name: 'Case Follow-up Call',
    description: 'Call survivor within 24 hours after report assignment.',
  },
  {
    id: 2,
    name: 'Evidence Verification',
    description: 'Review submitted files and validate authenticity before escalation.',
  },
]

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Incident Types')
  const [incidentTypes, setIncidentTypes] = useState([
    { id: 1, name: 'Gender-based Violence', description: 'For violence crimes against females', steps: 0 },
    { id: 2, name: 'Rape Issue', description: 'For reporting rape crimes', steps: 0 },
    { id: 3, name: 'Sexual Harassment', description: 'For harassment crimes', steps: 0 },
  ])
  const [typeName, setTypeName] = useState('')
  const [typeDescription, setTypeDescription] = useState('')
  const [typeSteps, setTypeSteps] = useState(0)
  const [editingTypeId, setEditingTypeId] = useState(null)
  const [roles, setRoles] = useState(initialRoles)
  const [adminUsers, setAdminUsers] = useState(initialAdminUsers)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState(initialRoles[1]?.name || initialRoles[0]?.name || '')
  const [editingRoleId, setEditingRoleId] = useState(null)
  const [roleName, setRoleName] = useState('')
  const [permissionRoleId, setPermissionRoleId] = useState(initialRoles[0]?.id || '')
  const [permissionDraft, setPermissionDraft] = useState(initialRoles[0]?.permissions || [])
  const [permissions, setPermissions] = useState([...INITIAL_PERMISSIONS])
  const [newPermissionName, setNewPermissionName] = useState('')
  const [selectedPermissionToAdd, setSelectedPermissionToAdd] = useState('')
  const [activities, setActivities] = useState(initialActivities)
  const [activityName, setActivityName] = useState('')
  const [activityDescription, setActivityDescription] = useState('')
  const [editingActivityId, setEditingActivityId] = useState(null)

  const availableRoleNames = roles.map((role) => role.name)

  const clearIncidentTypeForm = () => {
    setTypeName('')
    setTypeDescription('')
    setTypeSteps(0)
    setEditingTypeId(null)
  }

  const handleSaveIncidentType = (event) => {
    event.preventDefault()

    const name = typeName.trim()
    const description = typeDescription.trim()
    const normalizedSteps = Math.max(0, Number(typeSteps) || 0)
    if (!name || !description) return

    if (editingTypeId) {
      setIncidentTypes((prev) =>
        prev.map((type) =>
          type.id === editingTypeId ? { ...type, name, description, steps: normalizedSteps } : type
        )
      )
      clearIncidentTypeForm()
      return
    }

    const nextId = incidentTypes.length > 0 ? Math.max(...incidentTypes.map((t) => t.id)) + 1 : 1
    setIncidentTypes((prev) => [...prev, { id: nextId, name, description, steps: normalizedSteps }])
    clearIncidentTypeForm()
  }

  const handleEditIncidentType = (type) => {
    setEditingTypeId(type.id)
    setTypeName(type.name)
    setTypeDescription(type.description)
    setTypeSteps(type.steps ?? 0)
  }

  const handleDeleteIncidentType = (typeId) => {
    setIncidentTypes((prev) => prev.filter((type) => type.id !== typeId))
    if (editingTypeId === typeId) {
      clearIncidentTypeForm()
    }
  }

  const toDisplayName = (email) => {
    const localPart = (email || '').split('@')[0] || ''
    return localPart
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ') || 'New Admin'
  }

  const formatJoinedDate = (date) => {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const handleInviteAdmin = (event) => {
    event.preventDefault()
    const email = inviteEmail.trim().toLowerCase()
    if (!email || !inviteRole) return

    const nextId = adminUsers.length > 0 ? Math.max(...adminUsers.map((admin) => admin.id)) + 1 : 1
    const invitedAdmin = {
      id: nextId,
      name: toDisplayName(email),
      email,
      unit: 'Unassigned',
      gender: 'Not Set',
      dateJoined: formatJoinedDate(new Date()),
      status: 'Invited',
      role: inviteRole,
    }

    setAdminUsers((prev) => [...prev, invitedAdmin])
    setInviteEmail('')
  }

  const clearRoleForm = () => {
    setEditingRoleId(null)
    setRoleName('')
  }

  const handleCreatePermission = (event) => {
    event.preventDefault()
    const name = newPermissionName.trim()
    if (!name || permissions.includes(name)) return
    setPermissions((prev) => [...prev, name])
    setNewPermissionName('')
  }

  const handleDeletePermission = (permission) => {
    setPermissions((prev) => prev.filter((p) => p !== permission))
    setRoles((prev) =>
      prev.map((role) => ({ ...role, permissions: role.permissions.filter((p) => p !== permission) }))
    )
    setPermissionDraft((prev) => prev.filter((p) => p !== permission))
  }

  const handleAddPermissionToRole = () => {
    if (!selectedPermissionToAdd || permissionDraft.includes(selectedPermissionToAdd)) return
    setPermissionDraft((prev) => [...prev, selectedPermissionToAdd])
    setSelectedPermissionToAdd('')
  }

  const handleRemovePermissionFromDraft = (permission) => {
    setPermissionDraft((prev) => prev.filter((p) => p !== permission))
  }

  const handleSaveRole = (event) => {
    event.preventDefault()
    const normalizedName = roleName.trim()
    if (!normalizedName) return

    const duplicateRole = roles.find(
      (role) => role.name.toLowerCase() === normalizedName.toLowerCase() && role.id !== editingRoleId
    )
    if (duplicateRole) return

    if (editingRoleId) {
      const previousRole = roles.find((role) => role.id === editingRoleId)
      setRoles((prev) =>
        prev.map((role) =>
          role.id === editingRoleId
            ? { ...role, name: normalizedName }
            : role
        )
      )
      if (previousRole && previousRole.name !== normalizedName) {
        setAdminUsers((prev) =>
          prev.map((admin) =>
            admin.role === previousRole.name ? { ...admin, role: normalizedName } : admin
          )
        )
        if (inviteRole === previousRole.name) {
          setInviteRole(normalizedName)
        }
      }
      clearRoleForm()
      return
    }

    const nextId = roles.length > 0 ? Math.max(...roles.map((role) => role.id)) + 1 : 1
    setRoles((prev) => [...prev, { id: nextId, name: normalizedName, permissions: [] }])
    setPermissionRoleId(nextId)
    setPermissionDraft([])
    if (!inviteRole) {
      setInviteRole(normalizedName)
    }
    clearRoleForm()
  }

  const handleEditRole = (role) => {
    setEditingRoleId(role.id)
    setRoleName(role.name)
  }

  const handlePermissionRoleChange = (roleIdValue) => {
    if (!roleIdValue) {
      setPermissionRoleId('')
      setPermissionDraft([])
      return
    }

    const normalizedRoleId = Number(roleIdValue)
    const selectedRole = roles.find((role) => role.id === normalizedRoleId)
    setPermissionRoleId(normalizedRoleId)
    setPermissionDraft(selectedRole?.permissions || [])
  }

  const handleSaveRolePermissions = (event) => {
    event.preventDefault()
    if (!permissionRoleId) return

    setRoles((prev) =>
      prev.map((role) =>
        role.id === Number(permissionRoleId) ? { ...role, permissions: permissionDraft } : role
      )
    )
  }

  const handleOpenPermissionEditor = (roleId) => {
    const selectedRole = roles.find((role) => role.id === roleId)
    setPermissionRoleId(roleId)
    setPermissionDraft(selectedRole?.permissions || [])
  }

  const handleDeleteRole = (roleId) => {
    const roleToDelete = roles.find((role) => role.id === roleId)
    if (!roleToDelete) return

    const nextRoles = roles.filter((role) => role.id !== roleId)
    setRoles(nextRoles)
    setAdminUsers((prev) =>
      prev.map((admin) =>
        admin.role === roleToDelete.name ? { ...admin, role: 'Unassigned' } : admin
      )
    )

    if (inviteRole === roleToDelete.name) {
      setInviteRole(nextRoles[0]?.name || '')
    }

    if (editingRoleId === roleId) {
      clearRoleForm()
    }

    if (Number(permissionRoleId) === roleId) {
      const fallbackRole = nextRoles[0]
      setPermissionRoleId(fallbackRole?.id || '')
      setPermissionDraft(fallbackRole?.permissions || [])
    }
  }

  const handleAdminRoleChange = (adminId, nextRole) => {
    setAdminUsers((prev) =>
      prev.map((admin) => (admin.id === adminId ? { ...admin, role: nextRole || 'Unassigned' } : admin))
    )
  }

  const clearActivityForm = () => {
    setActivityName('')
    setActivityDescription('')
    setEditingActivityId(null)
  }

  const handleSaveActivity = (event) => {
    event.preventDefault()

    const name = activityName.trim()
    const description = activityDescription.trim()
    if (!name || !description) return

    if (editingActivityId) {
      setActivities((prev) =>
        prev.map((activity) =>
          activity.id === editingActivityId ? { ...activity, name, description } : activity
        )
      )
      clearActivityForm()
      return
    }

    const nextId = activities.length > 0 ? Math.max(...activities.map((activity) => activity.id)) + 1 : 1
    setActivities((prev) => [...prev, { id: nextId, name, description }])
    clearActivityForm()
  }

  const handleEditActivity = (activity) => {
    setEditingActivityId(activity.id)
    setActivityName(activity.name)
    setActivityDescription(activity.description)
  }

  const handleDeleteActivity = (activityId) => {
    setActivities((prev) => prev.filter((activity) => activity.id !== activityId))
    if (editingActivityId === activityId) {
      clearActivityForm()
    }
  }

  return (
    <div className='settings-container'>
      <Searchbar />
      <Sidebar />
      <div className='settings'>
        <p>Settings</p>

        {/* Navigation */}
        <div className='navigation'>
          <button 
            className={activeTab === 'Incident Types' ? 'active' : ''}
            onClick={() => setActiveTab('Incident Types')}
          >
            Incident Types
          </button>
          <button 
            className={activeTab === 'Admin Users' ? 'active' : ''}
            onClick={() => setActiveTab('Admin Users')}
          >
            Admin Users
          </button>
          <button
            className={activeTab === 'Activities' ? 'active' : ''}
            onClick={() => setActiveTab('Activities')}
          >
            Activities
          </button>
          <button
            className={activeTab === 'Roles & Permissions' ? 'active' : ''}
            onClick={() => setActiveTab('Roles & Permissions')}
          >
            Roles & Permissions
          </button>
        </div>

        {activeTab === 'Incident Types' && (
          <div className='incident-types'>
            <div className='incident-types-head'>
              <p>Incident Types</p>
              <span>Add, edit, list, and remove incident types available on the platform.</span>
            </div>

            <form className='incident-type-form' onSubmit={handleSaveIncidentType}>
              <label>
                <span>Incident Type Name</span>
                <input
                  type='text'
                  placeholder='e.g. Bullying'
                  value={typeName}
                  onChange={(event) => setTypeName(event.target.value)}
                  required
                />
              </label>

              <label>
                <span>Description</span>
                <textarea
                  placeholder='Describe what this incident type is for.'
                  value={typeDescription}
                  onChange={(event) => setTypeDescription(event.target.value)}
                  rows={3}
                  required
                />
              </label>

              <label>
                <span>Steps - total iteration to be taken to conclude this type of incidents</span>
                <input
                  type='number'
                  min='0'
                  value={typeSteps}
                  onChange={(event) => setTypeSteps(event.target.value)}
                  required
                />
              </label>

              <div className='incident-type-form-actions'>
                {editingTypeId ? (
                  <button type='button' className='incident-secondary-btn' onClick={clearIncidentTypeForm}>
                    Cancel
                  </button>
                ) : null}
                <button type='submit' className='incident-primary-btn'>
                  {editingTypeId ? 'Update Type' : (<><IoMdAdd /> Add Type</>)}
                </button>
              </div>
            </form>

            <div className='incident-types-list'>
              {incidentTypes.map((type) => (
                <article key={type.id} className='incident-type-item'>
                  <div className='incident-type-item-content'>
                    <h4>{type.name}</h4>
                    <p>{type.description}</p>
                    <p className='incident-type-steps'>Steps: {type.steps}</p>
                  </div>
                  <div className='incident-type-item-actions'>
                    <button type='button' className='incident-edit-btn' onClick={() => handleEditIncidentType(type)}>
                      <FiEdit2 size={14} /> Edit
                    </button>
                    <button type='button' className='incident-delete-btn' onClick={() => handleDeleteIncidentType(type.id)}>
                      <RiDeleteBin6Line size={14} /> Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Admin Users' && (
          <div className='admin-users'>
            <div className='admin-users-head'>
              <p>Admin Users</p>
              <span>Invite admins and update admin role assignments.</span>
            </div>

            <section className='invite-admin'>
              <h4>Invite Admin</h4>
              <form className='invite-admin-form' onSubmit={handleInviteAdmin}>
                <label>
                  <span>Admin Email</span>
                  <input
                    type='email'
                    placeholder='admin@trustline.org'
                    value={inviteEmail}
                    onChange={(event) => setInviteEmail(event.target.value)}
                    required
                  />
                </label>

                <label>
                  <span>Role</span>
                  <select
                    value={inviteRole}
                    onChange={(event) => setInviteRole(event.target.value)}
                    required
                  >
                    <option value='' disabled>Select role</option>
                    {availableRoleNames.map((roleNameValue) => (
                      <option key={roleNameValue} value={roleNameValue}>{roleNameValue}</option>
                    ))}
                  </select>
                </label>

                <button type='submit' className='admin-primary-btn'>
                  <IoMdAdd /> Invite Admin
                </button>
              </form>
            </section>

            <section className='admin-list'>
              <h4>All Admin Users</h4>
              <div className='admin-list-table-wrap'>
                <table className='admin-list-table'>
                  <thead>
                    <tr>
                      <th>Admin Name</th>
                      <th>Unit</th>
                      <th>Gender</th>
                      <th>Date Joined</th>
                      <th>Status</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminUsers.map((admin) => (
                      <tr key={admin.id}>
                        <td>
                          <div className='admin-name-cell'>
                            <p>{admin.name}</p>
                            <span>{admin.email}</span>
                          </div>
                        </td>
                        <td>{admin.unit}</td>
                        <td>{admin.gender}</td>
                        <td>{admin.dateJoined}</td>
                        <td>
                          <span className={admin.status === 'Active' ? 'admin-status active' : 'admin-status invited'}>
                            {admin.status}
                          </span>
                        </td>
                        <td>
                          <select
                            className='admin-role-select'
                            value={admin.role}
                            onChange={(event) => handleAdminRoleChange(admin.id, event.target.value)}
                          >
                            <option value='Unassigned'>Unassigned</option>
                            {availableRoleNames.map((roleNameValue) => (
                              <option key={roleNameValue} value={roleNameValue}>{roleNameValue}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'Activities' && (
          <div className='activities'>
            <div className='activities-head'>
              <p>Activities</p>
              <span>Add, edit, list, and delete platform activities.</span>
            </div>

            <form className='activity-form' onSubmit={handleSaveActivity}>
              <label>
                <span>Activity Name</span>
                <input
                  type='text'
                  placeholder='e.g. Legal Consultation'
                  value={activityName}
                  onChange={(event) => setActivityName(event.target.value)}
                  required
                />
              </label>

              <label>
                <span>Description</span>
                <textarea
                  placeholder='Describe the activity and expected outcome.'
                  value={activityDescription}
                  onChange={(event) => setActivityDescription(event.target.value)}
                  rows={3}
                  required
                />
              </label>

              <div className='activity-form-actions'>
                {editingActivityId ? (
                  <button type='button' className='incident-secondary-btn' onClick={clearActivityForm}>
                    Cancel
                  </button>
                ) : null}
                <button type='submit' className='incident-primary-btn'>
                  {editingActivityId ? 'Update Activity' : (<><IoMdAdd /> Add Activity</>)}
                </button>
              </div>
            </form>

            <div className='activities-list'>
              {activities.map((activity) => (
                <article key={activity.id} className='activity-item'>
                  <div className='activity-item-content'>
                    <h4>{activity.name}</h4>
                    <p>{activity.description}</p>
                  </div>
                  <div className='activity-item-actions'>
                    <button type='button' className='incident-edit-btn' onClick={() => handleEditActivity(activity)}>
                      <FiEdit2 size={14} /> Edit
                    </button>
                    <button type='button' className='incident-delete-btn' onClick={() => handleDeleteActivity(activity.id)}>
                      <RiDeleteBin6Line size={14} /> Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Roles & Permissions' && (
          <div className='role-permissions-tab'>
            <div className='admin-users-head'>
              <p>Roles & Permissions</p>
              <span>Create, update, and delete roles and permission assignments.</span>
            </div>

            <section className='roles-permissions'>
              <h4>Roles & Permissions</h4>

              <form className='role-form' onSubmit={handleSaveRole}>
                <label>
                  <span>Role Name</span>
                  <input
                    type='text'
                    placeholder='e.g. Compliance Admin'
                    value={roleName}
                    onChange={(event) => setRoleName(event.target.value)}
                    required
                  />
                </label>

                <div className='role-form-actions'>
                  {editingRoleId ? (
                    <button type='button' className='admin-secondary-btn' onClick={clearRoleForm}>
                      Cancel
                    </button>
                  ) : null}
                  <button type='submit' className='admin-primary-btn'>
                    {editingRoleId ? 'Update Role' : 'Create Role'}
                  </button>
                </div>
              </form>

              <section className='manage-permissions-section'>
                <h4>Manage Permissions</h4>
                <form className='permission-create-form' onSubmit={handleCreatePermission}>
                  <label>
                    <span>New Permission Name</span>
                    <input
                      type='text'
                      placeholder='e.g. Export Reports'
                      value={newPermissionName}
                      onChange={(event) => setNewPermissionName(event.target.value)}
                      required
                    />
                  </label>
                  <button type='submit' className='admin-primary-btn'>
                    <IoMdAdd /> Add Permission
                  </button>
                </form>
                <div className='permissions-list'>
                  {permissions.map((permission) => (
                    <div key={permission} className='permission-list-item'>
                      <span>{permission}</span>
                      <button
                        type='button'
                        className='permission-delete-btn'
                        onClick={() => handleDeletePermission(permission)}
                      >
                        <IoMdClose size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <form className='permission-assign-form' onSubmit={handleSaveRolePermissions}>
                <h4>Assign Permissions to Role</h4>
                <div className='permission-assign-top'>
                  <label>
                    <span>Select Role</span>
                    <select
                      value={permissionRoleId}
                      onChange={(event) => handlePermissionRoleChange(event.target.value)}
                      required
                    >
                      <option value='' disabled>Select role</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className='permission-box'>
                  <p>Add Permission</p>
                  <div className='permission-add-row'>
                    <select
                      value={selectedPermissionToAdd}
                      onChange={(event) => setSelectedPermissionToAdd(event.target.value)}
                      disabled={!permissionRoleId}
                    >
                      <option value=''>Select a permission…</option>
                      {permissions
                        .filter((p) => !permissionDraft.includes(p))
                        .map((permission) => (
                          <option key={permission} value={permission}>{permission}</option>
                        ))}
                    </select>
                    <button
                      type='button'
                      className='admin-primary-btn'
                      onClick={handleAddPermissionToRole}
                      disabled={!permissionRoleId || !selectedPermissionToAdd}
                    >
                      <IoMdAdd /> Add
                    </button>
                  </div>

                  {permissionDraft.length > 0 && (
                    <div className='permission-assigned-chips'>
                      {permissionDraft.map((permission) => (
                        <span key={permission} className='permission-chip'>
                          {permission}
                          <button
                            type='button'
                            onClick={() => handleRemovePermissionFromDraft(permission)}
                          >
                            <IoMdClose size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className='role-form-actions'>
                  <button type='submit' className='admin-primary-btn' disabled={!permissionRoleId}>
                    Save Permissions
                  </button>
                </div>
              </form>

              <div className='role-list'>
                {roles.map((role) => (
                  <article key={role.id} className='role-item'>
                    <div className='role-item-main'>
                      <h5>{role.name}</h5>
                      <div className='role-permissions-chips'>
                        {role.permissions.length > 0 ? role.permissions.map((permission) => (
                          <span key={permission}>{permission}</span>
                        )) : <span className='role-no-permission'>No permissions assigned</span>}
                      </div>
                    </div>

                    <div className='role-item-actions'>
                      <button type='button' className='incident-edit-btn' onClick={() => handleEditRole(role)}>
                        <FiEdit2 size={14} /> Edit
                      </button>
                      <button type='button' className='admin-secondary-btn' onClick={() => handleOpenPermissionEditor(role.id)}>
                        Permissions
                      </button>
                      <button type='button' className='incident-delete-btn' onClick={() => handleDeleteRole(role.id)}>
                        <RiDeleteBin6Line size={14} /> Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

      </div>
    </div>
  )
}


export default Settings
