import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Select from 'react-select'
import '../css/Settings.css'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import { api } from '../services/api'

import { IoMdAdd, IoMdClose  } from "react-icons/io";
import { FiEdit2 } from 'react-icons/fi'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import Link from '@tiptap/extension-link'
import {
  MdFormatBold, MdFormatItalic, MdFormatUnderlined, MdFormatStrikethrough,
  MdFormatListBulleted, MdFormatListNumbered, MdFormatAlignLeft,
  MdFormatAlignCenter, MdFormatAlignRight, MdFormatAlignJustify,
  MdFormatQuote, MdCode, MdUndo, MdRedo, MdLink, MdLinkOff,
} from 'react-icons/md'

// ─── Rich-text editor ────────────────────────────────────────────────────────
const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  const setLink = useCallback(() => {
    if (!editor) return
    const prev = editor.getAttributes('link').href || ''
    const url = window.prompt('Enter URL', prev)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) return null

  const ToolbarBtn = ({ onClick, active, title, children }) => (
    <button
      type='button'
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      className={`rte-btn${active ? ' rte-btn-active' : ''}`}
      title={title}
    >
      {children}
    </button>
  )

  return (
    <div className='rte-wrapper'>
      <div className='rte-toolbar'>
        <div className='rte-toolbar-group'>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title='Bold'><MdFormatBold size={18} /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title='Italic'><MdFormatItalic size={18} /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title='Underline'><MdFormatUnderlined size={18} /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title='Strikethrough'><MdFormatStrikethrough size={18} /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title='Inline code'><MdCode size={18} /></ToolbarBtn>
        </div>
        <div className='rte-toolbar-separator' />
        <div className='rte-toolbar-group'>
          {[1, 2, 3].map((level) => (
            <ToolbarBtn key={level} onClick={() => editor.chain().focus().toggleHeading({ level }).run()} active={editor.isActive('heading', { level })} title={`Heading ${level}`}>H{level}</ToolbarBtn>
          ))}
        </div>
        <div className='rte-toolbar-separator' />
        <div className='rte-toolbar-group'>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title='Bullet list'><MdFormatListBulleted size={18} /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title='Ordered list'><MdFormatListNumbered size={18} /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title='Blockquote'><MdFormatQuote size={18} /></ToolbarBtn>
        </div>
        <div className='rte-toolbar-separator' />
        <div className='rte-toolbar-group'>
          <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title='Align left'><MdFormatAlignLeft size={18} /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title='Align center'><MdFormatAlignCenter size={18} /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title='Align right'><MdFormatAlignRight size={18} /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title='Justify'><MdFormatAlignJustify size={18} /></ToolbarBtn>
        </div>
        <div className='rte-toolbar-separator' />
        <div className='rte-toolbar-group'>
          <ToolbarBtn onClick={setLink} active={editor.isActive('link')} title='Insert link'><MdLink size={18} /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().unsetLink().run()} active={false} title='Remove link'><MdLinkOff size={18} /></ToolbarBtn>
        </div>
        <div className='rte-toolbar-separator' />
        <div className='rte-toolbar-group'>
          <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} active={false} title='Undo'><MdUndo size={18} /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} active={false} title='Redo'><MdRedo size={18} /></ToolbarBtn>
        </div>
      </div>
      <EditorContent editor={editor} className='rte-content' data-placeholder={placeholder || 'Start writing your resource content here…'} />
    </div>
  )
}
// ─────────────────────────────────────────────────────────────────────────────



const extractIncidentTypeItems = (response) => {
  if (Array.isArray(response)) {
    return response
  }

  return Array.isArray(response?.data) ? response.data : []
}

const isIncidentTypeObject = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }

  return (
    'id' in value ||
    'name' in value ||
    'description' in value ||
    'steps' in value ||
    'createdBy' in value ||
    'unitIds' in value ||
    'units' in value
  )
}

const extractCreatedIncidentType = (response) => {
  if (isIncidentTypeObject(response)) {
    return response
  }

  const candidates = [
    response?.data,
    response?.result,
    response?.item,
    response?.incidentType,
    response?.data?.result,
    response?.data?.item,
    response?.data?.incidentType,
  ]

  return candidates.find(isIncidentTypeObject) || null
}

const extractRoles = (response) => {
  if (Array.isArray(response)) {
    return response
  }

  if (Array.isArray(response?.data)) {
    return response.data
  }

  return []
}

const normalizeRole = (role) => {
  if (!role || typeof role !== 'object') {
    return null
  }

  return {
    id: role.id ?? role._id ?? `role-${Date.now()}`,
    name: role.name ?? 'Unnamed role',
    permissions: Array.isArray(role.permissions)
      ? role.permissions
        .map((permission) => ({
          id: permission?.id ?? permission?._id ?? '',
          name: permission?.name ?? '',
        }))
        .filter((p) => p.name)
      : [],
  }
}

const normalizePermission = (permission) => {
  if (!permission || typeof permission !== 'object') {
    return null
  }

  return {
    id: permission.id ?? permission._id ?? '',
    name: permission.name ?? '',
    description: permission.description ?? '',
  }
}

const extractPermissions = (response) => {
  if (Array.isArray(response)) {
    return response
  }

  if (Array.isArray(response?.data)) {
    return response.data
  }

  return []
}

const extractResourceItems = (response) => {
  if (Array.isArray(response)) {
    return response
  }

  const candidates = [
    response?.data?.items,
    response?.data?.content,
    response?.data?.results,
    response?.data?.records,
    response?.items,
    response?.content,
    response?.results,
    response?.records,
    response?.data,
  ]

  return candidates.find(Array.isArray) || []
}

const extractActivityItems = (response) => {
  if (Array.isArray(response)) {
    return response
  }

  const candidates = [
    response?.data?.items,
    response?.data?.content,
    response?.data?.results,
    response?.data?.records,
    response?.items,
    response?.content,
    response?.results,
    response?.records,
    response?.data,
  ]

  return candidates.find(Array.isArray) || []
}

const normalizeResourceItem = (resource) => {
  if (!resource || typeof resource !== 'object') {
    return null
  }

  return {
    id: resource.id ?? resource.resourceId ?? '',
    title: resource.title ?? resource.name ?? 'Untitled',
    incidentTypeId: resource.incidentTypeId ?? resource.incidentType?.id ?? '',
    incidentTypeName:
      resource.incidentTypeName ??
      (typeof resource.incidentType === 'string' ? resource.incidentType : resource.incidentType?.name) ??
      '—',
    content: resource.content ?? resource.contents ?? '',
    fileUrl: resource.fileUrl ?? '',
    createdBy: resource.createdBy ?? '',
    createdAt: resource.createdAt ?? null,
    updatedAt: resource.updatedAt ?? null,
  }
}

const normalizeActivity = (activity) => {
  if (!activity || typeof activity !== 'object') {
    return null
  }

  return {
    id: activity.id ?? activity.activityId ?? '',
    name: activity.name ?? 'Untitled activity',
    description: activity.description ?? '',
    gradeType:
      typeof activity.gradeType === 'string'
        ? activity.gradeType
        : activity.gradeType?.name ?? '—',
    unit: activity.unit ?? '—',
    createdById: activity.createdById ?? '',
    createdByName: activity.createdByName ?? '—',
    createdAt: activity.createdAt ?? null,
    updatedAt: activity.updatedAt ?? null,
  }
}

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const isUuid = (value) => UUID_V4_REGEX.test(String(value || '').trim())

const normalizeIncidentType = (type) => {
  if (!type || typeof type !== 'object') {
    return null
  }

  const rawUnitIds = Array.isArray(type.unitIds)
    ? type.unitIds
    : Array.isArray(type.units)
      ? type.units.map((unit) => (typeof unit === 'object' ? unit?.id ?? unit?._id ?? '' : unit))
      : []

  return {
    id: type.id ?? type._id ?? '',
    name: type.name ?? 'Unnamed incident type',
    description: type.description ?? '',
    createdBy: type.createdBy ?? '',
    steps: Number(type.steps ?? 0) || 0,
    unitIds: rawUnitIds
      .map((unitId) => String(unitId || '').trim())
      .filter(Boolean),
  }
}

const extractUnitItems = (response) => {
  if (Array.isArray(response)) {
    return response
  }

  return Array.isArray(response?.data) ? response.data : []
}

const isUnitObject = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }

  return 'id' in value || 'name' in value || 'institutionId' in value
}

const extractCreatedUnit = (response) => {
  if (isUnitObject(response)) {
    return response
  }

  const candidates = [
    response?.data,
    response?.result,
    response?.item,
    response?.unit,
    response?.data?.result,
    response?.data?.item,
    response?.data?.unit,
  ]

  return candidates.find(isUnitObject) || null
}

const normalizeUnit = (unit) => {
  if (!unit || typeof unit !== 'object') {
    return null
  }

  return {
    id: unit.id ?? unit._id ?? '',
    name: unit.name ?? 'Unnamed unit',
    institutionId: unit.institutionId ?? '',
  }
}

const normalizeAdminUser = (admin) => {
  if (!admin || typeof admin !== 'object') {
    return null
  }

  const firstName = String(admin.firstName || '').trim()
  const lastName = String(admin.lastName || '').trim()
  const email = String(admin.email || '').trim()
  
  // Create display name from firstName + lastName or fallback to email
  let name = ''
  if (firstName && lastName) {
    name = `${firstName} ${lastName}`
  } else if (firstName) {
    name = firstName
  } else if (lastName) {
    name = lastName
  } else {
    // Extract from email if no name provided
    const localPart = email.split('@')[0] || ''
    name = localPart
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ') || 'New Admin'
  }

  // Format joined date
  const createdAtDate = admin.createdAt ? new Date(admin.createdAt) : new Date()
  const dateJoined = createdAtDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Map status
  const statusMapping = {
    'VERIFIED': 'Active',
    'UNVERIFIED': 'Unverified',
    'INVITED': 'Invited',
    'PENDING': 'Pending',
  }
  
  const status = statusMapping[admin.status] || (admin.status === 'VERIFIED' ? 'Active' : admin.status || 'Unverified')
  const roles = Array.isArray(admin.roles) ? admin.roles : []
  const role = roles.length > 0 ? roles[0] : 'Unassigned'

  return {
    id: admin.userId ?? admin.id ?? '',
    name: name,
    email: email,
    unit: admin.unit || 'Unassigned',
    gender: admin.gender || 'Not Set',
    dateJoined: dateJoined,
    status: status,
    role: role,
    phoneNumber: admin.phoneNumber || '',
    ongoingCases: admin.ongoingCases ?? 0,
  }
}

const extractAdminUsers = (response) => {
  if (Array.isArray(response)) {
    return response
  }

  return Array.isArray(response?.data) ? response.data : []
}

const SETTINGS_SECTION_LABELS = {
  'incident-types': 'Incident Types',
  'admin-users': 'Admin Users',
  units: 'Units',
  activities: 'Activities',
  'roles-permissions': 'Roles & Permissions',
  resources: 'Resources',
}

