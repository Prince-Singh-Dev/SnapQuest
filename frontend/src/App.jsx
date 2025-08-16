import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './index.css';

function App(){
  return (
    <div className = "min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className = "bg-white p-8 rounded-2x1 shadow-lg text-center">
        <h1 className = " bg-blue-500 text-white p-6 rounded-lg text-4xl font-bold text-gray-800 mb-4">
          Tailwind is Working !
        </h1>
        <p className="text-lg text-gray-600">
          If you see this styled box, Tailwind CSS is set up correctly
        </p>
      </div>
    </div>
  );
}

export default App;
