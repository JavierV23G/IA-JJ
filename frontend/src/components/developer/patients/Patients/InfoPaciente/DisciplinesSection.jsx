import React, { useState, useEffect, useRef } from 'react';
import PhysicalTherapy from './PhysicalTherapy.jsx';
import OccupationalTherapy from './OccupationalTherapy.jsx';
import SpeechTherapy from './SpeechTherapy.jsx';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../../../../../styles/developer/Patients/InfoPaciente/DisciplinesSection.scss';

const DisciplinesSection = ({ patientId }) => {
  const [activeSection, setActiveSection] = useState('physical');
  const [isLoading, setIsLoading] = useState(true);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(true);
  const [therapists, setTherapists] = useState({
    physical: [],
    occupational: [],
    speech: []
  });
  const [lastEdited, setLastEdited] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const disciplineContentRef = useRef(null);
  const initialLoadRef = useRef(true);
  
  // Datos simulados para el historial de cambios
  const changeHistory = [
    { discipline: 'physical', type: 'therapist_assigned', details: 'Regina Araquel (PT) assigned', timestamp: '03/10/2025 11:42 AM', user: 'Luis Nava' },
    { discipline: 'occupational', type: 'therapist_assigned', details: 'Justin Shimane (OT) assigned', timestamp: '03/05/2025 09:30 AM', user: 'Luis Nava' },
    { discipline: 'speech', type: 'frequency_updated', details: 'Frequency updated to 1W2', timestamp: '03/08/2025 02:15 PM', user: 'Luis Nava' },
    { discipline: 'physical', type: 'goal_completed', details: 'Goal "Improve balance" completed', timestamp: '03/09/2025 10:20 AM', user: 'Regina Araquel' }
  ];

  // Cargar datos y mostrar efectos de carga simulando una aplicación real
  useEffect(() => {
    const fetchTherapists = async () => {
      setIsLoading(true);
      setShowLoadingSpinner(true);
      
      // Simulando la carga desde una API
      setTimeout(() => {
        setTherapists({
          physical: [
            { id: 1, name: 'Araquel, Regina', role: 'PT', phone: '(917) 617-6012', email: 'raraquel@therapy.com', isActive: true, specialty: 'Orthopedics', avgRating: 4.8 },
            { id: 2, name: 'Staffey, Jacob', role: 'PTA', phone: '(310) 902-0768', email: 'jstaffey@therapy.com', isActive: true, specialty: 'Sports Rehabilitation', avgRating: 4.6 }
          ],
          occupational: [
            { id: 3, name: 'Shimane, Justin', role: 'OT', phone: '(310) 529-8395', email: 'jshimane@therapy.com', isActive: true, specialty: 'Hand Therapy', avgRating: 4.9 },
            { id: 4, name: 'Kim, April', role: 'COTA', phone: '(562) 242-8175', email: 'akim@therapy.com', isActive: true, specialty: 'Pediatrics', avgRating: 4.7 }
          ],
          speech: [
            { id: 5, name: 'Martinez, Elena', role: 'ST', phone: '(213) 456-7890', email: 'emartinez@therapy.com', isActive: true, specialty: 'Dysphagia', avgRating: 4.8 },
            { id: 6, name: 'Johnson, Mark', role: 'STA', phone: '(310) 765-4321', email: 'mjohnson@therapy.com', isActive: false, specialty: 'Voice Disorders', avgRating: 4.5 }
          ]
        });
        
        // Mostrar el spinner por un tiempo mínimo para evitar parpadeos
        setTimeout(() => {
          setShowLoadingSpinner(false);
          setTimeout(() => {
            setIsLoading(false);
            
            // Solo mostrar confeti en la carga inicial
            if (initialLoadRef.current) {
              setTimeout(() => setShowConfetti(true), 500);
              setTimeout(() => setShowConfetti(false), 4000);
              initialLoadRef.current = false;
            }
          }, 300);
        }, 800);
      }, 1000);
    };

    fetchTherapists();
  }, [patientId]);

  // Manejo de cambio de sección con animaciones
  const handleSectionChange = (section) => {
    if (section === activeSection) return;
    
    setIsLoading(true);
    setShowLoadingSpinner(true);
    setActiveSection(section);
    
    // Simulando la carga al cambiar de sección
    setTimeout(() => {
      setShowLoadingSpinner(false);
      setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => scrollToTop(), 100);
      }, 300);
    }, 600);
  };

  // Determinar el color de la disciplina para estilos consistentes
  const getDisciplineColor = (discipline) => {
    switch(discipline) {
      case 'physical': return 'discipline-green';
      case 'occupational': return 'discipline-orange';
      case 'speech': return 'discipline-purple';
      default: return '';
    }
  };
  
  // Obtener el ícono de la disciplina
  const getDisciplineIcon = (discipline) => {
    switch(discipline) {
      case 'physical': return 'fa-walking';
      case 'occupational': return 'fa-hands';
      case 'speech': return 'fa-comment-medical';
      default: return 'fa-question';
    }
  };
  
  // Obtener el nombre completo de la disciplina
  const getDisciplineName = (discipline) => {
    switch(discipline) {
      case 'physical': return 'Physical Therapy';
      case 'occupational': return 'Occupational Therapy';
      case 'speech': return 'Speech Language';
      default: return '';
    }
  };
  
  // Scroll automático al inicio del contenido al cambiar de pestaña
  const scrollToTop = () => {
    if (disciplineContentRef.current) {
      disciplineContentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };
  
  // Monitorear el scroll para mostrar el indicador de scroll
  useEffect(() => {
    const content = disciplineContentRef.current;
    
    const handleScroll = () => {
      if (!content) return;
      
      const isScrollable = content.scrollHeight > content.clientHeight;
      const isAtTop = content.scrollTop < 10;
      
      if (isScrollable && isAtTop && !isLoading) {
        setShowScrollHint(true);
        setTimeout(() => setShowScrollHint(false), 2000);
      } else {
        setShowScrollHint(false);
      }
    };
    
    // Mostrar el indicador de scroll después de la carga inicial
    if (!isLoading && !initialLoadRef.current) {
      setTimeout(handleScroll, 1000);
    }
    
    if (content) {
      content.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (content) {
        content.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isLoading]);

  // Renderiza el contenido de la disciplina activa
  const renderDisciplineContent = () => {
    if (showLoadingSpinner) {
      return (
        <div className="discipline-loading">
          <div className="loading-animation">
            <div className="loading-pulse"></div>
            <div className="loading-rings">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          <span className="loading-text">Loading therapist information...</span>
        </div>
      );
    }

    switch(activeSection) {
      case 'physical':
        return (
          <CSSTransition
            in={!isLoading}
            timeout={500}
            classNames="fade"
            unmountOnExit
          >
            <PhysicalTherapy 
              therapists={therapists.physical} 
              patientId={patientId} 
              onUpdate={(data) => handleDisciplineUpdate('physical', data)} 
            />
          </CSSTransition>
        );
      case 'occupational':
        return (
          <CSSTransition
            in={!isLoading}
            timeout={500}
            classNames="fade"
            unmountOnExit
          >
            <OccupationalTherapy 
              therapists={therapists.occupational} 
              patientId={patientId} 
              onUpdate={(data) => handleDisciplineUpdate('occupational', data)} 
            />
          </CSSTransition>
        );
      case 'speech':
        return (
          <CSSTransition
            in={!isLoading}
            timeout={500}
            classNames="fade"
            unmountOnExit
          >
            <SpeechTherapy 
              therapists={therapists.speech} 
              patientId={patientId} 
              onUpdate={(data) => handleDisciplineUpdate('speech', data)} 
            />
          </CSSTransition>
        );
      default:
        return null;
    }
  };
  
  // Manejar actualizaciones desde los componentes de terapias
  const handleDisciplineUpdate = (discipline, data) => {
    console.log(`${discipline} updated:`, data);
    setLastEdited({ discipline, timestamp: new Date() });
    
    // Aquí se podrían manejar actualizaciones reales a la API
    // y refrescar los datos según sea necesario
    
    // Mostrar efecto de confeti para celebrar guardado exitoso
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <div className="disciplines-section">
      {/* Header con título de sección */}
      <div className="section-header">
        <div className="header-main">
          <h2 className="section-title">
            <i className="fas fa-users-medical"></i>
            <span>Disciplines</span>
          </h2>
          
          {lastEdited && (
            <div className="last-edited">
              <i className="fas fa-history"></i>
              <span>{lastEdited.discipline} updated recently</span>
            </div>
          )}
        </div>
        
        <div className="section-actions">
          <button className="history-btn" title="View change history">
            <i className="fas fa-clock"></i>
            <span className="btn-text">History</span>
          </button>
          
          <div className="dropdown help-dropdown">
            <button className="help-btn" title="View help">
              <i className="fas fa-question-circle"></i>
              <span className="btn-text">Help</span>
            </button>
            
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <i className="fas fa-book"></i>
                <h4>Disciplines Help</h4>
              </div>
              <div className="dropdown-content">
                <p>This section allows you to manage therapy disciplines for this patient.</p>
                <div className="help-topics">
                  <div className="help-topic">
                    <h5><i className="fas fa-user-md"></i> Assigning Therapists</h5>
                    <p>Click "Edit" and select therapists from the dropdown menu.</p>
                  </div>
                  <div className="help-topic">
                    <h5><i className="fas fa-calendar-alt"></i> Setting Frequency</h5>
                    <p>Use the frequency selector to set visit patterns.</p>
                  </div>
                  <div className="help-topic">
                    <h5><i className="fas fa-bullseye"></i> Treatment Goals</h5>
                    <p>Add and track progress on treatment goals.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal de disciplinas */}
      <div className="disciplines-content">
        {/* Pestañas para seleccionar disciplinas */}
        <div className="disciplines-tabs">
          <button 
            className={`discipline-tab ${activeSection === 'physical' ? 'active' : ''} ${getDisciplineColor('physical')}`}
            onClick={() => handleSectionChange('physical')}
            disabled={isLoading}
          >
            <div className="tab-icon">
              <i className={`fas ${getDisciplineIcon('physical')}`}></i>
            </div>
            <div className="tab-content">
              <span className="tab-label">Physical Therapy</span>
              <div className="tab-meta">
                <span className="therapist-count">{therapists.physical.length}</span>
                <span className="tab-status active">Active</span>
              </div>
            </div>
          </button>
          
          <button 
            className={`discipline-tab ${activeSection === 'occupational' ? 'active' : ''} ${getDisciplineColor('occupational')}`}
            onClick={() => handleSectionChange('occupational')}
            disabled={isLoading}
          >
            <div className="tab-icon">
              <i className={`fas ${getDisciplineIcon('occupational')}`}></i>
            </div>
            <div className="tab-content">
              <span className="tab-label">Occupational Therapy</span>
              <div className="tab-meta">
                <span className="therapist-count">{therapists.occupational.length}</span>
                <span className="tab-status active">Active</span>
              </div>
            </div>
          </button>
          
          <button 
            className={`discipline-tab ${activeSection === 'speech' ? 'active' : ''} ${getDisciplineColor('speech')}`}
            onClick={() => handleSectionChange('speech')}
            disabled={isLoading}
          >
            <div className="tab-icon">
              <i className={`fas ${getDisciplineIcon('speech')}`}></i>
            </div>
            <div className="tab-content">
              <span className="tab-label">Speech Language</span>
              <div className="tab-meta">
                <span className="therapist-count">{therapists.speech.length}</span>
                <span className="tab-status active">Active</span>
              </div>
            </div>
          </button>
        </div>

        {/* Contenedor del contenido de la disciplina */}
        <div 
          className="discipline-content-wrapper" 
          ref={disciplineContentRef}
        >
          <div className={`discipline-content ${getDisciplineColor(activeSection)}`}>
            <div className="content-header">
              <div className="discipline-banner">
                <div className={`banner-icon ${getDisciplineColor(activeSection)}`}>
                  <i className={`fas ${getDisciplineIcon(activeSection)}`}></i>
                </div>
                <h3>{getDisciplineName(activeSection)}</h3>
              </div>
            </div>
            
            {renderDisciplineContent()}
            
            {/* Indicador de desplazamiento */}
            <div className={`scroll-indicator ${showScrollHint ? 'visible' : ''}`}>
              <i className="fas fa-chevron-down"></i>
              <span>Scroll for more</span>
            </div>
          </div>
        </div>
        
        {/* Historial de actividad reciente */}
        <div className="activity-timeline">
          <div className="timeline-header">
            <h4><i className="fas fa-history"></i> Recent Activity</h4>
          </div>
          <div className="timeline-events">
            {changeHistory.slice(0, 3).map((event, index) => (
              <div key={index} className={`timeline-event ${getDisciplineColor(event.discipline)}`}>
                <div className="event-time">
                  <div className="event-icon">
                    {event.type === 'therapist_assigned' && <i className="fas fa-user-plus"></i>}
                    {event.type === 'frequency_updated' && <i className="fas fa-calendar-check"></i>}
                    {event.type === 'goal_completed' && <i className="fas fa-bullseye"></i>}
                  </div>
                  <div className="time-display">{event.timestamp.split(' ')[0]}</div>
                </div>
                <div className="event-content">
                  <div className="event-title">{event.details}</div>
                  <div className="event-meta">
                    <span className="event-discipline">
                      <i className={`fas ${getDisciplineIcon(event.discipline)}`}></i>
                      {getDisciplineName(event.discipline)}
                    </span>
                    <span className="event-user">{event.user}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {changeHistory.length > 3 && (
              <button className="view-all-activity">
                <span>View all activity</span>
                <i className="fas fa-chevron-right"></i>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Efecto de confeti para celebrar guardado exitoso */}
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="confetti"></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisciplinesSection;