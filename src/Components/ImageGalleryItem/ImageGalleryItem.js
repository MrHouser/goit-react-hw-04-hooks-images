import PropTypes from 'prop-types';
import s from './ImageGalleryItem.module.css';

const ImageGalleryItem = ({ url, tags, modalUrl, onClick }) => {
  return (
    <li className={s.ImageGalleryItem} onClick={() => onClick(modalUrl)}>
      <img src={url} alt={tags} className={s.ImageGalleryItemImage} />
    </li>
  );
};

export default ImageGalleryItem;

ImageGalleryItem.propTypes = {
  url: PropTypes.string.isRequired,
  tags: PropTypes.string,
  modalUrl: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
