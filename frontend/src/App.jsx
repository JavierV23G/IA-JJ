import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet  } from 'react-router-dom';
import { AuthProvider } from './components/login/AuthContext';
import ProtectedRoute from './components/login/ProtectedRoute';
import RoleBasedRoute from './components/login/RoleBasedRoute';
import RoleRedirect from './components/login/RoleRedirect';
import LoginCard from './components/login/LoginCard';
import ResetVerifyPage from './components/login/ResetVerifyPage';
import GeoRestrictionProvider from './components/login/GeoRestrictionProvider';
import SessionTimeoutContainer from './components/login/SessionTimeoutContainer';
import ConcurrentSessionContainer from './components/login/ConcurrentSessionContainer';

// Importar componentes para Developer
import DevHomePage from './components/developer/welcome/Welcome';
import DevSupportPage from './components/developer/support/SupportPage';
import DevReferralsPage from './components/developer/referrals/ReferralsPage';
import DevCreateNF from './components/developer/referrals/CreateNF/CreateNF';
import DevPatientsPage from './components/developer/patients/PatientsPage';
import DevStaffingPage from './components/developer/patients/staffing/StaffingPage';
import DevInfoPaciente from './components/developer/patients/Patients/InfoPaciente/InfoPaciente';
import DevAccounting from './components/developer/accounting/Accounting';
import DevUserProfile from './components/developer/profile/UserProfile';

// Importar componentes para Administrator
import AdminHomePage from './components/admin/welcome/Welcome';
import AdminSupportPage from './components/admin/support/SupportPage';
import AdminReferralsPage from './components/admin/referrals/ReferralsPage';
import AdminCreateNF from './components/admin/referrals/CreateNF/CreateNF';
import AdminPatientsPage from './components/admin/patients/PatientsPage';
import AdminStaffingPage from './components/admin/patients/staffing/StaffingPage';
import AdminInfoPaciente from './components/admin/patients/Patients/InfoPaciente/InfoPaciente';
import AdminAccounting from './components/admin/accounting/Accounting';
import AdminUserProfile from './components/admin/profile/UserProfile';

// Importar componentes para PT, OT, ST (Therapists)
import TBHomePage from './components/pt-ot-st/welcome/Welcome';
import TBSupportPage from './components/pt-ot-st/support/SupportPage';
import TBReferralsPage from './components/pt-ot-st/referrals/ReferralsPage';
import TBCreateNF from './components/pt-ot-st/referrals/CreateNF/CreateNF';
import TBPatientsPage from './components/pt-ot-st/patients/PatientsPage';
import TBStaffingPage from './components/pt-ot-st/patients/staffing/StaffingPage';
import TBInfoPaciente from './components/pt-ot-st/patients/Patients/InfoPaciente/InfoPaciente';
import TBAccounting from './components/pt-ot-st/accounting/Accounting';
import TBUserProfile from './components/pt-ot-st/profile/UserProfile';

// Importar estilos para componentes nuevos
import './styles/Login/Login.scss';
import './styles/Login/AuthLoadingModal.scss';
import './styles/Login/PremiumLoadingModal.scss'; 
import './styles/Login/AccountLockoutModal.scss';
import './styles/Login/SessionTimeoutWarning.scss';
import './styles/Login/ConcurrentSessionModal.scss';
import './styles/Login/GeoRestrictionModal.scss';
import './styles/Login/ResetPassword.scss';

