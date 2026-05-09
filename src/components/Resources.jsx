import React, { useState, useEffect } from 'react';
import '../css/Resources.css';
import Sidebar from './Sidebar';
import Searchbar from './Searchbar';

import success from '../assets/success.png'
import warning from '../assets/Warning.png'

import { GrDocumentPdf } from "react-icons/gr";
import { CiStar, CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegFolderOpen } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoMdClose, IoMdAdd } from "react-icons/io";

const demoResources = [
  {
    id: 1001,
    title: 'What is Gender-based Violence?',
    category: 'Gender-based Violence',
    content:
      'Gender-based violence (GBV) is any harmful act directed at a person based on gender. It can include physical abuse, sexual abuse, emotional intimidation, economic control, threats, coercion, and deprivation of liberty in both public and private spaces. GBV affects people of all backgrounds and is often rooted in unequal power dynamics.\n\nIn a campus or workplace context, GBV may appear as harassment, stalking, coercive relationships, assault, or retaliatory behavior after reporting. Early reporting, survivor-centered response, and clear referral pathways are key to prevention and recovery.',
    createdAt: new Date('2024-08-03').getTime(),
  },
  {
    id: 1002,
    title: 'How to Support Survivors Respectfully',
    category: 'Sexual Harassment',
    content:
      'When someone shares an experience of abuse, begin by listening without judgment. Avoid blaming language, avoid forcing details, and let the survivor set the pace. Focus on safety, consent, confidentiality, and practical options.\n\nHelpful responses include: "I believe you," "This was not your fault," and "How can I support you right now?" Offer available channels such as counseling, medical care, legal support, and formal reporting mechanisms while respecting the survivor\'s decision-making.',
    createdAt: new Date('2024-07-21').getTime(),
  },
  {
    id: 1003,
    title: 'Reporting Process and Case Tracking',
    category: 'Rape Issues',
    content:
      'A standard response workflow includes: intake, immediate safety assessment, evidence guidance, referral to support services, investigation, committee review, and final resolution with documented outcomes.\n\nClear status tracking should communicate exactly where a case sits at every stage. Recommended statuses include: Pending Intake, In Progress, Awaiting Decision, Resolved, and Closed. Each stage should include owner, expected timeline, and survivor communication checkpoints.',
    createdAt: new Date('2024-06-12').getTime(),
  },
];

