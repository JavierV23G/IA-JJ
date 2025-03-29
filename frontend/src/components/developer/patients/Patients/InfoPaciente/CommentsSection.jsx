import React, { useState, useEffect, useRef } from 'react';
import '../../../../../styles/developer/Patients/InfoPaciente/CommentsSection.scss';

const CommentsSection = ({ patientId }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddComment, setShowAddComment] = useState(false);
  const [newComment, setNewComment] = useState({
    text: '',
    addressedTo: [],
    urgent: false
  });
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [expandedComment, setExpandedComment] = useState(null);
  const textareaRef = useRef(null);
  
  // Options for addressing comments
  const addressOptions = [
    { id: 'office', label: 'OFFICE STAFF' },
    { id: 'pt', label: 'PHYSICAL THERAPY' },
    { id: 'ot', label: 'OCCUPATIONAL THERAPY' },
    { id: 'st', label: 'SPEECH THERAPY' },
    { id: 'sw', label: 'SOCIAL WORKER' }
  ];
  
  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All Comments' },
    { value: 'therapy', label: 'Therapy Orders' },
    { value: 'nomnc', label: 'NOMNC Forms' },
    { value: 'other', label: 'Other Forms' }
  ];
  
  useEffect(() => {
    fetchComments();
  }, [patientId]);
  
  const fetchComments = () => {
    setIsLoading(true);
    
    // Simulated API call to fetch comments
    setTimeout(() => {
      const mockComments = [
        {
          id: 1,
          type: 'nomnc',
          title: 'NOMNC',
          content: 'A NOMNC was done by James Mwangi on 5/17/2024',
          author: 'James Mwangi',
          date: '5/17/2024',
          time: '12:00 AM',
          status: 'Complete',
          addressedTo: ['office'],
          attachments: [],
          hasAttachments: false
        },
        {
          id: 2,
          type: 'therapy',
          title: 'THERAPY ORDER',
          content: 'Add/Continue PT Frequency 1w1, 2w2 starting week of 04/30/2024 \\ Skilled PT consisting of: Progressive gait and transfer training, BLE ther ex, core strengthening exercises, standing static/dynamic balance exercises. Instruction in HEP, pain mgmt and fall prevention/safety.',
          author: 'Willie Blackwell',
          date: '04/30/2024',
          time: '2:08 PM',
          status: 'Complete',
          addressedTo: ['pt'],
          attachments: [{
            id: 1,
            name: 'PT_Order_04302024.pdf',
            type: 'pdf',
            size: '1.2 MB'
          }],
          hasAttachments: true
        },
        {
          id: 3,
          type: 'expense',
          title: 'EXPENSE REPORT',
          content: 'Transportation expense for home visit on 3/25/2025. Total miles: 28.',
          author: 'Regina Araquel',
          date: '3/26/2025',
          time: '9:45 AM',
          status: 'Pending Approval',
          addressedTo: ['office'],
          attachments: [{
            id: 2,
            name: 'Mileage_Receipt.jpg',
            type: 'image',
            size: '856 KB'
          }],
          hasAttachments: true
        },
        {
          id: 4,
          type: 'other',
          title: 'CARE COORDINATION',
          content: 'Contacted Dr. Patel regarding medication adjustments. Patient reported increased dizziness after lisinopril dose increase. Dr. Patel recommends reducing dose back to 10mg and monitoring BP for 1 week.',
          author: 'Jacob Staffey',
          date: '3/10/2025',
          time: '11:30 AM',
          status: 'Complete',
          addressedTo: ['pt', 'office'],
          attachments: [],
          hasAttachments: false
        },
        {
          id: 5,
          type: 'other',
          title: 'CARE PLAN UPDATE',
          content: 'Patient progressing well with balance activities. Able to stand unsupported for 30 seconds, up from 15 seconds at evaluation. Continue with current plan and progress to more challenging balance activities as tolerated.',
          author: 'Regina Araquel',
          date: '3/05/2025',
          time: '4:15 PM',
          status: 'Complete',
          addressedTo: ['pt'],
          attachments: [],
          hasAttachments: false
        }
      ];
      
      setComments(mockComments);
      setIsLoading(false);
    }, 800);
  };
  
  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };
  
  const filteredComments = () => {
    if (selectedFilter === 'all') {
      return comments;
    }
    return comments.filter(comment => comment.type === selectedFilter);
  };
  
  const handleAddressOptionChange = (optionId) => {
    if (newComment.addressedTo.includes(optionId)) {
      setNewComment({
        ...newComment,
        addressedTo: newComment.addressedTo.filter(id => id !== optionId)
      });
    } else {
      setNewComment({
        ...newComment,
        addressedTo: [...newComment.addressedTo, optionId]
      });
    }
  };
  
  const handleSubmitComment = () => {
    if (!newComment.text.trim() || newComment.addressedTo.length === 0) {
      // Show validation error
      return;
    }
    
    const currentDate = new Date();
    const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
    const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newCommentObj = {
      id: comments.length + 1,
      type: 'other',
      title: 'COMMENT',
      content: newComment.text,
      author: 'Luis Nava', // Hardcoded current user
      date: formattedDate,
      time: formattedTime,
      status: 'New',
      addressedTo: newComment.addressedTo,
      attachments: [],
      hasAttachments: false,
      urgent: newComment.urgent
    };
    
    setComments([newCommentObj, ...comments]);
    setNewComment({
      text: '',
      addressedTo: [],
      urgent: false
    });
    setShowAddComment(false);
  };
  
  const handleDeleteComment = (commentId) => {
    setComments(comments.filter(comment => comment.id !== commentId));
    setShowConfirmDelete(null);
  };
  
  const renderCommentActions = (comment) => {
    return (
      <div className="comment-actions">
        <button className="action-btn view" title="View Details">
          <i className="fas fa-eye"></i>
          <span>VIEW</span>
        </button>
        <button className="action-btn edit" title="Edit Comment">
          <i className="fas fa-edit"></i>
          <span>EDIT</span>
        </button>
        <button 
          className="action-btn delete" 
          title="Delete Comment"
          onClick={(e) => {
            e.stopPropagation();
            setShowConfirmDelete(comment.id);
          }}
        >
          <i className="fas fa-trash-alt"></i>
          <span>DELETE</span>
        </button>
      </div>
    );
  };
  
  const getCommentTypeIcon = (type) => {
    switch(type) {
      case 'nomnc':
        return 'fas fa-file-contract';
      case 'therapy':
        return 'fas fa-notes-medical';
      case 'expense':
        return 'fas fa-receipt';
      default:
        return 'fas fa-comment-medical';
    }
  };
  
  const getCommentTypeClass = (type) => {
    switch(type) {
      case 'nomnc':
        return 'nomnc-type';
      case 'therapy':
        return 'therapy-type';
      case 'expense':
        return 'expense-type';
      default:
        return 'other-type';
    }
  };
  
  const getStatusClass = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('complete')) return 'status-complete';
    if (statusLower.includes('pending')) return 'status-pending';
    if (statusLower.includes('new')) return 'status-new';
    return '';
  };
  
  const toggleExpandComment = (commentId) => {
    if (expandedComment === commentId) {
      setExpandedComment(null);
    } else {
      setExpandedComment(commentId);
    }
  };
  
  const renderAddressLabels = (addressedTo) => {
    return addressedTo.map(addr => {
      const option = addressOptions.find(opt => opt.id === addr);
      if (!option) return null;
      
      return (
        <span key={addr} className={`address-label ${addr}`}>
          {option.label}
        </span>
      );
    });
  };
  
  const renderAttachments = (attachments) => {
    if (!attachments || attachments.length === 0) return null;
    
    return (
      <div className="comment-attachments">
        <div className="attachments-header">
          <i className="fas fa-paperclip"></i>
          <span>Attachments ({attachments.length})</span>
        </div>
        <div className="attachments-list">
          {attachments.map(attachment => (
            <div key={attachment.id} className="attachment-item">
              <div className="attachment-icon">
                <i className={`fas ${attachment.type === 'pdf' ? 'fa-file-pdf' : 'fa-file-image'}`}></i>
              </div>
              <div className="attachment-info">
                <span className="attachment-name">{attachment.name}</span>
                <span className="attachment-size">{attachment.size}</span>
              </div>
              <div className="attachment-actions">
                <button className="attachment-btn view" title="View">
                  <i className="fas fa-eye"></i>
                </button>
                <button className="attachment-btn download" title="Download">
                  <i className="fas fa-download"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="comments-section">
      <div className="section-header">
        <h2 className="section-title">
          <i className="fas fa-comments"></i>
          Comments & Other Forms
        </h2>
      </div>
      
      <div className="comments-content">
        <div className="comments-toolbar">
          <div className="filter-container">
            <label htmlFor="commentFilter">Show:</label>
            <div className="select-wrapper">
              <select 
                id="commentFilter" 
                value={selectedFilter}
                onChange={handleFilterChange}
                className="filter-select"
              >
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
          
          <div className="action-buttons">
            <button 
              className="add-comment-btn"
              onClick={() => setShowAddComment(true)}
              disabled={showAddComment}
            >
              <i className="fas fa-plus-circle"></i>
              <span>Add Comment</span>
            </button>
            <button className="add-form-btn">
              <i className="fas fa-file-medical"></i>
              <span>Add Form</span>
            </button>
          </div>
        </div>
        
        {showAddComment && (
          <div className="add-comment-form">
            <div className="form-header">
              <h3>
                <i className="fas fa-comment-medical"></i>
                New Comment
              </h3>
              <button 
                className="close-form-btn"
                onClick={() => setShowAddComment(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="form-content">
              <div className="form-group">
                <label>Address Comment To:</label>
                <div className="address-options">
                  {addressOptions.map(option => (
                    <div key={option.id} className="address-option">
                      <input 
                        type="checkbox" 
                        id={`addr-${option.id}`}
                        checked={newComment.addressedTo.includes(option.id)}
                        onChange={() => handleAddressOptionChange(option.id)}
                      />
                      <label htmlFor={`addr-${option.id}`}>{option.label}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <textarea 
                  ref={textareaRef}
                  value={newComment.text}
                  onChange={(e) => setNewComment({...newComment, text: e.target.value})}
                  placeholder="Type your comment here..."
                  rows={5}
                ></textarea>
              </div>
              
              <div className="form-group urgent-option">
                <input 
                  type="checkbox" 
                  id="urgent-comment"
                  checked={newComment.urgent}
                  onChange={(e) => setNewComment({...newComment, urgent: e.target.checked})}
                />
                <label htmlFor="urgent-comment">
                  <i className="fas fa-exclamation-circle"></i>
                  Mark as urgent
                </label>
              </div>
              
              <div className="form-footer">
                <div className="attachments-section">
                  <button className="attach-btn">
                    <i className="fas fa-paperclip"></i>
                    <span>Attach File</span>
                  </button>
                </div>
                
                <div className="attention-note">
                  <i className="fas fa-info-circle"></i>
                  <span>Do not use comments for urgent information. If you need a response, please call therapist(s) directly.</span>
                </div>
                
                <div className="form-actions">
                  <button 
                    className="cancel-btn"
                    onClick={() => setShowAddComment(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="submit-btn"
                    onClick={handleSubmitComment}
                    disabled={!newComment.text.trim() || newComment.addressedTo.length === 0}
                  >
                    <i className="fas fa-paper-plane"></i>
                    Submit Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading comments and forms...</p>
          </div>
        ) : (
          <div className="comments-list">
            {filteredComments().length > 0 ? (
              filteredComments().map(comment => (
                <div 
                  key={comment.id} 
                  className={`comment-card ${getCommentTypeClass(comment.type)} ${expandedComment === comment.id ? 'expanded' : ''} ${comment.urgent ? 'urgent' : ''}`}
                  onClick={() => toggleExpandComment(comment.id)}
                >
                  <div className="comment-header">
                    <div className="comment-type-icon">
                      <i className={getCommentTypeIcon(comment.type)}></i>
                    </div>
                    
                    <div className="comment-title">
                      <h3>{comment.title}</h3>
                      {comment.urgent && (
                        <span className="urgent-badge" title="Urgent Comment">
                          <i className="fas fa-exclamation-circle"></i>
                        </span>
                      )}
                    </div>
                    
                    <div className="comment-meta">
                      <div className="meta-info">
                        <span className="documentation-date">
                          Documentation Date: {comment.date}
                        </span>
                        <span className="author-info">
                          -{comment.author} on {comment.date} @ {comment.time}
                        </span>
                        <span className={`status-badge ${getStatusClass(comment.status)}`}>
                          Status: {comment.status}
                        </span>
                      </div>
                      
                      {comment.hasAttachments && (
                        <div className="attachment-indicator" title="Has Attachments">
                          <i className="fas fa-paperclip"></i>
                        </div>
                      )}
                      
                      <div className="expand-indicator">
                        <i className={`fas fa-chevron-${expandedComment === comment.id ? 'up' : 'down'}`}></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className="comment-preview">
                    <p>{comment.content.length > 150 && expandedComment !== comment.id 
                      ? `${comment.content.substring(0, 150)}...` 
                      : comment.content}
                    </p>
                  </div>
                  
                  {expandedComment === comment.id && (
                    <div className="comment-details">
                      <div className="addressed-to">
                        <span className="label">Addressed To:</span>
                        <div className="address-labels">
                          {renderAddressLabels(comment.addressedTo)}
                        </div>
                      </div>
                      
                      {renderAttachments(comment.attachments)}
                      
                      {renderCommentActions(comment)}
                    </div>
                  )}
                  
                  {showConfirmDelete === comment.id && (
                    <div className="delete-confirmation" onClick={(e) => e.stopPropagation()}>
                      <div className="confirmation-dialog">
                        <div className="dialog-icon">
                          <i className="fas fa-exclamation-triangle"></i>
                        </div>
                        <div className="dialog-content">
                          <h4>Confirm Deletion</h4>
                          <p>Are you sure you want to delete this comment? This action cannot be undone.</p>
                        </div>
                        <div className="dialog-actions">
                          <button 
                            className="cancel-delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowConfirmDelete(null);
                            }}
                          >
                            Cancel
                          </button>
                          <button 
                            className="confirm-delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteComment(comment.id);
                            }}
                          >
                            <i className="fas fa-trash-alt"></i>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-comments">
                <div className="empty-state">
                  <i className="fas fa-comments"></i>
                  <h3>No Comments Found</h3>
                  <p>There are no comments or forms matching your filter criteria.</p>
                  <button 
                    className="add-first-comment"
                    onClick={() => setShowAddComment(true)}
                  >
                    <i className="fas fa-plus-circle"></i>
                    Add Your First Comment
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="expense-section">
          <div className="expense-header">
            <h3>
              <i className="fas fa-receipt"></i>
              Additional Expenses
            </h3>
            <button className="add-expense-btn">
              <i className="fas fa-plus"></i>
              ADD EXPENSE
            </button>
          </div>
          
          <div className="expense-content">
            <div className="expense-table">
              <div className="expense-table-header">
                <div className="header-cell">Date</div>
                <div className="header-cell">Description</div>
                <div className="header-cell">Amount</div>
                <div className="header-cell">Status</div>
                <div className="header-cell">Actions</div>
              </div>
              
              <div className="expense-table-body">
                <div className="expense-row">
                  <div className="cell">03/26/2025</div>
                  <div className="cell description">Transportation expense for home visit</div>
                  <div className="cell amount">$35.00</div>
                  <div className="cell">
                    <span className="status-badge status-pending">Pending</span>
                  </div>
                  <div className="cell actions">
                    <button className="action-btn view">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="action-btn edit">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="action-btn delete">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
                
                <div className="expense-row">
                  <div className="cell">02/15/2025</div>
                  <div className="cell description">Medical supplies for wound care</div>
                  <div className="cell amount">$22.50</div>
                  <div className="cell">
                    <span className="status-badge status-complete">Approved</span>
                  </div>
                  <div className="cell actions">
                    <button className="action-btn view">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="action-btn edit">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="action-btn delete">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;