// Importar Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <GeoRestrictionProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<LoginCard />} />
            <Route path="/reset-password" element={<ResetVerifyPage />} />
            
            {/* Rutas protegidas */}
            <Route element={<ProtectedRoute />}>
              {/* Componentes de sesión globales (timeout, concurrencia) */}
              <Route element={
                <>
                  <SessionTimeoutContainer />
                  <ConcurrentSessionContainer />
                  <Outlet />
                </>
              }>
                {/* Ruta para redireccionar al home basado en el rol */}
                <Route path="/home" element={<RoleRedirect />} />
                
                {/* Rutas específicas para Developer */}
                <Route element={<RoleBasedRoute allowedRoles={['Developer']} />}>
                  <Route path="/developer/homePage" element={<DevHomePage />} />
                  <Route path="/developer/support" element={<DevSupportPage />} />
                  <Route path="/developer/referrals" element={<DevReferralsPage />} />
                  <Route path="/developer/createNewReferral" element={<DevCreateNF />} />
                  <Route path="/developer/patients" element={<DevPatientsPage />} />
                  <Route path="/developer/paciente/:patientId" element={<DevInfoPaciente />} />
                  <Route path="/developer/staffing" element={<DevStaffingPage />} />
                  <Route path="/developer/accounting" element={<DevAccounting />} />
                  <Route path="/developer/profile" element={<DevUserProfile />} />
                </Route>
                
                {/* Rutas específicas para Administrator */}
                <Route element={<RoleBasedRoute allowedRoles={['Administrator']} />}>
                  <Route path="/administrator/homePage" element={<AdminHomePage />} />
                  <Route path="/administrator/support" element={<AdminSupportPage />} />
                  <Route path="/administrator/referrals" element={<AdminReferralsPage />} />
                  <Route path="/administrator/createNewReferral" element={<AdminCreateNF />} />
                  <Route path="/administrator/patients" element={<AdminPatientsPage />} />
                  <Route path="/administrator/paciente/:patientId" element={<AdminInfoPaciente />} />
                  <Route path="/administrator/staffing" element={<AdminStaffingPage />} />
                  <Route path="/administrator/accounting" element={<AdminAccounting />} />
                  <Route path="/administrator/profile" element={<AdminUserProfile />} />
                </Route>
                
                {/* Rutas específicas para PT */}
                <Route element={<RoleBasedRoute allowedRoles={['PT', 'PT - Administrator']} />}>
                  <Route path="/pt/homePage" element={<TBHomePage />} />
                  <Route path="/pt/support" element={<TBSupportPage />} />
                  <Route path="/pt/referrals" element={<TBReferralsPage />} />
                  <Route path="/pt/createNewReferral" element={<TBCreateNF />} />
                  <Route path="/pt/patients" element={<TBPatientsPage />} />
                  <Route path="/pt/paciente/:patientId" element={<TBInfoPaciente />} />
                  <Route path="/pt/staffing" element={<TBStaffingPage />} />
                  <Route path="/pt/accounting" element={<TBAccounting />} />
                  <Route path="/pt/profile" element={<TBUserProfile />} />
                </Route>
                
                {/* Rutas específicas para OT */}
                <Route element={<RoleBasedRoute allowedRoles={['OT', 'OT - Administrator']} />}>
                  <Route path="/ot/homePage" element={<TBHomePage />} />
                  <Route path="/ot/support" element={<TBSupportPage />} />
                  <Route path="/ot/referrals" element={<TBReferralsPage />} />
                  <Route path="/ot/createNewReferral" element={<TBCreateNF />} />
                  <Route path="/ot/patients" element={<TBPatientsPage />} />
                  <Route path="/ot/paciente/:patientId" element={<TBInfoPaciente />} />
                  <Route path="/ot/staffing" element={<TBStaffingPage />} />
                  <Route path="/ot/accounting" element={<TBAccounting />} />
                  <Route path="/ot/profile" element={<TBUserProfile />} />
                </Route>
                
                {/* Rutas específicas para ST */}
                <Route element={<RoleBasedRoute allowedRoles={['ST', 'ST - Administrator']} />}>
                  <Route path="/st/homePage" element={<TBHomePage />} />
                  <Route path="/st/support" element={<TBSupportPage />} />
                  <Route path="/st/referrals" element={<TBReferralsPage />} />
                  <Route path="/st/createNewReferral" element={<TBCreateNF />} />
                  <Route path="/st/patients" element={<TBPatientsPage />} />
                  <Route path="/st/paciente/:patientId" element={<TBInfoPaciente />} />
                  <Route path="/st/staffing" element={<TBStaffingPage />} />
                  <Route path="/st/accounting" element={<TBAccounting />} />
                  <Route path="/st/profile" element={<TBUserProfile />} />
                </Route>
                
                {/* Rutas específicas para PTA */}
                <Route element={<RoleBasedRoute allowedRoles={['PTA']} />}>
                  <Route path="/pta/homePage" element={<TBHomePage />} />
                  <Route path="/pta/support" element={<TBSupportPage />} />
                  <Route path="/pta/referrals" element={<TBReferralsPage />} />
                  <Route path="/pta/createNewReferral" element={<TBCreateNF />} />
                  <Route path="/pta/patients" element={<TBPatientsPage />} />
                  <Route path="/pta/paciente/:patientId" element={<TBInfoPaciente />} />
                  <Route path="/pta/staffing" element={<TBStaffingPage />} />
                  <Route path="/pta/accounting" element={<TBAccounting />} />
                  <Route path="/pta/profile" element={<TBUserProfile />} />
                </Route>
                
                {/* Rutas específicas para COTA */}
                <Route element={<RoleBasedRoute allowedRoles={['COTA']} />}>
                  <Route path="/cota/homePage" element={<TBHomePage />} />
                  <Route path="/cota/support" element={<TBSupportPage />} />
                  <Route path="/cota/referrals" element={<TBReferralsPage />} />
                  <Route path="/cota/createNewReferral" element={<TBCreateNF />} />
                  <Route path="/cota/patients" element={<TBPatientsPage />} />
                  <Route path="/cota/paciente/:patientId" element={<TBInfoPaciente />} />
                  <Route path="/cota/staffing" element={<TBStaffingPage />} />
                  <Route path="/cota/accounting" element={<TBAccounting />} />
                  <Route path="/cota/profile" element={<TBUserProfile />} />
                </Route>
                
                {/* Rutas específicas para STA */}
                <Route element={<RoleBasedRoute allowedRoles={['STA']} />}>
                  <Route path="/sta/homePage" element={<TBHomePage />} />
                  <Route path="/sta/support" element={<TBSupportPage />} />
                  <Route path="/sta/referrals" element={<TBReferralsPage />} />
                  <Route path="/sta/createNewReferral" element={<TBCreateNF />} />
                  <Route path="/sta/patients" element={<TBPatientsPage />} />
                  <Route path="/sta/paciente/:patientId" element={<TBInfoPaciente />} />
                  <Route path="/sta/staffing" element={<TBStaffingPage />} />
                  <Route path="/sta/accounting" element={<TBAccounting />} />
                  <Route path="/sta/profile" element={<TBUserProfile />} />
                </Route>
                
                {/* Rutas específicas para Supportive */}
                <Route element={<RoleBasedRoute allowedRoles={['Supportive', 'Support']} />}>
                  <Route path="/supportive/homePage" element={<TBHomePage />} />
                  <Route path="/supportive/support" element={<TBSupportPage />} />
                  <Route path="/supportive/referrals" element={<TBReferralsPage />} />
                  <Route path="/supportive/createNewReferral" element={<TBCreateNF />} />
                  <Route path="/supportive/patients" element={<TBPatientsPage />} />
                  <Route path="/supportive/paciente/:patientId" element={<TBInfoPaciente />} />
                  <Route path="/supportive/staffing" element={<TBStaffingPage />} />
                  <Route path="/supportive/accounting" element={<TBAccounting />} />
                  <Route path="/supportive/profile" element={<TBUserProfile />} />
                </Route>
                
                {/* Rutas específicas para Agency */}
                <Route element={<RoleBasedRoute allowedRoles={['Agency']} />}>
                  <Route path="/agency/homePage" element={<TBHomePage />} />
                  <Route path="/agency/support" element={<TBSupportPage />} />
                  <Route path="/agency/referrals" element={<TBReferralsPage />} />
                  <Route path="/agency/createNewReferral" element={<TBCreateNF />} />
                  <Route path="/agency/patients" element={<TBPatientsPage />} />
                  <Route path="/agency/paciente/:patientId" element={<TBInfoPaciente />} />
                  <Route path="/agency/staffing" element={<TBStaffingPage />} />
                  <Route path="/agency/accounting" element={<TBAccounting />} />
                  <Route path="/agency/profile" element={<TBUserProfile />} />
                </Route>
                
                {/* Rutas legacy (para compatibilidad con código existente) */}
                <Route path="/homePage" element={<RoleRedirect />} />
                <Route path="/support" element={<RoleRedirect />} />
                <Route path="/referrals" element={<RoleRedirect />} />
                <Route path="/createNewReferral" element={<RoleRedirect />} />
                <Route path="/patients" element={<RoleRedirect />} />
                <Route path="/paciente/:patientId" element={<RoleRedirect />} />
                <Route path="/staffing" element={<RoleRedirect />} />
                <Route path="/accounting" element={<RoleRedirect />} />
                <Route path="/profile" element={<RoleRedirect />} />
              </Route>
            </Route>
            
            {/* Ruta por defecto - Redirige al login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </GeoRestrictionProvider>
  );
}

export default App;