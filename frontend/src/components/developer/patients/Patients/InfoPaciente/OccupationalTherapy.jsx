import React, { useState } from 'react';
import TherapistCard from './TherapistCard';
import GoalsPanel from './GoalsPanel';
import FrequencySelector from './FrequencySelector';
import '../../../../../styles/developer/Patients/InfoPaciente/DisciplineTherapy.scss';

const OccupationalTherapy = ({ therapists, patientId }) => {
  const [showGoals, setShowGoals] = useState(false);
  const [currentFrequency, setCurrentFrequency] = useState("NO FREQUENCY SET");
  const [isEditing, setIsEditing] = useState(false);
  
  const primaryTherapist = therapists.find(t => t.role === 'OT');
  const assistantTherapist = therapists.find(t => t.role === 'COTA');

  const toggleGoalsPanel = () => {
    setShowGoals(!showGoals);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const saveChanges = () => {
    // Aquí iría la lógica para guardar los cambios en la API
    setIsEditing(false);
    // Mostrar notificación de éxito
    showNotification("Changes saved successfully");
  };

  const showNotification = (message) => {
    // Implementación simple de notificación
    const notification = document.createElement('div');
    notification.className = 'floating-notification success';
    notification.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
    }, 100);
  };

  return (
    <div className="discipline-therapy occupational">
      <div className="therapy-header">
        <div className="therapy-title">
          <i className="fas fa-hands"></i>
          <h3>Occupational Therapy</h3>
          <span className="status-badge active">Active</span>
        </div>
        
        <div className="header-actions">
          {isEditing ? (
            <>
              <button className="cancel-btn" onClick={toggleEditMode}>
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button className="save-btn" onClick={saveChanges}>
                <i className="fas fa-check"></i>
                Save Changes
              </button>
            </>
          ) : (
            <button className="edit-btn" onClick={toggleEditMode}>
              <i className="fas fa-pen"></i>
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="therapy-content">
        <div className="therapists-container">
          <div className="therapist-row">
            <div className="role-label">
              <span>Primary</span>
              <div className="role-badge ot">OT</div>
            </div>
            
            <TherapistCard 
              therapist={primaryTherapist} 
              isEditing={isEditing}
              role="OT"
            />
          </div>
          
          <div className="therapist-row">
            <div className="role-label">
              <span>Assistant</span>
              <div className="role-badge cota">COTA</div>
            </div>
            
            <TherapistCard 
              therapist={assistantTherapist} 
              isEditing={isEditing}
              role="COTA"
            />
          </div>
        </div>
        
        <div className="therapy-details">
          <div className="frequency-section">
            <div className="section-label">Visit Frequency</div>
            
            {isEditing ? (
              <FrequencySelector 
                currentValue={currentFrequency} 
                onChange={setCurrentFrequency} 
              />
            ) : (
              <div className="frequency-display">
                <i className="fas fa-calendar-check"></i>
                <span className="frequency-value">{currentFrequency}</span>
              </div>
            )}
          </div>
          
          <button className="goals-button" onClick={toggleGoalsPanel}>
            <i className="fas fa-bullseye"></i>
            <span>Treatment Goals & Plan</span>
            <i className={`fas fa-chevron-${showGoals ? 'up' : 'down'}`}></i>
          </button>
        </div>
      </div>
      
      {showGoals && (
        <GoalsPanel 
          disciplineType="occupational" 
          patientId={patientId} 
          isEditing={isEditing}
        />
      )}
      
      <div className="therapy-footer">
        <div className="last-updated">
          <i className="fas fa-history"></i>
          <span>Last updated: 03/05/2025</span>
        </div>
        
        <div className="session-count">
          <i className="fas fa-clipboard-check"></i>
          <span>8 sessions completed</span>
        </div>
      </div>
    </div>
  );
};

export default OccupationalTherapy;