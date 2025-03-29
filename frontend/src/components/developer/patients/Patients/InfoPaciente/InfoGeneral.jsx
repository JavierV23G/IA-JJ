import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarSelector from './CalendarSelector';
import '../../../../../styles/developer/Patients/InfoPaciente/InfoGeneral.scss';
import { motion, AnimatePresence } from 'framer-motion';

const InfoGeneral = ({ patientData }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [showCertDropdown, setShowCertDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [certPeriods, setCertPeriods] = useState([
    { id: 1, startDate: "04-19-2023", endDate: "04-19-2025", isActive: true },
    { id: 2, startDate: "12-05-2024", endDate: "02-02-2025", isActive: false },
    { id: 3, startDate: "07-19-2024", endDate: "09-16-2024", isActive: false }
  ]);
  const [activeCertPeriod, setActiveCertPeriod] = useState(certPeriods[0]);
  const [newCertPeriod, setNewCertPeriod] = useState({ startDate: "", endDate: "" });
  const [editingCertPeriod, setEditingCertPeriod] = useState(null);

  // Cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCertDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Función para manejar la edición del paciente
  const handleEditPatient = () => {
    navigate(`/editReferral/${patientData.id}`);
  };

  // Función para abrir el modal de edición de certificación
  const handleEditCertification = () => {
    setEditingCertPeriod({...activeCertPeriod});
    setShowEditModal(true);
  };

  // Función para seleccionar un período de certificación
  const handleCertPeriodSelect = (certPeriod) => {
    setActiveCertPeriod(certPeriod);
    setShowCertDropdown(false);
    
    // Actualizar el estado de los períodos
    const updatedPeriods = certPeriods.map(period => ({
      ...period,
      isActive: period.id === certPeriod.id
    }));
    
    setCertPeriods(updatedPeriods);
  };

  // Función para abrir el modal de agregar nuevo período
  const handleAddNewPeriod = () => {
    setNewCertPeriod({ startDate: "", endDate: "" });
    setShowAddModal(true);
    setShowCertDropdown(false);
  };

  // Función para guardar un nuevo período
  const handleSaveNewPeriod = () => {
    if (newCertPeriod.startDate && newCertPeriod.endDate) {
      const newPeriod = {
        id: certPeriods.length + 1,
        startDate: newCertPeriod.startDate,
        endDate: newCertPeriod.endDate,
        isActive: false
      };
      
      setCertPeriods([...certPeriods, newPeriod]);
      setShowAddModal(false);
    }
  };

  // Función para guardar cambios en un período existente
  const handleSaveEditPeriod = () => {
    if (editingCertPeriod.startDate && editingCertPeriod.endDate) {
      const updatedPeriods = certPeriods.map(period => 
        period.id === editingCertPeriod.id ? editingCertPeriod : period
      );
      
      setCertPeriods(updatedPeriods);
      
      // Si se está editando el período activo, actualizar ese también
      if (activeCertPeriod.id === editingCertPeriod.id) {
        setActiveCertPeriod(editingCertPeriod);
      }
      
      setShowEditModal(false);
    }
  };

  // Función para manejar la selección de fecha de inicio
  const handleStartDateSelect = (date) => {
    if (showAddModal) {
      setNewCertPeriod({ ...newCertPeriod, startDate: date });
    } else if (showEditModal) {
      setEditingCertPeriod({ ...editingCertPeriod, startDate: date });
    }
    setShowStartDateCalendar(false);
  };

  // Función para manejar la selección de fecha de fin
  const handleEndDateSelect = (date) => {
    if (showAddModal) {
      setNewCertPeriod({ ...newCertPeriod, endDate: date });
    } else if (showEditModal) {
      setEditingCertPeriod({ ...editingCertPeriod, endDate: date });
    }
    setShowEndDateCalendar(false);
  };

  // Calcular el progreso y tiempo restante para el período activo
  const calculateProgress = (startDate, endDate) => {
    const start = new Date(startDate.replace(/-/g, '/'));
    const end = new Date(endDate.replace(/-/g, '/'));
    const today = new Date();
    
    const totalDuration = end - start;
    const elapsed = today - start;
    
    let progress = Math.round((elapsed / totalDuration) * 100);
    progress = Math.max(0, Math.min(progress, 100)); // Limitar entre 0 y 100
    
    // Calcular meses restantes
    const monthDiff = (end.getFullYear() - today.getFullYear()) * 12 + 
                      (end.getMonth() - today.getMonth());
    
    return {
      progressPercent: progress,
      monthsRemaining: monthDiff > 0 ? monthDiff : 0
    };
  };

  const { progressPercent, monthsRemaining } = calculateProgress(
    activeCertPeriod.startDate,
    activeCertPeriod.endDate
  );

  // Variantes de animación para componentes
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 300 
      }
    },
    exit: { 
      opacity: 0, 
      y: 30, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="general-section"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="section-header" variants={fadeInVariants}>
        <h2 className="section-title">
          <i className="fas fa-user-circle"></i> General Information
        </h2>
      </motion.div>

      <div className="card-container">
        {/* Tarjeta de información del paciente */}
        <motion.div 
          className="info-card patient-info"
          variants={fadeInVariants}
        >
          <div className="card-header">
            <div className="header-icon">
              <i className="fas fa-user"></i>
            </div>
            <h3>Patient Information</h3>
            <button className="edit-btn" onClick={handleEditPatient}>
              <i className="fas fa-edit"></i> Edit
            </button>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-row">
                <div className="info-item">
                  <label>Full Name</label>
                  <p>{patientData.name}</p>
                </div>
                <div className="info-item">
                  <label>Date of Birth</label>
                  <p>{patientData.dob}</p>
                </div>
              </div>

              <div className="info-row">
                <div className="info-item">
                  <label>Phone</label>
                  <p>
                    <i className="fas fa-phone text-success"></i>
                    <a href={`tel:${patientData.phone}`} className="phone-link">
                      {patientData.phone}
                    </a>
                  </p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>
                    <i className="fas fa-envelope text-danger"></i>
                    <a href={`mailto:${patientData.email}`} className="email-link">
                      {patientData.email}
                    </a>
                  </p>
                </div>
              </div>

              <div className="info-row">
                <div className="info-item">
                  <label>Address</label>
                  <p>
                    <i className="fas fa-map-marker-alt text-danger"></i>
                    {patientData.street}, {patientData.city}, {patientData.state} {patientData.zip}
                  </p>
                </div>
                <div className="info-item">
                  <label>Emergency Contact</label>
                  <p>
                    {patientData.emergencyContact} |
                    <i className="fas fa-phone text-success"></i>
                    <a href={`tel:${patientData.emergencyPhone}`} className="phone-link">
                      {patientData.emergencyPhone}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tarjeta de información de certificación */}
        <motion.div 
          className="info-card certification-info"
          variants={fadeInVariants}
        >
          <div className="card-header">
            <div className="header-icon">
              <i className="fas fa-certificate"></i>
            </div>
            <h3>Certification Period</h3>
            <div className="cert-actions">
              <div className="cert-dropdown-container" ref={dropdownRef}>
                <button 
                  className="cert-dropdown-trigger"
                  onClick={() => setShowCertDropdown(!showCertDropdown)}
                >
                  <span>{activeCertPeriod.startDate} - {activeCertPeriod.endDate}</span>
                  <i className={`fas fa-chevron-${showCertDropdown ? 'up' : 'down'}`}></i>
                </button>
                
                {showCertDropdown && (
                  <div className="cert-dropdown-menu">
                    {certPeriods.map(period => (
                      <div 
                        key={period.id}
                        className={`cert-option ${period.isActive ? 'active' : ''}`}
                        onClick={() => handleCertPeriodSelect(period)}
                      >
                        {period.startDate} - {period.endDate}
                        {period.isActive && <i className="fas fa-check"></i>}
                      </div>
                    ))}
                    <div className="cert-option add-new" onClick={handleAddNewPeriod}>
                      <i className="fas fa-plus"></i> Add New Period
                    </div>
                  </div>
                )}
              </div>
              
              <button className="edit-btn" onClick={handleEditCertification}>
                <i className="fas fa-edit"></i> Edit
              </button>
            </div>
          </div>
          <div className="card-content">
            <div className="cert-period">
              <div className="date-box start-date">
                <span className="date-label">Start Date</span>
                <span className="date-value">{activeCertPeriod.startDate}</span>
              </div>
              <div className="date-arrow">
                <i className="fas fa-arrow-right"></i>
              </div>
              <div className="date-box end-date">
                <span className="date-label">End Date</span>
                <span className="date-value">{activeCertPeriod.endDate}</span>
              </div>
            </div>

            <div className="progress-container">
              <div className="progress-bar">
                <motion.div 
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                ></motion.div>
              </div>
              <span className="progress-text">{monthsRemaining} months remaining</span>
            </div>

            <div className="cert-details">
              <div className="cert-row">
                <div className="cert-item">
                  <label>Insurance</label>
                  <p>{patientData.insurance}</p>
                </div>
                <div className="cert-item">
                  <label>Agency</label>
                  <p>{patientData.agency}</p>
                </div>
              </div>
              <div className="cert-row">
                <div className="cert-item">
                  <label>Therapist</label>
                  <p>
                    <span className="therapist-badge">{patientData.therapistType}</span>
                    {patientData.therapist}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Modal para agregar nuevo período */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-container"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="modal-header">
                <h3>Add New Certification Period</h3>
                <button className="close-btn" onClick={() => setShowAddModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-content">
                <div className="form-group">
                  <label>Start Date</label>
                  <div className="date-input-container">
                    <input 
                      type="text" 
                      placeholder="MM-DD-YYYY"
                      value={newCertPeriod.startDate}
                      onChange={(e) => setNewCertPeriod({...newCertPeriod, startDate: e.target.value})}
                      readOnly
                      onClick={() => setShowStartDateCalendar(true)}
                    />
                    <i className="fas fa-calendar-alt" onClick={() => setShowStartDateCalendar(true)}></i>
                    
                    <AnimatePresence>
                      {showStartDateCalendar && (
                        <motion.div 
                          className="calendar-popup"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CalendarSelector 
                            onDateSelect={handleStartDateSelect}
                            initialDate={newCertPeriod.startDate || null}
                            onClose={() => setShowStartDateCalendar(false)}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <div className="date-input-container">
                    <input 
                      type="text" 
                      placeholder="MM-DD-YYYY"
                      value={newCertPeriod.endDate}
                      onChange={(e) => setNewCertPeriod({...newCertPeriod, endDate: e.target.value})}
                      readOnly
                      onClick={() => setShowEndDateCalendar(true)}
                    />
                    <i className="fas fa-calendar-alt" onClick={() => setShowEndDateCalendar(true)}></i>
                    
                    <AnimatePresence>
                      {showEndDateCalendar && (
                        <motion.div 
                          className="calendar-popup"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CalendarSelector 
                            onDateSelect={handleEndDateSelect}
                            initialDate={newCertPeriod.endDate || null}
                            onClose={() => setShowEndDateCalendar(false)}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                  <span>Cancel</span>
                </button>
                <button className="save-btn" onClick={handleSaveNewPeriod}>
                  <i className="fas fa-save"></i> 
                  <span>Save Period</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Modal para editar período existente */}
      <AnimatePresence>
        {showEditModal && editingCertPeriod && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-container"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="modal-header">
                <h3>Edit Certification Period</h3>
                <button className="close-btn" onClick={() => setShowEditModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-content">
                <div className="form-group">
                  <label>Start Date</label>
                  <div className="date-input-container">
                    <input 
                      type="text" 
                      value={editingCertPeriod.startDate}
                      readOnly
                      onClick={() => setShowStartDateCalendar(true)}
                    />
                    <i className="fas fa-calendar-alt" onClick={() => setShowStartDateCalendar(true)}></i>
                    
                    <AnimatePresence>
                      {showStartDateCalendar && (
                        <motion.div 
                          className="calendar-popup"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CalendarSelector 
                            onDateSelect={handleStartDateSelect}
                            initialDate={editingCertPeriod.startDate}
                            onClose={() => setShowStartDateCalendar(false)}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <div className="date-input-container">
                    <input 
                      type="text" 
                      value={editingCertPeriod.endDate}
                      readOnly
                      onClick={() => setShowEndDateCalendar(true)}
                    />
                    <i className="fas fa-calendar-alt" onClick={() => setShowEndDateCalendar(true)}></i>
                    
                    <AnimatePresence>
                      {showEndDateCalendar && (
                        <motion.div 
                          className="calendar-popup"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CalendarSelector 
                            onDateSelect={handleEndDateSelect}
                            initialDate={editingCertPeriod.endDate}
                            onClose={() => setShowEndDateCalendar(false)}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="cancel-btn" onClick={() => setShowEditModal(false)}>
                  <span>Cancel</span>
                </button>
                <button className="save-btn" onClick={handleSaveEditPeriod}>
                  <i className="fas fa-check"></i> 
                  <span>Save Changes</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InfoGeneral;