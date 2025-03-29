import React, { useState, useRef } from 'react';
import '../../../../../styles/developer/Patients/InfoPaciente/DocumentSection.scss';

const DocumentSection = ({ 
  documents, 
  onAddDocument, 
  onDeleteDocument, 
  onStatusChange, 
  expanded, 
  onToggleExpand, 
  isLoading 
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('uploadDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadingStatus, setUploadingStatus] = useState(null); // null, 'uploading', 'success', 'error'
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuDocId, setContextMenuDocId] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [expandedDoc, setExpandedDoc] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  
  // Estado para el formulario de carga
  const [uploadForm, setUploadForm] = useState({
    files: [],
    type: '',
    category: '',
    notes: ''
  });

  // Función para filtrar documentos por categoría y término de búsqueda
  const getFilteredDocuments = () => {
    return documents.filter(doc => {
      const matchesTab = activeTab === 'all' || doc.category === activeTab;
      const matchesSearch = searchTerm === '' || 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesTab && matchesSearch;
    });
  };

  // Función para ordenar documentos
  const getSortedDocuments = () => {
    const filtered = getFilteredDocuments();
    
    return filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Convertir fechas para comparación
      if (sortBy === 'uploadDate') {
        aValue = new Date(aValue.split('-').reverse().join('-'));
        bValue = new Date(bValue.split('-').reverse().join('-'));
      }
      
      // Convertir tamaños para comparación
      if (sortBy === 'size') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  };

  // Manejar cambio en ordenamiento
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc'); // Por defecto ordenar descendente en nuevo campo
    }
  };

  // Manejar selección de documento
  const handleSelectDocument = (docId) => {
    if (selectedDocuments.includes(docId)) {
      setSelectedDocuments(selectedDocuments.filter(id => id !== docId));
    } else {
      setSelectedDocuments([...selectedDocuments, docId]);
    }
    
    if (selectedDocuments.length > 0 || !selectedDocuments.includes(docId)) {
      setShowBulkActions(true);
    } else {
      setShowBulkActions(false);
    }
  };

  // Manejar selección de todos los documentos
  const handleSelectAll = () => {
    const filteredDocs = getFilteredDocuments();
    
    if (selectedDocuments.length === filteredDocs.length) {
      setSelectedDocuments([]);
      setShowBulkActions(false);
    } else {
      setSelectedDocuments(filteredDocs.map(doc => doc.id));
      setShowBulkActions(true);
    }
  };

  // Manejar acciones masivas
  const handleBulkAction = (action) => {
    if (action === 'delete') {
      // Confirmar antes de eliminar
      if (window.confirm(`¿Está seguro de eliminar ${selectedDocuments.length} documento(s)?`)) {
        selectedDocuments.forEach(docId => {
          onDeleteDocument(docId);
        });
        setSelectedDocuments([]);
        setShowBulkActions(false);
      }
    } else if (action === 'verify') {
      selectedDocuments.forEach(docId => {
        onStatusChange(docId, 'verified');
      });
      setSelectedDocuments([]);
      setShowBulkActions(false);
    }
  };

  // Manejar click derecho para menú contextual
  const handleContextMenu = (e, docId) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuDocId(docId);
    setShowContextMenu(true);
  };

  // Cerrar menú contextual
  const closeContextMenu = () => {
    setShowContextMenu(false);
  };

  // Manejar acción de menú contextual
  const handleContextAction = (action) => {
    if (!contextMenuDocId) return;
    
    if (action === 'view') {
      setExpandedDoc(contextMenuDocId);
    } else if (action === 'download') {
      // Simular descarga
      alert('Descargando documento...');
    } else if (action === 'verify') {
      onStatusChange(contextMenuDocId, 'verified');
    } else if (action === 'delete') {
      if (window.confirm('¿Está seguro de eliminar este documento?')) {
        onDeleteDocument(contextMenuDocId);
      }
    }
    
    closeContextMenu();
  };

  // Manejar arrastre de archivos
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  // Manejar selección de archivos
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelected(e.target.files);
    }
  };

  const handleFilesSelected = (files) => {
    setUploadForm({
      ...uploadForm,
      files: Array.from(files)
    });
    setShowUploadModal(true);
  };

  // Manejar cambios en el formulario de carga
  const handleUploadFormChange = (e) => {
    const { name, value } = e.target;
    setUploadForm({
      ...uploadForm,
      [name]: value
    });
  };

  // Simular proceso de carga de archivos
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    
    if (uploadForm.files.length === 0) {
      alert('Por favor seleccione al menos un archivo para cargar.');
      return;
    }
    
    // Iniciar simulación de carga
    setUploadingStatus('uploading');
    setUploadProgress(0);
    
    // Simular progreso de carga
    const totalFiles = uploadForm.files.length;
    let filesProcessed = 0;
    
    uploadForm.files.forEach((file, index) => {
      // Simular tiempo de carga variable según tamaño del archivo
      const fileSize = file.size;
      const simulatedUploadTime = Math.min(2000 + (fileSize / 1000000) * 500, 5000);
      
      setTimeout(() => {
        filesProcessed++;
        setUploadProgress(Math.round((filesProcessed / totalFiles) * 100));
        
        // Cuando todos los archivos se han procesado
        if (filesProcessed === totalFiles) {
          setTimeout(() => {
            setUploadingStatus('success');
            
            // Añadir documentos al estado
            uploadForm.files.forEach(file => {
              const newDocument = {
                name: file.name,
                type: uploadForm.type || getDocumentTypeFromFileName(file.name),
                category: uploadForm.category || 'administrative',
                size: formatFileSize(file.size)
              };
              
              onAddDocument(newDocument);
            });
            
            // Reiniciar formulario después de breve pausa
            setTimeout(() => {
              setUploadingStatus(null);
              setUploadForm({
                files: [],
                type: '',
                category: '',
                notes: ''
              });
              setShowUploadModal(false);
            }, 1500);
          }, 500);
        }
      }, simulatedUploadTime * (index + 1) / 2); // Escalonar tiempos para simular carga paralela
    });
  };

  // Inferir tipo de documento a partir del nombre del archivo
  const getDocumentTypeFromFileName = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) {
      return 'image';
    } else if (['pdf'].includes(extension)) {
      if (fileName.toLowerCase().includes('assessment')) return 'assessment';
      if (fileName.toLowerCase().includes('referral')) return 'referral';
      if (fileName.toLowerCase().includes('consent')) return 'consent';
      if (fileName.toLowerCase().includes('insurance')) return 'insurance';
      return 'document';
    } else if (['doc', 'docx', 'odt', 'rtf', 'txt'].includes(extension)) {
      return 'document';
    } else if (['xls', 'xlsx', 'csv'].includes(extension)) {
      return 'spreadsheet';
    } else if (['mp3', 'wav', 'm4a'].includes(extension)) {
      return 'audio';
    } else if (['mp4', 'mov', 'avi', 'wmv'].includes(extension)) {
      return 'video';
    } else {
      return 'other';
    }
  };

  // Formatear tamaño de archivo a unidades legibles
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Obtener ícono para tipo de documento
  const getDocumentIcon = (type) => {
    switch (type) {
      case 'assessment':
        return 'fas fa-clipboard-check';
      case 'referral':
        return 'fas fa-file-medical';
      case 'consent':
        return 'fas fa-file-signature';
      case 'insurance':
        return 'fas fa-file-invoice-dollar';
      case 'image':
        return 'fas fa-file-image';
      case 'spreadsheet':
        return 'fas fa-file-excel';
      case 'audio':
        return 'fas fa-file-audio';
      case 'video':
        return 'fas fa-file-video';
      default:
        return 'fas fa-file-pdf';
    }
  };

  // Obtener color para tipo de documento
  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'status-verified';
      case 'pending':
        return 'status-pending';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };

  // Obtener número de documentos por categoría
  const getDocumentCountByCategory = (category) => {
    return documents.filter(doc => doc.category === category).length;
  };

  // Si estamos realizando una acción de carga, mostrar estado de carga
  if (isLoading) {
    return (
      <div className={`document-section-card ${expanded ? 'expanded' : 'collapsed'}`}>
        <div className="card-header">
          <div className="header-icon documents">
            <i className="fas fa-file-medical-alt"></i>
          </div>
          <h3>Patient Documents</h3>
          <div className="header-actions">
            <button className="expand-btn" onClick={onToggleExpand} title={expanded ? "Collapse" : "Expand"}>
              <i className={`fas fa-chevron-${expanded ? 'up' : 'down'}`}></i>
            </button>
          </div>
        </div>
        <div className="card-content loading-state">
          <div className="loading-pulse"></div>
          <div className="loading-message">Processing documents...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`document-section-card ${expanded ? 'expanded' : 'collapsed'}`}>
      <div className="card-header">
        <div className="header-icon documents">
          <i className="fas fa-file-medical-alt"></i>
        </div>
        <h3>Patient Documents</h3>
        <div className="header-actions">
          <button 
            className="upload-btn" 
            onClick={() => fileInputRef.current.click()}
            title="Upload New Documents"
          >
            <i className="fas fa-cloud-upload-alt"></i> Upload
          </button>
          <button className="expand-btn" onClick={onToggleExpand} title={expanded ? "Collapse" : "Expand"}>
            <i className={`fas fa-chevron-${expanded ? 'up' : 'down'}`}></i>
          </button>
        </div>
      </div>

      {expanded && (
        <div 
          className={`card-content document-content ${dragActive ? 'drag-active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Zona de arrastre para subir archivos */}
          {dragActive && (
            <div className="drag-file-overlay">
              <i className="fas fa-cloud-upload-alt"></i>
              <h3>Drop Files to Upload</h3>
              <p>Release your files to upload them to this patient's records</p>
            </div>
          )}

          {/* Tabs de categorías de documentos */}
          <div className="document-tabs">
            <button 
              className={`doc-tab ${activeTab === 'all' ? 'active' : ''}`} 
              onClick={() => setActiveTab('all')}
            >
              All Documents
              <span className="doc-count">{documents.length}</span>
            </button>
            <button 
              className={`doc-tab ${activeTab === 'clinical' ? 'active' : ''}`} 
              onClick={() => setActiveTab('clinical')}
            >
              Clinical
              <span className="doc-count">{getDocumentCountByCategory('clinical')}</span>
            </button>
            <button 
              className={`doc-tab ${activeTab === 'administrative' ? 'active' : ''}`} 
              onClick={() => setActiveTab('administrative')}
            >
              Administrative
              <span className="doc-count">{getDocumentCountByCategory('administrative')}</span>
            </button>
          </div>

          {/* Barra de búsqueda y acciones */}
          <div className="document-actions">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Search documents..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="clear-search" 
                  onClick={() => setSearchTerm('')}
                  title="Clear search"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
            <div className="action-buttons">
              <button 
                className="add-doc-btn" 
                onClick={() => fileInputRef.current.click()}
                title="Upload New Document"
              >
                <i className="fas fa-plus"></i>
                <span>Add</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
              />
            </div>
          </div>

          {/* Acciones masivas */}
          {showBulkActions && (
            <div className="bulk-actions">
              <div className="selected-info">
                <i className="fas fa-check-square"></i>
                <span>{selectedDocuments.length} document(s) selected</span>
              </div>
              <div className="bulk-buttons">
                <button 
                  className="bulk-verify-btn" 
                  onClick={() => handleBulkAction('verify')}
                  title="Verify Selected Documents"
                >
                  <i className="fas fa-check-circle"></i>
                  <span>Verify</span>
                </button>
                <button 
                  className="bulk-delete-btn" 
                  onClick={() => handleBulkAction('delete')}
                  title="Delete Selected Documents"
                >
                  <i className="fas fa-trash-alt"></i>
                  <span>Delete</span>
                </button>
                <button 
                  className="bulk-cancel-btn" 
                  onClick={() => {
                    setSelectedDocuments([]);
                    setShowBulkActions(false);
                  }}
                  title="Cancel Selection"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}

          {/* Tabla de documentos */}
          <div className="document-table-container">
            {getSortedDocuments().length > 0 ? (
              <table className="document-table">
                <thead>
                  <tr>
                    <th className="select-column">
                      <div className="checkbox-wrapper">
                        <input 
                          type="checkbox" 
                          id="select-all" 
                          checked={
                            getFilteredDocuments().length > 0 && 
                            selectedDocuments.length === getFilteredDocuments().length
                          }
                          onChange={handleSelectAll}
                        />
                        <label htmlFor="select-all"></label>
                      </div>
                    </th>
                    <th 
                      className={`sortable ${sortBy === 'name' ? 'active-sort' : ''}`}
                      onClick={() => handleSortChange('name')}
                    >
                      Document
                      {sortBy === 'name' && (
                        <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                      )}
                    </th>
                    <th 
                      className={`sortable ${sortBy === 'uploadDate' ? 'active-sort' : ''}`}
                      onClick={() => handleSortChange('uploadDate')}
                    >
                      Date Uploaded
                      {sortBy === 'uploadDate' && (
                        <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                      )}
                    </th>
                    <th>Uploaded By</th>
                    <th 
                      className={`sortable ${sortBy === 'status' ? 'active-sort' : ''}`}
                      onClick={() => handleSortChange('status')}
                    >
                      Status
                      {sortBy === 'status' && (
                        <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                      )}
                    </th>
                    <th 
                      className={`size-column sortable ${sortBy === 'size' ? 'active-sort' : ''}`}
                      onClick={() => handleSortChange('size')}
                    >
                      Size
                      {sortBy === 'size' && (
                        <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                      )}
                    </th>
                    <th className="actions-column">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getSortedDocuments().map(doc => (
                    <tr 
                      key={doc.id} 
                      className={selectedDocuments.includes(doc.id) ? 'selected-row' : ''}
                      onContextMenu={(e) => handleContextMenu(e, doc.id)}
                    >
                      <td className="select-column">
                        <div className="checkbox-wrapper">
                          <input 
                            type="checkbox" 
                            id={`select-doc-${doc.id}`} 
                            checked={selectedDocuments.includes(doc.id)}
                            onChange={() => handleSelectDocument(doc.id)}
                          />
                          <label htmlFor={`select-doc-${doc.id}`}></label>
                        </div>
                      </td>
                      <td className="document-name-cell">
                        <div className="document-icon">
                          <i className={getDocumentIcon(doc.type)}></i>
                        </div>
                        <div className="document-info">
                          <span className="document-name">{doc.name}</span>
                          <span className="document-type">{doc.type}</span>
                        </div>
                      </td>
                      <td>{doc.uploadDate}</td>
                      <td className="uploader-cell">{doc.uploadedBy}</td>
                      <td>
                        <span className={`status-badge ${getStatusColor(doc.status)}`}>
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </span>
                      </td>
                      <td className="size-column">{doc.size}</td>
                      <td className="actions-column">
                        <div className="action-buttons">
                          <button 
                            className="view-btn" 
                            onClick={() => setExpandedDoc(doc.id)}
                            title="View Document"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            className="download-btn" 
                            onClick={() => alert(`Downloading ${doc.name}...`)}
                            title="Download Document"
                          >
                            <i className="fas fa-download"></i>
                          </button>
                          {doc.status !== 'verified' ? (
                            <button 
                              className="verify-btn" 
                              onClick={() => onStatusChange(doc.id, 'verified')}
                              title="Verify Document"
                            >
                              <i className="fas fa-check-circle"></i>
                            </button>
                          ) : (
                            <button 
                              className="verify-btn verified" 
                              title="Document Verified"
                              disabled
                            >
                              <i className="fas fa-check-circle"></i>
                            </button>
                          )}
                          <button 
                            className="delete-btn" 
                            onClick={() => {
                              if (window.confirm(`¿Está seguro de eliminar "${doc.name}"?`)) {
                                onDeleteDocument(doc.id);
                              }
                            }}
                            title="Delete Document"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-documents">
                <div className="no-docs-icon">
                  <i className="fas fa-folder-open"></i>
                </div>
                <h3>No documents found</h3>
                <p>
                  {searchTerm ? 
                    `No documents match your search "${searchTerm}"` : 
                    activeTab !== 'all' ? 
                      `No ${activeTab} documents available` :
                      'Upload new documents using the button above or drag and drop files here'
                  }
                </p>
                {searchTerm && (
                  <button 
                    className="clear-search-btn" 
                    onClick={() => setSearchTerm('')}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Información de documentos y ayuda */}
          <div className="document-footer">
            <div className="document-stats">
              <span className="doc-count">
                Showing {getFilteredDocuments().length} of {documents.length} documents
              </span>
            </div>
            <div className="document-help">
              <span className="help-text">
                <i className="fas fa-info-circle"></i>
                Drag and drop files anywhere in this area to upload
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal de carga de documentos */}
      {showUploadModal && (
        <div className="upload-modal-overlay">
          <div className="upload-modal">
            <div className="modal-header">
              <h3>
                <i className="fas fa-cloud-upload-alt"></i>
                Upload Documents
              </h3>
              {uploadingStatus !== 'uploading' && (
                <button 
                  className="close-btn" 
                  onClick={() => setShowUploadModal(false)}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>

            <div className="modal-content">
              {uploadingStatus === 'uploading' ? (
                <div className="upload-progress">
                  <div className="progress-circle-container">
                    <div className="progress-circle">
                      <svg viewBox="0 0 36 36" className="progress-ring">
                        <path 
                          className="progress-ring-bg"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path 
                          className="progress-ring-fill"
                          strokeDasharray={`${uploadProgress}, 100`}
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="progress-text">{uploadProgress}%</div>
                    </div>
                  </div>
                  <h4>Uploading {uploadForm.files.length} file(s)...</h4>
                  <p>Please wait while your files are being processed</p>
                </div>
              ) : uploadingStatus === 'success' ? (
                <div className="upload-success">
                  <div className="success-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <h4>Upload Complete!</h4>
                  <p>All files have been successfully uploaded</p>
                </div>
              ) : (
                <form className="upload-form" onSubmit={handleUploadSubmit}>
                  <div className="file-list-section">
                    <label className="section-label">Selected Files ({uploadForm.files.length})</label>
                    {uploadForm.files.length > 0 ? (
                      <div className="file-list">
                        {Array.from(uploadForm.files).map((file, index) => (
                          <div key={index} className="file-item">
                            <div className="file-icon">
                              <i className={getDocumentIcon(getDocumentTypeFromFileName(file.name))}></i>
                            </div>
                            <div className="file-info">
                              <span className="file-name">{file.name}</span>
                              <span className="file-size">{formatFileSize(file.size)}</span>
                            </div>
                            <button 
                              type="button" 
                              className="remove-file" 
                              onClick={() => {
                                const newFiles = [...uploadForm.files];
                                newFiles.splice(index, 1);
                                setUploadForm({...uploadForm, files: newFiles});
                              }}
                              title="Remove File"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="file-drop-zone" onClick={() => fileInputRef.current.click()}>
                        <div className="drop-icon">
                          <i className="fas fa-cloud-upload-alt"></i>
                        </div>
                        <h4>Drop files here or click to browse</h4>
                        <p>Supported formats: PDF, JPEG, PNG, DOC, XLS</p>
                      </div>
                    )}
                  </div>

                  <div className="form-section">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="document-type">Document Type</label>
                        <select 
                          id="document-type" 
                          name="type"
                          value={uploadForm.type}
                          onChange={handleUploadFormChange}
                        >
                          <option value="">Select Type</option>
                          <option value="assessment">Assessment</option>
                          <option value="referral">Referral</option>
                          <option value="consent">Consent Form</option>
                          <option value="insurance">Insurance</option>
                          <option value="document">Medical Record</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="document-category">Category</label>
                        <select 
                          id="document-category" 
                          name="category"
                          value={uploadForm.category}
                          onChange={handleUploadFormChange}
                        >
                          <option value="">Select Category</option>
                          <option value="clinical">Clinical</option>
                          <option value="administrative">Administrative</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="document-notes">Notes (Optional)</label>
                      <textarea
                        id="document-notes"
                        name="notes"
                        value={uploadForm.notes}
                        onChange={handleUploadFormChange}
                        placeholder="Add any notes about these documents..."
                      ></textarea>
                    </div>
                  </div>
                </form>
              )}
            </div>

            <div className="modal-footer">
              {uploadingStatus === 'uploading' ? (
                <div className="upload-info">
                  <span>Please don't close this window</span>
                </div>
              ) : uploadingStatus === 'success' ? (
                <button 
                  className="close-success-btn" 
                  onClick={() => {
                    setUploadingStatus(null);
                    setShowUploadModal(false);
                    setUploadForm({
                      files: [],
                      type: '',
                      category: '',
                      notes: ''
                    });
                  }}
                >
                  Close
                </button>
              ) : (
                <>
                  <button 
                    className="cancel-btn" 
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="upload-submit-btn" 
                    type="button"
                    disabled={uploadForm.files.length === 0}
                    onClick={handleUploadSubmit}
                  >
                    <i className="fas fa-cloud-upload-alt"></i>
                    Upload {uploadForm.files.length > 0 ? `(${uploadForm.files.length})` : ''}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Menú contextual */}
      {showContextMenu && (
        <>
          <div className="context-menu-overlay" onClick={closeContextMenu}></div>
          <div 
            className="context-menu"
            style={{
              top: `${contextMenuPosition.y}px`,
              left: `${contextMenuPosition.x}px`
            }}
          >
            <div className="menu-item" onClick={() => handleContextAction('view')}>
              <i className="fas fa-eye"></i>
              <span>View Document</span>
            </div>
            <div className="menu-item" onClick={() => handleContextAction('download')}>
              <i className="fas fa-download"></i>
              <span>Download</span>
            </div>
            <div className="menu-item" onClick={() => handleContextAction('verify')}>
              <i className="fas fa-check-circle"></i>
              <span>Verify</span>
            </div>
            <div className="menu-divider"></div>
            <div className="menu-item delete" onClick={() => handleContextAction('delete')}>
              <i className="fas fa-trash-alt"></i>
              <span>Delete</span>
            </div>
          </div>
        </>
      )}

      {/* Visor de documentos */}
      {expandedDoc && (
        <div className="document-viewer-overlay">
          <div className="document-viewer">
            <div className="viewer-header">
              <h3>
                <i className={getDocumentIcon(
                  documents.find(d => d.id === expandedDoc)?.type || 'document'
                )}></i>
                {documents.find(d => d.id === expandedDoc)?.name || 'Document'}
              </h3>
              <div className="viewer-actions">
                <button 
                  className="download-btn" 
                  onClick={() => alert('Downloading document...')}
                  title="Download Document"
                >
                  <i className="fas fa-download"></i>
                </button>
                <button 
                  className="close-btn" 
                  onClick={() => setExpandedDoc(null)}
                  title="Close Viewer"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            <div className="viewer-content">
              <div className="document-preview">
                <div className="preview-placeholder">
                  <i className={getDocumentIcon(
                    documents.find(d => d.id === expandedDoc)?.type || 'document'
                  )}></i>
                  <p>Document preview not available in this demonstration</p>
                  <div className="document-details">
                    <div className="detail-item">
                      <span className="detail-label">Uploaded by:</span>
                      <span className="detail-value">{documents.find(d => d.id === expandedDoc)?.uploadedBy}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">{documents.find(d => d.id === expandedDoc)?.uploadDate}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Size:</span>
                      <span className="detail-value">{documents.find(d => d.id === expandedDoc)?.size}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className={`status-badge ${getStatusColor(documents.find(d => d.id === expandedDoc)?.status)}`}>
                        {documents.find(d => d.id === expandedDoc)?.status.charAt(0).toUpperCase() + 
                         documents.find(d => d.id === expandedDoc)?.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="viewer-footer">
              <button 
                className="close-viewer-btn" 
                onClick={() => setExpandedDoc(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentSection;