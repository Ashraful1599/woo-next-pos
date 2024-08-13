
// ResetButton.js
import React from 'react';
import db from '@/lib/db';
import { fetchAndSaveProducts, fetchAndSaveCustomers, fetchAndSaveCategories, fetchAndSaveTaxes, fetchAndSaveData } from '@/lib/dataService';
import { useSelector } from 'react-redux';
import { setLoading, setProgress, setMessage } from '@/lib/slices/loadingSlice';
import { useDispatch } from 'react-redux';
import { setProducts } from '@/lib/slices/productsSlice';
import { toast } from 'react-toastify';
const ResetButton = () => {
  const dispatch = useDispatch();
  const { items, loading, progress } = useSelector((state) => state.products);

    const handleReset = async () => {
        try {
          dispatch(setLoading(true)); // Begin loading state
          dispatch(setProgress("0%"));
          dispatch(setMessage(""));
          await db.products.clear();
          await db.customers.clear();
          await db.categories.clear();
          await db.taxes.clear();
          // Clear other necessary databases here
          const storedProducts = await db.products.toArray();
          dispatch(setProducts(storedProducts));
    
          await fetchAndSaveData(dispatch);
        //  dispatch(setLoading(false)); // Begin loading state
          console.log('Data refreshed from WooCommerce successfully!');

          toast.dismiss();
       //   dispatch(setLoading(true));
          toast.success("All data fetched successfully");

          const storedProducts2 = await db.products.toArray();
          dispatch(setProducts(storedProducts2));
        } catch (error) {
          dispatch(setLoading(false)); // Begin loading state
          console.error('Error resetting database:', error);
          console.log('Failed to reset data, please try again.');
        }
      };

  return (
    <button onClick={handleReset} className=" mt-4">
      Reset Data
    </button>
  );
};

export default ResetButton;
