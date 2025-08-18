import React, { useState, useEffect } from 'react';
import '../css/Resources.css';
import Sidebar from './Sidebar';
import Searchbar from './Searchbar';

import success from '../assets/success.png'
import warning from '../assets/warning.png'

import { GrDocumentPdf } from "react-icons/gr";
import { CiStar, CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegFolderOpen } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoMdClose, IoMdAdd } from "react-icons/io";

const Resources = () => {
  const [isAddFileOpen, setIsAddFileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFileId, setEditFileId] = useState(null);
  const [resources, setResources] = useState(() => {
    const saved = localStorage.getItem("resources");
    return saved ? JSON.parse(saved) : [];
  });
  const [newFile, setNewFile] = useState({ title: "", category: "", content: "" });
  const [selectedResource, setSelectedResource] = useState(null);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false)
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)


  useEffect(() => {
    localStorage.setItem("resources", JSON.stringify(resources));
  }, [resources]);

  
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
    // Edit mode
    setResources(prev => {
      const updated = prev.map(file =>
        file.id === editFileId ? { ...file, ...newFile } : file
      );

      // Update selectedResource from the updated array
      const updatedFile = updated.find(file => file.id === editFileId);
      setSelectedResource(updatedFile);

      return updated;
    });
  } else {
    // Add mode
    const fileWithId = { id: Date.now(), ...newFile };
    setResources(prev => {
      const updated = [...prev, fileWithId];
      setSelectedResource(fileWithId);
      return updated;
    });

    // Show success popup
    setIsSuccessPopupOpen(true);
    setTimeout(() => {
      setIsSuccessPopupOpen(false);
    }, 1000);
  }

  // Reset form and close modal
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
          {/* LEFT SIDE */}
          <div className='left-side'>
            <div className='left-header'>
              <p>Resources</p>
              <button type='button' onClick={handleOpenAddfile}>Add New  <IoMdAdd/></button>
            </div>
            <div className='files'>
              {resources.map((res) => (
                <Resource
                  key={res.id}
                  title={res.title}
                  onClick={() => setSelectedResource(res)}
                />
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className='right-side'>
            {selectedResource ? (
              <>
                <div className='right-header'>
                  <p>
                    <CiStar className='icon' style={{ fill: '#FF7C33' }} size={24} />
                    <span>{selectedResource.category}</span>
                  </p>
                  <div className='header-right'>
                    <CiEdit
                      className='icon'
                      size={24}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleEditClick(selectedResource)}
                    />
                    <FaRegFolderOpen className='icon' size={24} />
                    <RiDeleteBin6Line
                      className='icon'
                      size={24}
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
              <p>Select a file to view details</p>
            )}
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

function Resource({ title, onClick }) {
  const date = new Date().toLocaleDateString();
  const truncatedTitle = title.length > 25 ? title.slice(0, 25) + "..." : title;

  return (
    <div className='file' onClick={onClick}>
      <div className='file-left'><GrDocumentPdf size={30} /></div>
      <div className='file-right'>
        <p>{truncatedTitle}</p>
        <p><span className='date'>{date}</span></p>
      </div>
    </div>
  );
}

export default Resources;
