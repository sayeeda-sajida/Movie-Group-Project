// src/App.js
//import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './css/App.css'
import MovieList from './components/MovieList';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import { Toaster } from 'react-hot-toast';
//import { Toaster } from 'react-hot-toast';
//import AddMovieForm from './components/AddMovieForm'; // Assumes a modal form

function App() {


  return (
    
    <Router>
      <div>
      <NavBar></NavBar>
<Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<HomePage />} />
           <Route path="/movies/:id" element={<MovieDetailsPage />} />
        <Route path="/movielist" element={<MovieList />} />
        </Routes>
        
      </div>
    </Router>
    
  );
}

export default App;
