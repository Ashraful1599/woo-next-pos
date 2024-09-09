// pages/index.js
import React from 'react';
import HomeClient from "@/components/client/HomeClient";


export const metadata = {
  title: 'Dashboard',
  description: 'Description of the Home Page',
  keywords: 'home, nextjs, metadata',
};

const Home = () => {
  return (
    <div>
      <HomeClient />
    </div>
  );
}

export default Home;
