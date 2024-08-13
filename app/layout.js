'use client';
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Head from "next/head";
const inter = Inter({ subsets: ["latin"] });
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from '@/lib/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function RootLayout({ children }) {
  const router = useRouter();
 
  // useEffect(() => {
  //   const token = localStorage.getItem('authToken');
  //   if (!token) {
  //     router.push('/login');
  //   }
  // }, [router]);

  // useEffect(() => {
  //   const token = document.cookie.split('; ').find(cookie => cookie.startsWith('authToken='));
  //   console.log('token');
  //   console.log(token);
  //   if (token) {
  //     router.push('/');
  //   } else {
  //     router.push('/login');
  //   }
  // }, [router]);







  return (
    <html lang="en">
      <Head>
        <title>Post application</title>
      </Head>
      <body className={inter.className + " overflow-hidden"}>
        <Provider store={store}>
          <div id="main" className="min-h-screenr bg-gray-100">
            {children}
          </div>
        </Provider>
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
      </body>
    </html>
  );
}
