import axios from "axios";
import config from "@/lib/config";
import db, {
  addOrdersToDB,
  getOrdersFromDB,
  clearOrdersFromDB,
  clearCustomersFromDB,
  addCustomersToDB,
  addProductsToDB,
  getProductsFromDB,
  clearProductsFromDB,
  addTaxesToDB,
  getTaxesFromDB,
  clearTaxesFromDB,
  addTransactionsToDB
} from "@/lib/db";
import { setOrders } from "./slices/ordersSlice";
import { setCustomers } from "./slices/customersSlice";
import { setProducts } from "./slices/productsSlice";
import { setLoading, setProgress, setMessage } from "./slices/loadingSlice";
import Cookies from "js-cookie";
import { setTransactions } from "./slices/transactionsSlice";

export const fetchAndSaveOrders = async (dispatch) => {
  try {
    const response = await axios.post(
      '/api/orders', // Call Next.js API route
      { per_page: -1 }, // You can adjust parameters as needed
      { withCredentials: true } // Necessary to send cookies along
    );

    const data = response.data;
    let allOrders = [];
    let page = 1;
    const totalOrders = data;
    const batchSize = 20;
    await clearOrdersFromDB();

    while (allOrders.length < totalOrders) {
      try {
        const batchResponse = await axios.post(
          '/api/orders',
          { current_page: page, per_page: batchSize },
          { withCredentials: true }
        );

        const fetchedOrders = batchResponse.data;
        allOrders = [...allOrders, ...fetchedOrders];

        await addOrdersToDB(fetchedOrders);
        dispatch(setOrders(allOrders));
        dispatch(setProgress(`Total Orders Loaded: ${allOrders.length}/${totalOrders}`));

        page++;
        if (fetchedOrders.length === 0) break;
      } catch (error) {
        console.error('Error fetching batch of orders:', error);
        break;
      }
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

export const fetchAndSaveCustomers = async (dispatch) => {
  try {
    const cashier_id = Cookies.get('user_id');
    const outlet_id = Cookies.get('outlet_id');

    const response = await axios.post(
      '/api/customers', // Call Next.js API route
      { cashier_id, outlet_id, per_page: -1 },
      { withCredentials: true }
    );

    const data = response.data;
    let allCustomers = [];
    let page = 1;
    const totalCustomers = data;
    const batchSize = 20;
    await clearCustomersFromDB();

    while (allCustomers.length < totalCustomers) {
      try {
        const batchResponse = await axios.post(
          '/api/customers',
          { cashier_id, outlet_id, current_page: page, per_page: batchSize },
          { withCredentials: true }
        );

        const fetchedCustomers = batchResponse.data;
        allCustomers = [...allCustomers, ...fetchedCustomers];

        await addCustomersToDB(fetchedCustomers);
        const calcProgress = Math.min((allCustomers.length / totalCustomers) * 100, 100);
        dispatch(setLoading(true));
        dispatch(setMessage(`Loading customers... ${calcProgress.toFixed(2)}%`));
        dispatch(setCustomers(allCustomers));
        dispatch(setProgress(`Total Customers Loaded: ${allCustomers.length}/${totalCustomers}`));

        page++;
        if (fetchedCustomers.length === 0) break;
      } catch (error) {
        console.error('Error fetching batch of customers:', error);
        break;
      }
    }
  } catch (error) {
    console.error('Error fetching customers:', error);
  }
};

export const fetchAndSaveProducts = async (dispatch) => {
  try {
    const cashier_id = Cookies.get('user_id');
    const outlet_id = Cookies.get('outlet_id');

    const response = await axios.post(
      '/api/products', // Call Next.js API route
      { cashier_id, outlet_id, per_page: -1 },
      { withCredentials: true }
    );

    const data = response.data;
    let allProducts = [];
    let page = 1;
    const totalProducts = data.total_products;
    const batchSize = 20;
    await clearProductsFromDB();

    while (allProducts.length < totalProducts) {
      try {
        const batchResponse = await axios.post(
          '/api/products',
          { cashier_id, outlet_id, current_page: page, per_page: batchSize },
          { withCredentials: true }
        );

        const fetchedProducts = batchResponse.data;
        allProducts = [...allProducts, ...fetchedProducts];

        await addProductsToDB(fetchedProducts);
        const calcProgress = Math.min((allProducts.length / totalProducts) * 100, 100);
        dispatch(setMessage(`Loading products... ${calcProgress.toFixed(2)}%`));
        dispatch(setProducts(allProducts));
        dispatch(setProgress(`Total Products Loaded: ${allProducts.length}/${totalProducts}`));

        page++;
        if (fetchedProducts.length === 0) break;
      } catch (error) {
        console.error('Error fetching batch of products:', error);
        break;
      }
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

export const fetchAndSaveCategories = async (dispatch) => {
  try {
    const cashier_id = Cookies.get('user_id');
    const outlet_id = Cookies.get('outlet_id');

    const response = await axios.post(
      '/api/categories', // Call Next.js API route
      { cashier_id, outlet_id },
      { withCredentials: true }
    );

    await db.categories.bulkPut(response.data);
    dispatch(setMessage(`Categories saved to IndexedDB`));
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

export const fetchAndSaveTaxes = async (dispatch) => {
  try {
    const cashier_id = Cookies.get('user_id');
    const outlet_id = Cookies.get('outlet_id');

    const response = await axios.post(
      '/api/taxes', // Call Next.js API route
      { cashier_id, outlet_id },
      { withCredentials: true }
    );

    const data = response.data;
    const taxesArray = Object.keys(data.taxes).map(key => ({
      id: parseInt(key),
      ...data.taxes[key]
    }));

    if (Array.isArray(taxesArray)) {
      await db.taxes.bulkPut(taxesArray);
      dispatch(setMessage(`Taxes saved to IndexedDB`));
    } else {
      throw new Error('Expected taxesArray to be an array');
    }
  } catch (error) {
    console.error("Error fetching taxes:", error);
  }
};

export const fetchAndSaveTransactions = async (dispatch) => {
  try {
    const cashier_id = Cookies.get('user_id');
    const outlet_id = Cookies.get('outlet_id');
    const todayDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    const response = await axios.post(
      '/api/transactions', // Call Next.js API route
      { cashier_id, date: todayDate, outlet_id },
      { withCredentials: true }
    );

    const data = response.data;
    await addTransactionsToDB(data);
    dispatch(setMessage(`Loading transactions...`));
    dispatch(setTransactions(data));
    dispatch(setProgress(`Total Transactions Loaded: ${data.length}`));
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
};

export const fetchAndSaveData = async (dispatch) => {
  await fetchAndSaveTaxes(dispatch);
  await fetchAndSaveCategories(dispatch);
  await fetchAndSaveProducts(dispatch);
  await fetchAndSaveCustomers(dispatch);
  await fetchAndSaveOrders(dispatch);
  await fetchAndSaveTransactions(dispatch);
};
