import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import LoginCard from './components/login/LoginCard';
import HomePage from './components/developer/welcome/Welcome';
import SupportPage from './components/developer/support/SupportPage';
import ReferralsPage from './components/developer/referrals/ReferralsPage';
import CreateNF from './components/developer/referrals/CreateNF/CreateNF';
import PatientsPage from './components/developer/patients/PatientsPage';
import StaffingPage from './components/developer/patients/staffing/StaffingPage';
import InfoPaciente from './components/developer/patients/Patients/InfoPaciente/InfoPaciente';
import Accounting from './components/developer/accounting/Accounting';
import UserProfile from './components/developer/profile/UserProfile';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LoginCard />} />
        <Route path="/homePage" element={<HomePage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/referrals" element={<ReferralsPage />} />
        <Route path="/createNewReferral" element={<CreateNF />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/paciente/:patientId" element={<InfoPaciente />} />
        <Route path="/staffing" element={<StaffingPage />} />
        <Route path="/accounting" element={<Accounting />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </HashRouter>
  );
}

export default App;