import React, { useState, useEffect, useRef } from 'react';
import '../../../../../styles/developer/Patients/InfoPaciente/CertPeriodDropdown.scss'; // Asegúrate de crear este archivo SCSS

const CertPeriodDropdown = ({ certPeriods, activePeriod, onPeriodSelect, onAddNew }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
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

  // Alternar el estado del dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Seleccionar un período
  const handleSelectPeriod = (period) => {
    onPeriodSelect(period);
    setIsOpen(false);
  };

  // Agregar un nuevo período
  const handleAddNew = () => {
    onAddNew();
    setIsOpen(false);
  };

  // Formatear la fecha para mostrar en el botón
  const formatDisplayDate = (startDate, endDate) => {
    return `${startDate} - ${endDate}`;
  };

  return (
    <div className="cert-dropdown-container" ref={dropdownRef}>
      <button 
        className="cert-dropdown-trigger"
        onClick={toggleDropdown}
      >
        <span>{formatDisplayDate(activePeriod.startDate, activePeriod.endDate)}</span>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </button>
      
      {isOpen && (
        <div className="cert-dropdown-menu">
          {certPeriods.map(period => (
            <div 
              key={period.id}
              className={`cert-option ${period.isActive ? 'active' : ''}`}
              onClick={() => handleSelectPeriod(period)}
            >
              {period.startDate} - {period.endDate}
              {period.isActive && <i className="fas fa-check"></i>}
            </div>
          ))}
          <div className="cert-option add-new" onClick={handleAddNew}>
            <i className="fas fa-plus"></i> Add New Period
          </div>
        </div>
      )}
    </div>
  );
};

export default CertPeriodDropdown;