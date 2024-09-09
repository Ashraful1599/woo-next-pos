// pages/login.js

import React from 'react';
import LoginClient from '@/components/client/LoginClient';

export const metadata = {
  title: 'Login',
  description: 'Description of the Login Page',
  keywords: 'login, nextjs, metadata',
};

const LoginPage = () => {
  return (
    <div>
      <LoginClient />
    </div>
  );
};

export default LoginPage;
