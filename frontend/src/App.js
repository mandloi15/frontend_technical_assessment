// App.js - Main application component
import React from 'react';
import { FlowCanvas } from './canvas/FlowCanvas';
import { Sidebar } from './canvas/Sidebar';

function App() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-900">
      {/* Sidebar with draggable nodes */}
      <Sidebar />
      
      {/* Main canvas area */}
      <div className="flex-1 relative">
        <FlowCanvas />
      </div>
    </div>
  );
}

export default App;
