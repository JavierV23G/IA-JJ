  import React, { useState, useEffect, useRef } from 'react';
import '../../../../../styles/developer/Patients/InfoPaciente/TherapistSelector.scss';

const TherapistSelector = ({ discipline, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    // Cerrar el dropdown cuando se hace clic afuera
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    // Simular carga de terapeutas según la disciplina
    setIsLoading(true);
    
    setTimeout(() => {
      let data = [];
      
      switch(discipline) {
        case 'PT':
          data = [
            { id: 1, name: 'Regina Araquel', role: 'PT', isActive: true },
            { id: 2, name: 'Jacob Staffey', role: 'PTA', isActive: true }
          ];
          break;
        case 'OT':
          data = [
            { id: 3, name: 'Justin Shimane', role: 'OT', isActive: true },
            { id: 4, name: 'April Kim', role: 'COTA', isActive: true }
          ];
          break;
        case 'ST':
          data = [
            { id: 5, name: 'Elena Martinez', role: 'ST', isActive: true },
            { id: 6, name: 'Mark Johnson', role: 'STA', isActive: false }
          ];
          break;
        default:
          data = [];
      }
      
      setTherapists(data);
      setSelectedTherapist(data.length > 0 ? data[0] : null);
      setIsLoading(false);
    }, 500);
  }, [discipline]);
  
  const handleSelect = (therapist) => {
    setSelectedTherapist(therapist);
    setIsOpen(false);
    
    if (onChange) {
      onChange(therapist);
    }
  };
  
  const getDisciplineClass = () => {
    switch(discipline) {
      case 'PT': return 'discipline-green';
      case 'OT': return 'discipline-orange';
      case 'ST': return 'discipline-purple';
      default: return '';
    }
  };
  
  const getRoleTitle = (role) => {
    switch(role) {
      case 'PT': return 'Physical Therapist';
      case 'PTA': return 'Physical Therapist Assistant';
      case 'OT': return 'Occupational Therapist';
      case 'COTA': return 'Certified Occupational Therapy Assistant';
      case 'ST': return 'Speech Therapist';
      case 'STA': return 'Speech Therapist Assistant';
      default: return role;
    }
  };
  
  return (
    <div className={`therapist-selector ${getDisciplineClass()}`} ref={dropdownRef}>
      {isLoading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <span>Loading therapists...</span>
        </div>
      ) : (
        <>
          <div 
            className={`selector-trigger ${isOpen ? 'active' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {selectedTherapist ? (
              <div className="selected-therapist">
                <div className="therapist-initials">
                  {selectedTherapist.name.split(' ').map(part => part[0]).join('')}
                </div>
                <div className="therapist-info">
                  <span className="therapist-name">{selectedTherapist.name}</span>
                  <span className="therapist-role">{selectedTherapist.role}</span>
                </div>
              </div>
            ) : (
              <div className="placeholder">Select a therapist</div>
            )}
            <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
          </div>
          
          {isOpen && (
            <div className="selector-dropdown">
              <div className="dropdown-header">
                <h4>Select Therapist</h4>
              </div>
              <div className="therapists-list">
                {therapists.length > 0 ? (
                  therapists.map(therapist => (
                    <div 
                      key={therapist.id}
                      className={`therapist-option ${selectedTherapist && selectedTherapist.id === therapist.id ? 'selected' : ''} ${!therapist.isActive ? 'inactive' : ''}`}
                      onClick={() => handleSelect(therapist)}
                    >
                      <div className="therapist-avatar">
                        {therapist.name.split(' ').map(part => part[0]).join('')}
                      </div>
                      <div className="therapist-details">
                        <span className="therapist-name">{therapist.name}</span>
                        <span className="therapist-role-title" title={getRoleTitle(therapist.role)}>
                          {therapist.role}
                        </span>
                      </div>
                      {selectedTherapist && selectedTherapist.id === therapist.id && (
                        <div className="selected-mark">
                          <i className="fas fa-check"></i>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-therapists">
                    <p>No therapists available for this discipline</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TherapistSelector;