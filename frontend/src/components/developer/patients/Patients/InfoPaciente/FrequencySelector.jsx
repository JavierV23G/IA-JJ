import React, { useState, useEffect, useRef } from 'react';
import '../../../../../styles/developer/Patients/InfoPaciente/FrequencySelector.scss';

const FrequencySelector = ({ currentValue, onChange, therapyType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [isCustomActive, setIsCustomActive] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentUsage, setRecentUsage] = useState([]);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  
  // Therapy-specific styling class
  const therapyClass = therapyType || 'physical';
  
  // Initialize values
  useEffect(() => {
    setCustomInput(currentValue);
    // Check if current value is a common frequency
    const isCommon = commonFrequencies.some(f => f.value === currentValue);
    setIsCustomActive(!isCommon);
    
    // Simulated recent usage data (would come from an API in production)
    setRecentUsage([
      { value: '2W3 1W2', timestamp: '2 days ago' },
      { value: '4W1', timestamp: '1 week ago' },
      { value: '2W2 3W1', timestamp: '2 weeks ago' }
    ]);
  }, [currentValue]);
  
  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Animation timing for opening the dropdown
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setAnimateIn(true);
      }, 50);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);
  
  // Common frequency patterns with descriptions
  const commonFrequencies = [
    { 
      value: '1W1', 
      label: '1 visit per week',
      description: 'Standard maintenance frequency'
    },
    { 
      value: '1W2', 
      label: '2 visits per week',
      description: 'Moderate intensity treatment'
    },
    { 
      value: '1W3', 
      label: '3 visits per week',
      description: 'Intensive treatment frequency'  
    },
    { 
      value: '2W1', 
      label: '1 visit every 2 weeks',
      description: 'Extended maintenance frequency'
    },
    { 
      value: '2W2 1W1', 
      label: '2 visits/week for 2 weeks, then 1/week',
      description: 'Tapering intensity pattern'
    },
    { 
      value: '3W2 2W2', 
      label: '2 visits/week for 3 weeks, then 2 every 2 weeks',
      description: 'Progressive reduction pattern'
    },
    { 
      value: 'NO FREQUENCY SET', 
      label: 'No frequency set',
      description: 'Frequency not yet determined'
    }
  ];
  
  // Filtered frequencies based on search
  const filteredFrequencies = searchQuery 
    ? commonFrequencies.filter(freq => 
        freq.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        freq.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
        freq.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : commonFrequencies;
  
  const selectFrequency = (value) => {
    onChange(value);
    handleClose();
  };
  
  const handleCustomInputChange = (e) => {
    setCustomInput(e.target.value);
  };
  
  const applyCustomFrequency = () => {
    if (customInput.trim()) {
      onChange(customInput.trim());
      // Add to recent usage in a real app
    }
    handleClose();
  };
  
  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery('');
  };
  
  const handleOpen = () => {
    setIsOpen(true);
    // Focus search input after dropdown is visible
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };
  
  // Help text explaining format options
  const helpExamples = [
    { code: "1W2", explanation: "2 visits per week" },
    { code: "2W1", explanation: "1 visit every 2 weeks" },
    { code: "2W3 4W1", explanation: "3 visits/week for 2 weeks, then 1 visit/week for 4 weeks" }
  ];
  
  const formatCustomValue = (value) => {
    // Example of improved formatting: 1W2 → 1W2 (2 visits per week)
    if (!value) return '';
    
    const found = commonFrequencies.find(f => f.value === value);
    if (found) return found.label;
    
    // If it's a custom value, we could do some parsing to make it more readable
    // This is a simple example - could be made more sophisticated
    return value;
  };
  
  return (
    <div className={`frequency-selector-container ${therapyClass}`} ref={dropdownRef}>
      {/* Main selector button */}
      <div 
        className={`frequency-selector ${isOpen ? 'active' : ''}`}
        onClick={handleOpen}
        aria-expanded={isOpen}
        role="combobox"
      >
        <div className="selected-frequency">
          <i className="fas fa-calendar-check"></i>
          <span className="frequency-text">{formatCustomValue(currentValue)}</span>
        </div>
        <div className="selector-actions">
          {currentValue && currentValue !== 'NO FREQUENCY SET' && (
            <button 
              className="clear-btn" 
              onClick={(e) => {
                e.stopPropagation();
                onChange('NO FREQUENCY SET');
              }}
              aria-label="Clear frequency"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
          <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} dropdown-arrow`}></i>
        </div>
      </div>
      
      {/* Dropdown panel */}
      {isOpen && (
        <div className={`frequency-dropdown ${animateIn ? 'animate-in' : ''}`}>
          {/* Search bar */}
          <div className="dropdown-search">
            <i className="fas fa-search search-icon"></i>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search frequencies..."
              className="search-input"
            />
            {searchQuery && (
              <button 
                className="clear-search" 
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          
          {/* Tabs for common and custom frequencies */}
          <div className="frequency-tabs">
            <button 
              className={`tab-btn ${!isCustomActive ? 'active' : ''}`}
              onClick={() => setIsCustomActive(false)}
            >
              <i className="fas fa-star"></i>
              <span>Common</span>
            </button>
            <button 
              className={`tab-btn ${isCustomActive ? 'active' : ''}`}
              onClick={() => setIsCustomActive(true)}
            >
              <i className="fas fa-edit"></i>
              <span>Custom</span>
            </button>
          </div>
          
          {/* Common frequencies tab */}
          {!isCustomActive && (
            <div className="dropdown-section common-section">
              <div className="frequency-options">
                {filteredFrequencies.length > 0 ? (
                  filteredFrequencies.map((frequency) => (
                    <div 
                      key={frequency.value}
                      className={`frequency-option ${currentValue === frequency.value ? 'active' : ''}`}
                      onClick={() => selectFrequency(frequency.value)}
                    >
                      <div className="option-content">
                        <div className="option-main">
                          <span className="option-label">{frequency.label}</span>
                          <span className="option-value">{frequency.value}</span>
                        </div>
                        <p className="option-description">{frequency.description}</p>
                      </div>
                      {currentValue === frequency.value && <i className="fas fa-check check-icon"></i>}
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    <i className="fas fa-search"></i>
                    <p>No matching frequencies found</p>
                    <button 
                      className="create-custom-btn"
                      onClick={() => {
                        setIsCustomActive(true);
                        setCustomInput(searchQuery);
                      }}
                    >
                      Create custom frequency
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Custom frequency tab */}
          {isCustomActive && (
            <div className="dropdown-section custom-section">
              <div className="section-header">
                <h4>Define Custom Frequency</h4>
              </div>
              
              <div className="custom-input-container">
                <div className="input-wrapper">
                  <i className="fas fa-calendar-alt"></i>
                  <input
                    type="text"
                    value={customInput}
                    onChange={handleCustomInputChange}
                    placeholder="e.g., 2W3 1W2"
                    onKeyDown={(e) => e.key === 'Enter' && applyCustomFrequency()}
                    className="custom-input"
                    spellCheck="false"
                  />
                </div>
                <button 
                  className="apply-btn" 
                  onClick={applyCustomFrequency}
                  disabled={!customInput.trim()}
                >
                  <i className="fas fa-check"></i>
                  <span>Apply</span>
                </button>
              </div>
              
              <div className="format-help">
                <div className="help-header">
                  <i className="fas fa-info-circle"></i>
                  <span>Format Guide</span>
                </div>
                <div className="help-content">
                  <p className="help-text">Use the format "[Weeks]W[Visits]" to specify the frequency pattern.</p>
                  <div className="help-examples">
                    {helpExamples.map((example, index) => (
                      <div key={index} className="help-example">
                        <code className="example-code">{example.code}</code>
                        <span className="example-explanation"> = {example.explanation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Recent usage section */}
              {recentUsage.length > 0 && (
                <div className="recent-usage">
                  <div className="section-header">
                    <h4>Recent Usage</h4>
                  </div>
                  <div className="recent-list">
                    {recentUsage.map((item, index) => (
                      <div 
                        key={index} 
                        className="recent-item"
                        onClick={() => {
                          setCustomInput(item.value);
                          setTimeout(() => applyCustomFrequency(), 100);
                        }}
                      >
                        <div className="item-value">{item.value}</div>
                        <div className="item-timestamp">{item.timestamp}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="dropdown-footer">
            <button className="cancel-btn" onClick={handleClose}>
              <i className="fas fa-times"></i>
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrequencySelector;