import React from 'react';
import { ToastContainer } from 'react-toastify';

import '../src/assets/styles/app.scss';
// import 'react-bnb-gallery/dist/style.css'

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <ToastContainer />
      <Component {...pageProps} />
    </>
  );
}
