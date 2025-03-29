import React, { useState, useEffect } from 'react';
import '../../../styles/developer/support/SupportCorporateEmail.scss';

const SupportCorporateEmail = () => {
  const [emails, setEmails] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [composeMode, setComposeMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [emailContent, setEmailContent] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    message: ''
  });
  
  // Datos simulados de carpetas de correo
  const mockFolders = [
    { id: 'inbox', name: 'Inbox', icon: 'fa-inbox', unread: 12, color: '#2196F3' },
    { id: 'sent', name: 'Sent', icon: 'fa-paper-plane', unread: 0, color: '#4CAF50' },
    { id: 'drafts', name: 'Drafts', icon: 'fa-file', unread: 3, color: '#FF9800' },
    { id: 'important', name: 'Important', icon: 'fa-exclamation-circle', unread: 5, color: '#F44336' },
    { id: 'starred', name: 'Starred', icon: 'fa-star', unread: 0, color: '#FFC107' },
    { id: 'spam', name: 'Spam', icon: 'fa-ban', unread: 8, color: '#9E9E9E' },
    { id: 'trash', name: 'Trash', icon: 'fa-trash-alt', unread: 0, color: '#795548' }
  ];
  
  // Datos simulados de etiquetas
  const mockLabels = [
    { id: 'support', name: 'Support', color: '#2196F3' },
    { id: 'urgent', name: 'Urgent', color: '#F44336' },
    { id: 'billing', name: 'Billing', color: '#4CAF50' },
    { id: 'technical', name: 'Technical', color: '#9C27B0' },
    { id: 'feature', name: 'Feature Request', color: '#FF9800' }
  ];
  
  // Datos simulados de correos
  const mockEmails = [
    {
      id: 'email-001',
      folder: 'inbox',
      from: {
        name: 'Jennifer Wilson',
        email: 'jennifer.wilson@healthcare.org',
        avatar: 'JW'
      },
      to: 'support@therapysync.com',
      cc: [],
      subject: 'Unable to access patient records after recent update',
      preview: 'After updating to the latest version of TherapySync, I am unable to access patient records. The system shows an error message...',
      body: `<p>Hello Support Team,</p>
            <p>After updating to the latest version of TherapySync, I am unable to access patient records. The system shows an error message stating "Unauthorized access" even though I have the proper credentials.</p>
            <p>This is urgent as I need to review patient information for upcoming appointments. I have tried logging out and back in, clearing my browser cache, and using a different browser, but the issue persists.</p>
            <p>Could you please help me resolve this as soon as possible?</p>
            <p>Thank you,<br>Jennifer Wilson<br>Wilson Therapy Center</p>`,
      date: '2023-03-15 09:32',
      isRead: false,
      hasAttachments: true,
      attachments: [
        { name: 'error_screenshot.png', size: '356 KB', type: 'image' }
      ],
      labels: ['support', 'urgent', 'technical'],
      isStarred: true,
      isImportant: true
    },
    {
      id: 'email-002',
      folder: 'inbox',
      from: {
        name: 'Robert Chen',
        email: 'r.chen@cityhealth.com',
        avatar: 'RC'
      },
      to: 'support@therapysync.com',
      cc: ['admin@cityhealth.com'],
      subject: 'Calendar sync issue with external scheduling system',
      preview: 'We are experiencing issues with the calendar sync between TherapySync and our hospital\'s scheduling system...',
      body: `<p>Support Team,</p>
            <p>We are experiencing issues with the calendar sync between TherapySync and our hospital\'s scheduling system (HealthScheduler Pro). Appointments created in our hospital system are not appearing in TherapySync, and vice versa.</p>
            <p>This integration was working correctly until about two days ago. We haven't made any changes on our end to the configuration settings.</p>
            <p>Could you please investigate what might be causing this sync failure?</p>
            <p>Best regards,<br>Robert Chen<br>IT Manager<br>City Health Hospital</p>`,
      date: '2023-03-13 16:45',
      isRead: false,
      hasAttachments: false,
      attachments: [],
      labels: ['support', 'technical'],
      isStarred: false,
      isImportant: true
    },
    {
      id: 'email-003',
      folder: 'inbox',
      from: {
        name: 'Sarah Martinez',
        email: 's.martinez@therapycenter.net',
        avatar: 'SM'
      },
      to: 'billing@therapysync.com',
      cc: ['support@therapysync.com'],
      subject: 'Payment processing failure for monthly subscription',
      preview: 'I received an email notification stating that my monthly subscription payment failed to process...',
      body: `<p>Hello Billing Department,</p>
            <p>I received an email notification stating that my monthly subscription payment failed to process. I've checked my credit card information, and everything appears to be correct.</p>
            <p>My account is currently showing as "Payment Overdue" even though I've been a customer for over two years without any payment issues. Could you please check what's happening with my account?</p>
            <p>I need this resolved quickly as it's affecting our ability to schedule new appointments.</p>
            <p>Thank you,<br>Sarah Martinez<br>Martinez Therapy Center</p>`,
      date: '2023-03-13 14:20',
      isRead: true,
      hasAttachments: true,
      attachments: [
        { name: 'payment_error.pdf', size: '125 KB', type: 'pdf' }
      ],
      labels: ['billing'],
      isStarred: false,
      isImportant: false
    },
    {
      id: 'email-004',
      folder: 'inbox',
      from: {
        name: 'Michael Thompson',
        email: 'm.thompson@wellness.org',
        avatar: 'MT'
      },
      to: 'feature-requests@therapysync.com',
      cc: [],
      subject: 'Feature request: Add bulk patient import option',
      preview: 'I am writing to request a feature that would be incredibly helpful for our practice...',
      body: `<p>Hello TherapySync Team,</p>
            <p>I'm writing to request a feature that would be incredibly helpful for our practice. We recently switched to TherapySync from another system, and we're looking for a way to import our patient data in bulk.</p>
            <p>Currently, we have to add each patient manually, which is very time-consuming with our large patient database. A bulk import feature, perhaps using a CSV or Excel template, would make the migration process much smoother.</p>
            <p>Is this something you could consider adding to a future update?</p>
            <p>Regards,<br>Michael Thompson<br>Wellness Center Director</p>`,
      date: '2023-03-12 11:05',
      isRead: true,
      hasAttachments: false,
      attachments: [],
      labels: ['feature'],
      isStarred: true,
      isImportant: false
    },
    {
      id: 'email-005',
      folder: 'inbox',
      from: {
        name: 'Emma Davis',
        email: 'e.davis@healthgroup.com',
        avatar: 'ED'
      },
      to: 'support@therapysync.com',
      cc: ['admin@healthgroup.com'],
      subject: 'Export data in CSV format not working',
      preview: 'We are trying to export our patient data in CSV format for analysis, but the export feature is nit working properly...',
      body: `<p>Support Team,</p>
            <p>We're trying to export our patient data in CSV format for analysis, but the export feature isn't working properly. When I click on "Export" and select CSV format, the system processes for a while but then returns an error message saying "Export failed."</p>
            <p>We need this data for our quarterly reporting. Is there a workaround or can you fix the issue quickly?</p>
            <p>I've attached a screenshot of the error message for reference.</p>
            <p>Thanks for your help,<br>Emma Davis<br>Data Analyst<br>Health Group</p>`,
      date: '2023-03-10 08:15',
      isRead: true,
      hasAttachments: true,
      attachments: [
        { name: 'export_error.jpg', size: '289 KB', type: 'image' }
      ],
      labels: ['support', 'technical'],
      isStarred: false,
      isImportant: true
    }
  ];
  
  // Cargar datos simulados
  useEffect(() => {
    setTimeout(() => {
      setFolders(mockFolders);
      setEmails(mockEmails);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Seleccionar carpeta
  const handleFolderSelect = (folderId) => {
    setSelectedFolder(folderId);
    setSelectedEmail(null);
    setComposeMode(false);
  };
  
  // Seleccionar email
  const handleEmailSelect = (email) => {
    // Marcar como leído
    if (!email.isRead) {
      const updatedEmails = emails.map(e => 
        e.id === email.id ? { ...e, isRead: true } : e
      );
      setEmails(updatedEmails);
      
      // Actualizar contador de no leídos
      const updatedFolders = folders.map(f => 
        f.id === email.folder ? { ...f, unread: f.unread - 1 } : f
      );
      setFolders(updatedFolders);
    }
    
    setSelectedEmail(email);
    setComposeMode(false);
  };
  
  // Iniciar modo de composición
  const handleCompose = () => {
    setSelectedEmail(null);
    setComposeMode(true);
    setEmailContent({
      to: '',
      cc: '',
      bcc: '',
      subject: '',
      message: ''
    });
  };
  
  // Actualizar contenido del email
  const handleEmailContentChange = (field, value) => {
    setEmailContent({
      ...emailContent,
      [field]: value
    });
  };
  
  // Enviar email
  const handleSendEmail = (e) => {
    e.preventDefault();
    // Lógica para enviar correo
    alert('Email would be sent here');
    setComposeMode(false);
  };
  
  // Responder email
  const handleReply = (email) => {
    setComposeMode(true);
    setEmailContent({
      to: `${email.from.name} <${email.from.email}>`,
      cc: '',
      bcc: '',
      subject: `Re: ${email.subject}`,
      message: `\n\n-------- Original Message --------\nFrom: ${email.from.name} <${email.from.email}>\nDate: ${email.date}\nSubject: ${email.subject}\n\n`
    });
  };
  
  // Marcar como importante
  const handleToggleImportant = (email) => {
    const updatedEmails = emails.map(e => 
      e.id === email.id ? { ...e, isImportant: !e.isImportant } : e
    );
    setEmails(updatedEmails);
    
    if (selectedEmail && selectedEmail.id === email.id) {
      setSelectedEmail({ ...selectedEmail, isImportant: !selectedEmail.isImportant });
    }
  };
  
  // Marcar como destacado
  const handleToggleStar = (email) => {
    const updatedEmails = emails.map(e => 
      e.id === email.id ? { ...e, isStarred: !e.isStarred } : e
    );
    setEmails(updatedEmails);
    
    if (selectedEmail && selectedEmail.id === email.id) {
      setSelectedEmail({ ...selectedEmail, isStarred: !selectedEmail.isStarred });
    }
  };
  
  // Filtrar emails por carpeta
  const getFilteredEmails = () => {
    if (selectedFolder === 'starred') {
      return emails.filter(email => email.isStarred);
    } else if (selectedFolder === 'important') {
      return emails.filter(email => email.isImportant);
    } else {
      return emails.filter(email => email.folder === selectedFolder);
    }
  };
  
  // Buscar emails
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Obtener emails según búsqueda
  const getSearchResults = () => {
    if (!searchQuery) return getFilteredEmails();
    
    return getFilteredEmails().filter(email => 
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.labels.some(label => label.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };
  
  // Renderizar componente principal
  return (
    <div className="support-email">
      <div className="email-header">
        <h2>Corporate Email</h2>
        <div className="email-search">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Search emails..." 
            value={searchQuery}
            onChange={handleSearch}
          />
          <button 
            className="toggle-advanced-search"
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          >
            <i className={`fas fa-chevron-${showAdvancedSearch ? 'up' : 'down'}`}></i>
          </button>
        </div>
      </div>
      
      {showAdvancedSearch && (
        <div className="advanced-search">
          <div className="search-filters">
            <div className="filter-group">
              <label>From:</label>
              <input type="text" placeholder="Sender email or name" />
            </div>
            <div className="filter-group">
              <label>To:</label>
              <input type="text" placeholder="Recipient email" />
            </div>
            <div className="filter-group">
              <label>Subject:</label>
              <input type="text" placeholder="Email subject" />
            </div>
            <div className="filter-group">
              <label>Has:</label>
              <select>
                <option value="">Select</option>
                <option value="attachment">Attachment</option>
                <option value="label">Label</option>
                <option value="star">Star</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Date:</label>
              <select>
                <option value="">Any time</option>
                <option value="today">Today</option>
                <option value="week">This week</option>
                <option value="month">This month</option>
                <option value="year">This year</option>
              </select>
            </div>
          </div>
          <div className="search-buttons">
            <button className="reset-search">Reset</button>
            <button className="apply-search">Apply Filters</button>
          </div>
        </div>
      )}
      
      <div className="email-container">
        {/* Barra lateral de carpetas */}
        <div className="email-sidebar">
          <button className="compose-button" onClick={handleCompose}>
            <i className="fas fa-plus"></i>
            <span>Compose</span>
          </button>
          
          <div className="folders-list">
            {folders.map((folder) => (
              <div 
                key={folder.id}
                className={`folder-item ${selectedFolder === folder.id ? 'active' : ''}`}
                onClick={() => handleFolderSelect(folder.id)}
              >
                <div className="folder-icon" style={{ color: folder.color }}>
                  <i className={`fas ${folder.icon}`}></i>
                </div>
                <div className="folder-name">{folder.name}</div>
                {folder.unread > 0 && (
                  <div className="folder-unread">{folder.unread}</div>
                )}
              </div>
            ))}
          </div>
          
          <div className="labels-section">
            <div className="section-header">
              <span>Labels</span>
              <button className="add-label">
                <i className="fas fa-plus"></i>
              </button>
            </div>
            <div className="labels-list">
              {mockLabels.map((label) => (
                <div key={label.id} className="label-item">
                  <div className="label-color" style={{ backgroundColor: label.color }}></div>
                  <div className="label-name">{label.name}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="storage-info">
            <div className="storage-text">
              <span>Storage: 65% used</span>
              <span>6.5 GB of 10 GB</span>
            </div>
            <div className="storage-bar">
              <div className="storage-used" style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>
        
        {/* Lista de emails */}
        <div className="email-list">
          <div className="email-list-header">
            <div className="folder-title">
              <i className={`fas ${folders.find(f => f.id === selectedFolder)?.icon || 'fa-inbox'}`}></i>
              <span>{folders.find(f => f.id === selectedFolder)?.name || 'Inbox'}</span>
              <span className="email-count">
                {getSearchResults().length} {getSearchResults().length === 1 ? 'email' : 'emails'}
              </span>
            </div>
            <div className="list-actions">
              <button className="list-action">
                <i className="fas fa-sync-alt"></i>
              </button>
              <button className="list-action">
                <i className="fas fa-ellipsis-v"></i>
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="emails-loading">
              <div className="loading-spinner"></div>
              <span>Loading emails...</span>
            </div>
          ) : getSearchResults().length > 0 ? (
            <div className="emails-list">
              {getSearchResults().map((email) => (
                <div 
                  key={email.id}
                  className={`email-item ${selectedEmail && selectedEmail.id === email.id ? 'selected' : ''} ${!email.isRead ? 'unread' : ''}`}
                  onClick={() => handleEmailSelect(email)}
                >
                  <div className="email-actions">
                    <button 
                      className={`star-button ${email.isStarred ? 'starred' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStar(email);
                      }}
                    >
                      <i className={`${email.isStarred ? 'fas' : 'far'} fa-star`}></i>
                    </button>
                    <button 
                      className={`important-button ${email.isImportant ? 'important' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleImportant(email);
                      }}
                    >
                      <i className={`${email.isImportant ? 'fas' : 'far'} fa-bookmark`}></i>
                    </button>
                  </div>
                  <div className="email-sender">
                    <div className="sender-avatar">{email.from.avatar}</div>
                    <div className="sender-name">{email.from.name}</div>
                  </div>
                  <div className="email-content">
                    <div className="email-subject">{email.subject}</div>
                    <div className="email-preview">{email.preview}</div>
                  </div>
                  <div className="email-meta">
                    {email.hasAttachments && (
                      <div className="attachment-indicator">
                        <i className="fas fa-paperclip"></i>
                      </div>
                    )}
                    {email.labels.length > 0 && (
                      <div className="email-labels">
                        {email.labels.slice(0, 2).map((labelId, index) => {
                          const label = mockLabels.find(l => l.id === labelId);
                          return label ? (
                            <div 
                              key={index} 
                              className="email-label"
                              style={{ backgroundColor: label.color }}
                            >
                              {label.name}
                            </div>
                          ) : null;
                        })}
                        {email.labels.length > 2 && (
                          <div className="label-more">+{email.labels.length - 2}</div>
                        )}
                      </div>
                    )}
                    <div className="email-time">{email.date.split(' ')[1]}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-emails">
              <div className="no-data-icon">
                <i className="fas fa-envelope-open"></i>
              </div>
              <h3>No emails found</h3>
              <p>
                {searchQuery 
                  ? `No emails matching "${searchQuery}"`
                  : `No emails in ${folders.find(f => f.id === selectedFolder)?.name || 'this folder'}`}
              </p>
            </div>
          )}
        </div>
        
        {/* Contenido del email o composición */}
        <div className="email-content">
          {composeMode ? (
            <div className="email-compose">
              <div className="compose-header">
                <h3>New Message</h3>
                <div className="compose-actions">
                  <button className="minimize-action">
                    <i className="fas fa-minus"></i>
                  </button>
                  <button className="close-action" onClick={() => setComposeMode(false)}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSendEmail} className="compose-form">
                <div className="compose-field">
                  <label>To:</label>
                  <input 
                    type="text" 
                    value={emailContent.to}
                    onChange={(e) => handleEmailContentChange('to', e.target.value)}
                    placeholder="Recipients"
                  />
                </div>
                <div className="compose-field">
                  <label>Cc:</label>
                  <input 
                    type="text" 
                    value={emailContent.cc}
                    onChange={(e) => handleEmailContentChange('cc', e.target.value)}
                    placeholder="Carbon copy"
                  />
                </div>
                <div className="compose-field">
                  <label>Bcc:</label>
                  <input 
                    type="text" 
                    value={emailContent.bcc}
                    onChange={(e) => handleEmailContentChange('bcc', e.target.value)}
                    placeholder="Blind carbon copy"
                  />
                </div>
                <div className="compose-field">
                  <label>Subject:</label>
                  <input 
                    type="text" 
                    value={emailContent.subject}
                    onChange={(e) => handleEmailContentChange('subject', e.target.value)}
                    placeholder="Subject"
                  />
                </div>
                <div className="compose-message">
                  <textarea 
                    value={emailContent.message}
                    onChange={(e) => handleEmailContentChange('message', e.target.value)}
                    placeholder="Compose your message..."
                    rows="12"
                  ></textarea>
                </div>
                <div className="compose-tools">
                <div className="formatting-tools">
                  <button type="button" className="format-button">
                    <i className="fas fa-bold"></i>
                  </button>
                  <button type="button" className="format-button">
                    <i className="fas fa-italic"></i>
                  </button>
                  <button type="button" className="format-button">
                    <i className="fas fa-underline"></i>
                  </button>
                  <button type="button" className="format-button">
                    <i className="fas fa-link"></i>
                  </button>
                  <button type="button" className="format-button">
                    <i className="fas fa-paperclip"></i>
                  </button>
                  <button type="button" className="format-button">
                    <i className="fas fa-image"></i>
                  </button>
                </div>
                <div className="compose-actions">
                  <button type="button" className="action-button">
                    <i className="fas fa-save"></i>
                    <span>Save Draft</span>
                  </button>
                  <button type="submit" className="action-button primary">
                    <i className="fas fa-paper-plane"></i>
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : selectedEmail ? (
          <div className="email-detail">
            <div className="email-detail-header">
              <div className="email-subject-line">
                <h2>{selectedEmail.subject}</h2>
                <div className="email-labels">
                  {selectedEmail.labels.map((labelId, index) => {
                    const label = mockLabels.find(l => l.id === labelId);
                    return label ? (
                      <div 
                        key={index} 
                        className="email-label"
                        style={{ backgroundColor: label.color }}
                      >
                        {label.name}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
              <div className="email-actions">
                <button 
                  className={`action-button ${selectedEmail.isStarred ? 'active' : ''}`}
                  onClick={() => handleToggleStar(selectedEmail)}
                >
                  <i className={`${selectedEmail.isStarred ? 'fas' : 'far'} fa-star`}></i>
                </button>
                <button 
                  className={`action-button ${selectedEmail.isImportant ? 'active' : ''}`}
                  onClick={() => handleToggleImportant(selectedEmail)}
                >
                  <i className={`${selectedEmail.isImportant ? 'fas' : 'far'} fa-bookmark`}></i>
                </button>
                <button className="action-button">
                  <i className="fas fa-reply"></i>
                </button>
                <button className="action-button">
                  <i className="fas fa-reply-all"></i>
                </button>
                <button className="action-button">
                  <i className="fas fa-forward"></i>
                </button>
                <button className="action-button">
                  <i className="fas fa-trash-alt"></i>
                </button>
                <button className="action-button">
                  <i className="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </div>
            
            <div className="email-sender-info">
              <div className="sender-avatar large">{selectedEmail.from.avatar}</div>
              <div className="sender-details">
                <div className="sender-name-email">
                  <span className="sender-name">{selectedEmail.from.name}</span>
                  <span className="sender-email">{`<${selectedEmail.from.email}>`}</span>
                </div>
                <div className="email-recipients">
                  <span className="to-label">to:</span>
                  <span className="to-address">support@therapysync.com</span>
                  {selectedEmail.cc.length > 0 && (
                    <>
                      <span className="cc-label">cc:</span>
                      <span className="cc-address">{selectedEmail.cc.join(', ')}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="email-date">
                <div className="date-time">{selectedEmail.date}</div>
                <button className="detail-toggle">
                  <i className="fas fa-chevron-down"></i>
                </button>
              </div>
            </div>
            
            <div className="email-body">
              <div dangerouslySetInnerHTML={{ __html: selectedEmail.body }}></div>
              
              {selectedEmail.hasAttachments && (
                <div className="email-attachments">
                  <div className="attachments-header">
                    <i className="fas fa-paperclip"></i>
                    <span>{selectedEmail.attachments.length} Attachment{selectedEmail.attachments.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="attachments-list">
                    {selectedEmail.attachments.map((attachment, index) => (
                      <div key={index} className="attachment-item">
                        <div className="attachment-icon">
                          <i className={`fas fa-${attachment.type === 'image' ? 'image' : 'file-pdf'}`}></i>
                        </div>
                        <div className="attachment-info">
                          <div className="attachment-name">{attachment.name}</div>
                          <div className="attachment-size">{attachment.size}</div>
                        </div>
                        <div className="attachment-actions">
                          <button className="attachment-action">
                            <i className="fas fa-download"></i>
                          </button>
                          <button className="attachment-action">
                            <i className="fas fa-eye"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="email-reply">
              <div className="reply-avatar">LN</div>
              <div className="reply-box">
                <div className="reply-placeholder" onClick={() => handleReply(selectedEmail)}>
                  Click here to reply or use the buttons below...
                </div>
                <div className="reply-actions">
                  <button 
                    className="reply-action"
                    onClick={() => handleReply(selectedEmail)}
                  >
                    <i className="fas fa-reply"></i>
                    <span>Reply</span>
                  </button>
                  <button className="reply-action">
                    <i className="fas fa-reply-all"></i>
                    <span>Reply All</span>
                  </button>
                  <button className="reply-action">
                    <i className="fas fa-forward"></i>
                    <span>Forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="email-empty">
            <div className="empty-icon">
              <i className="fas fa-envelope-open"></i>
            </div>
            <h3>No Email Selected</h3>
            <p>Select an email from the list to view its content</p>
            <button className="compose-now" onClick={handleCompose}>
              <i className="fas fa-plus"></i>
              <span>Compose New Email</span>
            </button>
          </div>
        )}
      </div>
    </div>
    </div>
  );
  
};

export default SupportCorporateEmail;