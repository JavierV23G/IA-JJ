import React, { useState, useEffect } from 'react';
import MedicalInfo from './MedicalInfo';
import DocumentSection from './DocumentSection';
import '../../../../../styles/developer/Patients/InfoPaciente/InfoMedical.scss';

const AdminInfoMedical = ({ patientData }) => {
  const [expandedSection, setExpandedSection] = useState('all');
  const [loading, setLoading] = useState(false);
  
  // Datos médicos simulados
  const [medicalData, setMedicalData] = useState({
    nursingDiagnosis: "Essential Hypertension, Type 2 Diabetes Mellitus",
    pmh: "Hypertension (5 years), Type 2 Diabetes (3 years), Dyslipidemia",
    clinicalGrouping: "Clinical Group 1 - MMTA - Cardiac",
    wbs: "Weakness, Balance deficit, Safety concerns at home",
    homebound: "Patient is homebound due to mobility limitations and risk of falls",
    height: "5'6\"",
    weight: "165 lbs",
    bmi: "26.6"
  });
  
  // Documentos simulados
  const [documents, setDocuments] = useState([
    { 
      id: 1, 
      name: "Initial Assessment.pdf", 
      type: "assessment", 
      uploadedBy: "John Smith, PT", 
      uploadDate: "04-19-2023", 
      size: "2.3 MB",
      status: "verified",
      category: "clinical"
    },
    { 
      id: 2, 
      name: "Insurance Card.pdf", 
      type: "insurance", 
      uploadedBy: "Maria Rodriguez, Admin", 
      uploadDate: "04-19-2023", 
      size: "1.1 MB",
      status: "verified",
      category: "administrative"
    },
    { 
      id: 3, 
      name: "OASIS Assessment.pdf", 
      type: "assessment", 
      uploadedBy: "Sarah Johnson, RN", 
      uploadDate: "04-20-2023", 
      size: "3.5 MB",
      status: "pending",
      category: "clinical"
    },
    { 
      id: 4, 
      name: "MD Referral Form.pdf", 
      type: "referral", 
      uploadedBy: "Mohammed Adhami", 
      uploadDate: "04-18-2023", 
      size: "1.8 MB",
      status: "verified",
      category: "administrative"
    },
    { 
      id: 5, 
      name: "Patient Consent Form.pdf", 
      type: "consent", 
      uploadedBy: "Luis Nava, Developer", 
      uploadDate: "04-19-2023", 
      size: "0.9 MB",
      status: "verified",
      category: "administrative"
    }
  ]);

  // Función para manejar la actualización de información médica
  const handleMedicalInfoUpdate = (updatedInfo) => {
    setLoading(true);
    // Simular petición a API
    setTimeout(() => {
      setMedicalData({...medicalData, ...updatedInfo});
      setLoading(false);
    }, 800);
  };

  // Función para añadir un nuevo documento
  const handleAddDocument = (newDocument) => {
    setLoading(true);
    // Simular carga y procesamiento del documento
    setTimeout(() => {
      const newId = documents.length > 0 ? Math.max(...documents.map(d => d.id)) + 1 : 1;
      const currentDate = new Date();
      const formattedDate = `${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}-${currentDate.getFullYear()}`;
      
      const documentToAdd = {
        id: newId,
        name: newDocument.name,
        type: newDocument.type || "other",
        uploadedBy: "Luis Nava, Developer", // Usuario actual simulado
        uploadDate: formattedDate,
        size: newDocument.size || "0 KB",
        status: "pending",
        category: newDocument.category || "administrative"
      };
      
      setDocuments([...documents, documentToAdd]);
      setLoading(false);
    }, 1200);
  };

  // Función para eliminar un documento
  const handleDeleteDocument = (documentId) => {
    setLoading(true);
    // Simular petición a API
    setTimeout(() => {
      setDocuments(documents.filter(doc => doc.id !== documentId));
      setLoading(false);
    }, 800);
  };

  // Función para cambiar el estado de un documento
  const handleDocumentStatusChange = (documentId, newStatus) => {
    setLoading(true);
    // Simular petición a API
    setTimeout(() => {
      setDocuments(documents.map(doc => 
        doc.id === documentId ? {...doc, status: newStatus} : doc
      ));
      setLoading(false);
    }, 600);
  };

  // Función para gestionar qué sección está expandida
  const toggleExpandedSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection('all');
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <div className="medical-section">
      <div className="section-header">
        <h2 className="section-title">
          <i className="fas fa-notes-medical"></i> Medical Information
        </h2>
      </div>

      <div className="medical-content">
        {/* Sección de Información Médica */}
        <MedicalInfo 
          data={medicalData} 
          onUpdate={handleMedicalInfoUpdate}
          expanded={expandedSection === 'all' || expandedSection === 'info'}
          onToggleExpand={() => toggleExpandedSection('info')}
          isLoading={loading}
        />

        {/* Sección de Documentos */}
        <DocumentSection 
          documents={documents} 
          onAddDocument={handleAddDocument}
          onDeleteDocument={handleDeleteDocument}
          onStatusChange={handleDocumentStatusChange}
          expanded={expandedSection === 'all' || expandedSection === 'documents'}
          onToggleExpand={() => toggleExpandedSection('documents')}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default AdminInfoMedical;