
// dataService.js
import axios from 'axios';
import config from '@/lib/config';
import db, {addProductsToDB, getProductsFromDB, clearProductsFromDB, clearCustomersFromDB, addCustomersToDB, getCustomersFromDB, addTaxesToDB, getTaxesFromDB, clearTaxesFromDB} from '@/lib/db';
import { setProducts } from './slices/productsSlice';
import { setCustomers } from './slices/customersSlice';
import { setLoading, setProgress, setMessage } from './slices/loadingSlice';
import { toast } from 'react-toastify';





// Fetch and save products to IndexedDB
export const fetchAndSaveProducts = async (dispatch) => {



    let allProducts = [];
    let page = 1;
    const totalProducts = 60;  // Total number of products to fetch
    const batchSize = 20;  // Number of products to fetch per batch
    // Clear old products in IndexedDB
    await clearProductsFromDB();

    while (allProducts.length < totalProducts) {
      try {
        
        const response = await axios.get(`${config.apiBaseUrlV1}/products`, {
          params: {
            per_page: batchSize,
            page
          },
          auth: config.auth
        });

        const fetchedProducts = response.data;
        allProducts = [...allProducts, ...fetchedProducts];

        // Store products in IndexedDB
        await addProductsToDB(fetchedProducts);
        console.log('Products saved to IndexedDB');
        const calcProgress = Math.min((allProducts.length / totalProducts) * 100, 100);
        dispatch(setMessage(`Loading products... ${calcProgress.toFixed(2)}%`));
        dispatch(setProducts(allProducts));
        
         dispatch(setProgress(`Total Products Loaded: ${allProducts.length}/${totalProducts}`));
        
        page++;
        
        // Break the loop if there are no more products to fetch
        if (fetchedProducts.length === 0) {
          break;
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        break;  // Stop the loop on error to avoid infinite calls
      }
    }



  
};

// Fetch and save customers to IndexedDB
export const fetchAndSaveCustomers = async (dispatch) => {
  // try {
  //   const response = await axios.get(`${config.apiBaseUrl}/customers`, { auth: config.auth });
  //   dispatch(setMessage(`Loading customers`));
  //   dispatch(setProgress(``));
  //   await db.customers.bulkPut(response.data);
  //   console.log('Customers saved to IndexedDB');
  // } catch (error) {
  //   console.error('Error fetching customers:', error);
  // }


  let allCustomers = [];
  let page = 1;
  const totalCustomers = 40;  // Total number of products to fetch
  const batchSize = 20;  // Number of products to fetch per batch
  // Clear old products in IndexedDB
  await clearCustomersFromDB();

  while (allCustomers.length < totalCustomers) {
    try {
      
      const response = await axios.get(`${config.apiBaseUrlV1}/customers`, {
        params: {
          per_page: batchSize,
          page
        },
        auth: config.auth
      });

      const fetchedCustomers = response.data;
      allCustomers = [...allCustomers, ...fetchedCustomers];

      // Store products in IndexedDB
      await addCustomersToDB(fetchedCustomers);
      console.log('Customers saved to IndexedDB');
      const calcProgress = Math.min((allCustomers.length / totalCustomers) * 100, 100);
      dispatch(setMessage(`Loading customers... ${calcProgress.toFixed(2)}%`));
      dispatch(setCustomers(allCustomers));
      
       dispatch(setProgress(`Total Customers Loaded: ${allCustomers.length}/${totalCustomers}`));
      
      page++;
      
      // Break the loop if there are no more products to fetch
      if (fetchedCustomers.length === 0) {
        break;
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      break;  // Stop the loop on error to avoid infinite calls
    }
  }





};

// Fetch and save categories to IndexedDB
export const fetchAndSaveCategories = async (dispatch) => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/products/categories`, { auth: config.auth });
    dispatch(setMessage(`Loading categories`));
    dispatch(setProgress(``));
    await db.categories.bulkPut(response.data);
    console.log('Categories saved to IndexedDB');
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

// Fetch and save taxes to IndexedDB
export const fetchAndSaveTaxes = async (dispatch) => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/taxes`, { auth: config.auth });
    dispatch(setMessage(`Loading taxes`));
    dispatch(setProgress(``));
    await db.taxes.bulkPut(response.data);
    console.log('Taxes saved to IndexedDB');
  } catch (error) {
    console.error('Error fetching taxes:', error);
  }
};

// export const closeToastNotify = async (dispatch)=>{
//   toast.dismiss();
//   dispatch(setLoading(true));
//   toast.success("All data fetched successfully");
// }

// Fetch all required data
export const fetchAndSaveData = async (dispatch) => {
  
  await fetchAndSaveProducts(dispatch);
  await fetchAndSaveCustomers(dispatch);
  await fetchAndSaveCategories(dispatch);
  await fetchAndSaveTaxes(dispatch);
 // await closeToastNotify(dispatch);
  // Add other fetch and save function calls here
};