const Resources = () => {
  const [isAddFileOpen, setIsAddFileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFileId, setEditFileId] = useState(null);
  const [resources, setResources] = useState(() => {
    const saved = localStorage.getItem("resources");
    if (!saved) return demoResources;

    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return demoResources;
      }
      return parsed;
    } catch {
      return demoResources;
    }
  });
  const [newFile, setNewFile] = useState({ title: "", category: "", content: "" });
  const [selectedResource, setSelectedResource] = useState(null);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false)
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)


  useEffect(() => {
    localStorage.setItem("resources", JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    if (!selectedResource && resources.length > 0) {
      setSelectedResource(resources[0]);
    }
  }, [resources, selectedResource]);

  
  function handleOpenAddfile() {
    setIsAddFileOpen(true);
  }

function handleOpenDeleteModal(){
  setIsDeletePopupOpen(prev => !prev)
}

function handleCloseDeleteModal(){
  setIsDeletePopupOpen(false)
}

  function handleCloseAddfile() {
    setIsAddFileOpen(false);
    setIsEditing(false);
    setEditFileId(null);
    setNewFile({ title: "", category: "", content: "" });
  }

function handleAddOrEditFile(e) {
  e.preventDefault();
  if (!newFile.title || !newFile.content || !newFile.category) {
    return alert("Please fill all fields");
  }

  if (isEditing && editFileId) {
    setResources(prev => {
      const updated = prev.map(file =>
        file.id === editFileId ? { ...file, ...newFile } : file
      );

      const updatedFile = updated.find(file => file.id === editFileId);
      setSelectedResource(updatedFile);

      return updated;
    });
  } else {
    const fileWithId = { id: Date.now(), createdAt: Date.now(), ...newFile };
    setResources(prev => {
      const updated = [...prev, fileWithId];
      setSelectedResource(fileWithId);
      return updated;
    });

    setIsSuccessPopupOpen(true);
    setTimeout(() => {
      setIsSuccessPopupOpen(false);
    }, 1000);
  }

  setNewFile({ title: "", category: "", content: "" });
  handleCloseAddfile();
}

  function handleDeleteFile() {
    if (!selectedResource) return;
    setResources(prev => prev.filter(res => res.id !== selectedResource.id));
    setSelectedResource(null);
    handleCloseDeleteModal()
  }

  function handleEditClick(file) {
    setIsEditing(true);
    setEditFileId(file.id);
    setNewFile({ title: file.title, category: file.category, content: file.content });
    setIsAddFileOpen(true);
  }

  return (
    <>
      <div className='resources-container'>
        <Searchbar />
        <Sidebar />
        <div className='resources'>
          <div className='resources-header'>
            <p>Resources</p>
            <button type='button' onClick={handleOpenAddfile}>Add new <IoMdAdd/></button>
          </div>

          <div className='resources-main'>
            <div className='left-side'>
              <div className='left-header'>
                <p>All Files</p>
              </div>
              <div className='files'>
                {resources.map((res) => (
                  <Resource
                    key={res.id}
                    title={res.title}
                    createdAt={res.createdAt}
                    isActive={selectedResource?.id === res.id}
                    onClick={() => setSelectedResource(res)}
                  />
                ))}
              </div>
            </div>

            <div className='right-side'>
              {selectedResource ? (
                <>
                  <div className='right-header'>
                    <p>
                      <CiStar className='icon' style={{ fill: '#FF7C33' }} size={22} />
                      <span>{selectedResource.category}</span>
                    </p>
                    <div className='header-right'>
                      <CiEdit
                        className='icon'
                        size={22}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEditClick(selectedResource)}
                      />
                      <FaRegFolderOpen className='icon' size={20} />
                      <RiDeleteBin6Line
                        className='icon'
                        size={22}
                        style={{ cursor: "pointer" }}
                        onClick={handleOpenDeleteModal}
                      />
                    </div>
                  </div>
                  <div className='right-body'>
                    <h1>{selectedResource.title}</h1>
                    <p>{selectedResource.content}</p>
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

      {/* MODAL for Add / Edit */}
      {isAddFileOpen &&
        <div className='modal-overlay'>
          <div className='add-new-file'>
            <div className='header'>
              <div className='back' onClick={handleCloseAddfile}><FaArrowLeftLong /></div>
              <p>{isEditing ? "Edit File" : "Add New File"}</p>
            </div>
            <form className='form' onSubmit={handleAddOrEditFile}>
              <label>Name</label>
              <input
                type='text'
                placeholder='Impact of Gender-based Violence'
                value={newFile.title}
                onChange={(e) => setNewFile({ ...newFile, title: e.target.value })}
              />
              <label>Category</label>
              <select
                value={newFile.category}
                onChange={(e) => setNewFile({ ...newFile, category: e.target.value })}
              >
                <option value="">Select</option>
                <option value="Gender-based Violence">Gender-based Violence</option>
                <option value="Sexual Harassment">Sexual Harassment</option>
                <option value="Rape Issues">Rape Issues</option>
              </select>
              <label>Content</label>
              <textarea
                placeholder="Write the content here..."
                value={newFile.content}
                onChange={(e) => setNewFile({ ...newFile, content: e.target.value })}
              />
              <button type='submit'>{isEditing ? "Save Changes" : "Submit"}</button>
            </form>
          </div>
        </div>
      }

    {isSuccessPopupOpen &&
      <div className='modal-overlay'>
      <div className='success-popup'>
      <img src={success} alt='image' />
      <p>Congratulations</p>
      <p>New file added successfully</p>
      </div>
    </div>}

{isDeletePopupOpen &&
    <div className='modal-overlay'>
        <div className='delete-popup'>
        <div className='close-icon'><IoMdClose size={30} onClick={handleCloseDeleteModal}/></div>
        <img src={warning} />
        <p>Delete Resource File</p>
        <p><span>You are about to delete this file. There is no way to access this file once </span>
          <span>it is deleted. Are you sure you want to delete it?</span>
        </p>
        <div className='buttons'>
        <button type='submit' onClick={handleCloseDeleteModal}>Cancel</button>
        <button type='submit' onClick={handleDeleteFile}>Delete</button>
        </div>
        </div>
    </div>}
    </>
  );
};

function Resource({ title, createdAt, isActive, onClick }) {
function formatDate(date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}
  const truncatedTitle = title.length > 25 ? title.slice(0, 25) + "..." : title;

  return (
    <div className={`file ${isActive ? 'active' : ''}`} onClick={onClick}>
      <div className='file-left'><GrDocumentPdf size={30} /></div>
      <div className='file-right'>
        <p>{truncatedTitle}</p>
        <p><span className='meta'>22mb • {formatDate(createdAt || Date.now())}</span></p>
      </div>
    </div>
  );
}

export default Resources;
