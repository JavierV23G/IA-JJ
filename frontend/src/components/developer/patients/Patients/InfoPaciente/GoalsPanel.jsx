import React, { useState, useEffect } from 'react';
import '../../../../../styles/developer/Patients/InfoPaciente/GoalsPanel.scss';


const GoalsPanel = ({ disciplineType, patientId, isEditing }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  
  useEffect(() => {
    fetchGoals();
  }, [disciplineType, patientId]);
  
  const fetchGoals = () => {
    setLoading(true);
    // Simulación de llamada a API para obtener objetivos
    setTimeout(() => {
      // Datos simulados según la disciplina
      let mockGoals = [];
      
      if (disciplineType === 'physical') {
        mockGoals = [
          { id: 1, text: 'Patient will improve balance while standing to reduce fall risk.', progress: 65, target: 'By 04/15/2025' },
          { id: 2, text: 'Patient will increase strength in lower extremities to improve mobility.', progress: 40, target: 'By 04/30/2025' },
          { id: 3, text: 'Patient will demonstrate proper use of assistive device for ambulation.', progress: 80, target: 'By 03/25/2025' },
          { id: 4, text: 'Patient will improve endurance to walk 100 feet without rest breaks.', progress: 30, target: 'By 05/10/2025' }
        ];
      } else if (disciplineType === 'occupational') {
        mockGoals = [
          { id: 5, text: 'Patient will independently perform dressing activities with minimal assistance.', progress: 55, target: 'By 04/20/2025' },
          { id: 6, text: 'Patient will demonstrate proper body mechanics during ADLs to reduce fall risk.', progress: 70, target: 'By 03/30/2025' },
          { id: 7, text: 'Patient will increase coordination to improve meal preparation abilities.', progress: 45, target: 'By 04/25/2025' }
        ];
      } else if (disciplineType === 'speech') {
        mockGoals = [
          { id: 8, text: 'Patient will improve swallowing function to safely consume regular consistency foods.', progress: 60, target: 'By 04/10/2025' },
          { id: 9, text: 'Patient will increase speech clarity to be understood by unfamiliar listeners.', progress: 50, target: 'By 04/05/2025' },
          { id: 10, text: 'Patient will demonstrate improved cognitive skills for medication management.', progress: 35, target: 'By 05/15/2025' }
        ];
      }
      
      setGoals(mockGoals);
      setLoading(false);
    }, 800);
  };
  
  const addNewGoal = () => {
    if (!newGoalText.trim() || !newGoalTarget.trim()) return;
    
    const newGoal = {
      id: Date.now(),
      text: newGoalText,
      progress: 0,
      target: newGoalTarget
    };
    
    setGoals([...goals, newGoal]);
    setNewGoalText('');
    setNewGoalTarget('');
  };
  
  const updateGoalProgress = (goalId, newProgress) => {
    setGoals(goals.map(goal => 
      goal.id === goalId ? { ...goal, progress: parseInt(newProgress) } : goal
    ));
  };
  
  const deleteGoal = (goalId) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };
  
  const getProgressColor = (progress) => {
    if (progress < 30) return 'low';
    if (progress < 70) return 'medium';
    return 'high';
  };
  
  const getDisciplineColor = () => {
    switch (disciplineType) {
      case 'physical': return 'green';
      case 'occupational': return 'orange';
      case 'speech': return 'purple';
      default: return '';
    }
  };
  
  return (
    <div className={`goals-panel ${getDisciplineColor()}`}>
      <div className="goals-header">
        <h4>
          <i className="fas fa-bullseye"></i>
          Treatment Goals
        </h4>
      </div>
      
      <div className="goals-content">
        {loading ? (
          <div className="goals-loading">
            <div className="spinner"></div>
            <span>Loading treatment goals...</span>
          </div>
        ) : (
          <>
            {goals.length > 0 ? (
              <div className="goals-list">
                {goals.map((goal) => (
                  <div className="goal-item" key={goal.id}>
                    <div className="goal-header">
                      <div className="goal-info">
                        <div className="goal-text">{goal.text}</div>
                        <div className="goal-target">
                          <i className="fas fa-calendar-day"></i>
                          <span>{goal.target}</span>
                        </div>
                      </div>
                      
                      {isEditing && (
                        <button 
                          className="delete-goal-btn" 
                          onClick={() => deleteGoal(goal.id)}
                          title="Delete Goal"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      )}
                    </div>
                    
                    <div className="goal-progress">
                      <div className="progress-info">
                        <span className="progress-label">Progress</span>
                        <span className="progress-value">{goal.progress}%</span>
                      </div>
                      
                      <div className="progress-bar-container">
                        <div 
                          className={`progress-bar ${getProgressColor(goal.progress)}`}
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      
                      {isEditing && (
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={goal.progress} 
                          onChange={(e) => updateGoalProgress(goal.id, e.target.value)}
                          className="progress-slider"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-goals">
                <i className="fas fa-clipboard-list"></i>
                <p>No treatment goals have been defined yet.</p>
              </div>
            )}
            
            {isEditing && (
              <div className="add-goal-form">
                <h5>
                  <i className="fas fa-plus-circle"></i>
                  Add New Goal
                </h5>
                
                <div className="form-group">
                  <label>Goal Description</label>
                  <textarea 
                    value={newGoalText}
                    onChange={(e) => setNewGoalText(e.target.value)}
                    placeholder="Enter a new treatment goal..."
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label>Target Date</label>
                  <input 
                    type="text" 
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(e.target.value)}
                    placeholder="e.g., By 05/15/2025"
                  />
                </div>
                
                <button 
                  className="add-goal-btn" 
                  onClick={addNewGoal}
                  disabled={!newGoalText.trim() || !newGoalTarget.trim()}
                >
                  <i className="fas fa-plus"></i>
                  Add Goal
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GoalsPanel;