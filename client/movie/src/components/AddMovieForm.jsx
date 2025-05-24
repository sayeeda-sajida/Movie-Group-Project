import '../css/AddMovieForm.css';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Ratings from '../components/Ratings';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const currentYear = new Date().getFullYear();

const AddMovieForm = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    genre: '',
    release_year: '',
    notes: '',
    rating: 0,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setForm({
        title: '',
        genre: '',
        release_year: '',
        notes: '',
        rating: 0,
      });
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ];

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(focusableSelectors);
        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        } else if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      setTimeout(() => {
        const firstInput = modalRef.current?.querySelector('input, select, textarea, button');
        firstInput?.focus();
      }, 0);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const validateField = (name, value) => {
    let error = '';
    const trimmed = value.trim();

    if (name === 'title') {
      if (!trimmed) {
        error = 'Title is required.';
      } else if (/^-?\d+$/.test(trimmed)) {
        error = 'Title cannot contain only numbers.';
      } else if (/^-\d/.test(trimmed)) {
        error = 'Title cannot start with a negative number.';
      }
    }

    if (name === 'genre') {
      if (!trimmed) {
        error = 'Genre is required.';
      }
    }

    if (name === 'release_year') {
      const year = Number(value);
      if (!trimmed) {
        error = 'Release year is required.';
      } else if (isNaN(year) || year < 1900 || year > currentYear) {
        error = `Year must be between 1900 and ${currentYear}.`;
      }
    }

    if (name === 'notes') {
      const len = value.length;
      if (len > 0 && ( len > 300)) {
        error = 'Notes must be max 300 characters.';
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleRatingChange = (newRating) => {
    setForm((prev) => ({ ...prev, rating: newRating }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      if (key === 'rating') return;
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSend = {
      ...form,
      genre: form.genre.trim().toLowerCase(),
      
    };

    try {
      await axios.post('http://localhost:5000/movies', formDataToSend);
      toast.success('Movie saved successfully!');
      setForm({
        title: '',
        genre: '',
        release_year: '',
        notes: '',
        rating: 0,
      });
      setErrors({});
      onClose();
      navigate(0);
    } catch (error) {
      if (error.response?.data?.message) {
       toast.error('Error: ' + error.response.data.message);
      } else {
        toast.error('Network or server error occurred.');
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeIn' }}
        >
          <motion.div
            className="modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-movie-title"
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeIn' }}
          >
            <form onSubmit={handleSubmit} className="add-movie-form">
              <h2 id="add-movie-title">Add Movie</h2>

              <label htmlFor="title">Title *</label>
              <input
                type="text"
                name="title"
                id="title"
                aria-label="Movie title"
                placeholder="Enter movie title"
                value={form.title}
                onChange={handleChange}
                className={errors.title ? 'input-error' : ''}
              />
              {errors.title && <div className="error">{errors.title}</div>}

              <label htmlFor="genre">Genre *</label>
              <select
                name="genre"
                id="genre"
                aria-label="Genre"
                value={form.genre}
                onChange={handleChange}
                className={errors.genre ? 'input-error' : ''}
              >
                <option value="">Select Genre</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Drama">Drama</option>
                <option value="Comedy">Comedy</option>
                <option value="Action">Action</option>
                <option value="Other">Other</option>
              </select>
              {errors.genre && <div className="error">{errors.genre}</div>}

              <label htmlFor="release_year">Release Year *</label>
              <input
                type="text"
                name="release_year"
                id="release_year"
                aria-label="Release year"
                placeholder="Year between 1900 to 2025"
                value={form.release_year}
                onChange={handleChange}
                min="1900"
                max={currentYear}
                className={errors.release_year ? 'input-error' : ''}
              />
              {errors.release_year && <div className="error">{errors.release_year}</div>}

              <Ratings initialRating={form.rating} onRatingChange={handleRatingChange} />

              <label htmlFor="notes">Notes (optional)</label>
              <textarea
                name="notes"
                id="notes"
                aria-label="Movie notes"
                placeholder="Write something about the movie ( max 300 characters)..."
                value={form.notes}
                onChange={handleChange}
                rows="4"
                
                maxLength={300}
                className={errors.notes ? 'input-error' : ''}
              />
              {errors.notes && <div className="error">{errors.notes}</div>}

              <div className="form-actions">
                <button type="submit">Submit</button>
                <button type="button" onClick={onClose}>Cancel</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddMovieForm;