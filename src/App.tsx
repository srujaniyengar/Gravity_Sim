import React from 'react';
import { BrowserRouter, Routes, Route, HashRouter } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { TutorialPage } from './components/TutorialPage';
import { SandboxPage } from './components/SandboxPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tutorial" element={<TutorialPage />} />
        <Route path="/sandbox" element={<SandboxPage />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
