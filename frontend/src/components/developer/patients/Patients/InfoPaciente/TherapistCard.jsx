import React, { useState, useEffect } from 'react';
import '../../../../../styles/developer/Patients/InfoPaciente/TherapistCard.scss';

const TherapistCard = ({ therapist, isEditing, role }) => {
  const [therapistList, setTherapistList] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(therapist);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchTherapists();
    }
  }, [isEditing]);

  useEffect(() => {
    setSelectedTherapist(therapist);
  }, [therapist]);

  const fetchTherapists = async () => {
    setIsLoading(true);
    // Simular una llamada a la API
    setTimeout(() => {
      setTherapistList([
        { id: 1, name: 'Araquel, Regina', role: 'PT', phone: '(917) 617-6012', email: 'raraquel@therapy.com' },
        { id: 2, name: 'Staffey, Jacob', role: 'PTA', phone: '(310) 902-0768', email: 'jstaffey@therapy.com' },
        { id: 3, name: 'Shimane, Justin', role: 'OT', phone: '(310) 529-8395', email: 'jshimane@therapy.com' },
        { id: 4, name: 'Kim, April', role: 'COTA', phone: '(562) 242-8175', email: 'akim@therapy.com' },
        { id: 5, name: 'Martinez, Elena', role: 'ST', phone: '(213) 456-7890', email: 'emartinez@therapy.com' },
        { id: 6, name: 'Johnson, Mark', role: 'STA', phone: '(310) 765-4321', email: 'mjohnson@therapy.com' },
        { id: 7, name: 'Smith, Sarah', role: role, phone: '(424) 123-4567', email: 'ssmith@therapy.com' },
        { id: 8, name: 'Davis, Michael', role: role, phone: '(213) 987-6543', email: 'mdavis@therapy.com' },
        { id: 9, name: 'Wilson, Jennifer', role: role, phone: '(818) 456-7890', email: 'jwilson@therapy.com' }
      ].filter(t => t.role === role));
      setIsLoading(false);
    }, 800);
  };

  const handleTherapistChange = (e) => {
    const therapistId = parseInt(e.target.value);
    const newTherapist = therapistList.find(t => t.id === therapistId) || null;
    setSelectedTherapist(newTherapist);
  };

  if (!therapist && !isEditing) {
    return (
      <div className="therapist-card empty">
        <div className="empty-message">
          <i className="fas fa-user-plus"></i>
          <span>No therapist assigned</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`therapist-card ${isEditing ? 'editing' : ''}`}>
      {isEditing ? (
        <>
          <div className="therapist-selector">
            <select
              value={selectedTherapist?.id || ''}
              onChange={handleTherapistChange}
              disabled={isLoading}
              className={isLoading ? 'loading' : ''}
            >
              <option value="">Select a therapist</option>
              {therapistList.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            {isLoading && (
              <div className="selector-loader">
                <div className="spinner"></div>
              </div>
            )}
          </div>
          
          {selectedTherapist && (
            <div className="therapist-preview">
              <div className="therapist-info">
                <div className="therapist-contact">
                  <div className="contact-item">
                    <i className="fas fa-phone"></i>
                    <span>{selectedTherapist.phone}</span>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-envelope"></i>
                    <span>{selectedTherapist.email}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="therapist-avatar">
            <div className="avatar-circle">
              {therapist.name.split(' ').map(word => word[0]).join('').substring(0, 2)}
            </div>
          </div>
          
          <div className="therapist-info">
            <div className="therapist-name">{therapist.name}</div>
            
            <div className="therapist-contact">
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <a href={`tel:${therapist.phone}`} className="phone-link">{therapist.phone}</a>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <a href={`mailto:${therapist.email}`} className="email-link">{therapist.email}</a>
              </div>
            </div>
          </div>
          
          <div className="action-buttons">
            <button className="action-btn message-btn" title="Send Message">
              <i className="fas fa-comment"></i>
            </button>
            <button className="action-btn call-btn" title="Call Therapist">
              <i className="fas fa-phone-alt"></i>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TherapistCard;