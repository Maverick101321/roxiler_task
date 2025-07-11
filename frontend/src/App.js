import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import StoresListPage from './pages/StoresListPage';
import StoreDetailPage from './pages/StoreDetailPage';
import CreateStorePage from './pages/CreateStorePage';
import EditStorePage from './pages/EditStorePage';
import RegistrationPage from './pages/RegistrationPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="page-container">
            <Routes>
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stores"
                element={
                  <ProtectedRoute>
                    <StoresListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stores/:id"
                element={
                  <ProtectedRoute>
                    <StoreDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-store"
                element={
                  <ProtectedRoute roles={['admin', 'store_owner']}>
                    <CreateStorePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stores/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditStorePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
