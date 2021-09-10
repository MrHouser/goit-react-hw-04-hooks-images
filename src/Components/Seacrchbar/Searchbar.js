import { useState } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import s from './Searchbar.module.css';

function Searchbar({ onSubmit }) {
  const [value, setValue] = useState('');

  const handleInputChange = event => {
    setValue(event.target.value);
  };

  const reset = () => {
    setValue('');
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (value.trim() === '') {
      return toast.error('Enter query to search');
    }
    onSubmit(value);
    reset();
  };

  return (
    <header className={s.Searchbar}>
      <form className={s.SearchForm} onSubmit={handleSubmit}>
        <button type="submit" className={s.SearchFormButton}>
          <span className={s.SearchFormButtonLabel}>Search</span>
        </button>

        <input
          className={s.SearchFormInput}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={value}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
}

export default Searchbar;

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
