import { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import Searchbar from './Components/Seacrchbar/Searchbar';
import 'react-toastify/dist/ReactToastify.css';
import ImageGallery from './Components/ImageGallery/ImageGallery';

class App extends Component {
  state = {
    query: '',
  };

  componentDidMount() {}

  handleFormSubmit = query => {
    this.setState({ query });
  };

  render() {
    return (
      <div className="App">
        <Searchbar onSubmit={this.handleFormSubmit} />
        <ImageGallery query={this.state.query} />
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    );
  }
}

export default App;
