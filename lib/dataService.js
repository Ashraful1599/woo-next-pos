import axios from 'axios';
import config from '@/lib/config';
import db, {
  addOrdersToDB, getOrdersFromDB, clearOrdersFromDB,
  clearCustomersFromDB, addCustomersToDB,
  addProductsToDB, getProductsFromDB, clearProductsFromDB,
  addTaxesToDB, getTaxesFromDB, clearTaxesFromDB
} from '@/lib/db';
import { setOrders } from './slices/ordersSlice';
import { setCustomers } from './slices/customersSlice';
import { setProducts } from './slices/productsSlice';
import { setLoading, setProgress, setMessage } from './slices/loadingSlice';
import { toast } from 'react-toastify';

// Fetch and save orders to IndexedDB
export const fetchAndSaveOrders = async (dispatch) => {
    let allOrders = [];
    let page = 1;
    const totalOrders = 50; // Adjust based on your needs
    const batchSize = 20;
  
    // Clear old orders in IndexedDB
    await clearOrdersFromDB();
  
    while (allOrders.length < totalOrders) {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/orders`, {
          params: {
            per_page: batchSize,
            page
          },
          auth: config.auth
        });
        console.log(response);
        const fetchedOrders = response.data;
        allOrders = [...allOrders, ...fetchedOrders];
  
        // Store orders in IndexedDB
        await addOrdersToDB(fetchedOrders);
        console.log(fetchedOrders);
        console.log('Orders saved to IndexedDB');
        const calcProgress = Math.min((allOrders.length / totalOrders) * 100, 100);
        dispatch(setMessage(`Loading orders... ${calcProgress.toFixed(2)}%`));
        dispatch(setOrders(allOrders));
        dispatch(setProgress(`Total Orders Loaded: ${allOrders.length}/${totalOrders}`));
  
        page++;
  
        // Break the loop if there are no more orders to fetch
        if (fetchedOrders.length === 0) {
          break;
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        break; // Stop the loop on error to avoid infinite calls
      }
    }
};

// Fetch and save customers to IndexedDB
export const fetchAndSaveCustomers = async (dispatch) => {
  let allCustomers = [];
  let page = 1;
  const totalCustomers = 40;
  const batchSize = 20;
  
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
  
      await addCustomersToDB(fetchedCustomers);
      console.log('Customers saved to IndexedDB');
      const calcProgress = Math.min((allCustomers.length / totalCustomers) * 100, 100);
      dispatch(setMessage(`Loading customers... ${calcProgress.toFixed(2)}%`));
      dispatch(setCustomers(allCustomers));
      dispatch(setProgress(`Total Customers Loaded: ${allCustomers.length}/${totalCustomers}`));
  
      page++;
  
      if (fetchedCustomers.length === 0) {
        break;
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      break;
    }
  }
};

// Fetch and save products to IndexedDB
export const fetchAndSaveProducts = async (dispatch) => {
    let allProducts = [];
    let page = 1;
    const totalProducts = 60;
    const batchSize = 20;
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
        break; // Stop the loop on error to avoid infinite calls
      }
    }
};

// Fetch and save categories to IndexedDB
export const fetchAndSaveCategories = async (dispatch) => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/products/categories`, {
      auth: config.auth
    });
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
    const response = await axios.get(`${config.apiBaseUrl}/taxes`, {
      auth: config.auth
    });
    dispatch(setMessage(`Loading taxes`));
    dispatch(setProgress(``));
    await db.taxes.bulkPut(response.data);
    console.log('Taxes saved to IndexedDB');
  } catch (error) {
    console.error('Error fetching taxes:', error);
  }
};

// Fetch all required data
export const fetchAndSaveData = async (dispatch) => {
  await fetchAndSaveProducts(dispatch);
  await fetchAndSaveCustomers(dispatch);
  await fetchAndSaveCategories(dispatch);
  await fetchAndSaveTaxes(dispatch);
};
