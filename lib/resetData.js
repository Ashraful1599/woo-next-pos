// resetData.js
import db from '@/lib/db';
import { fetchAndSaveData } from '@/lib/dataService';
import { setLoading, setProgress, setMessage } from '@/lib/slices/loadingSlice';
import { setProducts } from '@/lib/slices/productsSlice';
import { toast } from 'react-toastify';
import { clearDatabase } from '@/lib/dbClearFunctions'

export const handleReset = async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setProgress("0%"));
    dispatch(setMessage(""));
    
    await clearDatabase();

    dispatch(setProducts([]));

    await fetchAndSaveData(dispatch);

    toast.dismiss();
    toast.success("All data fetched successfully");
    dispatch(setLoading(false));
    //const storedProducts = await db.products.toArray();
   // // console.log('storedProducts',storedProducts);
  //  dispatch(setProducts(storedProducts));
  } catch (error) {
    dispatch(setLoading(false));
    console.error('Error resetting database:', error);
    // console.log('Failed to reset data, please try again.');
  }
};
