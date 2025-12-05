import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './widget/Header';
import Calculator from './calculator/ui/Calculator';
import Registration from './auth/ui/Registration';
import Login from './auth/ui/Login';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        
        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path='/login' element={<Login />} />
          <Route path='/registration' element={<Registration />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;