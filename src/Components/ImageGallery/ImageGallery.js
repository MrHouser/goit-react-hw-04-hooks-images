import { Component } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import Spinner from '../Loader/Spinner';
import Button from '../Button/Button';
import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';
import api from '../../api/apiService';
import s from './ImageGallery.module.css';
import Modal from '../Modal/Modal';

class ImageGallery extends Component {
  state = {
    pictures: null,
    error: null,
    status: 'idle',
    page: 1,
    isModalOpen: false,
    modalUrl: '',
  };

  componentDidUpdate(prevProps, prevState) {
    const { query } = this.props;
    const { page } = this.state;
    if (prevProps.query !== query) {
      this.setState({ pictures: null, status: 'pending', page: 1 });

      api
        .getPicturesByQuery(query, page)
        .then(pictures => {
          if (pictures.total === 0) {
            return toast.error(`No result for ${query}. Try another query`);
          }
          this.setState({
            pictures: pictures.hits,
          });
        })
        .catch(error => this.setState({ error, status: 'rejected' }))
        .finally(() =>
          this.setState(prevState => {
            return { status: 'idle', page: prevState.page + 1 };
          }),
        );
    }
  }

  getNextPagePictures = () => {
    const { page } = this.state;
    const { query } = this.props;

    this.setState({ status: 'pending' });

    api
      .getPicturesByQuery(query, page)
      .then(pictures => {
        if (pictures.hits.length === 0) {
          console.log('lenght 0');
          toast.warning(`No more pictures for "${query}" query`);
          return;
        }
        this.setState(prevState => {
          return {
            pictures: [...prevState.pictures, ...pictures.hits],
            page: prevState.page + 1,
          };
        });
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      })
      .catch(error => this.setState({ error, status: 'rejected' }))
      .finally(() => this.setState({ status: 'idle' }));
  };

  toggleModal = url => {
    this.setState(prevState => {
      return {
        isModalOpen: !prevState.isModalOpen,
        modalUrl: url,
      };
    });
  };

  render() {
    const { pictures, error, status, isModalOpen, modalUrl } = this.state;

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
                  onClick={this.toggleModal}
                />
              ))}
          </ul>
          {pictures && <Button onClick={this.getNextPagePictures} />}
          {isModalOpen && (
            <Modal closeModal={this.toggleModal} url={modalUrl} />
          )}
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
          <Button onClick={this.getNextPagePictures} />
        </>
      );
    }
  }
}

export default ImageGallery;

ImageGallery.propTypes = {
  query: PropTypes.string.isRequired,
};
