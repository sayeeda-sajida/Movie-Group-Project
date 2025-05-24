import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import AddMovieForm from './AddMovieForm';
import '../css/NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => setShowPopup((prev) => !prev);

  return (
    <nav className="navbar">
      <div className="navbar-left" onClick={() => navigate('/')}>
        <FaHome className="navbar-icon" />
        <span className="navbar-title">My Movie Collection</span>
      </div>

      <button className="navbar-button" onClick={togglePopup}>
        Add Movie
      </button>

      <AddMovieForm isOpen={showPopup} onClose={togglePopup} />
    </nav>
  );
};

export default NavBar;
