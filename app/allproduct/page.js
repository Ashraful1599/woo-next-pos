"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
const MyComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Background data fetch

      const fetchProduct = async () => {
        const response = await axios.get(`http://localhost/pos/wp-json/wc/v3/products/`, {
            auth: {
              username: 'ck_5e371a1274c6e40c395bf5418489e6afdc5f447f',
              password: 'cs_48f7627d826cd209f345f05c3d40f96d4a2d76fa'
            },
            params: { 
                per_page: '100' 
            }  // Parameters added to the request URL
          });
          setData(response.data);  // Set the fetched data to state
          setLoading(false);  // Loading done
          // console.log(response.data);
         // return response.data;
      };
  
      fetchProduct();



  }, []);  // Empty dependency array means this effect runs once after initial render

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {/* Render your data here */}
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default MyComponent;
