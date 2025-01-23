   // src/App.tsx
   import React from 'react';
   import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
   import Home from './pages/Home';
   import Cities from './pages/Cities';
   import Sidebar from './components/Sidebar';
   import { WeatherProvider } from './context/WeatherContext';
   import './styles/index.css';
   const App: React.FC = () => {
     return (
       <WeatherProvider>
         <Router>
           <div className="app-container">
             <Sidebar />
             <div className="main-content">
               <Routes>
                 <Route path="/" element={<Home />} />
                 <Route path="/cities" element={<Cities />} />
               </Routes>
             </div>
           </div>
         </Router>
       </WeatherProvider>
     );
   };

   export default App;