import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CalendarSelector = ({ initialDate, onDateSelect, onClose }) => {
  // Fecha actual para referencia
  const today = new Date();
  
  // Parseando la fecha inicial si existe
  const parseInitialDate = () => {
    if (!initialDate) return today;
    
    const parts = initialDate.split('-');
    if (parts.length !== 3) return today;
    
    // El formato es MM-DD-YYYY
    return new Date(parts[2], parts[0] - 1, parts[1]);
  };
  
  // Estado para la fecha seleccionada y el mes/año mostrados
  const [selectedDate, setSelectedDate] = useState(parseInitialDate());
  const [displayedMonth, setDisplayedMonth] = useState(parseInitialDate().getMonth());
  const [displayedYear, setDisplayedYear] = useState(parseInitialDate().getFullYear());
  
  // Nombres de los meses y días
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Función para generar los días del mes actual
  const generateDays = () => {
    const days = [];
    const daysInMonth = new Date(displayedYear, displayedMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(displayedYear, displayedMonth, 1).getDay();
    
    // Días del mes anterior para completar la primera semana
    const daysInPrevMonth = new Date(displayedYear, displayedMonth, 0).getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        month: displayedMonth - 1,
        year: displayedMonth === 0 ? displayedYear - 1 : displayedYear,
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = 
        i === today.getDate() && 
        displayedMonth === today.getMonth() && 
        displayedYear === today.getFullYear();
        
      const isSelected = 
        i === selectedDate.getDate() && 
        displayedMonth === selectedDate.getMonth() && 
        displayedYear === selectedDate.getFullYear();
        
      days.push({
        day: i,
        month: displayedMonth,
        year: displayedYear,
        isCurrentMonth: true,
        isToday,
        isSelected
      });
    }
    
    // Días del mes siguiente para completar la última semana
    const remainingDays = 42 - days.length; // 6 filas x 7 días = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: displayedMonth + 1,
        year: displayedMonth === 11 ? displayedYear + 1 : displayedYear,
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    return days;
  };
  
  // Función para avanzar al mes siguiente
  const nextMonth = () => {
    if (displayedMonth === 11) {
      setDisplayedMonth(0);
      setDisplayedYear(displayedYear + 1);
    } else {
      setDisplayedMonth(displayedMonth + 1);
    }
  };
  
  // Función para retroceder al mes anterior
  const prevMonth = () => {
    if (displayedMonth === 0) {
      setDisplayedMonth(11);
      setDisplayedYear(displayedYear - 1);
    } else {
      setDisplayedMonth(displayedMonth - 1);
    }
  };
  
  // Función para seleccionar una fecha
  const handleDateClick = (day) => {
    const newDate = new Date(day.year, day.month, day.day);
    setSelectedDate(newDate);
    
    // Formatear la fecha como MM-DD-YYYY
    const month = (day.month + 1).toString().padStart(2, '0');
    const date = day.day.toString().padStart(2, '0');
    const year = day.year;
    
    // Llamar a la función de callback con la fecha formateada
    onDateSelect(`${month}-${date}-${year}`);
  };
  
  // Función para ir a la fecha actual
  const goToToday = () => {
    setDisplayedMonth(today.getMonth());
    setDisplayedYear(today.getFullYear());
  };
  
  // Generar años para el selector (10 años antes y después del actual)
  const years = [];
  const currentYear = today.getFullYear();
  for (let i = currentYear - 10; i <= currentYear + 10; i++) {
    years.push(i);
  }
  
  // Generar los días para mostrar en el calendario
  const days = generateDays();
  
  // Animaciones
  const calendarVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };
  
  const dayVariants = {
    hover: { 
      scale: 1.1,
      y: -3,
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  return (
    <motion.div 
      className="calendar-selector"
      variants={calendarVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="calendar-header">
        <div className="month-nav">
          <button className="nav-btn prev" onClick={prevMonth}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="month-name">{monthNames[displayedMonth]} {displayedYear}</span>
          <button className="nav-btn next" onClick={nextMonth}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        <div className="year-selector">
          <select 
            value={displayedYear}
            onChange={(e) => setDisplayedYear(parseInt(e.target.value))}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="weekdays">
        {weekdayNames.map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>
      
      <div className="days-grid">
        {days.map((day, index) => (
          <motion.div
            key={index}
            className={`day ${day.isCurrentMonth ? '' : 'other-month'} ${day.isToday ? 'today' : ''} ${day.isSelected ? 'selected' : ''}`}
            onClick={() => handleDateClick(day)}
            whileHover="hover"
            whileTap="tap"
            variants={dayVariants}
          >
            {day.day}
          </motion.div>
        ))}
      </div>
      
      <div className="calendar-footer">
        <button className="today-btn" onClick={goToToday}>
          <i className="fas fa-calendar-day"></i> Today
        </button>
        <button className="close-btn" onClick={onClose}>
          <i className="fas fa-times"></i> Close
        </button>
      </div>
    </motion.div>
  );
};

export default CalendarSelector;