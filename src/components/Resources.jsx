import React, { useCallback, useEffect, useState } from 'react';
import '../css/Resources.css';
import Sidebar from './Sidebar';
import Searchbar from './Searchbar';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import warning from '../assets/Warning.png';
import {
  MdFormatBold, MdFormatItalic, MdFormatUnderlined, MdFormatStrikethrough,
  MdFormatListBulleted, MdFormatListNumbered, MdFormatAlignLeft,
  MdFormatAlignCenter, MdFormatAlignRight, MdFormatAlignJustify,
  MdFormatQuote, MdCode, MdUndo, MdRedo, MdLink, MdLinkOff,
} from 'react-icons/md';
import { GrDocumentPdf, GrDocumentText } from 'react-icons/gr';
import { CiStar, CiEdit } from 'react-icons/ci';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaRegFolderOpen } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { IoMdClose, IoMdAdd } from 'react-icons/io';

// ─── Rich Text Editor ────────────────────────────────────────────────────────
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
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href || '';
    const url = window.prompt('Enter URL', prev);
    if (url === null) return;
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  // Sync content when editing an existing resource
  useEffect(() => {
    if (editor && value !== undefined && editor.getHTML() !== value) {
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  if (!editor) return null;

  const Btn = ({ onClick, active, title, children }) => (
    <button type='button' onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`rte-btn${active ? ' rte-btn-active' : ''}`} title={title}>
      {children}
    </button>
  );

  return (
    <div className='rte-wrapper'>
      <div className='rte-toolbar'>
        <div className='rte-toolbar-group'>
          <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title='Bold'><MdFormatBold size={16} /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title='Italic'><MdFormatItalic size={16} /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title='Underline'><MdFormatUnderlined size={16} /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title='Strikethrough'><MdFormatStrikethrough size={16} /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title='Code'><MdCode size={16} /></Btn>
        </div>
        <div className='rte-toolbar-separator' />
        <div className='rte-toolbar-group'>
          {[1,2,3].map(l => <Btn key={l} onClick={() => editor.chain().focus().toggleHeading({ level: l }).run()} active={editor.isActive('heading', { level: l })} title={`H${l}`}>H{l}</Btn>)}
        </div>
        <div className='rte-toolbar-separator' />
        <div className='rte-toolbar-group'>
          <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title='Bullet list'><MdFormatListBulleted size={16} /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title='Ordered list'><MdFormatListNumbered size={16} /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title='Blockquote'><MdFormatQuote size={16} /></Btn>
        </div>
        <div className='rte-toolbar-separator' />
        <div className='rte-toolbar-group'>
          <Btn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title='Left'><MdFormatAlignLeft size={16} /></Btn>
          <Btn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title='Center'><MdFormatAlignCenter size={16} /></Btn>
          <Btn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title='Right'><MdFormatAlignRight size={16} /></Btn>
          <Btn onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title='Justify'><MdFormatAlignJustify size={16} /></Btn>
        </div>
        <div className='rte-toolbar-separator' />
        <div className='rte-toolbar-group'>
          <Btn onClick={setLink} active={editor.isActive('link')} title='Link'><MdLink size={16} /></Btn>
          <Btn onClick={() => editor.chain().focus().unsetLink().run()} active={false} title='Unlink'><MdLinkOff size={16} /></Btn>
        </div>
        <div className='rte-toolbar-separator' />
        <div className='rte-toolbar-group'>
          <Btn onClick={() => editor.chain().focus().undo().run()} active={false} title='Undo'><MdUndo size={16} /></Btn>
          <Btn onClick={() => editor.chain().focus().redo().run()} active={false} title='Redo'><MdRedo size={16} /></Btn>
        </div>
      </div>
      <EditorContent editor={editor} className='rte-content' data-placeholder={placeholder || 'Write content here…'} />
    </div>
  );
};
// ─────────────────────────────────────────────────────────────────────────────

const extractResourceItems = (response) => {
  if (Array.isArray(response)) return response;

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
  ];

  return candidates.find(Array.isArray) || [];
};

const normalizeResource = (r) => ({
  id: r.id || r.resourceId || String(Date.now()),
  title: r.title || r.name || 'Untitled',
  incidentTypeId: r.incidentTypeId || r.incidentType?.id || '',
  incidentTypeName: r.incidentTypeName || (typeof r.incidentType === 'string' ? r.incidentType : r.incidentType?.name) || r.category || '—',
  content: r.content ?? r.contents ?? '',
  fileUrl: r.fileUrl || '',
  createdBy: r.createdBy || '',
  createdAt: r.createdAt || Date.now(),
  updatedAt: r.updatedAt || null,
});

