import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLoadingModal from './AuthLoadingModal';
import logoImg from '../../assets/LogoMHC.jpeg';

const Login = ({ onForgotPassword }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    username: false,
    password: false,
    message: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  
  // Estado para el modal de carga
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    status: 'loading',
    message: ''
  });

  // Lista de credenciales válidas (después se moverían al backend)
  const validCredentials = [
    { username: "JLuis09", password: "Kariokito12" },
    { username: "Javi1", password: "JavierVargas12" }
  ];

  // Comprobar el localStorage al cargar
  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      setFormData(prev => ({
        ...prev,
        username: savedUsername
      }));
      setRememberMe(true);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar error al escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: false
      });
    }
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const showError = (field, message) => {
    setErrors({
      ...errors,
      [field]: true,
      message: message
    });
    
    // Efecto de pulsación
    const element = document.getElementById(`${field}Group`);
    if (element) {
      element.classList.add("form-pulse");
      setTimeout(() => {
        element.classList.remove("form-pulse");
      }, 500);
    }
  };

  const showSuccess = (field) => {
    const element = document.getElementById(`${field}Group`);
    if (element) {
      element.classList.remove("error");
      element.classList.add("success");
    }
  };

  const validateForm = () => {
    let isValid = true;
    
    if (formData.username.trim() === "") {
      showError('username', "Username cannot be empty");
      isValid = false;
    }
    
    if (formData.password === "") {
      showError('password', "Password cannot be empty");
      isValid = false;
    }
    
    return isValid; 
  };
  
  // Función para cerrar el modal
  const closeAuthModal = () => {
    setAuthModal({
      ...authModal,
      isOpen: false
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar el formulario
    if (!validateForm()) {
      return;
    }
    
    // Verificar credenciales rápidamente primero
    const isValid = validCredentials.some(
      cred => cred.username === formData.username && cred.password === formData.password
    );
    
    // Si las credenciales no son válidas, mostrar error inmediatamente sin abrir el modal
    if (!isValid) {
      showError('username', "Invalid username or password");
      showError('password', "Invalid username or password");
      
      // Efecto visual para errores
      document.querySelectorAll(".login__input").forEach(input => {
        input.classList.add("shake-error");
        setTimeout(() => {
          input.classList.remove("shake-error");
        }, 500);
      });
      
      return;
    }
    
    // Manejar "Remember Me"
    if (rememberMe) {
      localStorage.setItem('rememberedUsername', formData.username);
    } else {
      localStorage.removeItem('rememberedUsername');
    }
    
    // Si las credenciales son válidas, mostrar el modal de carga
    setAuthModal({
      isOpen: true,
      status: 'loading',
      message: 'Verifying credentials...'
    });
    
    // Simulación del proceso de autenticación exitoso
    setTimeout(() => {
      // Actualizar modal a éxito
      setAuthModal({
        isOpen: true,
        status: 'success',
        message: 'Authentication successful! Redirecting...'
      });
      
      // Mostrar efecto de éxito en los campos
      showSuccess('username');
      showSuccess('password');
      
      // Redirigir después de mostrar el mensaje de éxito
      setTimeout(() => {
        navigate('/homePage');
      }, 2000);
    }, 4500);
  };

  return (
    <>
      <div className="login__logo">
        <img src={logoImg} alt="Motive Homecare Logo" className="login__logo-img" />
      </div>
      
      <h2 className="login__title">Login</h2>
      
      <form id="loginForm" className="login__form" onSubmit={handleSubmit}>
        <div className={`login__form-group ${errors.username ? 'error' : ''}`} id="usernameGroup">
          <label htmlFor="username" className="login__label">
            <i className="fas fa-user"></i>
            Username
          </label>
          <div className="login__input-wrapper">
            <input 
              type="text" 
              id="username" 
              name="username" 
              className="login__input" 
              placeholder="Enter your username" 
              value={formData.username}
              onChange={handleInputChange}
              required 
            />
          </div>
          <div className="login__error-message">
            {errors.username ? errors.message : "Please enter a valid username"}
          </div>
        </div>
        
        <div className={`login__form-group ${errors.password ? 'error' : ''}`} id="passwordGroup">
          <label htmlFor="password" className="login__label">
            <i className="fas fa-lock"></i>
            Password
          </label>
          <div className="login__input-wrapper">
            <input 
              type="password" 
              id="password" 
              name="password" 
              className="login__input" 
              placeholder="Enter your password" 
              value={formData.password}
              onChange={handleInputChange}
              required 
            />
          </div>
          <div className="login__error-message">
            {errors.password ? errors.message : "Please enter a valid password"}
          </div>
        </div>
        
        {/* Checkbox clickeable mejorado */}
        <div className="login__checkbox-group">
          <label className="custom-checkbox">
            <input 
              type="checkbox" 
              id="rememberMe"
              checked={rememberMe}
              onChange={handleRememberMeChange}
            />
            <span className="checkmark"></span>
            <span>Remember me</span>
          </label>
        </div>
        
        <button type="submit" className="login__button">LOG IN</button>
      </form>
      
      {/* Enlace de forgot password mejorado */}
      <div className="login__extra-links">
        <a href="#" className="forgot-password-link" onClick={(e) => {
          e.preventDefault();
          onForgotPassword(e);
        }}>
          Forgot your password?
        </a>
      </div>
      
      {/* Modal de carga para autenticación */}
      <AuthLoadingModal 
        isOpen={authModal.isOpen}
        status={authModal.status}
        message={authModal.message}
        onClose={closeAuthModal}
      />
    </>
  );
};

export default Login;