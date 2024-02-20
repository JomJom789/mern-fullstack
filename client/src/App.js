//* -------------------------------------------------------------------------- */
//*                                     CSS                                    */
//* -------------------------------------------------------------------------- */
import './App.css';

//* -------------------------------------------------------------------------- */
//*                                    Hooks                                   */
//* -------------------------------------------------------------------------- */
import React, {
  useEffect,
} from 'react';

//* -------------------------------------------------------------------------- */
//*                                 React Route                                */
//* -------------------------------------------------------------------------- */
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate, 
} from 'react-router-dom';

//* -------------------------------------------------------------------------- */
//*                                  Provider                                  */
//* -------------------------------------------------------------------------- */
import { useStateContext } from './contexts/ThemeProvider';

//* -------------------------------------------------------------------------- */
//*                                    Redux                                   */
//* -------------------------------------------------------------------------- */
import { useSelector } from "react-redux";

//* -------------------------------------------------------------------------- */
//*                                  Component                                 */
//* -------------------------------------------------------------------------- */
import { 
  HomeNavbar,
  AdminNavbar,
  AdminSidebar, 
} from './components';

//* -------------------------------------------------------------------------- */
//*                                    Pages                                   */
//* -------------------------------------------------------------------------- */
import { 
  HomePage,
  SkillsPage,
  ProjectListPage,  
  ProjectDetailsPage,
  ContactsPage,
  NotFoundPage,
  LoginPage,
  EmailVerify,
  EmailForgotPassword,
  ResetPassword,
} from './pages';

//* -------------------------------------------------------------------------- */
//*                                 Admin Page                                 */
//* -------------------------------------------------------------------------- */
import AdminDashboard from './pages/AdminDashboard'

import AdminWebsites from './pages/AdminWebsites';
import AdminWebsiteDetails from './pages/AdminWebsites/AdminWebsiteDetails';

import AdminMobiles from './pages/AdminMobiles';
import AdminMobileDetails from './pages/AdminMobiles/AdminMobileDetails';

import AdminUsers from './pages/AdminUsers';
import AdminUsersDetails from './pages/AdminUsers/AdminUsersDetails';

