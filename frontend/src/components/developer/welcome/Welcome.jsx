import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/developer/Welcome/Welcome.scss';
import logoImg from '../../../assets/LogoMHC.jpeg';
import LogoutAnimation from './LogoutAnimation';
import InfoWelcome from './infoWelcome';
// import AIAssistant from './AIAssistant';

const HomePage = () => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeMenuIndex, setActiveMenuIndex] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [menuTransitioning, setMenuTransitioning] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [parallaxPosition, setParallaxPosition] = useState({ x: 0, y: 0 });
  const [headerGlow, setHeaderGlow] = useState(false);
  const [particles, setParticles] = useState([]);
  const [welcomeAnimComplete, setWelcomeAnimComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const notificationCount = 5;
  
  const userData = {
    name: 'Luis Nava',
    avatar: 'LN',
    email: 'luis.nava@therapysync.com',
    role: 'Developer',
    status: 'online', // online, away, busy, offline
    stats: {
      // Stats data if needed
    },
    quickActions: [
      // Quick actions if needed
    ]
  };
  
  const userMenuRef = useRef(null);
  const menuRef = useRef(null);
  const containerRef = useRef(null);
  
  // Main menu options with icons
  const menuOptions = [
    { id: 1, name: "Patients", icon: "fa-user-injured", route: '/patients', color: "#36D1DC" },
    { id: 2, name: "Referrals", icon: "fa-file-medical", route: '/referrals', color: "#FF9966" },
    { id: 3, name: "Support", icon: "fa-headset", route: '/support', color: "#64B5F6" },
    { id: 4, name: "System Management", icon: "fa-cogs", route: '/management', color: "#8B5CF6" },
    { id: 5, name: "Accounting", icon: "fa-chart-pie", route: '/accounting', color: "#4CAF50" }
  ];
  
  // Check device size on mount and resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Generate random particles for background effect with responsive count
  const generateParticles = () => {
    const particlesArray = [];
    // Adjust particle count based on device performance capabilities
    const particleCount = isMobile ? 15 : isTablet ? 20 : 25;
    
    for (let i = 0; i < particleCount; i++) {
      particlesArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * (isMobile ? 3 : 5) + (isMobile ? 2 : 3),
        speed: Math.random() * 0.8 + 0.2,
        opacity: Math.random() * 0.5 + 0.1,
        color: `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`,
        delay: Math.random() * 5
      });
    }
    
    setParticles(particlesArray);
  };
  
  // Load assistant after page is fully loaded with performance optimizations
  useEffect(() => {
    // Generate particles
    generateParticles();
    
    // Complete entrance animation
    setTimeout(() => {
      setWelcomeAnimComplete(true);
    }, isMobile ? 1000 : 1500);
    
    // Delay to ensure page loads first - shorter delay on mobile for better UX
    const timer = setTimeout(() => {
      setShowAIAssistant(true);
    }, isMobile ? 1500 : 2000);
    
    return () => clearTimeout(timer);
  }, [isMobile]);
  
  // Auto-rotation carousel effect with responsive timing
  useEffect(() => {
    // Slower rotation on mobile for better readability
    const interval = setInterval(() => {
      if (!isLoggingOut && !menuTransitioning) {
        setActiveMenuIndex((prevIndex) => 
          prevIndex >= menuOptions.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, isMobile ? 8000 : 6000);
    
    return () => clearInterval(interval);
  }, [menuOptions.length, isLoggingOut, menuTransitioning, isMobile]);
  
  // Parallax effect with performance optimizations for mobile
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current && !isMobile) { // Disable parallax on mobile for performance
        const { clientX, clientY } = e;
        const { width, height } = containerRef.current.getBoundingClientRect();
        
        // Calculate position relative to center with reduced movement on lower-power devices
        const multiplier = isTablet ? 15 : 20;
        const xPos = (clientX / width - 0.5) * multiplier;
        const yPos = (clientY / height - 0.5) * (isTablet ? 10 : 15);
        
        setParallaxPosition({ x: xPos, y: yPos });
        
        // Activate header glow when mouse is near the top
        if (clientY < 100) {
          setHeaderGlow(true);
        } else {
          setHeaderGlow(false);
        }
      }
    };
    
    // Only add event listener if not on mobile
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile, isTablet]);
  
  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle left carousel navigation
  const handlePrevious = () => {
    setActiveMenuIndex((prevIndex) => 
      prevIndex <= 0 ? menuOptions.length - 1 : prevIndex - 1
    );
  };
  
  // Handle right carousel navigation
  const handleNext = () => {
    setActiveMenuIndex((prevIndex) => 
      prevIndex >= menuOptions.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  // Handle logout with enhanced animation
  const handleLogout = () => {
    setIsLoggingOut(true);
    setShowUserMenu(false);
    setShowAIAssistant(false);
    
    // Adjusted timing for different devices
    setTimeout(() => {
      navigate('/');
    }, isMobile ? 3000 : 5000);
  };
  
  // Handle menu option click with responsive transitions
  const handleMenuOptionClick = (option) => {
    setActiveMenuIndex(menuOptions.findIndex(o => o.id === option.id));
    setMenuTransitioning(true);
    setShowAIAssistant(false);
    
    // Faster transition on mobile for better UX
    setTimeout(() => {
      navigate(option.route);
    }, isMobile ? 300 : 500);
  };
  
  // Handle navigation to profile page
  const handleNavigateToProfile = () => {
    setShowUserMenu(false);
    setMenuTransitioning(true);
    
    // Add transition effect before navigation
    setTimeout(() => {
      navigate('/profile');
    }, isMobile ? 300 : 500);
  };
  
  // Get visible menu options for carousel with responsive considerations
  const getVisibleMenuOptions = () => {
    const result = [];
    const totalOptions = menuOptions.length;
    
    // For mobile, show only 3 elements; for tablets and up, show 5
    const visibleItems = isMobile ? 3 : 5;
    const offset = Math.floor(visibleItems / 2);
    
    // Get indices with the active in the center
    for (let i = -offset; i <= offset; i++) {
      // Skip far elements on mobile
      if (isMobile && (i === -2 || i === 2)) continue;
      
      const actualIndex = (activeMenuIndex + i + totalOptions) % totalOptions;
      
      // Determine position based on distance to active element
      let position;
      if (i === -2) position = 'far-left';
      else if (i === -1) position = 'left';
      else if (i === 0) position = 'center';
      else if (i === 1) position = 'right';
      else position = 'far-right';
      
      result.push({
        ...menuOptions[actualIndex],
        position
      });
    }
    
    return result;
  };

  return (
    <div 
      className={`dashboard ${menuTransitioning ? 'transitioning' : ''} ${welcomeAnimComplete ? 'anim-complete' : ''} ${isMobile ? 'mobile' : ''} ${isTablet ? 'tablet' : ''}`}
      ref={containerRef}
    >
      {/* Parallax background with responsive behavior */}
      <div 
        className="parallax-background"
        style={{ 
          transform: isMobile ? 'scale(1.05)' : `scale(1.1) translate(${parallaxPosition.x}px, ${parallaxPosition.y}px)` 
        }}
      >
        <div className="gradient-overlay"></div>
        
        {/* Floating particles with responsive count */}
        <div className="particles-container">
          {particles.map(particle => (
            <div 
              key={particle.id}
              className="particle"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
                backgroundColor: particle.color,
                animationDuration: `${10 + particle.speed * 20}s`,
                animationDelay: `${particle.delay}s`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Logout animation component */}
      {isLoggingOut && <LogoutAnimation isMobile={isMobile} />}
      
      {/* Premium header with responsive layout */}
      <header className={`main-header ${headerGlow ? 'glow-effect' : ''}`}>
        <div className="header-container">
          {/* Logo with effects */}
          <div className="logo-container">
            <div className="logo-glow"></div>
            <img src={logoImg} alt="TherapySync Logo" className="logo" />
          </div>
          
          {/* Enhanced carousel with responsive layout */}
          <div className="top-carousel" ref={menuRef}>
            <button className="carousel-arrow left" onClick={handlePrevious} aria-label="Previous">
              <div className="arrow-icon">
                <i className="fas fa-chevron-left"></i>
              </div>
            </button>
            
            <div className="carousel-options">
              {getVisibleMenuOptions().map((item) => (
                <div 
                  key={item.id} 
                  className={`carousel-option ${item.position}`}
                  onClick={() => handleMenuOptionClick(item)}
                >
                  <div className="option-content">
                    <div 
                      className="option-icon" 
                      style={{ 
                        background: `linear-gradient(135deg, ${item.color}, ${item.color}88)`,
                        opacity: item.position === 'center' ? 1 : 0
                      }}
                    >
                      <i className={`fas ${item.icon}`}></i>
                    </div>
                    <span>{item.name}</span>
                    {item.position === 'center' && (
                      <div className="active-underline"></div>
                    )}
                  </div>
                  {item.position === 'center' && (
                    <div className="option-glow"></div>
                  )}
                </div>
              ))}
            </div>
            
            <button className="carousel-arrow right" onClick={handleNext} aria-label="Next">
              <div className="arrow-icon">
                <i className="fas fa-chevron-right"></i>
              </div>
            </button>
          </div>
          
          {/* Enhanced user profile with responsive layout */}
          <div className="support-user-profile" ref={userMenuRef}>
            <div 
              className={`support-profile-button ${showUserMenu ? 'active' : ''}`} 
              onClick={() => setShowUserMenu(!showUserMenu)}
              data-tooltip="Your profile and settings"
            >
              <div className="support-avatar">
                <div className="support-avatar-text">{userData.avatar}</div>
                <div className={`support-avatar-status ${userData.status}`}></div>
              </div>
              
              <div className="support-profile-info">
                <span className="support-user-name">{userData.name}</span>
                <span className="support-user-role">{userData.role}</span>
              </div>
              
              <i className={`fas fa-chevron-${showUserMenu ? 'up' : 'down'}`}></i>
            </div>
            
            {/* Enhanced dropdown menu with responsive layout */}
            {showUserMenu && (
              <div className="support-user-menu">
                <div className="support-menu-header">
                  <div className="support-user-info">
                    <div className="support-user-avatar">
                      <span>{userData.avatar}</span>
                      <div className={`avatar-status ${userData.status}`}></div>
                    </div>
                    <div className="support-user-details">
                      <h4>{userData.name}</h4>
                      <span className="support-user-email">{userData.email}</span>
                      <span className={`support-user-status ${userData.status}`}>
                        <i className="fas fa-circle"></i> 
                        {userData.status.charAt(0).toUpperCase() + userData.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="support-menu-section">
                  <div className="section-title">Account</div>
                  <div className="support-menu-items">
                    <div 
                      className="support-menu-item"
                      onClick={handleNavigateToProfile}
                    >
                      <i className="fas fa-user-circle"></i>
                      <span>My Profile</span>
                    </div>
                    <div className="support-menu-item">
                      <i className="fas fa-cog"></i>
                      <span>Settings</span>
                    </div>
                    <div className="support-menu-item">
                      <i className="fas fa-calendar-alt"></i>
                      <span>My Schedule</span>
                    </div>
                  </div>
                </div>
                
                <div className="support-menu-section">
                  <div className="section-title">Preferences</div>
                  <div className="support-menu-items">
                    <div className="support-menu-item">
                      <i className="fas fa-bell"></i>
                      <span>Notifications</span>
                      <div className="support-notification-badge">{notificationCount}</div>
                    </div>
                    <div className="support-menu-item toggle-item">
                      <div className="toggle-item-content">
                        <i className="fas fa-moon"></i>
                        <span>Dark Mode</span>
                      </div>
                      <div className="toggle-switch">
                        <div className="toggle-handle active"></div>
                      </div>
                    </div>
                    <div className="support-menu-item toggle-item">
                      <div className="toggle-item-content">
                        <i className="fas fa-volume-up"></i>
                        <span>Sound Alerts</span>
                      </div>
                      <div className="toggle-switch">
                        <div className="toggle-handle"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="support-menu-section">
                  <div className="section-title">Support</div>
                  <div className="support-menu-items">
                    <div className="support-menu-item">
                      <i className="fas fa-headset"></i>
                      <span>Contact Support</span>
                    </div>
                    <div className="support-menu-item">
                      <i className="fas fa-bug"></i>
                      <span>Report Issue</span>
                    </div>
                  </div>
                </div>
                
                <div className="support-menu-footer">
                  <div className="support-menu-item logout" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Log Out</span>
                  </div>
                  <div className="version-info">
                    <span>TherapySync™ Support</span>
                    <span>v2.7.0</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Enhanced main content with responsive layout */}
      <main className="main-content">
        {/* Welcome container with responsive typography */}
        <div className="welcome-container welcome-container-top">
          <h1 className="welcome-title">
            <span className="highlight">Welcome</span> to TherapySync
            <div className="title-decoration"></div>
          </h1>
          <p className="welcome-subtitle">
            Select an option from the navigation menu to get started
            <span className="cursor-blink">_</span>
          </p>
        </div>
        
        {/* Info welcome component with responsive props */}
        <InfoWelcome isMobile={isMobile} isTablet={isTablet} />
      </main>
      
      {/* AI Assistant with conditional loading */}
      {/* {showAIAssistant && <AIAssistant isMobile={isMobile} />} */}
    </div>
  );
};

export default HomePage;