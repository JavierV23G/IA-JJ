import React, { useState } from 'react';
import '../../../../../styles/developer/Patients/InfoPaciente/MedicalInfo.scss';

const MedicalInfo = ({ data, onUpdate, expanded, onToggleExpand, isLoading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({...data});
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar error para este campo si existe
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  // Función para validar el formulario
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Validar campos requeridos
    if (!formData.nursingDiagnosis || formData.nursingDiagnosis.trim() === '') {
      errors.nursingDiagnosis = 'Nursing Diagnosis is required';
      isValid = false;
    }

    if (!formData.clinicalGrouping || formData.clinicalGrouping.trim() === '') {
      errors.clinicalGrouping = 'Clinical Grouping is required';
      isValid = false;
    }

    // Validar formato para altura (ej. 5'6")
    if (formData.height && !formData.height.match(/^\d+'(\d+\")?$/)) {
      errors.height = 'Height should be in format: 5\'6\"';
      isValid = false;
    }

    // Validar peso (debe ser un número o terminar en lbs/kg)
    if (formData.weight && !formData.weight.match(/^(\d+(.\d+)?\s*(lbs|kg)?)$/)) {
      errors.weight = 'Enter a valid weight (e.g. 165 lbs)';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onUpdate(formData);
      setIsEditing(false);
    }
  };

  // Función para calcular el BMI a partir de la altura y el peso
  const calculateBMI = () => {
    // Extraer valores numéricos (simplificado, en una implementación real sería más robusto)
    let heightInches = 0;
    let weightLbs = 0;
    
    if (formData.height) {
      const heightParts = formData.height.match(/(\d+)'(\d+)?/);
      if (heightParts) {
        heightInches = parseInt(heightParts[1]) * 12 + (heightParts[2] ? parseInt(heightParts[2]) : 0);
      }
    }
    
    if (formData.weight) {
      const weightParts = formData.weight.match(/(\d+(\.\d+)?)/);
      if (weightParts) {
        weightLbs = parseFloat(weightParts[1]);
        if (formData.weight.includes('kg')) {
          weightLbs = weightLbs * 2.20462; // Convertir kg a lbs
        }
      }
    }
    
    if (heightInches > 0 && weightLbs > 0) {
      const bmi = (weightLbs * 703) / (heightInches * heightInches);
      return bmi.toFixed(1);
    }
    
    return formData.bmi || "N/A";
  };

  // Función para determinar el estado del BMI
  const getBmiStatus = (bmiValue) => {
    const bmi = parseFloat(bmiValue);
    if (isNaN(bmi)) return '';
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
  };

  // Si estamos realizando una acción de carga, mostrar estado de carga
  if (isLoading) {
    return (
      <div className={`medical-info-card ${expanded ? 'expanded' : 'collapsed'}`}>
        <div className="card-header">
          <div className="header-icon medical">
            <i className="fas fa-heartbeat"></i>
          </div>
          <h3>Medical Details</h3>
          <div className="header-actions">
            <button className="expand-btn" onClick={onToggleExpand} title={expanded ? "Collapse" : "Expand"}>
              <i className={`fas fa-chevron-${expanded ? 'up' : 'down'}`}></i>
            </button>
          </div>
        </div>
        <div className="card-content loading-state">
          <div className="loading-pulse"></div>
          <div className="loading-message">Updating medical information...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`medical-info-card ${expanded ? 'expanded' : 'collapsed'}`}>
      <div className="card-header">
        <div className="header-icon medical">
          <i className="fas fa-heartbeat"></i>
        </div>
        <h3>Medical Details</h3>
        <div className="header-actions">
          {!isEditing && (
            <button 
              className="edit-btn" 
              onClick={() => setIsEditing(true)}
              title="Edit Medical Information"
            >
              <i className="fas fa-edit"></i> Edit
            </button>
          )}
          <button className="expand-btn" onClick={onToggleExpand} title={expanded ? "Collapse" : "Expand"}>
            <i className={`fas fa-chevron-${expanded ? 'up' : 'down'}`}></i>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="card-content">
          {!isEditing ? (
            <div className="info-display">
              <div className="info-group medical-diagnoses">
                <div className="info-item">
                  <label>Nursing Diagnosis</label>
                  <p>{data.nursingDiagnosis}</p>
                </div>
                <div className="info-item">
                  <label>PMH</label>
                  <p>{data.pmh}</p>
                </div>
              </div>

              <div className="info-group medical-classifications">
                <div className="info-item">
                  <label>Clinical Grouping</label>
                  <p>
                    <span className="clinical-badge">{data.clinicalGrouping}</span>
                  </p>
                </div>
                <div className="info-item">
                  <label>WBS</label>
                  <p>{data.wbs}</p>
                </div>
              </div>

              <div className="info-group medical-status">
                <div className="info-item">
                  <label>Homebound Status</label>
                  <p>{data.homebound}</p>
                </div>
              </div>

              <div className="info-group medical-metrics">
                <div className="metrics-container">
                  <div className="metric-item">
                    <div className="metric-icon">
                      <i className="fas fa-ruler-vertical"></i>
                    </div>
                    <div className="metric-content">
                      <span className="metric-label">Height</span>
                      <span className="metric-value">{data.height}</span>
                    </div>
                  </div>
                  
                  <div className="metric-item">
                    <div className="metric-icon">
                      <i className="fas fa-weight"></i>
                    </div>
                    <div className="metric-content">
                      <span className="metric-label">Weight</span>
                      <span className="metric-value">{data.weight}</span>
                    </div>
                  </div>
                  
                  <div className="metric-item">
                    <div className="metric-icon">
                      <i className="fas fa-calculator"></i>
                    </div>
                    <div className="metric-content">
                      <span className="metric-label">BMI</span>
                      <span className="metric-value">
                        {data.bmi}
                        <span className="bmi-indicator" data-status={getBmiStatus(data.bmi)}></span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form className="edit-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nursingDiagnosis">Nursing Diagnosis*</label>
                  <textarea
                    id="nursingDiagnosis"
                    name="nursingDiagnosis"
                    value={formData.nursingDiagnosis}
                    onChange={handleInputChange}
                    className={formErrors.nursingDiagnosis ? 'error' : ''}
                  />
                  {formErrors.nursingDiagnosis && <div className="error-message">{formErrors.nursingDiagnosis}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="pmh">Past Medical History</label>
                  <textarea
                    id="pmh"
                    name="pmh"
                    value={formData.pmh}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="clinicalGrouping">Clinical Grouping*</label>
                  <select
                    id="clinicalGrouping"
                    name="clinicalGrouping"
                    value={formData.clinicalGrouping}
                    onChange={handleInputChange}
                    className={formErrors.clinicalGrouping ? 'error' : ''}
                  >
                    <option value="">Select Clinical Group</option>
                    <option value="Clinical Group 1 - MMTA - Cardiac">Clinical Group 1 - MMTA - Cardiac</option>
                    <option value="Clinical Group 2 - MMTA - Respiratory">Clinical Group 2 - MMTA - Respiratory</option>
                    <option value="Clinical Group 3 - MMTA - Endocrine">Clinical Group 3 - MMTA - Endocrine</option>
                    <option value="Clinical Group 4 - MMTA - GI/GU">Clinical Group 4 - MMTA - GI/GU</option>
                    <option value="Clinical Group 5 - MMTA - Infectious">Clinical Group 5 - MMTA - Infectious</option>
                    <option value="Clinical Group 6 - MMTA - Other">Clinical Group 6 - MMTA - Other</option>
                    <option value="Clinical Group 7 - Behavioral Health">Clinical Group 7 - Behavioral Health</option>
                    <option value="Clinical Group 8 - Complex Nursing">Clinical Group 8 - Complex Nursing</option>
                    <option value="Clinical Group 9 - MS Rehab">Clinical Group 9 - MS Rehab</option>
                    <option value="Clinical Group 10 - Wound">Clinical Group 10 - Wound</option>
                    <option value="Clinical Group 11 - Neuro Rehab">Clinical Group 11 - Neuro Rehab</option>
                    <option value="Clinical Group 12 - Medication Management">Clinical Group 12 - Medication Management</option>
                  </select>
                  {formErrors.clinicalGrouping && <div className="error-message">{formErrors.clinicalGrouping}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="wbs">Weakness, Balance, Safety (WBS)</label>
                  <textarea
                    id="wbs"
                    name="wbs"
                    value={formData.wbs}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="homebound">Homebound Status</label>
                  <textarea
                    id="homebound"
                    name="homebound"
                    value={formData.homebound}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row metrics-row">
                <div className="form-group">
                  <label htmlFor="height">Height</label>
                  <div className="input-with-icon">
                    <i className="fas fa-ruler-vertical"></i>
                    <input
                      type="text"
                      id="height"
                      name="height"
                      placeholder="5'6\"
                      value={formData.height}
                      onChange={handleInputChange}
                      className={formErrors.height ? 'error' : ''}
                    />
                  </div>
                  {formErrors.height && <div className="error-message">{formErrors.height}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="weight">Weight</label>
                  <div className="input-with-icon">
                    <i className="fas fa-weight"></i>
                    <input
                      type="text"
                      id="weight"
                      name="weight"
                      placeholder="165 lbs"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className={formErrors.weight ? 'error' : ''}
                    />
                  </div>
                  {formErrors.weight && <div className="error-message">{formErrors.weight}</div>}
                </div>
                <div className="form-group">
                  <label>BMI (Calculated)</label>
                  <div className="input-with-icon bmi-display">
                    <i className="fas fa-calculator"></i>
                    <div className="bmi-value">
                      {calculateBMI()}
                      <span 
                        className="bmi-indicator" 
                        data-status={getBmiStatus(calculateBMI())}
                      ></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => {
                  setIsEditing(false);
                  setFormData({...data});
                  setFormErrors({});
                }}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  <i className="fas fa-save"></i> Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default MedicalInfo;