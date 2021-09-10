import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Searchbar from './Components/Seacrchbar/Searchbar';
import 'react-toastify/dist/ReactToastify.css';
import ImageGallery from './Components/ImageGallery/ImageGallery';

function App() {
  const [query, setQuery] = useState('');

  const handleFormSubmit = query => {
    setQuery(query);
  };

  return (
    <div className="App">
      <Searchbar onSubmit={handleFormSubmit} />
      <ImageGallery query={query} />
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default App;