const Settings = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const sectionSlug = location.pathname.split('/')[2] || 'incident-types'
  const activeTab = SETTINGS_SECTION_LABELS[sectionSlug] || 'Incident Types'
  const isIncidentTypesPage = sectionSlug === 'incident-types' || sectionSlug === 'resources'
  const isAdminUsersPage = sectionSlug === 'admin-users'
  const isUnitsPage = sectionSlug === 'incident-types' || sectionSlug === 'units'
  const isActivitiesPage = sectionSlug === 'activities'
  const isRolesPermissionsPage = sectionSlug === 'roles-permissions'
  const isResourcesPage = sectionSlug === 'resources'
  const isRolesOrAdminUsersPage = isRolesPermissionsPage || isAdminUsersPage

  useEffect(() => {
    if (!SETTINGS_SECTION_LABELS[sectionSlug]) {
      navigate('/settings/incident-types', { replace: true })
    }
  }, [navigate, sectionSlug])

  const [incidentTypes, setIncidentTypes] = useState([])
  const [isLoadingIncidentTypes, setIsLoadingIncidentTypes] = useState(true)
  const [typeName, setTypeName] = useState('')
  const [typeDescription, setTypeDescription] = useState('')
  const [typeSteps, setTypeSteps] = useState(0)
  const [typeUnitIds, setTypeUnitIds] = useState([])
  const [editingTypeId, setEditingTypeId] = useState(null)
  const [isCreatingIncidentType, setIsCreatingIncidentType] = useState(false)
  const [isUpdatingIncidentType, setIsUpdatingIncidentType] = useState(false)
  const [isDeletingIncidentTypeId, setIsDeletingIncidentTypeId] = useState(null)
  const [roles, setRoles] = useState([])
  const [adminUsers, setAdminUsers] = useState([])
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('')
  const [inviteUnitId, setInviteUnitId] = useState('')
  const [isInvitingAdmin, setIsInvitingAdmin] = useState(false)
  const [editingRoleId, setEditingRoleId] = useState(null)
  const [roleName, setRoleName] = useState('')
  const [roleDescription, setRoleDescription] = useState('')
  const [isCreatingRole, setIsCreatingRole] = useState(false)
  const [isSavingRolePermissions, setIsSavingRolePermissions] = useState(false)
  const [permissionRoleId, setPermissionRoleId] = useState('')
  const [permissionDraft, setPermissionDraft] = useState([])
  const [permissions, setPermissions] = useState([])
  const [newPermissionName, setNewPermissionName] = useState('')
  const [newPermissionDescription, setNewPermissionDescription] = useState('')
  const [isCreatingPermission, setIsCreatingPermission] = useState(false)
  const [selectedPermissionToAdd, setSelectedPermissionToAdd] = useState('')
  const [activities, setActivities] = useState([])
  const [isLoadingActivities, setIsLoadingActivities] = useState(true)
  const [activityName, setActivityName] = useState('')
  const [activityDescription, setActivityDescription] = useState('')
  const [activityGradeType, setActivityGradeType] = useState('PERCENTAGE')
  const [editingActivityId, setEditingActivityId] = useState(null)
  const [isCreatingActivity, setIsCreatingActivity] = useState(false)
  const [isUpdatingActivity, setIsUpdatingActivity] = useState(false)
  const [isDeletingActivityId, setIsDeletingActivityId] = useState(null)
  const [units, setUnits] = useState([])
  const [isLoadingUnits, setIsLoadingUnits] = useState(true)
  const [unitName, setUnitName] = useState('')
  const [editingUnitId, setEditingUnitId] = useState(null)
  const unitNameInputRef = useRef(null)
  const [isCreatingUnit, setIsCreatingUnit] = useState(false)
  const [isUpdatingUnit, setIsUpdatingUnit] = useState(false)
  const [isDeletingUnitId, setIsDeletingUnitId] = useState(null)

  // Resources
  const [resources, setResources] = useState([])
  const [isLoadingResources, setIsLoadingResources] = useState(true)
  const [resourceTitle, setResourceTitle] = useState('')
  const [resourceIncidentTypeId, setResourceIncidentTypeId] = useState('')
  const [resourceContent, setResourceContent] = useState('')
  const [isPostingResource, setIsPostingResource] = useState(false)
  const [isDeletingResourceId, setIsDeletingResourceId] = useState(null)

  const availableRoleNames = roles.map((role) => role.name)
  const availableUnits = units
    .map((unit) => ({
      id: String(unit?.id || '').trim(),
      name: String(unit?.name || 'Unnamed unit'),
    }))
    .filter((unit) => unit.id)
  const incidentTypeUnitOptions = units
    .map((unit) => ({
      value: String(unit?.id || '').trim(),
      label: String(unit?.name || 'Unnamed unit'),
    }))
    .filter((option) => option.value)
  const selectedIncidentTypeUnitOptions = incidentTypeUnitOptions.filter((option) =>
    typeUnitIds.includes(option.value),
  )

  useEffect(() => {
    if (!isIncidentTypesPage) {
      return
    }

    let isActive = true

    const loadIncidentTypes = async () => {
      setIsLoadingIncidentTypes(true)

      try {
        const response = await api.get('/api/v1/incident-types')
        const items = extractIncidentTypeItems(response)
          .map(normalizeIncidentType)
          .filter(Boolean)

        if (!isActive) return

        setIncidentTypes(items)
      } catch (error) {
        if (!isActive) return

        setIncidentTypes([])
        toast.error(error.message || 'Unable to load incident types.')
      } finally {
        if (isActive) {
          setIsLoadingIncidentTypes(false)
        }
      }
    }

    loadIncidentTypes()

    return () => {
      isActive = false
    }
  }, [isIncidentTypesPage])

  useEffect(() => {
    if (!isActivitiesPage) {
      return
    }

    let isActive = true

    const loadActivities = async () => {
      setIsLoadingActivities(true)

      try {
        const response = await api.get('/api/v1/admin/activities')
        const items = extractActivityItems(response)
          .map(normalizeActivity)
          .filter(Boolean)

        if (!isActive) return

        setActivities(items)
      } catch (error) {
        if (!isActive) return

        setActivities([])
        toast.error(error.message || 'Unable to load activities.')
      } finally {
        if (isActive) {
          setIsLoadingActivities(false)
        }
      }
    }

    loadActivities()

    return () => {
      isActive = false
    }
  }, [isActivitiesPage])

  useEffect(() => {
    if (!isUnitsPage && !isAdminUsersPage) {
      return
    }

    let isActive = true

    const loadUnits = async () => {
      setIsLoadingUnits(true)

      try {
        const response = await api.get('/api/v1/units')
        const items = extractUnitItems(response)
          .map(normalizeUnit)
          .filter(Boolean)

        if (!isActive) return
        setUnits(items)
        setInviteUnitId((prev) => prev || String(items[0]?.id || '').trim())
      } catch (error) {
        if (!isActive) return
        setUnits([])
        setInviteUnitId('')
        toast.error(error.message || 'Unable to load units.')
      } finally {
        if (isActive) {
          setIsLoadingUnits(false)
        }
      }
    }

    loadUnits()

    return () => {
      isActive = false
    }
  }, [isUnitsPage, isAdminUsersPage])

  useEffect(() => {
    if (!isRolesOrAdminUsersPage) {
      return
    }

    let isActive = true

    const loadRoles = async () => {
      try {
        const response = await api.get('/api/v1/admin/roles')
        const normalizedRoles = extractRoles(response)
          .map(normalizeRole)
          .filter(Boolean)

        if (!isActive || normalizedRoles.length === 0) return

        const firstRole = normalizedRoles[0]

        setRoles(normalizedRoles)
        setPermissionRoleId(String(firstRole.id))
        setPermissionDraft(firstRole.permissions)
        setInviteRole(firstRole.name || '')
      } catch (error) {
        if (!isActive) return
        toast.error(error.message || 'Unable to load roles.')
      }
    }

    loadRoles()

    return () => {
      isActive = false
    }
  }, [isRolesOrAdminUsersPage])

  useEffect(() => {
    if (!isRolesPermissionsPage) {
      return
    }

    let isActive = true

    const loadPermissions = async () => {
      try {
        const response = await api.get('/api/v1/admin/permissions')
        const items = extractPermissions(response)
          .map(normalizePermission)
          .filter((permission) => permission?.name)

        if (!isActive) return

        setPermissions(items)
      } catch (error) {
        if (!isActive) return
        toast.error(error.message || 'Unable to load permissions.')
      }
    }

    loadPermissions()

    return () => {
      isActive = false
    }
  }, [isRolesPermissionsPage])

  useEffect(() => {
    if (!isResourcesPage) {
      return
    }

    let isActive = true

    const loadResources = async () => {
      setIsLoadingResources(true)
      try {
        const response = await api.get('/api/v1/resources?offset=0&limit=20')
        const items = extractResourceItems(response)
          .map(normalizeResourceItem)
          .filter(Boolean)
        if (!isActive) return
        setResources(items)
      } catch {
        if (!isActive) return
        setResources([])
      } finally {
        if (isActive) setIsLoadingResources(false)
      }
    }

    loadResources()

    return () => { isActive = false }
  }, [isResourcesPage])

  useEffect(() => {
    if (!isAdminUsersPage) {
      return
    }

    let isActive = true

    const loadAdminUsers = async () => {
      try {
        const response = await api.get('/api/v1/admin/admins')
        const items = extractAdminUsers(response)
          .map((admin) => normalizeAdminUser(admin))
          .filter(Boolean)

        if (!isActive) return

        setAdminUsers(items)
      } catch (error) {
        if (!isActive) return

        setAdminUsers([])
        toast.error(error.message || 'Unable to load admin users.')
      }
    }

    loadAdminUsers()

    return () => {
      isActive = false
    }
  }, [isAdminUsersPage])

  const toastSuccess = (message, toastId = null) => {
    if (toastId) {
      toast.success(message, { id: toastId })
    } else {
      toast.success(message)
    }
  }

  const toastError = (message, toastId = null) => {
    if (toastId) {
      toast.error(message, { id: toastId })
    } else {
      toast.error(message)
    }
  }

  const clearIncidentTypeForm = () => {
    setTypeName('')
    setTypeDescription('')
    setTypeSteps(0)
    setTypeUnitIds([])
    setEditingTypeId(null)
  }

  const handleIncidentTypeUnitsChange = (selectedOptions) => {
    const selectedIds = Array.isArray(selectedOptions)
      ? selectedOptions
        .map((option) => String(option?.value || '').trim())
        .filter(Boolean)
      : []

    setTypeUnitIds(selectedIds)
  }

  const handleSaveIncidentType = async (event) => {
    event.preventDefault()

    const name = typeName.trim()
    const description = typeDescription.trim()
    const normalizedSteps = Math.max(0, Number(typeSteps) || 0)
    const normalizedUnitIds = Array.from(
      new Set(typeUnitIds.map((unitId) => String(unitId || '').trim()).filter(Boolean)),
    )
    if (!name || !description) return
    if (normalizedUnitIds.length === 0) {
      toastError('Select at least one unit for this incident type.')
      return
    }

    if (editingTypeId) {
      if (!isUuid(editingTypeId)) {
        toastError('Invalid incident type id. Please refresh and try again.')
        return
      }

      setIsUpdatingIncidentType(true)

      try {
        const response = await api.put(
          `/api/v1/incident-types/${editingTypeId}`,
          {
            name,
            description,
            steps: normalizedSteps,
            unitIds: normalizedUnitIds,
          },
          { auth: true },
        )

        const updatedPayload = extractCreatedIncidentType(response) || {
          id: editingTypeId,
          name,
          description,
          steps: normalizedSteps,
          unitIds: normalizedUnitIds,
        }

        const updatedType = normalizeIncidentType(updatedPayload, incidentTypes.length)
        if (updatedType) {
          setIncidentTypes((prev) =>
            prev.map((type) => (type.id === editingTypeId ? updatedType : type)),
          )
        }
        clearIncidentTypeForm()
        toastSuccess('Incident type updated successfully! 🎉')
      } catch (error) {
        toastError(error.message || 'Unable to update incident type.')
      } finally {
        setIsUpdatingIncidentType(false)
      }
      return
    }

    setIsCreatingIncidentType(true)

    try {
      const response = await api.post(
        '/api/v1/incident-types',
        {
          name,
          description,
          steps: normalizedSteps,
          unitIds: normalizedUnitIds,
        },
        { auth: true },
      )

      const createdPayload = extractCreatedIncidentType(response) || {
        name,
        description,
        steps: normalizedSteps,
        unitIds: normalizedUnitIds,
      }

      const createdType = normalizeIncidentType(createdPayload, incidentTypes.length)
      if (createdType) {
        setIncidentTypes((prev) => [createdType, ...prev])
      }
      clearIncidentTypeForm()
      toastSuccess('Incident type created successfully! ✨')
    } catch (error) {
      toastError(error.message || 'Unable to create incident type.')
    } finally {
      setIsCreatingIncidentType(false)
    }
  }

  const handleEditIncidentType = (type) => {
    setEditingTypeId(type.id)
    setTypeName(type.name)
    setTypeDescription(type.description)
    setTypeSteps(type.steps ?? 0)
    setTypeUnitIds(
      Array.isArray(type.unitIds)
        ? type.unitIds.map((unitId) => String(unitId || '').trim()).filter(Boolean)
        : [],
    )
  }

  const handleDeleteIncidentType = async (typeId) => {
    if (!typeId || typeof typeId !== 'string' || !typeId.includes('-')) {
      toastError('Invalid incident type ID. Cannot delete.')
      return
    }

    setIsDeletingIncidentTypeId(typeId)

    try {
      await api.delete(
        `/api/v1/incident-types/${typeId}`,
        { auth: true },
      )

      setIncidentTypes((prev) => prev.filter((type) => type.id !== typeId))
      if (editingTypeId === typeId) {
        clearIncidentTypeForm()
      }
      toastSuccess('Incident type deleted successfully! 👋')
    } catch (error) {
      toastError(error.message || 'Unable to delete incident type.')
    } finally {
      setIsDeletingIncidentTypeId(null)
    }
  }

  const clearUnitForm = () => {
    setUnitName('')
    setEditingUnitId(null)
  }

  const handleSaveUnit = async (event) => {
    event.preventDefault()

    const name = unitName.trim()
    if (!name) return

    if (editingUnitId) {
      if (!isUuid(editingUnitId)) {
        toastError('Invalid unit id. Please refresh and try again.')
        return
      }

      setIsUpdatingUnit(true)

      try {
        const response = await api.put(
          `/api/v1/units/${editingUnitId}`,
          { name },
          { auth: true },
        )

        const updatedPayload = extractCreatedUnit(response) || {
          id: editingUnitId,
          name,
        }

        const updatedUnit = normalizeUnit(updatedPayload)
        if (updatedUnit) {
          setUnits((prev) => prev.map((unit) => (unit.id === editingUnitId ? updatedUnit : unit)))
        }

        clearUnitForm()
        toastSuccess('Unit updated successfully!')
      } catch (error) {
        toastError(error.message || 'Unable to update unit.')
      } finally {
        setIsUpdatingUnit(false)
      }
      return
    }

    setIsCreatingUnit(true)

    try {
      const response = await api.post(
        '/api/v1/units',
        { name },
        { auth: true },
      )

      const createdPayload = extractCreatedUnit(response) || { name }
      const createdUnit = normalizeUnit(createdPayload)

      if (createdUnit) {
        setUnits((prev) => [createdUnit, ...prev])
        setInviteUnitId((prev) => prev || String(createdUnit.id || '').trim())
      }

      clearUnitForm()
      toastSuccess('Unit created successfully!')
    } catch (error) {
      toastError(error.message || 'Unable to create unit.')
    } finally {
      setIsCreatingUnit(false)
    }
  }

  const handleEditUnit = (unit) => {
    setEditingUnitId(unit.id)
    setUnitName(unit.name)
    setTimeout(() => unitNameInputRef.current?.focus(), 0)
  }

  const handleDeleteUnit = async (unitId) => {
    if (!unitId || typeof unitId !== 'string' || !unitId.includes('-')) {
      toastError('Invalid unit ID. Cannot delete.')
      return
    }

    setIsDeletingUnitId(unitId)

    try {
      await api.delete(`/api/v1/units/${unitId}`, { auth: true })
      setUnits((prev) => prev.filter((unit) => unit.id !== unitId))

      if (inviteUnitId === unitId) {
        const remainingUnits = units.filter((unit) => unit.id !== unitId)
        setInviteUnitId(String(remainingUnits[0]?.id || '').trim())
      }

      if (editingUnitId === unitId) {
        clearUnitForm()
      }

      toastSuccess('Unit deleted successfully!')
    } catch (error) {
      toastError(error.message || 'Unable to delete unit.')
    } finally {
      setIsDeletingUnitId(null)
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

  const handleInviteAdmin = async (event) => {
    event.preventDefault()
    const email = inviteEmail.trim().toLowerCase()
    const selectedInviteUnitId = String(inviteUnitId || '').trim()
    if (!email || !inviteRole || !selectedInviteUnitId) return

    const selectedInviteUnit = availableUnits.find((unit) => unit.id === selectedInviteUnitId)

    setIsInvitingAdmin(true)
    const loadingToastId = toast.loading('Sending admin invite...')

    try {
      const response = await api.post(
        '/api/v1/admin/invite',
        {
          email,
          role: inviteRole,
          unitId: selectedInviteUnitId,
        },
        { auth: true },
      )

      const payload = response?.data && typeof response.data === 'object'
        ? response.data
        : response

      const userId = payload?.userId || payload?.id || payload?._id
      const invitedAdmin = {
        id: userId || `${email}-${Date.now()}`,
        name: toDisplayName(payload?.email || email),
        email: payload?.email || email,
        unit: payload?.unitName || payload?.unit || selectedInviteUnit?.name || 'Unassigned',
        gender: 'Not Set',
        dateJoined: formatJoinedDate(new Date()),
        status: 'Invited',
        role: payload?.role || inviteRole,
      }

      setAdminUsers((prev) => {
        const withoutDuplicate = prev.filter(
          (admin) => admin.email.toLowerCase() !== invitedAdmin.email.toLowerCase(),
        )
        return [...withoutDuplicate, invitedAdmin]
      })
      setInviteEmail('')
      toast.success('Invite sent successfully. Admin will receive an email shortly.', { id: loadingToastId })
    } catch (error) {
      toast.error(error.message || 'Unable to send admin invite right now.', { id: loadingToastId })
    } finally {
      setIsInvitingAdmin(false)
    }
  }

  const clearRoleForm = () => {
    setEditingRoleId(null)
    setRoleName('')
    setRoleDescription('')
  }

  const handleCreatePermission = async (event) => {
    event.preventDefault()
    const name = newPermissionName.trim()
    const description = newPermissionDescription.trim()
    if (!name || permissions.some((permission) => permission.name.toLowerCase() === name.toLowerCase())) return

    setIsCreatingPermission(true)
    const loadingToastId = toast.loading('Creating permission...')

    try {
      const response = await api.post(
        '/api/v1/admin/permissions',
        { name, description },
        { auth: true },
      )

      const createdPayload = response?.data && typeof response.data === 'object'
        ? response.data
        : response
      const createdPermission = normalizePermission(createdPayload) || {
        id: '',
        name,
        description,
      }

      setPermissions((prev) =>
        prev.some((permission) => permission.name.toLowerCase() === createdPermission.name.toLowerCase())
          ? prev
          : [...prev, createdPermission]
      )
      setNewPermissionName('')
      setNewPermissionDescription('')
      toast.success('Permission created successfully!', { id: loadingToastId })
    } catch (error) {
      toast.error(error.message || 'Unable to create permission.', { id: loadingToastId })
    } finally {
      setIsCreatingPermission(false)
    }
  }

  const handleDeletePermission = (permissionId) => {
    setPermissions((prev) => prev.filter((p) => p.id !== permissionId))
    setRoles((prev) =>
      prev.map((role) => ({ ...role, permissions: role.permissions.filter((p) => p?.id !== permissionId) }))
    )
    setPermissionDraft((prev) => prev.filter((p) => p?.id !== permissionId))
  }

  const handleAddPermissionToRole = () => {
    if (!selectedPermissionToAdd) return

    const selectedPerm = permissions.find((p) => p.name === selectedPermissionToAdd)
    if (!selectedPerm) return

    const alreadyExists = permissionDraft.some(
      (p) => String(p?.id || '').toLowerCase() === String(selectedPerm.id).toLowerCase()
    )
    if (alreadyExists) return

    setPermissionDraft((prev) => [...prev, { id: selectedPerm.id, name: selectedPerm.name }])
    setSelectedPermissionToAdd('')
  }

  const handleRemovePermissionFromDraft = (permissionId) => {
    setPermissionDraft((prev) => prev.filter((p) => p?.id !== permissionId))
  }

  const handleSaveRole = async (event) => {
    event.preventDefault()
    const normalizedName = roleName.trim()
    const normalizedDescription = roleDescription.trim()
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

    setIsCreatingRole(true)
    const loadingToastId = toast.loading('Creating role...')

    try {
      const response = await api.post(
        '/api/v1/admin/roles',
        {
          name: normalizedName,
          description: normalizedDescription,
        },
        { auth: true },
      )

      const createdPayload = response?.data && typeof response.data === 'object'
        ? response.data
        : response

      const createdRole = normalizeRole(createdPayload)
      if (createdRole) {
        setRoles((prev) => [...prev, createdRole])
        setPermissionRoleId(String(createdRole.id))
        setPermissionDraft(createdRole.permissions)
        if (!inviteRole) {
          setInviteRole(createdRole.name)
        }
      }
      clearRoleForm()
      toast.success('Role created successfully! 🎭', { id: loadingToastId })
    } catch (error) {
      toast.error(error.message || 'Unable to create role.', { id: loadingToastId })
    } finally {
      setIsCreatingRole(false)
    }
  }

  const handleEditRole = (role) => {
    setEditingRoleId(role.id)
    setRoleName(role.name)
    setRoleDescription(role.description || '')
  }

  const handlePermissionRoleChange = (roleIdValue) => {
    if (!roleIdValue) {
      setPermissionRoleId('')
      setPermissionDraft([])
      return
    }

    const selectedRole = roles.find((role) => String(role.id) === String(roleIdValue))
    setPermissionRoleId(String(roleIdValue))
    setPermissionDraft(selectedRole?.permissions || [])
  }

  const handleSaveRolePermissions = async (event) => {
    event.preventDefault()
    if (!permissionRoleId) return

    const permissionIds = permissionDraft
      .map((perm) => perm?.id)
      .filter((id) => id && String(id).trim().length > 0)

    console.log('Permission Draft:', permissionDraft)
    console.log('Extracted Permission IDs:', permissionIds)

    setIsSavingRolePermissions(true)
    const loadingToastId = toast.loading('Saving role permissions...')

    try {
      const response = await api.post(
        `/api/v1/admin/roles/${permissionRoleId}/permissions`,
        { permissionIds },
        { auth: true },
      )

      const updatedPayload = response?.data && typeof response.data === 'object'
        ? response.data
        : response
      const updatedRole = normalizeRole(updatedPayload)

      if (updatedRole) {
        setRoles((prev) =>
          prev.map((role) =>
            String(role.id) === String(permissionRoleId) ? updatedRole : role,
          ),
        )
        setPermissionDraft(updatedRole.permissions)
      }

      toast.success('Permissions assigned successfully!', { id: loadingToastId })
    } catch (error) {
      toast.error(error.message || 'Unable to assign permissions to role.', { id: loadingToastId })
    } finally {
      setIsSavingRolePermissions(false)
    }
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

    if (String(permissionRoleId) === String(roleId)) {
      const fallbackRole = nextRoles[0]
      setPermissionRoleId(fallbackRole?.id ? String(fallbackRole.id) : '')
      setPermissionDraft(fallbackRole?.permissions || [])
    }
  }

  const handleAdminRoleChange = async (adminId, nextRole) => {
    // Find the role ID from the roles list
    const selectedRole = roles.find((role) => role.name === nextRole)
    const roleId = selectedRole?.id

    if (!roleId || !adminId) {
      toastError('Unable to assign role. Missing role or admin information.')
      return
    }

    // Store current admin state for rollback
    const currentAdmin = adminUsers.find((admin) => admin.id === adminId)
    const previousRole = currentAdmin?.role || 'Unassigned'

    // Optimistically update the UI
    setAdminUsers((prev) =>
      prev.map((admin) => (admin.id === adminId ? { ...admin, role: nextRole || 'Unassigned' } : admin))
    )

    try {
      await api.put(
        '/api/v1/admin/users/roles/assign',
        {
          userId: adminId,
          roleId: roleId,
        },
        { auth: true }
      )

      toastSuccess('Role assigned successfully!')
    } catch (error) {
      // Rollback on error
      setAdminUsers((prev) =>
        prev.map((admin) => (admin.id === adminId ? { ...admin, role: previousRole } : admin))
      )
      toastError(error.message || 'Unable to assign role.')
    }
  }

  const clearResourceForm = () => {
    setResourceTitle('')
    setResourceIncidentTypeId('')
    setResourceContent('')
  }

  const handlePostResource = async (event) => {
    event.preventDefault()
    const title = resourceTitle.trim()
    const content = resourceContent.trim()
    if (!title || !resourceIncidentTypeId || !content || content === '<p></p>') {
      toastError('Please fill in title, incident type, and content.')
      return
    }

    setIsPostingResource(true)
    const loadingToastId = toast.loading('Publishing resource…')

    try {
      // Build FormData for multipart resource creation.
      // The 'resource' part must have Content-Type: application/json for Spring's @RequestPart.
      const formData = new FormData()
      const resourceJson = JSON.stringify({ name: title, incidentTypeId: resourceIncidentTypeId, contents: content })
      const resourceBlob = new Blob([resourceJson], { type: 'application/json' })
      formData.append('resource', resourceBlob)
      
      const response = await api.post(
        '/api/v1/resources',
        formData,
        { auth: true },
      )
      const created = normalizeResourceItem(response?.data || response)
      if (created) {
        setResources((prev) => [created, ...prev])
      }
      clearResourceForm()
      toast.success('Resource published successfully!', { id: loadingToastId })
    } catch (error) {
      toast.error(error.message || 'Unable to publish resource.', { id: loadingToastId })
    } finally {
      setIsPostingResource(false)
    }
  }

  const handleDeleteResource = async (resourceId) => {
    if (!resourceId) return
    setIsDeletingResourceId(resourceId)
    try {
      await api.delete(`/api/v1/resources/${resourceId}`, { auth: true })
      setResources((prev) => prev.filter((r) => r.id !== resourceId && r.resourceId !== resourceId))
      toastSuccess('Resource deleted.')
    } catch (error) {
      toastError(error.message || 'Unable to delete resource.')
    } finally {
      setIsDeletingResourceId(null)
    }
  }

  const clearActivityForm = () => {
    setActivityName('')
    setActivityDescription('')
    setActivityGradeType('PERCENTAGE')
    setEditingActivityId(null)
    setIsUpdatingActivity(false)
  }

  const handleSaveActivity = async (event) => {
    event.preventDefault()

    const name = activityName.trim()
    const description = activityDescription.trim()
    const gradeType = String(activityGradeType || '').trim()
    if (!name || !description || !gradeType) return

    if (editingActivityId) {
      setIsUpdatingActivity(true)

      try {
        const response = await api.put(
          `/api/v1/admin/activities/${editingActivityId}`,
          {
            name,
            description,
            gradeType,
          },
          { auth: true },
        )

        const updatedActivity = normalizeActivity(response?.data || response) || {
          id: editingActivityId,
          name,
          description,
          gradeType,
          unit: '—',
          createdById: '',
          createdByName: '—',
          createdAt: null,
          updatedAt: null,
        }

        setActivities((prev) =>
          prev.map((activity) =>
            activity.id === editingActivityId ? { ...activity, ...updatedActivity } : activity,
          ),
        )
        clearActivityForm()
        toastSuccess('Activity updated successfully!')
      } catch (error) {
        toastError(error.message || 'Unable to update activity.')
      } finally {
        setIsUpdatingActivity(false)
      }

      return
    }

    setIsCreatingActivity(true)

    try {
      const response = await api.post(
        '/api/v1/admin/activities',
        {
          name,
          description,
          gradeType,
        },
        { auth: true },
      )

      const createdActivity = normalizeActivity(response?.data || response) || {
        id: String(Date.now()),
        name,
        description,
        gradeType,
      }

      setActivities((prev) => [createdActivity, ...prev])
      clearActivityForm()
      toastSuccess('Activity created successfully!')
    } catch (error) {
      toastError(error.message || 'Unable to create activity.')
    } finally {
      setIsCreatingActivity(false)
    }
  }

  const handleEditActivity = (activity) => {
    setEditingActivityId(activity.id)
    setActivityName(activity.name)
    setActivityDescription(activity.description)
    setActivityGradeType(activity.gradeType || 'PERCENTAGE')
  }

  const handleDeleteActivity = (activityId) => {
    if (!activityId) return

    setIsDeletingActivityId(activityId)

    api.delete(`/api/v1/admin/activities/${activityId}`, { auth: true })
      .then(() => {
        setActivities((prev) => prev.filter((activity) => activity.id !== activityId))
        if (editingActivityId === activityId) {
          clearActivityForm()
        }
        toastSuccess('Activity deleted successfully!')
      })
      .catch((error) => {
        toastError(error.message || 'Unable to delete activity.')
      })
      .finally(() => {
        setIsDeletingActivityId(null)
      })
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
            type='button'
            className={activeTab === 'Incident Types' ? 'active' : ''}
            onClick={() => navigate('/settings/incident-types')}
          >
            Incident Types
          </button>
          <button 
            type='button'
            className={activeTab === 'Admin Users' ? 'active' : ''}
            onClick={() => navigate('/settings/admin-users')}
          >
            Admin Users
          </button>
          <button
            type='button'
            className={activeTab === 'Units' ? 'active' : ''}
            onClick={() => navigate('/settings/units')}
          >
            Units
          </button>
          <button
            type='button'
            className={activeTab === 'Activities' ? 'active' : ''}
            onClick={() => navigate('/settings/activities')}
          >
            Activities
          </button>
          <button
            type='button'
            className={activeTab === 'Roles & Permissions' ? 'active' : ''}
            onClick={() => navigate('/settings/roles-permissions')}
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

              <div className='incident-type-unit-picker'>
                <div className='incident-type-unit-picker-head'>
                  <span>Units that will attend to this incident type</span>
                  <strong>{typeUnitIds.length} selected</strong>
                </div>

                {isLoadingUnits ? (
                  <p className='incident-type-unit-picker-hint'>Loading units...</p>
                ) : null}

                {!isLoadingUnits && units.length === 0 ? (
                  <p className='incident-type-unit-picker-hint'>No units available. Create units first.</p>
                ) : null}

                {!isLoadingUnits && units.length > 0 ? (
                  <>
                    <Select
                      isMulti
                      closeMenuOnSelect={false}
                      options={incidentTypeUnitOptions}
                      value={selectedIncidentTypeUnitOptions}
                      onChange={handleIncidentTypeUnitsChange}
                      isLoading={isLoadingUnits}
                      className='incident-type-unit-react-select'
                      classNamePrefix='incident-type-unit-select'
                      placeholder='Select one or more units'
                      noOptionsMessage={() => 'No units found'}
                    />
                  </>
                ) : null}
              </div>

              <div className='incident-type-form-actions'>
                {editingTypeId ? (
                  <button type='button' className='incident-secondary-btn' onClick={clearIncidentTypeForm}>
                    Cancel
                  </button>
                ) : null}
                <button
                  type='submit'
                  className='incident-primary-btn'
                  disabled={isCreatingIncidentType || isUpdatingIncidentType}
                >
                  {editingTypeId
                    ? (isUpdatingIncidentType ? 'Updating...' : 'Update Type')
                    : (isCreatingIncidentType ? 'Creating...' : <><IoMdAdd /> Add Type</>)}
                </button>
              </div>
            </form>

            <div className='incident-types-list'>
              {isLoadingIncidentTypes ? (
                <div className='incident-types-list-state'>
                  <div className='incident-types-loader' role='status' aria-live='polite'>
                    <span className='incident-types-loader-label'>Loading incident types</span>
                    <span className='incident-types-loader-dots' aria-hidden='true'>
                      <span className='dot' />
                      <span className='dot' />
                      <span className='dot' />
                    </span>
                  </div>
                </div>
              ) : null}

              {!isLoadingIncidentTypes && incidentTypes.length === 0 ? (
                <div className='incident-types-empty-box'>
                  <div className='incident-types-empty-illustration' aria-hidden='true' />
                  <p>No incident types found.</p>
                  <span>When incident types are available from the API, they will appear here.</span>
                </div>
              ) : null}

              {!isLoadingIncidentTypes && incidentTypes.length > 0 ? incidentTypes.map((type, index) => (
                <article key={type.id || `incident-type-${index}`} className='incident-type-item'>
                  <div className='incident-type-item-content'>
                    <h4>{type.name}</h4>
                    <p>{type.description}</p>
                    {type.createdBy ? <p className='incident-type-created-by'>Created by: {type.createdBy}</p> : null}
                    <p className='incident-type-steps'>Steps: {type.steps}</p>
                  </div>
                  <div className='incident-type-item-actions'>
                    <button type='button' className='incident-edit-btn' onClick={() => handleEditIncidentType(type)} disabled={isDeletingIncidentTypeId === type.id}>
                      <FiEdit2 size={14} /> Edit
                    </button>
                    <button type='button' className='incident-delete-btn' onClick={() => handleDeleteIncidentType(type.id)} disabled={isDeletingIncidentTypeId === type.id}>
                      <RiDeleteBin6Line size={14} /> {isDeletingIncidentTypeId === type.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </article>
              )) : null}
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

                <label>
                  <span>Unit</span>
                  <select
                    value={inviteUnitId}
                    onChange={(event) => setInviteUnitId(event.target.value)}
                    required
                    disabled={isLoadingUnits || availableUnits.length === 0}
                  >
                    <option value='' disabled>Select unit</option>
                    {availableUnits.map((unit) => (
                      <option key={unit.id} value={unit.id}>{unit.name}</option>
                    ))}
                  </select>
                </label>

                <button
                  type='submit'
                  className='admin-primary-btn invite-admin-submit'
                  disabled={isInvitingAdmin || isLoadingUnits || availableUnits.length === 0}
                >
                  {isInvitingAdmin ? 'Inviting...' : <><IoMdAdd /> Invite Admin</>}
                </button>
              </form>
            </section>

            <section className='admin-list'>
              <h4>All Admin Users</h4>
              <div className='admin-list-table-wrap'>
                <table className='admin-list-table'>
                  <thead>
                    <tr>
                      <th>Name</th>
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

        {activeTab === 'Units' && (
          <div className='units'>
            <div className='incident-types-head'>
              <p>Units</p>
              <span>Create, update, list, and delete units in your institution.</span>
            </div>

            <form className='incident-type-form' onSubmit={handleSaveUnit}>
              <label>
                <span>Unit Name</span>
                <input
                  type='text'
                  placeholder='e.g. Counselling'
                  ref={unitNameInputRef}
                  value={unitName}
                  onChange={(event) => setUnitName(event.target.value)}
                  required
                />
              </label>

              <div className='incident-type-form-actions'>
                {editingUnitId ? (
                  <button type='button' className='incident-secondary-btn' onClick={clearUnitForm}>
                    Cancel
                  </button>
                ) : null}

                <button
                  type='submit'
                  className='incident-primary-btn'
                  disabled={isCreatingUnit || isUpdatingUnit}
                >
                  {editingUnitId
                    ? (isUpdatingUnit ? 'Updating...' : 'Update Unit')
                    : (isCreatingUnit ? 'Creating...' : <><IoMdAdd /> Add Unit</>)}
                </button>
              </div>
            </form>

            <div className='incident-types-list'>
              {isLoadingUnits ? (
                <div className='incident-types-list-state'>
                  <div className='incident-types-loader' role='status' aria-live='polite'>
                    <span className='incident-types-loader-label'>Loading units</span>
                    <span className='incident-types-loader-dots' aria-hidden='true'>
                      <span className='dot' />
                      <span className='dot' />
                      <span className='dot' />
                    </span>
                  </div>
                </div>
              ) : null}

              {!isLoadingUnits && units.length === 0 ? (
                <div className='incident-types-empty-box'>
                  <div className='incident-types-empty-illustration' aria-hidden='true' />
                  <p>No units found.</p>
                  <span>When units are available from the API, they will appear here.</span>
                </div>
              ) : null}

              {!isLoadingUnits && units.length > 0 ? units.map((unit, index) => (
                <article key={unit.id || `unit-${index}`} className='incident-type-item'>
                  <div className='incident-type-item-content'>
                    <h4>{unit.name}</h4>
                  </div>
                  <div className='incident-type-item-actions'>
                    <button
                      type='button'
                      className='incident-edit-btn'
                      onClick={() => handleEditUnit(unit)}
                      disabled={isDeletingUnitId === unit.id}
                    >
                      <FiEdit2 size={14} /> Edit
                    </button>
                    <button
                      type='button'
                      className='incident-delete-btn'
                      onClick={() => handleDeleteUnit(unit.id)}
                      disabled={isDeletingUnitId === unit.id}
                    >
                      <RiDeleteBin6Line size={14} /> {isDeletingUnitId === unit.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </article>
              )) : null}
            </div>
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

              <label>
                <span>Grade Type</span>
                <select
                  value={activityGradeType}
                  onChange={(event) => setActivityGradeType(event.target.value)}
                  required
                >
                  <option value='PERCENTAGE'>PERCENTAGE</option>
                  <option value='TIME'>TIME</option>
                </select>
              </label>

              <div className='activity-form-actions'>
                {editingActivityId ? (
                  <button type='button' className='incident-secondary-btn' onClick={clearActivityForm}>
                    Cancel
                  </button>
                ) : null}
                <button type='submit' className='incident-primary-btn' disabled={isCreatingActivity || isUpdatingActivity}>
                  {editingActivityId ? (isUpdatingActivity ? 'Updating...' : 'Update Activity') : (isCreatingActivity ? 'Creating...' : (<><IoMdAdd /> Add Activity</>))}
                </button>
              </div>
            </form>

            <div className='activities-list'>
              {isLoadingActivities ? (
                <div className='incident-types-empty-box'>
                  <p>Loading activities…</p>
                </div>
              ) : null}
              {!isLoadingActivities && activities.length === 0 ? (
                <div className='incident-types-empty-box'>
                  <p>No activities yet.</p>
                  <span>Activities returned from the admin API will appear here.</span>
                </div>
              ) : null}
              {!isLoadingActivities && activities.map((activity) => {
                const formattedCreatedAt = activity.createdAt
                  ? new Intl.DateTimeFormat('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }).format(new Date(activity.createdAt))
                  : '—'

                return (
                  <article key={activity.id} className='activity-item'>
                    <div className='activity-item-content'>
                      <h4>{activity.name}</h4>
                      <p>{activity.description}</p>
                      <div className='activity-item-meta'>
                        <span>Grade Type: {activity.gradeType}</span>
                        <span>Unit: {activity.unit}</span>
                        <span>Created by: {activity.createdByName}</span>
                        <span>Date Created: {formattedCreatedAt}</span>
                      </div>
                    </div>
                    <div className='activity-item-actions'>
                      <button type='button' className='incident-edit-btn' onClick={() => handleEditActivity(activity)}>
                        <FiEdit2 size={14} /> Edit
                      </button>
                      <button
                        type='button'
                        className='incident-delete-btn'
                        onClick={() => handleDeleteActivity(activity.id)}
                        disabled={isDeletingActivityId === activity.id}
                      >
                        <RiDeleteBin6Line size={14} /> {isDeletingActivityId === activity.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </article>
                )
              })}
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

                <label>
                  <span>Description</span>
                  <textarea
                    placeholder='Describe the purpose and scope of this role.'
                    value={roleDescription}
                    onChange={(event) => setRoleDescription(event.target.value)}
                    rows={3}
                  />
                </label>

                <div className='role-form-actions'>
                  {editingRoleId ? (
                    <button type='button' className='admin-secondary-btn' onClick={clearRoleForm}>
                      Cancel
                    </button>
                  ) : null}
                  <button type='submit' className='admin-primary-btn' disabled={isCreatingRole}>
                    {editingRoleId ? 'Update Role' : (isCreatingRole ? 'Creating...' : 'Create Role')}
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
                  <label>
                    <span>Description</span>
                    <input
                      type='text'
                      placeholder='Brief description of this permission'
                      value={newPermissionDescription}
                      onChange={(event) => setNewPermissionDescription(event.target.value)}
                    />
                  </label>
                  <button type='submit' className='admin-primary-btn' disabled={isCreatingPermission}>
                    <IoMdAdd /> {isCreatingPermission ? 'Adding...' : 'Add Permission'}
                  </button>
                </form>
                <div className='permissions-list'>
                  {permissions.map((permission) => (
                    <div key={permission.id || permission.name} className='permission-list-item'>
                      <span>{permission.name}</span>
                      <button
                        type='button'
                        className='permission-delete-btn'
                        onClick={() => handleDeletePermission(permission.id)}
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
                        .filter((permission) =>
                          !permissionDraft.some((p) => p?.id === permission?.id)
                        )
                        .map((permission) => (
                          <option key={permission.id || permission.name} value={permission.name}>{permission.name}</option>
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
                        <span key={permission?.id || permission?.name} className='permission-chip'>
                          {permission?.name}
                          <button
                            type='button'
                            onClick={() => handleRemovePermissionFromDraft(permission?.id)}
                          >
                            <IoMdClose size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className='role-form-actions'>
                  <button type='submit' className='admin-primary-btn' disabled={!permissionRoleId || isSavingRolePermissions}>
                    {isSavingRolePermissions ? 'Saving...' : 'Save Permissions'}
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
                          <span key={permission?.id || permission?.name}>{permission?.name}</span>
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

        {activeTab === 'Resources' && (
          <div className='resources-tab'>
            <div className='resources-head'>
              <p>Resources</p>
              <span>Create and publish educational or guidance resources for admins and users.</span>
            </div>

            <section className='resource-editor-section'>
              <h4>Add New Resource</h4>
              <form className='resource-form' onSubmit={handlePostResource}>
                <label>
                  <span>Title</span>
                  <input
                    type='text'
                    placeholder='e.g. How to Handle Bullying Incidents'
                    value={resourceTitle}
                    onChange={(e) => setResourceTitle(e.target.value)}
                    required
                  />
                </label>

                <label>
                  <span>Incident Type</span>
                  <select
                    value={resourceIncidentTypeId}
                    onChange={(e) => setResourceIncidentTypeId(e.target.value)}
                    required
                    disabled={isLoadingIncidentTypes || incidentTypes.length === 0}
                  >
                    <option value='' disabled>Select incident type</option>
                    {incidentTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                  {isLoadingIncidentTypes && <span className='resource-hint'>Loading incident types…</span>}
                  {!isLoadingIncidentTypes && incidentTypes.length === 0 && (
                    <span className='resource-hint'>No incident types yet. Create some under the Incident Types tab.</span>
                  )}
                </label>

                <div className='resource-editor-label'>
                  <span>Content</span>
                  <RichTextEditor
                    value={resourceContent}
                    onChange={setResourceContent}
                    placeholder='Write your resource content here. Use the toolbar to format text, add headings, lists, and links.'
                  />
                </div>

                <div className='resource-form-actions'>
                  <button type='button' className='incident-secondary-btn' onClick={clearResourceForm}>
                    Clear
                  </button>
                  <button
                    type='submit'
                    className='incident-primary-btn'
                    disabled={isPostingResource || isLoadingIncidentTypes || incidentTypes.length === 0}
                  >
                    {isPostingResource ? 'Publishing…' : <><IoMdAdd /> Publish Resource</>}
                  </button>
                </div>
              </form>
            </section>

            <section className='resource-list-section'>
              <h4>Published Resources</h4>
              {isLoadingResources ? (
                <div className='incident-types-list-state'>
                  <div className='incident-types-loader' role='status' aria-live='polite'>
                    <span className='incident-types-loader-label'>Loading resources</span>
                    <span className='incident-types-loader-dots' aria-hidden='true'>
                      <span className='dot' /><span className='dot' /><span className='dot' />
                    </span>
                  </div>
                </div>
              ) : null}
              {!isLoadingResources && resources.length === 0 ? (
                <div className='incident-types-empty-box'>
                  <div className='incident-types-empty-illustration' aria-hidden='true' />
                  <p>No resources yet.</p>
                  <span>Published resources will appear here.</span>
                </div>
              ) : null}
              {!isLoadingResources && resources.length > 0 ? (
                <div className='resource-list'>
                  {resources.map((resource, index) => {
                    const rid = resource.id || resource.resourceId || `resource-${index}`
                    const typeName = resource.incidentTypeName || incidentTypes.find(
                      (t) => t.id === (resource.incidentTypeId || resource.incidentType?.id)
                    )?.name || resource.incidentType?.name || '—'
                    return (
                      <article key={rid} className='resource-item'>
                        <div className='resource-item-meta'>
                          <h5>{resource.title || 'Untitled'}</h5>
                          <span className='resource-incident-badge'>{typeName}</span>
                        </div>
                        <div
                          className='resource-item-preview'
                          dangerouslySetInnerHTML={{ __html: resource.content || '' }}
                        />
                        <div className='resource-item-actions'>
                          <button
                            type='button'
                            className='incident-delete-btn'
                            onClick={() => handleDeleteResource(rid)}
                            disabled={isDeletingResourceId === rid}
                          >
                            <RiDeleteBin6Line size={14} /> {isDeletingResourceId === rid ? 'Deleting…' : 'Delete'}
                          </button>
                        </div>
                      </article>
                    )
                  })}
                </div>
              ) : null}
            </section>
          </div>
        )}

      </div>
    </div>
  )
}


export default Settings
