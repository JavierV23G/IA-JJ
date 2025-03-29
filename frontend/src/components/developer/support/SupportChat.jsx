import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../../../styles/developer/support/SupportChat.scss';
import { motion, AnimatePresence } from 'framer-motion'; // Añadimos framer-motion para animaciones premium

const SupportChat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [agentStatus, setAgentStatus] = useState('online');
  const [selectedTab, setSelectedTab] = useState('active');
  const [newMessageAlert, setNewMessageAlert] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [quickReplies, setQuickReplies] = useState([
    'Hello! How can I help you today?',
    'I\'m looking into this for you.',
    'Could you provide more details?',
    'Thank you for your patience.',
    'Let me check your account status.',
    'Is there anything else I can help you with?',
    'I\'ll generate a temporary password for you.',
    'Please try logging in again now.'
  ]);
  
  const chatContainerRef = useRef(null);
  const messageInputRef = useRef(null);
  
  // Mock conversations data (usando el mismo que proporcionaste)
  const mockConversations = [
    {
      id: 'chat-001',
      customer: {
        name: 'Emily Johnson',
        avatar: 'EJ',
        email: 'emily.johnson@example.com',
        status: 'online'
      },
      department: 'Technical Support',
      startTime: '2023-03-15 10:15',
      duration: '24m',
      status: 'active',
      unreadCount: 2,
      priority: 'high',
      tags: ['login issue', 'billing'],
      messages: [
        {
          id: 1,
          sender: 'system',
          content: 'Chat started at 10:15 AM',
          time: '10:15 AM',
          isRead: true
        },
        {
          id: 2,
          sender: 'customer',
          content: 'Hello, I\'m having trouble logging into my account after the recent update. It keeps saying "invalid credentials" even though I\'m sure my password is correct.',
          time: '10:15 AM',
          isRead: true
        },
        {
          id: 3,
          sender: 'agent',
          content: 'Hello Emily, I am Luis from technical support. I am sorry to hear you are having trouble logging in. Let me help you with that.',
          time: '10:17 AM',
          isRead: true
        },
        {
          id: 4,
          sender: 'agent',
          content: 'Could you tell me if you have tried resetting your password? Also, which browser are you using?',
          time: '10:18 AM',
          isRead: true
        },
        {
          id: 5,
          sender: 'customer',
          content: 'I tried resetting my password, but I am not receiving the reset email. I am using Chrome on my laptop.',
          time: '10:20 AM',
          isRead: true
        },
        {
          id: 6,
          sender: 'agent',
          content: 'Thank you for that information. Sometimes reset emails can be delayed or go to spam folders. Let me check your account on our end.',
          time: '10:22 AM',
          isRead: true
        },
        {
          id: 7,
          sender: 'agent',
          content: 'I have checked your account and I see that there might be an issue with your email verification. Let me fix that for you.',
          time: '10:25 AM',
          isRead: true
        },
        {
          id: 8,
          sender: 'customer',
          content: 'That would be great, thank you!',
          time: '10:26 AM',
          isRead: true
        },
        {
          id: 9,
          sender: 'agent',
          content: 'I have reset your account verification status. Please try logging in again now. If that does not work, I can generate a temporary password for you.',
          time: '10:32 AM',
          isRead: true
        },
        {
          id: 10,
          sender: 'customer',
          content: 'It is still not working. Could you provide me with a temporary password?',
          time: '10:35 AM',
          isRead: false
        },
        {
          id: 11,
          sender: 'customer',
          content: 'Also, will I need to update my billing information after this is fixed? I noticed my last payment did not go through.',
          time: '10:36 AM',
          isRead: false
        }
      ]
    },
    {
      id: 'chat-002',
      customer: {
        name: 'James Rodriguez',
        avatar: 'JR',
        email: 'j.rodriguez@healthcare.net',
        status: 'online'
      },
      department: 'Product Support',
      startTime: '2023-03-15 09:45',
      duration: '58m',
      status: 'active',
      unreadCount: 0,
      priority: 'medium',
      tags: ['reports', 'data export'],
      messages: []
    },
    {
      id: 'chat-003',
      customer: {
        name: 'Sophia Lee',
        avatar: 'SL',
        email: 'sophia.lee@example.org',
        status: 'online'
      },
      department: 'Billing',
      startTime: '2023-03-15 10:05',
      duration: '37m',
      status: 'active',
      unreadCount: 1,
      priority: 'medium',
      tags: ['subscription', 'payment'],
      messages: []
    },
    {
      id: 'chat-004',
      customer: {
        name: 'Ryan Miller',
        avatar: 'RM',
        email: 'ryan.m@medclinic.com',
        status: 'away'
      },
      department: 'Technical Support',
      startTime: '2023-03-14 15:30',
      duration: '1h 12m',
      status: 'pending',
      unreadCount: 0,
      priority: 'low',
      tags: ['calendar', 'sync'],
      messages: []
    },
    {
      id: 'chat-005',
      customer: {
        name: 'Daniel Wang',
        avatar: 'DW',
        email: 'd.wang@therapy.org',
        status: 'offline'
      },
      department: 'Product Support',
      startTime: '2023-03-14 14:20',
      duration: '45m',
      status: 'closed',
      unreadCount: 0,
      priority: 'medium',
      tags: ['patient records', 'import'],
      messages: []
    }
  ];
  
  // Efecto al cargar los datos
  useEffect(() => {
    // Simular carga con efecto de aparición gradual
    const timer = setTimeout(() => {
      setConversations(mockConversations);
      setSelectedConversation(mockConversations[0]);
      setLoading(false);
      setFilteredConversations(mockConversations.filter(c => c.status === 'active'));
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Actualizar conversaciones filtradas cuando cambia la pestaña
  useEffect(() => {
    if (searchTerm) {
      const filtered = conversations.filter(c => 
        (selectedTab === 'all' || c.status === selectedTab) &&
        (c.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         c.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
         c.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
      setFilteredConversations(filtered);
    } else {
      if (selectedTab === 'all') {
        setFilteredConversations(conversations);
      } else {
        setFilteredConversations(conversations.filter(c => c.status === selectedTab));
      }
    }
  }, [selectedTab, conversations, searchTerm]);
  
  // Scroll al final del chat cuando cambia la conversación o llegan nuevos mensajes
  useEffect(() => {
    if (chatContainerRef.current && selectedConversation) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [selectedConversation]);
  
  // Seleccionar una conversación
  const handleSelectConversation = useCallback((conversation) => {
    // Marcar mensajes como leídos
    const updatedConversation = {
      ...conversation,
      unreadCount: 0,
      messages: conversation.messages.map(msg => ({
        ...msg,
        isRead: true
      }))
    };
    
    setSelectedConversation(updatedConversation);
    setNewMessageAlert(false);
    
    // Actualizar el estado global de conversaciones
    const updatedConversations = conversations.map(c => 
      c.id === conversation.id ? updatedConversation : c
    );
    
    setConversations(updatedConversations);
    
    // Efecto: mostrar que estamos leyendo los mensajes
    if (conversation.unreadCount > 0) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 1500);
    }
  }, [conversations]);
  
  // Enviar un nuevo mensaje
  const handleSendMessage = useCallback((e) => {
    e && e.preventDefault();
    
    if (!message.trim() || !selectedConversation) return;
    
    // Guardar mensaje para referencia
    const sentMessage = message.trim();
    
    // Crear nuevo mensaje
    const newMessage = {
      id: Date.now(),
      sender: 'agent',
      content: sentMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };
    
    // Actualizar la conversación seleccionada
    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMessage]
    };
    
    setSelectedConversation(updatedConversation);
    
    // Actualizar el estado global de conversaciones
    const updatedConversations = conversations.map(c => 
      c.id === selectedConversation.id ? updatedConversation : c
    );
    
    setConversations(updatedConversations);
    setMessage('');
    
    // Desplazarse al final del chat con animación suave
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
    
    // Simular respuesta del cliente después de un tiempo aleatorio (para demo)
    simulateCustomerResponse(updatedConversation.id);
  }, [message, selectedConversation, conversations]);
  
  // Simulación de respuesta del cliente (solo para demostración)
  const simulateCustomerResponse = (conversationId) => {
    // Solo para la primera conversación para hacer una demo
    if (conversationId !== 'chat-001') return;
    
    // Probabilidad de respuesta
    if (Math.random() > 0.7) {
      const possibleResponses = [
        'Thanks for the help!',
        'I still see the same error message.',
        'That worked! Thank you so much.',
        'Let me try that and get back to you.',
        'Could you explain a bit more?'
      ];
      
      // Tiempo de espera aleatorio entre 3 y 8 segundos
      const waitTime = Math.random() * 5000 + 3000;
      
      setTimeout(() => {
        // Mensaje de "escribiendo..."
        setIsTyping(true);
        
        // Después de otro tiempo aleatorio, enviar la respuesta
        setTimeout(() => {
          const customerResponse = {
            id: Date.now(),
            sender: 'customer',
            content: possibleResponses[Math.floor(Math.random() * possibleResponses.length)],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: false
          };
          
          // Actualizar la conversación con la respuesta
          const updatedConversation = {
            ...selectedConversation,
            messages: [...selectedConversation.messages, customerResponse],
            unreadCount: 1
          };
          
          setSelectedConversation(updatedConversation);
          
          // Actualizar conversaciones
          const updatedConversations = conversations.map(c => 
            c.id === conversationId ? updatedConversation : c
          );
          
          setConversations(updatedConversations);
          setIsTyping(false);
          setNewMessageAlert(true);
          
          // Notificación de sonido (descomentar para activar)
          // playMessageSound();
          
        }, Math.random() * 2000 + 1000);
      }, waitTime);
    }
  };
  
  // Usar una respuesta rápida
  const handleQuickReply = (reply) => {
    setMessage(reply);
    messageInputRef.current?.focus();
  };
  
  // Agregar una respuesta rápida personalizada
  const addCustomQuickReply = () => {
    if (message.trim() && !quickReplies.includes(message.trim())) {
      setQuickReplies([...quickReplies, message.trim()]);
      
      // Muestra notificación de éxito (implementar UI para esto)
      alert('¡Respuesta rápida añadida!');
    } else {
      // Muestra error (implementar UI para esto)
      alert('Por favor, ingresa un texto nuevo para guardar como respuesta rápida');
    }
  };
  
  // Crear un nuevo ticket a partir de la conversación
  const createTicket = () => {
    if (!selectedConversation) return;
    
    // Aquí implementarías la lógica real para crear un ticket
    alert(`Ticket creado para ${selectedConversation.customer.name} sobre "${selectedConversation.tags.join(', ')}"`);
    
    // Actualizar el estado, por ejemplo agregar etiqueta "ticket-created"
    const updatedConversation = {
      ...selectedConversation,
      tags: [...selectedConversation.tags, 'ticket-created']
    };
    
    setSelectedConversation(updatedConversation);
    
    // Actualizar conversaciones
    const updatedConversations = conversations.map(c => 
      c.id === selectedConversation.id ? updatedConversation : c
    );
    
    setConversations(updatedConversations);
  };
  
  // Llamar al cliente
  const callCustomer = () => {
    if (!selectedConversation) return;
    
    // Simulación de llamada (implementarías integración real)
    alert(`Iniciando llamada con ${selectedConversation.customer.name}...`);
    
    // Agregar mensaje de sistema indicando la llamada
    const callMessage = {
      id: Date.now(),
      sender: 'system',
      content: `Llamada iniciada con ${selectedConversation.customer.name} a las ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };
    
    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, callMessage]
    };
    
    setSelectedConversation(updatedConversation);
    
    const updatedConversations = conversations.map(c => 
      c.id === selectedConversation.id ? updatedConversation : c
    );
    
    setConversations(updatedConversations);
  };
  
  // Ver perfil completo del cliente
  const viewCustomerProfile = () => {
    if (!selectedConversation) return;
    
    // Aquí implementarías navegación al perfil completo
    alert(`Ver perfil completo de ${selectedConversation.customer.name}`);
  };
  
  // Ver historial de conversaciones
  const viewChatHistory = () => {
    if (!selectedConversation) return;
    
    // Aquí implementarías navegación al historial
    alert(`Ver historial de conversaciones con ${selectedConversation.customer.name}`);
  };
  
  // Ver tickets del cliente
  const viewCustomerTickets = () => {
    if (!selectedConversation) return;
    
    // Aquí implementarías navegación a tickets
    alert(`Ver tickets de ${selectedConversation.customer.name}`);
  };
  
  // Ver registros del paciente
  const viewPatientRecords = () => {
    if (!selectedConversation) return;
    
    // Aquí implementarías navegación a registros
    alert(`Ver registros médicos de ${selectedConversation.customer.name}`);
  };
  
  // Ver información de facturación
  const viewBillingInfo = () => {
    if (!selectedConversation) return;
    
    // Aquí implementarías navegación a facturación
    alert(`Ver información de facturación de ${selectedConversation.customer.name}`);
  };
  
  // Añadir una etiqueta nueva
  const addTag = () => {
    if (!selectedConversation) return;
    
    const newTag = prompt('Ingresa una nueva etiqueta:');
    if (newTag && !selectedConversation.tags.includes(newTag)) {
      const updatedConversation = {
        ...selectedConversation,
        tags: [...selectedConversation.tags, newTag]
      };
      
      setSelectedConversation(updatedConversation);
      
      const updatedConversations = conversations.map(c => 
        c.id === selectedConversation.id ? updatedConversation : c
      );
      
      setConversations(updatedConversations);
    }
  };
  
  // Cambiar estado del agente
  const handleAgentStatusChange = (status) => {
    setAgentStatus(status);
  };
  
  // Función para asignar color a la prioridad
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };
  
  // Función para asignar color al estado del cliente
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#4CAF50';
      case 'away': return '#FF9800';
      case 'offline': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };
  
  // Generar un background gradient para el avatar basado en el nombre
  const getAvatarGradient = (name) => {
    const colors = [
      ['#FF9800', '#F44336'],
      ['#2196F3', '#3F51B5'],
      ['#4CAF50', '#8BC34A'],
      ['#9C27B0', '#E91E63'],
      ['#00BCD4', '#03A9F4']
    ];
    
    // Usar las iniciales para elegir un color de forma determinística
    const colorIndex = name.charCodeAt(0) % colors.length;
    return `linear-gradient(135deg, ${colors[colorIndex][0]}, ${colors[colorIndex][1]})`;
  };
  
  // Renderizar la interfaz
  return (
    <div className="support-chat support-chat-premium">
      <div className="chat-header">
        <h2>Live Chat Support</h2>
        <div className="agent-status">
          <div className="status-label">Your Status:</div>
          <div className="status-dropdown">
            <div className={`status-indicator ${agentStatus}`}></div>
            <select 
              value={agentStatus} 
              onChange={(e) => handleAgentStatusChange(e.target.value)}
              className="status-select"
            >
              <option value="online">Online</option>
              <option value="busy">Busy</option>
              <option value="away">Away</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          <div className="agent-info">
            <span className="agent-name">Luis Nava</span>
            <span className="agent-role">Support Agent</span>
          </div>
        </div>
      </div>
      
      <div className="chat-container">
        {/* Lista de conversaciones */}
        <div className="chat-conversations">
          <div className="conversations-search">
            <input
              type="text"
              placeholder="Buscar conversaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search"></i>
          </div>
          
          <div className="conversations-tabs">
            <div 
              className={`tab ${selectedTab === 'active' ? 'active' : ''}`}
              onClick={() => setSelectedTab('active')}
            >
              <span>Active</span>
              <div className="tab-count">
                {conversations.filter(c => c.status === 'active').length}
              </div>
            </div>
            <div 
              className={`tab ${selectedTab === 'pending' ? 'active' : ''}`}
              onClick={() => setSelectedTab('pending')}
            >
              <span>Pending</span>
              <div className="tab-count">
                {conversations.filter(c => c.status === 'pending').length}
              </div>
            </div>
            <div 
              className={`tab ${selectedTab === 'closed' ? 'active' : ''}`}
              onClick={() => setSelectedTab('closed')}
            >
              <span>Closed</span>
              <div className="tab-count">
                {conversations.filter(c => c.status === 'closed').length}
              </div>
            </div>
            <div 
              className={`tab ${selectedTab === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedTab('all')}
            >
              <span>All</span>
              <div className="tab-count">
                {conversations.length}
              </div>
            </div>
          </div>
          
          <div className="conversations-list">
            {loading ? (
              <div className="conversations-loading">
                <div className="loading-spinner"></div>
                <span>Loading conversations...</span>
              </div>
            ) : filteredConversations.length > 0 ? (
              <AnimatePresence>
                {filteredConversations.map((conversation) => (
                  <motion.div 
                    key={conversation.id}
                    className={`conversation-item ${selectedConversation && selectedConversation.id === conversation.id ? 'selected' : ''} ${conversation.unreadCount > 0 ? 'unread' : ''}`}
                    onClick={() => handleSelectConversation(conversation)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    layout
                  >
                    <div 
                      className="conversation-priority" 
                      style={{ backgroundColor: getPriorityColor(conversation.priority) }}
                    ></div>
                    <div 
                      className="conversation-avatar"
                      style={{ background: getAvatarGradient(conversation.customer.name) }}
                    >
                      <div className="avatar-text">{conversation.customer.avatar}</div>
                      <div 
                        className="avatar-status" 
                        style={{ backgroundColor: getStatusColor(conversation.customer.status) }}
                      ></div>
                    </div>
                    <div className="conversation-info">
                      <div className="conversation-name">
                        {conversation.customer.name}
                        {conversation.unreadCount > 0 && (
                          <div className="unread-badge">{conversation.unreadCount}</div>
                        )}
                      </div>
                      <div className="conversation-preview">
                        {conversation.messages.length > 0
                          ? conversation.messages[conversation.messages.length - 1].content.substring(0, 35) + (conversation.messages[conversation.messages.length - 1].content.length > 35 ? '...' : '')
                          : 'No messages yet'
                        }
                      </div>
                      <div className="conversation-meta">
                        <div className="conversation-time">
                          <i className="fas fa-clock"></i>
                          <span>{conversation.duration}</span>
                        </div>
                        <div className="conversation-department">
                          <i className="fas fa-tag"></i>
                          <span>{conversation.department}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="no-conversations">
                <div className="no-data-icon">
                  <i className="fas fa-comments"></i>
                </div>
                <h3>No conversations</h3>
                <p>There are no {selectedTab !== 'all' ? selectedTab : ''} conversations{searchTerm ? ' matching your search' : ' at the moment'}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Área de chat */}
        <div className="chat-main">
          {selectedConversation ? (
            <>
              <div className="chat-main-header">
                <div className="chat-customer">
                  <div 
                    className="customer-avatar"
                    style={{ background: getAvatarGradient(selectedConversation.customer.name) }}
                  >
                    <div className="avatar-text">{selectedConversation.customer.avatar}</div>
                    <div 
                      className="avatar-status" 
                      style={{ backgroundColor: getStatusColor(selectedConversation.customer.status) }}
                    ></div>
                  </div>
                  <div className="customer-info">
                    <div className="customer-name">{selectedConversation.customer.name}</div>
                    <div className="customer-email">{selectedConversation.customer.email}</div>
                  </div>
                </div>
                <div className="chat-actions">
                  <button className="chat-action-button" onClick={viewCustomerProfile}>
                    <i className="fas fa-user"></i>
                    <span>Profile</span>
                  </button>
                  <button className="chat-action-button" onClick={createTicket}>
                    <i className="fas fa-ticket-alt"></i>
                    <span>Create Ticket</span>
                  </button>
                  <button className="chat-action-button" onClick={callCustomer}>
                    <i className="fas fa-phone"></i>
                    <span>Call</span>
                  </button>
                  <button className="chat-action-button">
                    <i className="fas fa-ellipsis-h"></i>
                  </button>
                </div>
              </div>
              
              <div className="chat-messages" ref={chatContainerRef}>
                <AnimatePresence>
                  {selectedConversation.messages.map((message) => (
                    <motion.div 
                      key={message.id}
                      className={`chat-message ${message.sender} ${!message.isRead && message.sender !== 'agent' ? 'unread' : ''}`}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {message.sender === 'system' ? (
                        <div className="system-message">
                          <div className="system-content">{message.content}</div>
                        </div>
                      ) : (
                        <>
                          <div 
                            className="message-avatar"
                            style={{ 
                              background: message.sender === 'customer' 
                                ? getAvatarGradient(selectedConversation.customer.name) 
                                : 'linear-gradient(135deg, #0288d1, #26c6da)'
                            }}
                          >
                            {message.sender === 'customer' ? (
                              selectedConversation.customer.avatar
                            ) : (
                              'LN'
                            )}
                          </div>
                          <div className="message-content">
                            <div className="message-header">
                              <span className="message-sender">
                                {message.sender === 'customer' 
                                  ? selectedConversation.customer.name 
                                  : 'Luis Nava'}
                              </span>
                              <span className="message-time">{message.time}</span>
                            </div>
                            <div className="message-body">{message.content}</div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isTyping && (
                  <div className="typing-indicator">
                    <div className="typing-bubble"></div>
                    <div className="typing-bubble"></div>
                    <div className="typing-bubble"></div>
                    <span>{selectedConversation.customer.name} está escribiendo...</span>
                  </div>
                )}
                
                {newMessageAlert && (
                  <div className="new-message-alert" onClick={() => chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight}>
                  <i className="fas fa-arrow-down"></i>
                  <span>Nuevo mensaje</span>
                </div>
              )}
            </div>
            
            <div className="chat-input">
              <form onSubmit={handleSendMessage}>
                <div className="input-actions">
                  <button type="button" className="input-action">
                    <i className="fas fa-paperclip"></i>
                    <span className="tooltip">Adjuntar archivo</span>
                  </button>
                  <button 
                    type="button" 
                    className="input-action"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <i className="fas fa-smile"></i>
                    <span className="tooltip">Emojis</span>
                  </button>
                  <button type="button" className="input-action">
                    <i className="fas fa-image"></i>
                    <span className="tooltip">Enviar imagen</span>
                  </button>
                  <button 
                    type="button" 
                    className="input-action"
                    onClick={addCustomQuickReply}
                  >
                    <i className="fas fa-save"></i>
                    <span className="tooltip">Guardar respuesta</span>
                  </button>
                </div>
                
                {showEmojiPicker && (
                  <div className="emoji-picker">
                    <div className="emoji-picker-header">
                      <span>Emojis</span>
                      <button 
                        className="close-emoji-picker"
                        onClick={() => setShowEmojiPicker(false)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                    <div className="emoji-list">
                      {["😊", "👍", "🙏", "👋", "🎉", "✅", "⭐", "📌", "📝", "💬", "📞", "📧", "💻", "🔍", "⚙️", "🔒"].map(emoji => (
                        <button 
                          key={emoji} 
                          className="emoji-item"
                          onClick={() => {
                            setMessage(prev => prev + emoji);
                            setShowEmojiPicker(false);
                          }}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="input-container">
                  <textarea 
                    placeholder="Escribe tu mensaje..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    ref={messageInputRef}
                  ></textarea>
                  <button 
                    type="submit" 
                    className={`send-button ${message.trim() ? 'active' : ''}`}
                    disabled={!message.trim()}
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </form>
              
              <div className="input-tools">
  <div className="quick-responses">
    {quickReplies.slice(0, 4).map((reply, index) => (
      <button 
        key={index} 
        className="quick-response"
        onClick={() => handleQuickReply(reply)}
      >
        {reply}
      </button>
    ))}
    <div className="quick-response-dropdown">
      <button className="quick-response more">
        <i className="fas fa-ellipsis-h"></i>
      </button>
      <div className="dropdown-content">
        {quickReplies.slice(4).map((reply, index) => (
          <button 
            key={index + 4} 
            className="dropdown-item"
            onClick={() => handleQuickReply(reply)}
          >
            {reply}
          </button>
        ))}
      </div>
    </div>
  </div>
</div>
            </div>
          </>
        ) : (
          <div className="chat-empty">
            <div className="empty-icon">
              <i className="fas fa-comments"></i>
            </div>
            <h3>No tienes ninguna conversación seleccionada</h3>
            <p>Selecciona una conversación de la lista para comenzar a chatear</p>
            <button className="refresh-btn" onClick={() => window.location.reload()}>
              <i className="fas fa-sync-alt"></i>
              <span>Refrescar lista</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Información del cliente */}
      {selectedConversation && (
        <div className="chat-customer-info">
          <div className="customer-card">
            <div className="customer-header">
              <div 
                className="customer-avatar-large"
                style={{ background: getAvatarGradient(selectedConversation.customer.name) }}
              >
                <span>{selectedConversation.customer.avatar}</span>
              </div>
              <h3 className="customer-name-large">{selectedConversation.customer.name}</h3>
              <div className="customer-status">
                <div 
                  className="status-indicator" 
                  style={{ backgroundColor: getStatusColor(selectedConversation.customer.status) }}
                ></div>
                <span className="status-text">{selectedConversation.customer.status}</span>
              </div>
              <div className="customer-email-large">{selectedConversation.customer.email}</div>
            </div>
            
            <div className="customer-details">
              <div className="detail-item">
                <div className="detail-label">
                  <i className="fas fa-calendar-alt"></i>
                  <span>Chat Started</span>
                </div>
                <div className="detail-value">{selectedConversation.startTime}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">
                  <i className="fas fa-clock"></i>
                  <span>Duration</span>
                </div>
                <div className="detail-value">{selectedConversation.duration}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">
                  <i className="fas fa-bookmark"></i>
                  <span>Department</span>
                </div>
                <div className="detail-value">{selectedConversation.department}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">
                  <i className="fas fa-flag"></i>
                  <span>Priority</span>
                </div>
                <div 
                  className="detail-value priority"
                  style={{ color: getPriorityColor(selectedConversation.priority) }}
                >
                  {selectedConversation.priority.charAt(0).toUpperCase() + selectedConversation.priority.slice(1)}
                </div>
              </div>
            </div>
            
            <div className="customer-tags">
              <div className="tags-header">
                <i className="fas fa-tags"></i>
                <span>Tags</span>
              </div>
              <div className="tags-list">
                {selectedConversation.tags.map((tag, index) => (
                  <div key={index} className="tag-item">
                    <span>{tag}</span>
                    <button className="tag-remove" onClick={() => {
                      // Eliminar etiqueta
                      const updatedConversation = {
                        ...selectedConversation,
                        tags: selectedConversation.tags.filter((_, i) => i !== index)
                      };
                      
                      setSelectedConversation(updatedConversation);
                      
                      const updatedConversations = conversations.map(c => 
                        c.id === selectedConversation.id ? updatedConversation : c
                      );
                      
                      setConversations(updatedConversations);
                    }}>
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
                <div className="tag-item add" onClick={addTag}>
                  <i className="fas fa-plus"></i>
                </div>
              </div>
            </div>
          </div>
          
          <div className="customer-actions-panel">
            <h4>Quick Actions</h4>
            <div className="action-buttons">
              <button className="customer-action" onClick={viewCustomerProfile}>
                <i className="fas fa-user-circle"></i>
                <span>View Profile</span>
              </button>
              <button className="customer-action" onClick={viewChatHistory}>
                <i className="fas fa-history"></i>
                <span>Chat History</span>
              </button>
              <button className="customer-action" onClick={viewCustomerTickets}>
                <i className="fas fa-ticket-alt"></i>
                <span>View Tickets</span>
              </button>
              <button className="customer-action" onClick={viewPatientRecords}>
                <i className="fas fa-notes-medical"></i>
                <span>Patient Records</span>
              </button>
              <button className="customer-action" onClick={viewBillingInfo}>
                <i className="fas fa-file-invoice-dollar"></i>
                <span>Billing Info</span>
              </button>
            </div>
          </div>
          
          {/* Resumen de actividad reciente */}
          <div className="recent-activity">
            <h4>Recent Activity</h4>
            <div className="activity-timeline">
              <div className="activity-item">
                <div className="activity-icon">
                  <i className="fas fa-sign-in-alt"></i>
                </div>
                <div className="activity-content">
                  <div className="activity-title">Last Login</div>
                  <div className="activity-description">Yesterday, 18:42</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">
                  <i className="fas fa-ticket-alt"></i>
                </div>
                <div className="activity-content">
                  <div className="activity-title">Ticket #12854</div>
                  <div className="activity-description">Created 3 days ago</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">
                  <i className="fas fa-credit-card"></i>
                </div>
                <div className="activity-content">
                  <div className="activity-title">Payment Failed</div>
                  <div className="activity-description">Today, 09:15</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    
    {/* Modal para transferir el chat (ejemplo) */}
    {/* <div className="transfer-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Transfer Chat</h3>
          <button className="close-modal">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <div className="transfer-options">
            <div className="option-group">
              <h4>Department</h4>
              <select className="department-select">
                <option value="technical">Technical Support</option>
                <option value="billing">Billing</option>
                <option value="product">Product Support</option>
              </select>
            </div>
            <div className="option-group">
              <h4>Agent</h4>
              <select className="agent-select">
                <option value="any">Any Available Agent</option>
                <option value="maria">Maria Lopez</option>
                <option value="john">John Smith</option>
                <option value="sarah">Sarah Johnson</option>
              </select>
            </div>
            <div className="option-group">
              <h4>Transfer Note</h4>
              <textarea placeholder="Add a note for the receiving agent..."></textarea>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="cancel-btn">Cancel</button>
          <button className="transfer-btn">Transfer</button>
        </div>
      </div>
    </div> */}
  </div>
);
};

export default SupportChat;