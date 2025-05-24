import React, { useState, useEffect, useRef,useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import '../css/EditDelete.css';

function EditDeleteForm({ movie, onClose, onMovieUpdated, onMovieDeleted }) {
  const [form, setForm] = useState({ ...movie });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const modalRef = useRef();

  const validate = () => {
    const newErrors = {};
    if (!form.title) newErrors.title = 'Title is required';
    if (!form.release_year || form.release_year < 1900 || form.release_year > new Date().getFullYear()) {
      newErrors.release_year = 'Enter a valid year (1900 - present)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (rating) => {
    setForm((prev) => ({ ...prev, rating }));
  };

  const handleUpdate = async () => {
    if (!validate()) {
      toast.error("Please fix validation errors.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/movie/${movie.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success('Movie updated!');
        onMovieUpdated(form);
        navigate(`/movies/${movie.id}`);
      } else {
        toast.error(result.error || 'Update failed.');
      }
    } catch (err) {
      toast.error('Network error.');
    }
  };

  
 const handleKeyDown = useCallback((e) => {
  if (e.key === 'Escape') onClose();
}, [onClose]);

  useEffect(() => {
    const trapFocus = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        e.preventDefault();
        modalRef.current.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', trapFocus);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', trapFocus);
    };
  }, [handleKeyDown]);

  return (
    <AnimatePresence>
      <motion.div className="edit-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div
          className="edit-form__container"
          ref={modalRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeIn' }}
        >
          <h3>Edit Movie</h3>

          <label htmlFor="title">Title:</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <div className="error-msg">{errors.title}</div>}

          <label htmlFor="genre">Genre:</label>
          <select name="genre" value={form.genre} onChange={handleChange}>
            <option>Sci-Fi</option>
            <option>Drama</option>
            <option>Comedy</option>
            <option>Action</option>
            <option>Other</option>
          </select>

          <label htmlFor="release_year">Release Year:</label>
          <input
            id="release_year"
            name="release_year"
            type="number"
            value={form.release_year}
            onChange={handleChange}
            className={errors.release_year ? 'error' : ''}
          />
          {errors.release_year && <div className="error-msg">{errors.release_year}</div>}

          <label>Rating:</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleRatingClick(star)}
                className={star <= form.rating ? 'selected' : ''}
              >
                {star <= form.rating ? '★' : '☆'}
              </span>
            ))}
          </div>

         

          <label>Notes:</label>
          <textarea name="notes" rows="4" value={form.notes} onChange={handleChange} />

          <div className="buttons">
            <button className="save-btn" onClick={handleUpdate}>Save</button>
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
            
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default EditDeleteForm;
