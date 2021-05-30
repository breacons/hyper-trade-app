import './App.css';

import React from 'react';

import { ComplexLoader } from './components/ComplexLoader';
import HyperPage from './pages/HyperPage';

function App() {
  return (
    <ComplexLoader>
      <HyperPage />
    </ComplexLoader>
  );
}

export default App;
