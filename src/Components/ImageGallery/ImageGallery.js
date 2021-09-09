import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import Spinner from '../Loader/Spinner';
import Button from '../Button/Button';
import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';
import api from '../../api/apiService';
import s from './ImageGallery.module.css';
import Modal from '../Modal/Modal';

function ImageGallery({ query }) {
  const [pictures, setPictures] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle');
  const [page, setPage] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalUrl, setModalUrl] = useState('');

  useEffect(() => {
    // setPictures(null);
    // setPage(1);

    if (query) {
      setStatus('pending');

      api
        .getPicturesByQuery(query, page)
        .then(pictures => {
          if (pictures.total === 0) {
            return toast.error(`No result for ${query}. Try another query`);
          }
          setPictures([...pictures.hits]);
        })
        .catch(error => {
          setError(error);
          setStatus('rejected');
        })
        .finally(() => {
          setPage(page => page + 1);
          setStatus('idle');
        });
    }
    console.log('finally', pictures);
  }, [query]);

  const getNextPagePictures = query => {
    setStatus('pending');

    api
      .getPicturesByQuery(query, page)
      .then(pictures => {
        if (pictures.hits.length === 0) {
          console.log('lenght 0');
          toast.warning(`No more pictures for "${query}" query`);
          return;
        }
        setPictures(pictures => [...pictures, pictures.hits]);
        setPage(page => page + 1);
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      })
      .catch(error => {
        setError(error);
        setStatus('rejected');
      })
      .finally(() => {
        setStatus('idle');
      });
  };

  const toggleModal = url => {
    setModalIsOpen(!modalIsOpen);
    setModalUrl(url);
  };

  if (status === 'idle') {
    return (
      <>
        <ul className={s.ImageGallery}>
          {pictures &&
            pictures.map(picture => (
              <ImageGalleryItem
                key={picture.id}
                url={picture.webformatURL}
                tags={picture.tags}
                modalUrl={picture.largeImageURL}
                onClick={toggleModal}
              />
            ))}
        </ul>
        {pictures && <Button onClick={getNextPagePictures} />}
        {modalIsOpen && <Modal closeModal={toggleModal} url={modalUrl} />}
      </>
    );
  }

  if (status === 'rejected') {
    return <h2>{error.message}</h2>;
  }

  if (status === 'pending') {
    return (
      <>
        <ul className={s.ImageGallery}>
          {pictures &&
            pictures.map(picture => (
              <ImageGalleryItem
                key={picture.id}
                url={picture.webformatURL}
                tags={picture.tags}
              />
            ))}
        </ul>
        <Spinner />
        <Button onClick={getNextPagePictures} />
      </>
    );
  }
}

export default ImageGallery;

ImageGallery.propTypes = {
  query: PropTypes.string.isRequired,
};
