import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import Spinner from '../Loader/Spinner';
import Button from '../Button/Button';
import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';
import api from '../../api/apiService';
import s from './ImageGallery.module.css';
import Modal from '../Modal/Modal';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

function ImageGallery({ query }) {
  const [pictures, setPictures] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(Status.IDLE);
  const [page, setPage] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalUrl, setModalUrl] = useState('');

  useEffect(() => {
    if (!query) {
      return;
    }
    setStatus(Status.PENDING);

    api
      .getPicturesByQuery(query, 1)
      .then(pictures => {
        if (pictures.total === 0) {
          return toast.error(`No result for "${query}". Try another query`);
        }
        setPictures(pictures.hits);
      })
      .catch(error => {
        setError(error);
        setStatus(Status.REJECTED);
      })
      .finally(() => {
        setStatus(Status.RESOLVED);
        setPage(2);
      });
  }, [query]);

  const getNextPagePictures = () => {
    setStatus('pending');

    api
      .getPicturesByQuery(query, page)
      .then(result => {
        if (result.hits.length === 0) {
          toast.warning(`No more pictures for "${query}" query`);
          return;
        }
        setPictures(pictures => [...pictures, ...result.hits]);
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      })
      .catch(error => {
        setError(error);
        setStatus(Status.REJECTED);
      })
      .finally(() => {
        setPage(page + 1);
      });
    setStatus(Status.RESOLVED);
  };

  const toggleModal = url => {
    setModalIsOpen(!modalIsOpen);
    setModalUrl(url);
  };

  if (status === Status.IDLE) {
    return null;
  }

  if (status === Status.RESOLVED || status === Status.PENDING) {
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
        {status === Status.PENDING && <Spinner />}
        {pictures && <Button onClick={getNextPagePictures} />}

        {modalIsOpen && <Modal closeModal={toggleModal} url={modalUrl} />}
      </>
    );
  }

  if (status === Status.REJECTED) {
    return <h2>{error.message}</h2>;
  }
}

export default ImageGallery;

ImageGallery.propTypes = {
  query: PropTypes.string.isRequired,
};
