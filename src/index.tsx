import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Game from './components/Game.tsx';
import reportWebVitals from './reportWebVitals.ts';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Video de fondo */}
      <video
        autoPlay
        loop
        muted
        className="fixed inset-0 w-full h-full object-cover opacity-10"
      >
        <source 
          src="https://assets.codepen.io/3364143/7btrrd.mp4" 
          type="video/mp4"
        />
      </video>

      {/* Overlay para oscurecer el video */}
      <div className="fixed inset-0 bg-black/50" />

      {/* Contenido */}
      <div className="relative flex flex-col justify-center min-h-screen">
        <Game />
      </div>
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
