import React, { useState, useEffect, useRef } from 'react';
import '../../../../../styles/developer/Patients/InfoPaciente/VisitTypeSelector.scss';

const VisitTypeSelector = ({ discipline, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('Standard');
  const dropdownRef = useRef(null);
  
  // Opciones de tipos de visita según la disciplina
  const getVisitTypes = () => {
    const commonTypes = [
      { id: 'initial', name: 'Initial Eval', description: 'First evaluation of the patient' },
      { id: 'standard', name: 'Standard', description: 'Regular therapy session' },
      { id: 'recert', name: 'ReCert Eval', description: 'Recertification evaluation' },
      { id: 'discharge', name: 'Discharge (DC w/o a visit)', description: 'Discharge without visit' }
    ];
    
    const ptSpecific = [
      { id: 'posthospital', name: 'Post-Hospital Eval', description: 'Evaluation after hospital stay' },
      { id: 'supervision', name: 'Supervision Assessment', description: 'PTA supervision assessment' }
    ];
    
    const otSpecific = [
      { id: 'equipment', name: 'Equipment Assessment', description: 'Evaluation of adaptive equipment needs' }
    ];
    
    const stSpecific = [
      { id: 'swallow', name: 'Swallow Assessment', description: 'Evaluation of swallowing capabilities' }
    ];
    
    switch(discipline) {
      case 'PT':
        return [...commonTypes, ...ptSpecific];
      case 'OT':
        return [...commonTypes, ...otSpecific];
      case 'ST':
        return [...commonTypes, ...stSpecific];
      default:
        return commonTypes;
    }
  };
  
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
  
  const handleSelect = (type) => {
    setSelectedType(type.name);
    setIsOpen(false);
    
    if (onChange) {
      onChange(type.name);
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
  
  // Clase según el tipo de visita
  const getTypeClass = (typeName) => {
    switch(typeName) {
      case 'Initial Eval': return 'visit-initial';
      case 'Standard': return 'visit-standard';
      case 'ReCert Eval': return 'visit-recert';
      case 'Discharge (DC w/o a visit)': return 'visit-discharge';
      case 'Post-Hospital Eval': return 'visit-posthospital';
      default: return '';
    }
  };
  
  // Icono según el tipo de visita
  const getTypeIcon = (typeName) => {
    switch(typeName) {
      case 'Initial Eval': return 'fa-clipboard-check';
      case 'Standard': return 'fa-calendar-check';
      case 'ReCert Eval': return 'fa-sync-alt';
      case 'Discharge (DC w/o a visit)': return 'fa-sign-out-alt';
      case 'Post-Hospital Eval': return 'fa-hospital';
      case 'Supervision Assessment': return 'fa-user-check';
      case 'Equipment Assessment': return 'fa-wheelchair';
      case 'Swallow Assessment': return 'fa-utensils';
      default: return 'fa-calendar-day';
    }
  };
  
  return (
    <div className={`visit-type-selector ${getDisciplineClass()}`} ref={dropdownRef}>
      <div 
        className={`selector-trigger ${isOpen ? 'active' : ''} ${getTypeClass(selectedType)}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className={`fas ${getTypeIcon(selectedType)}`}></i>
        <span>{selectedType}</span>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </div>
      
      {isOpen && (
        <div className="selector-dropdown">
          <div className="dropdown-header">
            <h4>Select Visit Type</h4>
          </div>
          <div className="visit-types-list">
            {getVisitTypes().map((type) => (
              <div 
                key={type.id}
                className={`visit-type-option ${selectedType === type.name ? 'selected' : ''} ${getTypeClass(type.name)}`}
                onClick={() => handleSelect(type)}
              >
                <div className="type-icon">
                  <i className={`fas ${getTypeIcon(type.name)}`}></i>
                </div>
                <div className="type-details">
                  <span className="type-name">{type.name}</span>
                  <span className="type-description">{type.description}</span>
                </div>
                {selectedType === type.name && (
                  <div className="selected-mark">
                    <i className="fas fa-check"></i>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitTypeSelector;