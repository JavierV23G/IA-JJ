import React, { useState, useEffect } from 'react';
import '../../../../../styles/developer/Patients/InfoPaciente/DocumentsComponent.scss';

const DocumentsComponent = ({ patient, onUpdateDocuments }) => {
  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewDocument, setViewDocument] = useState(null);

  // Mock documents data - In a real app, this would come from an API
  useEffect(() => {
    if (patient?.documents) {
      setDocuments(patient.documents);
    } else {
      // Mock data for testing
      setDocuments([
        {
          id: 1,
          name: 'Initial Evaluation Report.pdf',
          type: 'application/pdf',
          date: '2025-04-10T15:30:00',
          size: 1240000,
          uploadedBy: 'Dr. Michael Chen',
          category: 'Evaluation'
        },
        {
          id: 2,
          name: 'Prescription for PT services.pdf',
          type: 'application/pdf',
          date: '2025-04-05T10:15:00',
          size: 890000,
          uploadedBy: 'Dr. Emily Parker',
          category: 'Prescription'
        },
        {
          id: 3,
          name: 'Medical Records - Hospital Discharge.docx',
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          date: '2025-03-25T09:45:00',
          size: 2540000,
          uploadedBy: 'Intra Care Home Health',
          category: 'Medical Records'
        },
        {
          id: 4,
          name: 'Insurance Verification.pdf',
          type: 'application/pdf',
          date: '2025-03-20T14:20:00',
          size: 980000,
          uploadedBy: 'Admin Staff',
          category: 'Insurance'
        }
      ]);
    }
  }, [patient]);

  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      
      // Create new document object
      const newDocument = {
        id: documents.length + 1,
        name: selectedFile.name,
        type: selectedFile.type,
        date: new Date().toISOString(),
        size: selectedFile.size,
        uploadedBy: 'Current User', // In real app, get from auth context
        category: 'Uncategorized'
      };

      // Add to documents list
      const updatedDocuments = [...documents, newDocument];
      setDocuments(updatedDocuments);
      
      // Call parent handler if provided
      if (onUpdateDocuments) {
        onUpdateDocuments(updatedDocuments);
      }
      
      // Reset upload state
      setTimeout(() => {
        setIsUploading(false);
        setSelectedFile(null);
        setUploadProgress(0);
      }, 500);
    }, 2500);
  };

  const handleDeleteDocument = (id) => {
    // Show confirmation first
    setShowConfirmDelete(id);
  };

  const confirmDelete = (id) => {
    // Filter out the document with the given id
    const updatedDocuments = documents.filter(doc => doc.id !== id);
    setDocuments(updatedDocuments);
    
    // Call parent handler if provided
    if (onUpdateDocuments) {
      onUpdateDocuments(updatedDocuments);
    }
    
    // Reset confirmation
    setShowConfirmDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(null);
  };

  const handleViewDocument = (document) => {
    setViewDocument(document);
  };

  const closeDocumentViewer = () => {
    setViewDocument(null);
  };

  const downloadDocument = (document) => {
    // In a real app, this would download the file
    console.log(`Downloading document: ${document.name}`);
    
    // Simulate download by creating a temporary link
    const link = document.createElement('a');
    link.href = '#'; // This would be the download URL in a real app
    link.setAttribute('download', document.name);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) {
      return <i className="fas fa-file-pdf"></i>;
    } else if (fileType.includes('word') || fileType.includes('doc')) {
      return <i className="fas fa-file-word"></i>;
    } else if (fileType.includes('sheet') || fileType.includes('excel') || fileType.includes('xls')) {
      return <i className="fas fa-file-excel"></i>;
    } else if (fileType.includes('image')) {
      return <i className="fas fa-file-image"></i>;
    } else {
      return <i className="fas fa-file-alt"></i>;
    }
  };

  // Filter and sort documents
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'date') {
      comparison = new Date(a.date) - new Date(b.date);
    } else if (sortBy === 'size') {
      comparison = a.size - b.size;
    } else if (sortBy === 'category') {
      comparison = a.category.localeCompare(b.category);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="documents-component">
      <div className="documents-header">
        <div className="header-title">
          <i className="fas fa-file-alt"></i>
          <h3>Patient Documents</h3>
        </div>
        
        <div className="header-actions">
          <div className="search-documents">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Search documents..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="sort-options">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-by"
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="size">Size</option>
              <option value="category">Category</option>
            </select>
            
            <button 
              className="sort-order" 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              title={sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
            >
              <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
            </button>
          </div>
          
          <label className="upload-button">
            <input 
              type="file" 
              onChange={handleFileSelect} 
              style={{ display: 'none' }}
            />
            <i className="fas fa-plus"></i>
            <span>Upload Document</span>
          </label>
        </div>
      </div>
      
      {/* Upload progress */}
      {isUploading && (
        <div className="upload-progress-container">
          <div className="upload-info">
            <div className="file-preview">
              {getFileIcon({ type: selectedFile.type })}
              <span className="file-name">{selectedFile.name}</span>
            </div>
            <div className="progress-percentage">{uploadProgress}%</div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${uploadProgress}%` }}
            >
              <div className="progress-glow"></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Selected file ready for upload */}
      {selectedFile && !isUploading && (
        <div className="selected-file-container">
          <div className="file-preview">
            {getFileIcon({ type: selectedFile.type })}
            <span className="file-name">{selectedFile.name}</span>
            <span className="file-size">({formatFileSize(selectedFile.size)})</span>
          </div>
          <div className="file-actions">
            <button className="cancel-button" onClick={() => setSelectedFile(null)}>
              <i className="fas fa-times"></i>
              <span>Cancel</span>
            </button>
            <button className="upload-now-button" onClick={handleUpload}>
              <i className="fas fa-cloud-upload-alt"></i>
              <span>Upload Now</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Documents list */}
      <div className="documents-list">
        {sortedDocuments.length > 0 ? (
          <>
            <div className="documents-table-header">
              <div className="document-name-col">Document</div>
              <div className="document-category-col">Category</div>
              <div className="document-date-col">Date Uploaded</div>
              <div className="document-size-col">Size</div>
              <div className="document-uploaded-by-col">Uploaded By</div>
              <div className="document-actions-col">Actions</div>
            </div>
            
            {sortedDocuments.map(document => (
              <div key={document.id} className="document-item">
                <div className="document-name-col">
                  <div className="document-icon">
                    {getFileIcon(document.type)}
                  </div>
                  <div className="document-name-text">
                    {document.name}
                  </div>
                </div>
                <div className="document-category-col">
                  <span className={`category-badge ${document.category.toLowerCase().replace(/\s+/g, '-')}`}>
                    {document.category}
                  </span>
                </div>
                <div className="document-date-col">
                  {formatDate(document.date)}
                </div>
                <div className="document-size-col">
                  {formatFileSize(document.size)}
                </div>
                <div className="document-uploaded-by-col">
                  {document.uploadedBy}
                </div>
                <div className="document-actions-col">
                  <button 
                    className="document-action view-action" 
                    onClick={() => handleViewDocument(document)}
                    title="View Document"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button 
                    className="document-action download-action" 
                    onClick={() => downloadDocument(document)}
                    title="Download Document"
                  >
                    <i className="fas fa-download"></i>
                  </button>
                  <button 
                    className="document-action delete-action" 
                    onClick={() => handleDeleteDocument(document.id)}
                    title="Delete Document"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                  
                  {showConfirmDelete === document.id && (
                    <div className="delete-confirmation">
                      <p>Delete this document?</p>
                      <div className="confirmation-actions">
                        <button onClick={() => confirmDelete(document.id)} className="confirm-yes">
                          Yes
                        </button>
                        <button onClick={cancelDelete} className="confirm-no">
                          No
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="no-documents">
            <div className="no-docs-icon">
              <i className="fas fa-file-upload"></i>
            </div>
            <p>No documents available</p>
            <label className="add-document-btn">
              <input 
                type="file" 
                onChange={handleFileSelect} 
                style={{ display: 'none' }}
              />
              <i className="fas fa-plus"></i>
              <span>Upload First Document</span>
            </label>
          </div>
        )}
      </div>
      
      {/* Document viewer */}
      {viewDocument && (
        <div className="document-viewer-overlay">
          <div className="document-viewer">
            <div className="viewer-header">
              <div className="viewer-title">
                <div className="document-icon">
                  {getFileIcon(viewDocument.type)}
                </div>
                <h3>{viewDocument.name}</h3>
              </div>
              <div className="viewer-actions">
                <button 
                  className="download-action" 
                  onClick={() => downloadDocument(viewDocument)}
                  title="Download Document"
                >
                  <i className="fas fa-download"></i>
                </button>
                <button 
                  className="close-action" 
                  onClick={closeDocumentViewer}
                  title="Close Viewer"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            <div className="viewer-content">
              {/* In a real app, this would render the document based on type */}
              <div className="document-preview">
                <div className="preview-placeholder">
                  <i className="fas fa-file-alt"></i>
                  <p>Document Preview</p>
                  <span>Preview would be rendered here based on document type</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsComponent;