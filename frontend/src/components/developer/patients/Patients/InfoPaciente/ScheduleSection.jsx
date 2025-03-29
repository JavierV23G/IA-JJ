import React, { useState, useEffect, useRef } from 'react';
import '../../../../../styles/developer/Patients/InfoPaciente/ScheduleSection.scss';
import VisitDetail from './VisitDetail';
import VisitTypeSelector from './VisitTypeSelector';
import FrequencySelector from './FrequencySelector';
import TherapistSelector from './TherapistSelector';

const ScheduleSection = ({ patientId }) => {
  // Estados para gestionar el calendario y visitas
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [visits, setVisits] = useState([]);
  const [isAddingVisit, setIsAddingVisit] = useState(false);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(true);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [certPeriod, setCertPeriod] = useState({ 
    start: new Date("2023-04-19"), 
    end: new Date("2025-04-19") 
  });
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'list'
  const calendarRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentFrequency, setCurrentFrequency] = useState('2W2 1W1');
  const [discipline, setDiscipline] = useState('PT'); // PT, OT, ST
  
  // Mock data for testing
  useEffect(() => {
    const fetchScheduleData = async () => {
      setIsLoading(true);
      
      // Simulating API call
      setTimeout(() => {
        // Sample visits data
        const mockVisits = [
          { 
            id: 1, 
            date: new Date(2025, 2, 20), // March 20, 2025
            type: 'Initial Eval', 
            status: 'Scheduled',
            time: '8:00 PM',
            therapist: { name: 'Willie Blackwell', role: 'PT' },
            notes: '',
            hasDocuments: true
          },
          { 
            id: 2, 
            date: new Date(2025, 2, 26), // March 26, 2025
            type: 'Standard', 
            status: 'Scheduled',
            time: '3:15 PM',
            therapist: { name: 'Jacob Staffey', role: 'PTA' },
            notes: '',
            hasDocuments: false
          },
          { 
            id: 3, 
            date: new Date(2025, 2, 31), // March 31, 2025
            type: 'Standard', 
            status: 'Scheduled',
            time: '7:15 PM',
            therapist: { name: 'Jacob Staffey', role: 'PTA' },
            notes: '',
            hasDocuments: false
          },
          { 
            id: 4, 
            date: new Date(2025, 3, 2), // April 2, 2025
            type: 'Discharge (DC w/o a visit)', 
            status: 'Scheduled',
            time: '2:45 PM',
            therapist: { name: 'Regina Araquel', role: 'PT' },
            notes: '',
            hasDocuments: true
          }
        ];
        
        setVisits(mockVisits);
        setIsLoading(false);
      }, 1500);
    };
    
    fetchScheduleData();
  }, [patientId]);
  
  // Helper functions para el calendario
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  
  const getMonthData = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    let dayCount = 1;
    
    // Previous month days to fill the first week
    for (let i = 0; i < firstDayOfMonth; i++) {
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const prevMonthDays = getDaysInMonth(prevYear, prevMonth);
      
      days.push({
        date: new Date(prevYear, prevMonth, prevMonthDays - (firstDayOfMonth - i - 1)),
        isCurrentMonth: false,
        hasVisit: false,
        visits: []
      });
    }
    
    // Current month days
    for (let i = 0; i < daysInMonth; i++) {
      const date = new Date(year, month, dayCount);
      const dayVisits = visits.filter(visit => 
        visit.date.getDate() === date.getDate() && 
        visit.date.getMonth() === date.getMonth() && 
        visit.date.getFullYear() === date.getFullYear()
      );
      
      days.push({
        date,
        isCurrentMonth: true,
        hasVisit: dayVisits.length > 0,
        visits: dayVisits,
        isInCertPeriod: date >= certPeriod.start && date <= certPeriod.end,
        isPast: date < new Date(new Date().setHours(0, 0, 0, 0))
      });
      
      dayCount++;
    }
    
    // Next month days to complete the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
    for (let i = 0; i < remainingDays; i++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      
      days.push({
        date: new Date(nextYear, nextMonth, i + 1),
        isCurrentMonth: false,
        hasVisit: false,
        visits: []
      });
    }
    
    return days;
  };
  
  // Formatear fecha para mostrar
  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  // Navegar entre meses
  const navigateMonth = (direction) => {
    setIsAnimating(true);
    
    setTimeout(() => {
      const newMonth = new Date(currentMonth);
      newMonth.setMonth(newMonth.getMonth() + direction);
      setCurrentMonth(newMonth);
      setIsAnimating(false);
    }, 300);
  };
  
  // Cambiar a la vista del mes actual
  const goToToday = () => {
    setIsAnimating(true);
    
    setTimeout(() => {
      setCurrentMonth(new Date());
      setIsAnimating(false);
    }, 300);
  };
  
  // Manejar la selección de un día
  const handleDateSelect = (day) => {
    if (!day.isInCertPeriod) return;
    
    setSelectedDate(day.date);
    
    if (day.hasVisit) {
      // Si ya hay visitas para este día, mostrar la primera
      setSelectedVisit(day.visits[0]);
    } else {
      // Si no hay visitas, preparar para agregar una nueva
      setSelectedVisit(null);
      setIsAddingVisit(true);
    }
  };
  
  // Cambiar entre vistas (mes, semana, lista)
  const handleViewChange = (view) => {
    setViewMode(view);
  };
  
  // Agregar una nueva visita
  const handleAddVisit = (visitData) => {
    const newVisit = {
      id: visits.length + 1,
      date: selectedDate,
      ...visitData
    };
    
    setVisits([...visits, newVisit]);
    setIsAddingVisit(false);
    setSelectedVisit(newVisit);
  };
  
  // Eliminar una visita
  const handleDeleteVisit = (visitId) => {
    setVisits(visits.filter(visit => visit.id !== visitId));
    setSelectedVisit(null);
  };
  
  // Actualizar una visita existente
  const handleUpdateVisit = (updatedVisit) => {
    setVisits(visits.map(visit => 
      visit.id === updatedVisit.id ? updatedVisit : visit
    ));
    setSelectedVisit(updatedVisit);
  };
  
  // Renderizar encabezados de los días de la semana
  const renderWeekDays = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <div className="calendar-header">
        {weekDays.map(day => (
          <div key={day} className="weekday">
            <span>{day}</span>
          </div>
        ))}
      </div>
    );
  };

  // Determinar el color según el tipo de visita
  const getVisitTypeColor = (type) => {
    switch(type) {
      case 'Initial Eval':
        return 'visit-initial';
      case 'Standard':
        return 'visit-standard';
      case 'Discharge (DC w/o a visit)':
        return 'visit-discharge';
      case 'ReCert Eval':
        return 'visit-recert';
      case 'Post-Hospital Eval':
        return 'visit-posthospital';
      default:
        return 'visit-other';
    }
  };
  
  // Determinar el color según la disciplina
  const getDisciplineColor = () => {
    switch(discipline) {
      case 'PT': 
        return 'discipline-green';
      case 'OT': 
        return 'discipline-orange';
      case 'ST': 
        return 'discipline-purple';
      default: 
        return '';
    }
  };
  
  // Renderizar el calendario mensual
  const renderCalendar = () => {
    const days = getMonthData();
    
    return (
      <div className={`calendar-grid ${isAnimating ? 'animating' : ''}`} ref={calendarRef}>
        {days.map((day, index) => {
          const isToday = day.date.toDateString() === new Date().toDateString();
          const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString();
          
          return (
            <div 
              key={index} 
              className={`calendar-day ${!day.isCurrentMonth ? 'not-current-month' : ''} 
                          ${isToday ? 'today' : ''} 
                          ${isSelected ? 'selected' : ''}
                          ${day.hasVisit ? 'has-visit' : ''}
                          ${day.isInCertPeriod ? 'in-cert-period' : 'out-cert-period'}
                          ${day.isPast ? 'past-day' : ''}`}
              onClick={() => handleDateSelect(day)}
            >
              <div className="day-header">
                <span className="day-number">{day.date.getDate()}</span>
                {isToday && <span className="today-marker"></span>}
              </div>
              
              {day.hasVisit && (
                <div className="day-visits">
                  {day.visits.map((visit, visitIndex) => (
                    <div 
                      key={visitIndex} 
                      className={`visit-indicator ${getVisitTypeColor(visit.type)}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVisit(visit);
                        setSelectedDate(day.date);
                      }}
                    >
                      <span className="visit-time">{visit.time}</span>
                      <span className="visit-type">{visit.type}</span>
                      <span className="visit-therapist">{visit.therapist.name} ({visit.therapist.role})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  // Renderizar la vista de semana
  const renderWeekView = () => {
    // Obtener el domingo de la semana actual
    const currentDate = new Date(currentMonth);
    const firstDayOfWeek = new Date(currentDate);
    firstDayOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekDays = [];
    
    // Generar los 7 días de la semana
    for (let i = 0; i < 7; i++) {
      const day = new Date(firstDayOfWeek);
      day.setDate(firstDayOfWeek.getDate() + i);
      
      const dayVisits = visits.filter(visit => 
        visit.date.getDate() === day.getDate() && 
        visit.date.getMonth() === day.getMonth() && 
        visit.date.getFullYear() === day.getFullYear()
      );
      
      weekDays.push({
        date: day,
        isToday: day.toDateString() === new Date().toDateString(),
        hasVisit: dayVisits.length > 0,
        visits: dayVisits,
        isInCertPeriod: day >= certPeriod.start && day <= certPeriod.end,
        isPast: day < new Date(new Date().setHours(0, 0, 0, 0))
      });
    }
    
    return (
      <div className="week-view">
        <div className="week-header">
          {weekDays.map((day, index) => (
            <div 
              key={index} 
              className={`week-day-header ${day.isToday ? 'today' : ''}`}
            >
              <div className="day-name">{day.date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div className="day-number">{day.date.getDate()}</div>
              <div className="day-month">{day.date.toLocaleDateString('en-US', { month: 'short' })}</div>
            </div>
          ))}
        </div>
        
        <div className="week-body">
          {weekDays.map((day, index) => (
            <div 
              key={index} 
              className={`week-day-column ${day.isToday ? 'today' : ''} 
                          ${day.isInCertPeriod ? 'in-cert-period' : 'out-cert-period'}
                          ${day.isPast ? 'past-day' : ''}`}
              onClick={() => handleDateSelect(day)}
            >
              {day.hasVisit ? (
                day.visits.map((visit, visitIndex) => (
                  <div 
                    key={visitIndex} 
                    className={`week-visit ${getVisitTypeColor(visit.type)}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVisit(visit);
                      setSelectedDate(day.date);
                    }}
                  >
                    <div className="visit-time">{visit.time}</div>
                    <div className="visit-title">{visit.type}</div>
                    <div className="visit-therapist">{visit.therapist.name}</div>
                    <div className="visit-role">{visit.therapist.role}</div>
                  </div>
                ))
              ) : (
                <div className="no-visits"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Renderizar la vista de lista
  const renderListView = () => {
    // Agrupar visitas por mes para la vista de lista
    const groupedVisits = visits.reduce((acc, visit) => {
      const monthYear = visit.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      
      acc[monthYear].push(visit);
      return acc;
    }, {});
    
    return (
      <div className="list-view">
        {Object.keys(groupedVisits).length > 0 ? (
          Object.entries(groupedVisits).map(([monthYear, monthVisits]) => (
            <div key={monthYear} className="month-visits">
              <div className="month-header">{monthYear}</div>
              <div className="visits-list">
                {monthVisits
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map(visit => (
                    <div 
                      key={visit.id} 
                      className={`list-visit ${getVisitTypeColor(visit.type)}`}
                      onClick={() => {
                        setSelectedVisit(visit);
                        setSelectedDate(visit.date);
                      }}
                    >
                      <div className="visit-date">
                        <div className="visit-day">{visit.date.getDate()}</div>
                        <div className="visit-weekday">{visit.date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      </div>
                      <div className="visit-content">
                        <div className="visit-time">{visit.time}</div>
                        <div className="visit-type">{visit.type}</div>
                        <div className="visit-therapist">
                          {visit.therapist.name} <span className="therapist-role">({visit.therapist.role})</span>
                        </div>
                      </div>
                      <div className="visit-status">
                        <span className={`status-badge ${visit.status.toLowerCase()}`}>
                          {visit.status}
                        </span>
                        {visit.hasDocuments && (
                          <i className="fas fa-file-medical" title="Has documents"></i>
                        )}
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          ))
        ) : (
          <div className="no-visits-message">
            <i className="fas fa-calendar-times"></i>
            <p>No visits scheduled in this period</p>
          </div>
        )}
      </div>
    );
  };
  
  // Actualizar la frecuencia
  const handleFrequencyChange = (newFrequency) => {
    setCurrentFrequency(newFrequency);
  };
  
  // Cambiar la disciplina
  const handleDisciplineChange = (newDiscipline) => {
    setDiscipline(newDiscipline);
  };
  
  // Determinar qué vista renderizar según el modo seleccionado
  const renderViewContent = () => {
    switch(viewMode) {
      case 'week':
        return renderWeekView();
      case 'list':
        return renderListView();
      case 'month':
      default:
        return (
          <>
            {renderWeekDays()}
            {renderCalendar()}
          </>
        );
    }
  };

  return (
    <div className={`schedule-section ${getDisciplineColor()}`}>
      <div className="section-header">
        <h2 className="section-title">
          <i className="fas fa-calendar-alt"></i>
          Schedule & Documentation
        </h2>
      </div>

      <div className="schedule-content">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading schedule information...</p>
          </div>
        ) : (
          <div className="schedule-container">
            {/* Controles del calendario */}
            <div className="calendar-controls">
              <div className="control-left">
                <button 
                  className="today-btn"
                  onClick={goToToday}
                >
                  Today
                </button>
                <div className="nav-buttons">
                  <button 
                    className="nav-btn prev"
                    onClick={() => navigateMonth(-1)}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button 
                    className="nav-btn next"
                    onClick={() => navigateMonth(1)}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
                <h3 className="current-date">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
              </div>
              
              <div className="control-right">
                <div className="view-selector">
                  <button 
                    className={`view-btn ${viewMode === 'month' ? 'active' : ''}`}
                    onClick={() => handleViewChange('month')}
                  >
                    <i className="fas fa-calendar-alt"></i>
                    <span>Month</span>
                  </button>
                  <button 
                    className={`view-btn ${viewMode === 'week' ? 'active' : ''}`}
                    onClick={() => handleViewChange('week')}
                  >
                    <i className="fas fa-calendar-week"></i>
                    <span>Week</span>
                  </button>
                  <button 
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => handleViewChange('list')}
                  >
                    <i className="fas fa-list"></i>
                    <span>List</span>
                  </button>
                </div>
                
                <div className="discipline-selector">
                  <select 
                    value={discipline}
                    onChange={(e) => handleDisciplineChange(e.target.value)}
                    className={getDisciplineColor()}
                  >
                    <option value="PT">Physical Therapy</option>
                    <option value="OT">Occupational Therapy</option>
                    <option value="ST">Speech Therapy</option>
                  </select>
                </div>
                
                <div className="action-buttons">
                  <button className="action-btn add-visit">
                    <i className="fas fa-plus"></i>
                    <span>Add Visit</span>
                  </button>
                  <button className="action-btn print">
                    <i className="fas fa-print"></i>
                    <span>Print</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Info del periodo de certificación */}
            <div className="cert-period-info">
              <div className="cert-dates">
                <div className="cert-date start">
                  <i className="fas fa-calendar-check"></i>
                  <span>{certPeriod.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="date-separator">
                  <div className="line"></div>
                  <i className="fas fa-arrow-right"></i>
                  <div className="line"></div>
                </div>
                <div className="cert-date end">
                  <i className="fas fa-calendar-times"></i>
                  <span>{certPeriod.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
              
              <div className="frequency-info">
                <label>Visit Frequency:</label>
                <FrequencySelector 
                  currentValue={currentFrequency}
                  onChange={handleFrequencyChange}
                />
              </div>
            </div>
            
            {/* Leyenda para los colores de visitas */}
            <div className="visit-legend">
              <div className="legend-item">
                <div className="legend-color visit-initial"></div>
                <span>Initial Eval</span>
              </div>
              <div className="legend-item">
                <div className="legend-color visit-standard"></div>
                <span>Standard</span>
              </div>
              <div className="legend-item">
                <div className="legend-color visit-recert"></div>
                <span>ReCert</span>
              </div>
              <div className="legend-item">
                <div className="legend-color visit-discharge"></div>
                <span>Discharge</span>
              </div>
              <div className="legend-item">
                <div className="legend-color visit-posthospital"></div>
                <span>Post-Hospital</span>
              </div>
            </div>

            {/* Contenido del calendario según la vista */}
            <div className={`calendar-wrapper ${isCalendarExpanded ? 'expanded' : 'collapsed'}`}>
              {renderViewContent()}
            </div>

            {/* Panel de detalles de visita */}
            {(selectedVisit || isAddingVisit) && (
              <div className="visit-details-panel">
                <div className="panel-header">
                  <h3>
                    {isAddingVisit ? (
                      <>
                        <i className="fas fa-plus-circle"></i>
                        Add Visit for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </>
                    ) : (
                      <>
                        <i className="fas fa-calendar-day"></i>
                        Visit Details
                      </>
                    )}
                  </h3>
                  <button 
                    className="close-panel-btn"
                    onClick={() => {
                      setSelectedVisit(null);
                      setIsAddingVisit(false);
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <div className="panel-content">
                  {isAddingVisit ? (
                    <div className="add-visit-form">
                      <div className="form-group">
                        <label>Visit Type</label>
                        <VisitTypeSelector discipline={discipline} />
                      </div>
                      
                      <div className="form-group">
                        <label>Therapist</label>
                        <TherapistSelector discipline={discipline} />
                      </div>
                      
                      <div className="form-group time-selectors">
                        <div className="time-input">
                          <label>Time</label>
                          <div className="time-picker">
                            <select defaultValue="8">
                              {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                                <option key={hour} value={hour}>{hour}</option>
                              ))}
                            </select>
                            <span>:</span>
                            <select defaultValue="00">
                              {['00', '15', '30', '45'].map(minute => (
                                <option key={minute} value={minute}>{minute}</option>
                              ))}
                            </select>
                            <select defaultValue="PM">
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label>Notes (Optional)</label>
                        <textarea 
                          placeholder="Add any notes about this visit..."
                          rows={3}
                        ></textarea>
                      </div>
                      
                      <div className="form-actions">
                        <button 
                          className="cancel-btn"
                          onClick={() => setIsAddingVisit(false)}
                        >
                          Cancel
                        </button>
                        <button 
                          className="save-btn"
                          onClick={() => {
                            handleAddVisit({
                              type: 'Standard',
                              status: 'Scheduled',
                              time: '8:00 PM',
                              therapist: { name: 'Regina Araquel', role: 'PT' },
                              notes: '',
                              hasDocuments: false
                            });
                          }}
                        >
                          <i className="fas fa-calendar-plus"></i>
                          Schedule Visit
                        </button>
                      </div>
                    </div>
                  ) : selectedVisit && (
                    <div className="visit-details">
                      <div className="detail-card">
                        <div className="detail-header">
                          <i className={`fas fa-calendar-${selectedVisit.type === 'Initial Eval' ? 'plus' : 'check'}`}></i>
                          <h4>{selectedVisit.type}</h4>
                          <span className={`status-badge ${selectedVisit.status.toLowerCase()}`}>
                            {selectedVisit.status}
                          </span>
                        </div>

                        <div className="detail-content">
                          <div className="detail-row">
                            <div className="detail-label">
                              <i className="fas fa-calendar-day"></i>
                              <span>Date:</span>
                            </div>
                            <div className="detail-value">
                              {selectedVisit.date.toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                month: 'long', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </div>
                          </div>
                          
                          <div className="detail-row">
                            <div className="detail-label">
                              <i className="fas fa-clock"></i>
                              <span>Time:</span>
                            </div>
                            <div className="detail-value">
                              {selectedVisit.time}
                            </div>
                          </div>
                          
                          <div className="detail-row">
                            <div className="detail-label">
                              <i className="fas fa-user-md"></i>
                              <span>Therapist:</span>
                            </div>
                            <div className="detail-value">
                              {selectedVisit.therapist.name} 
                              <span className="therapist-role">({selectedVisit.therapist.role})</span>
                            </div>
                          </div>
                          
                          <div className="detail-row">
                            <div className="detail-label">
                              <i className="fas fa-clipboard-list"></i>
                              <span>Status:</span>
                            </div>
                            <div className="detail-value">
                              <span className={`status-badge ${selectedVisit.status.toLowerCase()}`}>
                                {selectedVisit.status}
                              </span>
                            </div>
                          </div>
                          
                          {selectedVisit.notes && (
                            <div className="detail-row notes">
                              <div className="detail-label">
                                <i className="fas fa-sticky-note"></i>
                                <span>Notes:</span>
                              </div>
                              <div className="detail-value">
                                {selectedVisit.notes || "No notes available for this visit."}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="detail-actions">
                          {selectedVisit.hasDocuments && (
                            <button className="action-btn view-docs">
                              <i className="fas fa-file-medical"></i>
                              <span>View Documents</span>
                            </button>
                          )}
                          <button className="action-btn edit">
                            <i className="fas fa-edit"></i>
                            <span>Edit</span>
                          </button>
                          <button 
                            className="action-btn delete"
                            onClick={() => handleDeleteVisit(selectedVisit.id)}
                          >
                            <i className="fas fa-trash-alt"></i>
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleSection;