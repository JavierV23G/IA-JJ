import React, { useState, useEffect } from 'react';
import VisitTypeSelector from './VisitTypeSelector';
import TherapistSelector from './TherapistSelector';
import '../../../../../styles/developer/Patients/InfoPaciente/VisitDetail.scss';

const VisitDetail = ({ visit, onClose, onUpdate, onDelete, addMode = false, discipline = 'PT' }) => {
  const [isEditing, setIsEditing] = useState(addMode);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: visit?.type || 'Standard',
    date: visit?.date || new Date(),
    time: visit?.time || '8:00 PM',
    therapist: visit?.therapist || { name: 'Regina Araquel', role: 'PT' },
    status: visit?.status || 'Scheduled',
    notes: visit?.notes || ''
  });
  
  const [showDocuments, setShowDocuments] = useState(false);
  const [documentsData, setDocumentsData] = useState([]);
  
  useEffect(() => {
    // Si está en modo de detalles y hay documentos asociados, cargar datos de documentos
    if (!addMode && visit && visit.hasDocuments && showDocuments) {
      setIsLoading(true);
      
      // Simular carga de documentos
      setTimeout(() => {
        setDocumentsData([
          { id: 1, name: 'SOAP Note.pdf', type: 'PDF', uploadedBy: 'System', date: '03/15/2025' },
          { id: 2, name: 'Patient Assessment.docx', type: 'DOCX', uploadedBy: visit.therapist.name, date: '03/15/2025' }
        ]);
        setIsLoading(false);
      }, 800);
    }
  }, [addMode, visit, showDocuments]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleVisitTypeChange = (newType) => {
    setFormData({
      ...formData,
      type: newType
    });
  };
  
  const handleTherapistChange = (newTherapist) => {
    setFormData({
      ...formData,
      therapist: newTherapist
    });
  };
  
  const handleSave = () => {
    setIsLoading(true);
    
    // Simular guardado
    setTimeout(() => {
      if (addMode) {
        onUpdate({
          id: Date.now(), // Generar ID temporal
          ...formData
        });
      } else {
        onUpdate({
          ...visit,
          ...formData
        });
      }
      
      setIsLoading(false);
      setIsEditing(false);
      if (addMode) {
        onClose();
      }
    }, 500);
  };
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Clase según el tipo de visita
  const getVisitTypeClass = () => {
    switch(formData.type) {
      case 'Initial Eval': return 'visit-initial';
      case 'Standard': return 'visit-standard';
      case 'ReCert Eval': return 'visit-recert';
      case 'Discharge (DC w/o a visit)': return 'visit-discharge';
      case 'Post-Hospital Eval': return 'visit-posthospital';
      default: return '';
    }
  };
  
  // Clase según la disciplina
  const getDisciplineClass = () => {
    switch(discipline) {
      case 'PT': return 'discipline-green';
      case 'OT': return 'discipline-orange';
      case 'ST': return 'discipline-purple';
      default: return '';
    }
  };
  
  // Renderizar modo de edición
  const renderEditMode = () => {
    return (
      <div className="edit-form">
        <div className="form-row">
          <div className="form-group">
            <label>Visit Type</label>
            <VisitTypeSelector 
              discipline={discipline}
              onChange={handleVisitTypeChange}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <div className="date-input">
              <i className="fas fa-calendar-alt"></i>
              <input 
                type="date" 
                name="date"
                value={formData.date instanceof Date ? formData.date.toISOString().split('T')[0] : formData.date}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Time</label>
            <div className="time-input">
              <i className="fas fa-clock"></i>
              <input 
                type="time" 
                name="timeInput"
                value={formData.time.replace(/\s*(AM|PM)$/i, '')}
                onChange={(e) => {
                  const timeValue = e.target.value;
                  const [hours] = timeValue.split(':');
                  const period = parseInt(hours, 10) >= 12 ? 'PM' : 'AM';
                  setFormData({
                    ...formData,
                    time: `${timeValue} ${period}`
                  });
                }}
              />
              <select 
                name="timePeriod"
                value={formData.time.includes('PM') ? 'PM' : 'AM'}
                onChange={(e) => {
                  const newPeriod = e.target.value;
                  const timeWithoutPeriod = formData.time.replace(/\s*(AM|PM)$/i, '');
                  setFormData({
                    ...formData,
                    time: `${timeWithoutPeriod} ${newPeriod}`
                  });
                }}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Therapist</label>
            <TherapistSelector 
              discipline={discipline}
              onChange={handleTherapistChange}
            />
          </div>
          
          <div className="form-group">
            <label>Status</label>
            <select 
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="status-select"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Missed">Missed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group full-width">
            <label>Notes</label>
            <textarea 
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Add notes about this visit..."
              rows={4}
            ></textarea>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            className="cancel-btn"
            onClick={() => {
              if (addMode) {
                onClose();
              } else {
                setIsEditing(false);
                // Restaurar datos originales
                setFormData({
                  type: visit.type,
                  date: visit.date,
                  time: visit.time,
                  therapist: visit.therapist,
                  status: visit.status,
                  notes: visit.notes
                });
              }
            }}
          >
            Cancel
          </button>
          <button 
            className="save-btn"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                <span>{addMode ? 'Create Visit' : 'Save Changes'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  };
  
  // Renderizar modo de visualización
  const renderViewMode = () => {
    return (
      <div className="view-details">
        <div className={`detail-card ${getVisitTypeClass()}`}>
          <div className="card-header">
            <h3>
              <i className={`fas fa-${formData.type === 'Initial Eval' ? 'clipboard-check' : 'calendar-check'}`}></i>
              {formData.type}
            </h3>
            <span className={`status-badge ${formData.status.toLowerCase()}`}>
              {formData.status}
            </span>
          </div>
          
          <div className="card-content">
            <div className="detail-item">
              <div className="detail-label">
                <i className="fas fa-calendar-day"></i>
                <span>Date:</span>
              </div>
              <div className="detail-value">
                {formatDate(formData.date)}
              </div>
            </div>
            
            <div className="detail-item">
              <div className="detail-label">
                <i className="fas fa-clock"></i>
                <span>Time:</span>
              </div>
              <div className="detail-value">
                {formData.time}
              </div>
            </div>
            
            <div className="detail-item">
              <div className="detail-label">
                <i className="fas fa-user-md"></i>
                <span>Therapist:</span>
              </div>
              <div className="detail-value">
                {formData.therapist.name} 
                <span className="therapist-role">({formData.therapist.role})</span>
              </div>
            </div>
            
            {formData.notes && (
              <div className="detail-item notes">
                <div className="detail-label">
                  <i className="fas fa-sticky-note"></i>
                  <span>Notes:</span>
                </div>
                <div className="detail-value">
                  {formData.notes}
                </div>
              </div>
            )}
          </div>
          
          <div className="card-actions">
            <button 
              className="action-btn edit"
              onClick={() => setIsEditing(true)}
            >
              <i className="fas fa-edit"></i>
              <span>Edit</span>
            </button>
            
            {visit?.hasDocuments && (
              <button 
                className="action-btn documents"
                onClick={() => setShowDocuments(!showDocuments)}
              >
                <i className="fas fa-file-medical"></i>
                <span>{showDocuments ? 'Hide Documents' : 'Show Documents'}</span>
              </button>
            )}
            
            <button 
              className="action-btn delete"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this visit?')) {
                  onDelete(visit.id);
                }
              }}
            >
              <i className="fas fa-trash-alt"></i>
              <span>Delete</span>
            </button>
          </div>
        </div>
        
        {showDocuments && (
          <div className="documents-section">
            <h4>
              <i className="fas fa-file-medical"></i>
              Associated Documents
            </h4>
            
            {isLoading ? (
              <div className="loading-documents">
                <div className="spinner"></div>
                <span>Loading documents...</span>
              </div>
            ) : documentsData.length > 0 ? (
              <div className="documents-list">
                {documentsData.map(doc => (
                  <div key={doc.id} className="document-item">
                    <div className="document-icon">
                      <i className={`fas fa-file-${doc.type === 'PDF' ? 'pdf' : 'word'}`}></i>
                    </div>
                    <div className="document-info">
                      <span className="document-name">{doc.name}</span>
                      <span className="document-meta">
                        Uploaded by {doc.uploadedBy} on {doc.date}
                      </span>
                    </div>
                    <div className="document-actions">
                      <button className="doc-action-btn view">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="doc-action-btn download">
                        <i className="fas fa-download"></i>
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="upload-section">
                  <button className="upload-btn">
                    <i className="fas fa-cloud-upload-alt"></i>
                    <span>Upload New Document</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="no-documents">
                <i className="fas fa-file-medical-alt"></i>
                <p>No documents have been uploaded for this visit.</p>
                <button className="upload-btn">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <span>Upload Document</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className={`visit-detail ${getDisciplineClass()}`}>
      <div className="detail-header">
        <h3>
          {addMode ? (
            <>
              <i className="fas fa-plus-circle"></i>
              <span>Add New Visit</span>
            </>
          ) : (
            <>
              <i className="fas fa-calendar-day"></i>
              <span>Visit Details</span>
            </>
          )}
        </h3>
        <button 
          className="close-btn"
          onClick={onClose}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="detail-content">
        {isEditing ? renderEditMode() : renderViewMode()}
      </div>
    </div>
  );
};

export default VisitDetail;