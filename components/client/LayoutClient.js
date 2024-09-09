// components/ClientProvider.js

'use client';
import { Provider } from 'react-redux';
import store from '@/lib/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '@/components/Loading';

const ClientProvider = ({ children }) => {



  return (
    <Provider store={store}>
      {children}
      <Loading />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Provider>
  );
}

export default ClientProvider;
