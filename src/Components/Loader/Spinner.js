import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import s from './Spinner.module.css';

export default class Spinner extends Component {
  //other logic
  render() {
    return (
      <div className={s.Spinner}>
        <Loader type="ThreeDots" color="#3f51b5" height={100} width={100} />
      </div>
    );
  }
}