const isPdfResourceUrl = (value) => {
  const url = String(value || '').toLowerCase();
  if (!url) return false;
  return /\.pdf([?#].*)?$/.test(url) || url.includes('application/pdf') || url.includes('/pdf');
};

const looksLikeHtml = (value) => /<\/?[a-z][\s\S]*>/i.test(String(value || ''));

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [incidentTypes, setIncidentTypes] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formIncidentTypeId, setFormIncidentTypeId] = useState('');
  const [formContent, setFormContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(null);

  // Load resources
  useEffect(() => {
    let active = true;
    setIsLoading(true);
    api.get('/api/v1/resources?offset=0&limit=20')
      .then((res) => {
        if (!active) return;
        const items = extractResourceItems(res)
          .map(normalizeResource);
        setResources(items);
        if (items.length > 0) setSelectedResource(items[0]);
      })
      .catch(() => { if (active) setResources([]); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  // Load selected resource details using GET /api/v1/resources/{resourceId}
  useEffect(() => {
    if (!selectedResource?.id) return;

    let active = true;
    api.get(`/api/v1/resources/${encodeURIComponent(selectedResource.id)}`)
      .then((res) => {
        if (!active) return;
        const detailed = normalizeResource(res?.data || res || {});
        setSelectedResource((prev) => (prev?.id === detailed.id ? { ...prev, ...detailed } : prev));
        setResources((prev) => prev.map((item) => (item.id === detailed.id ? { ...item, ...detailed } : item)));
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [selectedResource?.id]);

  // Load incident types for the category dropdown
  useEffect(() => {
    let active = true;
    api.get('/api/v1/incident-types')
      .then((res) => {
        if (!active) return;
        const items = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        setIncidentTypes(items);
      })
      .catch(() => {})
      .finally(() => { active = false; });
    return () => { active = false; };
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormTitle('');
    setFormIncidentTypeId('');
    setFormContent('');
    setIsModalOpen(true);
  };

  const openEditModal = (resource) => {
    setIsEditing(true);
    setEditingId(resource.id);
    setFormTitle(resource.title);
    setFormIncidentTypeId(resource.incidentTypeId);
    setFormContent(resource.content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingId(null);
    setFormTitle('');
    setFormIncidentTypeId('');
    setFormContent('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = formTitle.trim();
    const content = formContent.trim();
    if (!title || !formIncidentTypeId || !content || content === '<p></p>') {
      toast.error('Please fill in all fields.');
      return;
    }

    setIsSaving(true);
    const loadingId = toast.loading(isEditing ? 'Saving changes…' : 'Publishing resource…');

    try {
      const payload = { name: title, incidentTypeId: formIncidentTypeId, contents: content };

      if (isEditing && editingId) {
        const formData = new FormData();
        const resourceJson = JSON.stringify({ name: title, incidentTypeId: formIncidentTypeId, contents: content });
        const resourceBlob = new Blob([resourceJson], { type: 'application/json' });
        formData.append('resource', resourceBlob);

        const res = await api.put(`/api/v1/resources/${editingId}`, formData, { auth: true });
        const updated = normalizeResource({ ...payload, id: editingId, ...(res?.data || {}) });
        // Resolve incidentTypeName from loaded types
        const typeName = incidentTypes.find(t => t.id === formIncidentTypeId)?.name || '—';
        updated.incidentTypeName = typeName;
        setResources(prev => prev.map(r => r.id === editingId ? updated : r));
        setSelectedResource(updated);
        toast.success('Resource updated!', { id: loadingId });
      } else {
        // Build FormData for multipart resource creation.
        // The 'resource' part must have Content-Type: application/json for Spring's @RequestPart.
        const formData = new FormData();
        const resourceJson = JSON.stringify({ name: title, incidentTypeId: formIncidentTypeId, contents: content });
        const resourceBlob = new Blob([resourceJson], { type: 'application/json' });
        formData.append('resource', resourceBlob);
        
        const res = await api.post('/api/v1/resources', formData, { auth: true });
        const created = normalizeResource({ ...payload, ...(res?.data || res || {}) });
        const typeName = incidentTypes.find(t => t.id === formIncidentTypeId)?.name || '—';
        created.incidentTypeName = typeName;
        setResources(prev => [created, ...prev]);
        setSelectedResource(created);
        toast.success('Resource published!', { id: loadingId });
      }
      closeModal();
    } catch (error) {
      toast.error(error.message || 'Unable to save resource.', { id: loadingId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedResource) return;
    setIsDeletingId(selectedResource.id);
    try {
      await api.delete(`/api/v1/resources/${selectedResource.id}`, { auth: true });
      const remaining = resources.filter(r => r.id !== selectedResource.id);
      setResources(remaining);
      setSelectedResource(remaining[0] || null);
      setIsDeletePopupOpen(false);
      toast.success('Resource deleted.');
    } catch (error) {
      toast.error(error.message || 'Unable to delete resource.');
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <>
      <div className='resources-container'>
        <Searchbar />
        <Sidebar />
        <div className='resources'>
          <div className='resources-header'>
            <p>Resources</p>
            <button type='button' onClick={openAddModal}>
              Add new <IoMdAdd />
            </button>
          </div>

          <div className='resources-main'>
            {/* Left: file list */}
            <div className='left-side'>
              <div className='left-header'>
                <p>All Files</p>
              </div>
              <div className='files'>
                {isLoading && (
                  <p style={{ padding: '12px', fontSize: '13px', color: '#888' }}>Loading resources…</p>
                )}
                {!isLoading && resources.length === 0 && (
                  <p style={{ padding: '12px', fontSize: '13px', color: '#888' }}>No resources yet. Click "Add new" to create one.</p>
                )}
                {resources.map((res) => (
                  <ResourceCard
                    key={res.id}
                    title={res.title}
                    createdAt={res.createdAt}
                    createdBy={res.createdBy}
                    fileUrl={res.fileUrl}
                    content={res.content}
                    isActive={selectedResource?.id === res.id}
                    onClick={() => setSelectedResource(res)}
                  />
                ))}
              </div>
            </div>

            {/* Right: content viewer */}
            <div className='right-side'>
              {selectedResource ? (
                <>
                  <div className='right-header'>
                    <p>
                      <CiStar className='icon' style={{ fill: '#FF7C33' }} size={22} />
                      <span>{selectedResource.incidentTypeName}</span>
                    </p>
                    <div className='header-right'>
                      <CiEdit
                        className='icon'
                        size={22}
                        onClick={() => openEditModal(selectedResource)}
                        title='Edit'
                      />
                      <FaRegFolderOpen className='icon' size={20} />
                      <RiDeleteBin6Line
                        className='icon'
                        size={22}
                        onClick={() => setIsDeletePopupOpen(true)}
                        title='Delete'
                      />
                    </div>
                  </div>
                  <div className='right-body'>
                    <h1>{selectedResource.title}</h1>
                    <p className='resource-meta-line'>
                      {selectedResource.createdBy ? `Created by: ${selectedResource.createdBy}` : 'Created by: —'}
                      {isPdfResourceUrl(selectedResource.fileUrl) ? ' • Source: PDF upload' : looksLikeHtml(selectedResource.content) ? ' • Source: HTML content' : ' • Source: Text content'}
                    </p>
                    <div
                      className='resource-html-content'
                      dangerouslySetInnerHTML={{ __html: selectedResource.content }}
                    />
                  </div>
                </>
              ) : (
                <div className='empty-state'>
                  <p>Select a resource on the left to view content.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className='modal-overlay'>
          <div className='add-new-file res-modal-wide'>
            <div className='header'>
              <div className='back' onClick={closeModal}><FaArrowLeftLong /></div>
              <p>{isEditing ? 'Edit Resource' : 'Add New Resource'}</p>
            </div>
            <form className='res-form' onSubmit={handleSubmit}>
              <div className='res-form-field'>
                <label>Title</label>
                <input
                  type='text'
                  placeholder='e.g. Impact of Gender-based Violence'
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                />
              </div>

              <div className='res-form-field'>
                <label>Incident Type</label>
                <select
                  value={formIncidentTypeId}
                  onChange={(e) => setFormIncidentTypeId(e.target.value)}
                  required
                >
                  <option value=''>Select incident type</option>
                  {incidentTypes.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className='res-form-field'>
                <label>Content</label>
                <RichTextEditor
                  value={formContent}
                  onChange={setFormContent}
                  placeholder='Write your resource content here. Use the toolbar to format text, add headings, lists, and links.'
                />
              </div>

              <div className='res-form-actions'>
                <button type='button' className='res-btn-cancel' onClick={closeModal}>Cancel</button>
                <button type='submit' className='res-btn-submit' disabled={isSaving}>
                  {isSaving ? 'Saving…' : (isEditing ? 'Save Changes' : 'Publish Resource')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {isDeletePopupOpen && (
        <div className='modal-overlay'>
          <div className='delete-popup'>
            <div className='close-icon'><IoMdClose size={30} onClick={() => setIsDeletePopupOpen(false)} /></div>
            <img src={warning} alt='warning' />
            <p>Delete Resource File</p>
            <p>
              <span>You are about to delete this file. There is no way to access this file once </span>
              <span>it is deleted. Are you sure you want to delete it?</span>
            </p>
            <div className='buttons'>
              <button type='button' onClick={() => setIsDeletePopupOpen(false)}>Cancel</button>
              <button type='button' onClick={handleDeleteConfirm} disabled={!!isDeletingId}>
                {isDeletingId ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function ResourceCard({ title, createdAt, createdBy, fileUrl, content, isActive, onClick }) {
  const formatDate = (date) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date));
  const truncated = title.length > 25 ? title.slice(0, 25) + '…' : title;
  const isPdf = isPdfResourceUrl(fileUrl);
  const contentTypeLabel = isPdf ? 'PDF' : looksLikeHtml(content) ? 'HTML' : 'TEXT';
  return (
    <div className={`file ${isActive ? 'active' : ''}`} onClick={onClick}>
      <div className='file-left'>{isPdf ? <GrDocumentPdf size={30} /> : <GrDocumentText size={30} />}</div>
      <div className='file-right'>
        <p>{truncated}</p>
        <p className='created-by'>{createdBy ? `Created by: ${createdBy}` : 'Created by: —'}</p>
        <p><span className='meta'>{formatDate(createdAt || Date.now())} • {contentTypeLabel}</span></p>
      </div>
    </div>
  );
}

export default Resources;
