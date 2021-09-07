const BASE = {
  URL: 'https://pixabay.com/api/',
  KEY: '22353623-6201980fc547853fa44be7702',
  PER_PAGE: 12,
};

const getPicturesByQuery = (query, page) => {
  return fetch(
    `${BASE.URL}?q=${query}&page=${page}&key=${BASE.KEY}&image_type=photo&orientation=horizontal&per_page=${BASE.PER_PAGE}`,
  ).then(response => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(new Error(`Something went wrong...`));
  });
};

export default {
  getPicturesByQuery,
};