//* -------------------------------------------------------------------------- */
//*                                     App                                    */
//* -------------------------------------------------------------------------- */
function App() {

  /* -------------------------------------------------------------------------- */
  /*                                    Redux                                   */
  /* -------------------------------------------------------------------------- */
  const isAuth = Boolean(useSelector((state) => state.auth.token));
  const isSidebar = useSelector((state) => state.admin.isSidebarOpen);

  /* -------------------------------------------------------------------------- */
  /*                               useStateContext                              */
  /* -------------------------------------------------------------------------- */
  const { 
    setCurrentMode,
    setCurrentColor,    
    currentMode,    
    // currentColor,
  } = useStateContext();

  /* -------------------------------------------------------------------------- */
  /*                         Get Data from Local Storage                        */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const currentThemeMode = localStorage.getItem('themeMode');
    const currentThemeColor = localStorage.getItem('colorMode');
    if (currentThemeMode &&  currentThemeColor) {
      setCurrentMode(currentThemeMode);
      setCurrentColor(currentThemeColor);
    }
  },);

  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div 
      className={ 
        currentMode === 'Dark' 
        ? 'dark' 
        : ''
      }
    >
      <BrowserRouter>
        
        {/* Theme Mode */}
        <div className='dark:bg-slate-900'>
                          
          {/* Screen */}
          <div className='' >
              
            {/* --------------------------------- Navbar --------------------------------- */}
            <div className='' >
              { 
                isAuth 
                ? <AdminNavbar /> 
                : <HomeNavbar /> 
              }
            </div>

            {/* --------------------------------- Sidebar -------------------------------- */}
            {
              isAuth
              ? isSidebar
                ? (
                    <div 
											className={`
												mt-[70px]
												xx:w-0 lg:w-60
												fixed
												bg-white
											`}
										>
                      <AdminSidebar />
                    </div>
                  ) 
                : (
                    <div 
											className={`
												mt-[70px]
												w-32												
											`}
										>
                      
                    </div>
                  )
              : <></>
            }

            {/* ---------------------------------- Body ---------------------------------- */}
            <div 
              className={
                isSidebar
                ? `min-h-screen xx:ml-0 ${isAuth? `lg:ml-60`: `lg:ml-0`}`
                : `w-full min-h-screen flex-2`
              }
            >
              <Routes>

                {/* ------------------------------ Landing Page ------------------------------ */}
                <Route 
                  path="/" 
                  element={
                    isAuth 
                    ? <AdminDashboard />
                    : <HomePage />
                  }
                />

                <Route 
                  path="/home" 
                  element={
                    isAuth
                    ? <AdminDashboard />
                    : <HomePage />
                  } 
                />

                <Route 
                  path="/skills" 
                  element={
                    isAuth
                    ? <Navigate to="/" />
                    : <SkillsPage />
                  } 
                />

                <Route 
                  path="/projects/:project" 
                  element={
                    isAuth 
                    ? <Navigate to="/" />
                    : <ProjectListPage />
                  } 
                />

                <Route 
                  path="/projects/:project/:id" 
                  element={
                    isAuth 
                    ? <Navigate to="/" />
                    : <ProjectDetailsPage />
                  }
                />

                <Route 
                  path="/contacts" 
                  element={
                    isAuth 
                    ? <Navigate to="/" />
                    : <ContactsPage />
                  }
                />

                {/* ---------------------------------- Auth ---------------------------------- */}
                <Route 
                  path="/login" 
                  element={
                    isAuth 
                    ? <Navigate to="/" />
                    : <LoginPage />
                  }
                />

                {/* ----------------------------- Verify Account ----------------------------- */}
                <Route 
                  path="/users/:id/verify/:token"
                  element={
                    isAuth 
                    ? <AdminDashboard />
                    : <EmailVerify />
                  }
                />

                {/* ----------------------------- Forgot Password ---------------------------- */}
                <Route 
                  path="/forgot-password"
                  element={<EmailForgotPassword />}
                />

                {/* ----------------------------- Reset Password ----------------------------- */}
                <Route 
                  path="/users/:id/reset-password/:token"
                  element={<ResetPassword />}
                />
                
                { /* ---------------------------------- Admin --------------------------------- */}
                
                {/* Admin Dashboard */}
                <Route 
                  path="/admin" 
                  element={
                    isAuth 
                    ? <AdminDashboard /> 
                    : <Navigate to="/" />
                  } 
                />

                {/* Admin Dashboard with / */}
                <Route 
                  path="/admin/dashboard" 
                  element={
                    isAuth 
                    ? <AdminDashboard /> 
                    : <Navigate to="/" />
                  } 
                />

                {/* Admin Websites */}
                <Route
                  path="/admin/websites"
                  element={
                    isAuth
                    ? <AdminWebsites />
                    : <Navigate to="/" />
                  }
                />

                {/* Admin Website Details */}
                <Route
                  path="/admin/websites/:id"
                  element={
                    isAuth
                    ? <AdminWebsiteDetails />
                    : <Navigate to="/" />
                  }
                />

                {/* Admin Mobiles */}
                <Route
                  path="/admin/mobiles"
                  element={
                    isAuth
                    ? <AdminMobiles />
                    : <Navigate to="/" />
                  } 
                />
                
                {/* Admin Mobile Details */}
                <Route
                  path="/admin/mobiles/:id"
                  element={
                    isAuth
                    ? <AdminMobileDetails />
                    : <Navigate to="/" />
                  }
                />
                
                {/* Admin Users */}
                <Route
                  path="/admin/users"
                  element={
                    isAuth 
                    ? <AdminUsers /> 
                    : <Navigate to="/" />
                  } 
                />
                
                {/* Admin Profile */}
                <Route
                  path="/admin/users/:id"
                  element={
                    isAuth 
                    ? <AdminUsersDetails /> 
                    : <Navigate to="/" />
                  } 
                />

                {/* -------------------------------- Not Found ------------------------------- */}
                <Route 
                  path='*' 
                  element={
                    isAuth 
                    ? <></>
                    : <NotFoundPage />
                  }
                />
                
              </Routes>
            </div>

          </div>
      
        </div>
      </BrowserRouter>

    </div>
  );
}

export default App;
