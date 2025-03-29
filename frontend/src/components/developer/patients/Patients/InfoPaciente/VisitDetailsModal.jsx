import React, { useState } from 'react';
import '../../../../../styles/developer/Patients/InfoPaciente/VisitDetailsModal.scss';
import TherapistSelector from './TherapistSelector';
import VisitTypeSelector from './VisitTypeSelector';

const VisitDetailsModal = ({ visit, onClose, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    type: visit?.type || 'Standard',
    date: visit?.date || new Date(),
    time: visit?.time || '8:00 PM',
    therapist: visit?.therapist || { name: 'Therapist Name', role: 'PT' },
    status: visit?.status || 'Scheduled',
    notes: visit?.notes || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = () => {
    setIsLoading(true);
    
    // Simulación de guardado
    setTimeout(() => {
      onSave({ ...visit, ...formData });
      setIsLoading(false);
      setIsEditing(false);
    }, 600);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this visit?')) {
      onDelete(visit.id);
    }
  };

  // Formatear la fecha para mostrar
  const formatDate = (date) => {
    if (!date) return '';
    
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return date instanceof Date 
      ? date.toLocaleDateString('en-US', options)
      : new Date(date).toLocaleDateString('en-US', options);
  };

  // Determinamos el color según el tipo de visita
  const getVisitTypeColor = () => {
    switch(formData.type) {
      case 'Initial Eval': return 'visit-initial';
      case 'Standard': return 'visit-standard';
      case 'Discharge (DC w/o a visit)': return 'visit-discharge';
      case 'ReCert Eval': return 'visit-recert';
      case 'Post-Hospital Eval': return 'visit-posthospital';
      default: return '';
    }
  };

  // Renderizar modo de visualización
  const renderViewMode = () => {
    return (
      <div className="visit-details-view">
        <div className={`visit-type-header ${getVisitTypeColor()}`}>
          <div className="type-icon">
            <i className={`fas fa-${formData.type === 'Initial Eval' ? 'clipboard-check' : 'calendar-check'}`}></i>
          </div>
          <h3>{formData.type}</h3>
          <span className={`status-badge ${formData.status.toLowerCase()}`}>
            {formData.status}
          </span>
        </div>
        
        <div className="visit-info-grid">
          <div className="info-item">
            <div className="info-label">
              <i className="fas fa-calendar-day"></i>
              <span>Date</span>
            </div>
            <div className="info-value">{formatDate(formData.date)}</div>
          </div>
          
          <div className="info-item">
            <div className="info-label">
              <i className="fas fa-clock"></i>
              <span>Time</span>
            </div>
            <div className="info-value">{formData.time}</div>
          </div>
          
          <div className="info-item full-width">
            <div className="info-label">
              <i className="fas fa-user-md"></i>
              <span>Therapist</span>
            </div>
            <div className="info-value therapist">
              <span className="name">{formData.therapist.name}</span>
              <span className="role">{formData.therapist.role}</span>
            </div>
          </div>
          
          {formData.notes && (
            <div className="info-item full-width notes">
              <div className="info-label">
                <i className="fas fa-sticky-note"></i>
                <span>Notes</span>
              </div>
              <div className="info-value">{formData.notes}</div>
            </div>
          )}
        </div>
        
        <div className="action-buttons">
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            <i className="fas fa-edit"></i>
            <span>Edit</span>
          </button>
          
          {visit && visit.hasDocuments && (
            <button className="docs-btn">
              <i className="fas fa-file-medical"></i>
              <span>View Documents</span>
            </button>
          )}
          
          <button className="delete-btn" onClick={handleDelete}>
            <i className="fas fa-trash-alt"></i>
            <span>Delete</span>
          </button>
        </div>
      </div>
    );
  };

  // Renderizar modo de edición
  const renderEditMode = () => {
    return (
      <div className="visit-edit-form">
        <div className="form-group">
          <label>Visit Type</label>
          <VisitTypeSelector 
            discipline="PT"
            onChange={(type) => setFormData({ ...formData, type })}
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <div className="input-icon">
              <i className="fas fa-calendar-alt"></i>
              <input 
                type="date" 
                name="date"
                value={formData.date instanceof Date 
                  ? formData.date.toISOString().split('T')[0]
                  : new Date(formData.date).toISOString().split('T')[0]
                }
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Time</label>
            <div className="input-icon">
              <i className="fas fa-clock"></i>
              <input 
                type="time" 
                name="time"
                value={formData.time.split(' ')[0]}
                onChange={(e) => {
                  const timeValue = e.target.value;
                  const hour = parseInt(timeValue.split(':')[0]);
                  const period = hour >= 12 ? 'PM' : 'AM';
                  
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
          <div className="form-group full-width">
            <label>Therapist</label>
            <TherapistSelector 
              discipline="PT"
              onChange={(therapist) => setFormData({ ...formData, therapist })}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Status</label>
            <div className="select-wrapper">
              <select 
                name="status" 
                value={formData.status}
                onChange={handleInputChange}
                className={`status-select ${formData.status.toLowerCase()}`}
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Missed">Missed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <i className="fas fa-chevron-down"></i>
            </div>
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
            onClick={() => setIsEditing(false)}
          >
            <i className="fas fa-times"></i>
            <span>Cancel</span>
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
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="visit-details-modal-overlay" onClick={onClose}>
      <div 
        className={`visit-details-modal ${getVisitTypeColor()}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>
            <i className="fas fa-calendar-day"></i>
            Visit Details
          </h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-content">
          {isEditing ? renderEditMode() : renderViewMode()}
        </div>
      </div>
    </div>
  );
};

export default VisitDetailsModal;