import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatBot from './components/ChatBot';
import HelpPage from './components/HelpPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Main page with chatbot */}
          <Route path="/" element={
            <div>
              {/* Your main content here */}
              <ChatBot />
            </div>
          } />
          
          {/* Help page */}
          <Route path="/help" element={<HelpPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;