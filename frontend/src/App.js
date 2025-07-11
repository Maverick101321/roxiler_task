import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* We will add a home page route later */}
          <Route path="/" element={<h1>Welcome to the Store Rating App</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

