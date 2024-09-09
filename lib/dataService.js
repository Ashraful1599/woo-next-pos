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
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { setTransactions } from "./slices/transactionsSlice";





// Fetch and save orders to IndexedDB
export const fetchAndSaveOrders = async (dispatch) => {
  
  const cashier_id = Cookies.get('user_id');
  const outlet_id = Cookies.get('outlet_id');
 // // console.log('cashier_id',outlet_id);


  try {
    const response = await axios.post(
      `${config.apiBaseUrl}/get-orders`,
      {
        cashier_id: cashier_id,
        per_page: -1,
        outlet_id: outlet_id,
      }, // The post data body, if any
      {
        withCredentials: true,
      }
    );
 //   // console.log(response.data);
  const data = response.data

  let allProducts = [];
  let page = 1;
  const totalProducts = data;
  const batchSize = 100;
  await clearOrdersFromDB();

  while (allProducts.length < totalProducts) {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/get-orders`,
        {
          cashier_id: cashier_id,
          current_page: page,
          per_page: batchSize,
          outlet_id: outlet_id,
        }, // The post data body, if any
        {
          withCredentials: true,
        }
      );



      const fetchedProducts = response.data;
      allProducts = [...allProducts, ...fetchedProducts];

      await addOrdersToDB(fetchedProducts);
      // console.log('Orders saved to IndexedDB');
      const calcProgress = Math.min((allProducts.length / totalProducts) * 100, 100);
      dispatch(setMessage(`Loading orders... ${calcProgress.toFixed(2)}%`));
      dispatch(setOrders(allProducts));
      dispatch(setProgress(`Total Orders Loaded: ${allProducts.length}/${totalProducts}`));

      page++;
      // Break the loop if there are no more products to fetch
      if (fetchedProducts.length === 0) {
        break;
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      break; // Stop the loop on error to avoid infinite calls
    }
  }



  } catch (error) {
    console.error("Error fetching orders:", error);
  }


};

// Fetch and save customers to IndexedDB
export const fetchAndSaveCustomers = async (dispatch) => {

  const cashier_id = Cookies.get('user_id');
  const outlet_id = Cookies.get('outlet_id');
  // console.log('cashier_id',outlet_id);


  const response = await axios.post(
    `${config.apiBaseUrl}/get-customers`,
    {
      cashier_id: cashier_id,
      per_page: -1,
      outlet_id: outlet_id,
    }, // The post data body, if any
    {
      withCredentials: true,
    }
  );
//   // console.log(response.data);
const data = response.data






  let allCustomers = [];
  let page = 1;
  const totalCustomers = data;
  const batchSize = 150;

  await clearCustomersFromDB();

  while (allCustomers.length < totalCustomers) {
    try {

      const response = await axios.post(
        `${config.apiBaseUrl}/get-customers`,
        {
          cashier_id: cashier_id,
          current_page: page,
          per_page: batchSize,
          outlet_id: outlet_id,
        }, // The post data body, if any
        {
          withCredentials: true,
        }
      );


      const fetchedCustomers = response.data;
      allCustomers = [...allCustomers, ...fetchedCustomers];

      await addCustomersToDB(fetchedCustomers);
      // console.log("Customers saved to IndexedDB");
      const calcProgress = Math.min(
        (allCustomers.length / totalCustomers) * 100,
        100
      );
      dispatch(setLoading(true));
      dispatch(setMessage(`Loading customers... ${calcProgress.toFixed(2)}%`));
      dispatch(setCustomers(allCustomers));
      dispatch(
        setProgress(
          `Total Customers Loaded: ${allCustomers.length}/${totalCustomers}`
        )
      );

      page++;

      if (fetchedCustomers.length === 0) {
        break;
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      break;
    }
  }
};

// Fetch and save products to IndexedDB
export const fetchAndSaveProducts = async (dispatch) => {

  const cashier_id = Cookies.get('user_id');
  const outlet_id = Cookies.get('outlet_id');
  // console.log('cashier_id',outlet_id);


  try {
    const response = await axios.post(
      `${config.apiBaseUrl}/get-products`,
      {
        cashier_id: cashier_id,
        per_page: -1,
        outlet_id: outlet_id,
      }, // The post data body, if any
      {
        withCredentials: true,
      }
    );
 //   // console.log(response.data);
  const data = response.data

  let allProducts = [];
  let page = 1;
  const totalProducts = data.total_products;
  const batchSize = 100;
  await clearProductsFromDB();

  while (allProducts.length < totalProducts) {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/get-products`,
        {
          cashier_id: cashier_id,
          current_page: page,
          per_page: batchSize,
          outlet_id: outlet_id,
        }, // The post data body, if any
        {
          withCredentials: true,
        }
      );



      const fetchedProducts = response.data;
      allProducts = [...allProducts, ...fetchedProducts];

      await addProductsToDB(fetchedProducts);
      // console.log('Products saved to IndexedDB');
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



  } catch (error) {
    console.error("Error fetching products:", error);
  }


};

// Fetch and save categories to IndexedDB
export const fetchAndSaveCategories = async (dispatch) => {
  
  const cashier_id = Cookies.get('user_id');
  const outlet_id = Cookies.get('outlet_id');
  // console.log('cashier_id',outlet_id);
  try {
    const response = await axios.post(
      `${config.apiBaseUrl}/get-product-categories`,
      {
        cashier_id: cashier_id,
        outlet_id: outlet_id,
      },
      {
        withCredentials: true,
      }
    );
  //  dispatch(setMessage(`Loading categories`));
    dispatch(setProgress(``));
    await db.categories.bulkPut(response.data);
    dispatch(setMessage(`Categories saved to IndexedDB`));
   // // console.log("Categories saved to IndexedDB");
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

// Fetch and save taxes to IndexedDB
export const fetchAndSaveTaxes = async (dispatch) => {
  
  const cashier_id = Cookies.get('user_id');
  const outlet_id = Cookies.get('outlet_id');
  // console.log('cashier_id',outlet_id);
  try {
    const response = await axios.post(
      `${config.apiBaseUrl}/get-products`,
      {
        cashier_id: cashier_id,
        per_page: -1,
        outlet_id: outlet_id,
      },
      {
        withCredentials: true
      }
    );

    const data = response.data;
    // console.log('Fetched data:', data);

    // Convert data.taxes from object to array
    const taxesArray = Object.keys(data.taxes).map(key => ({
      id: parseInt(key),
      ...data.taxes[key]
    }));

   // // console.log('taxesArray:', JSON.stringify(taxesArray, null, 2)); // Log the converted array

    if (Array.isArray(taxesArray)) {
   //    dispatch(setMessage(`Loading taxes`));
       dispatch(setProgress(``));
      await db.taxes.bulkPut(taxesArray);
      dispatch(setMessage(`Taxes saved to IndexedDB`));
      // console.log("Taxes saved to IndexedDB");
    } else {
      throw new Error('Expected taxesArray to be an array');
    }
  } catch (error) {
    console.error("Error fetching taxes:", error);
  }
};


export const fetchAndSaveTransactions = async (dispatch) => {
  
  const cashier_id = Cookies.get('user_id');
  const outlet_id = Cookies.get('outlet_id');
  function getFormattedDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based, hence the +1
    const day = String(today.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}
const todayDate = getFormattedDate();



  try {
    const response = await axios.post(
      `${config.apiBaseUrl}/get-transactions`,
      {
        cashier_id: cashier_id,
        date: todayDate,
        outlet_id: outlet_id,
      }, // The post data body, if any
      {
        withCredentials: true,
      }
    );
 //   // console.log(response.data);
  const data = response.data

  await addTransactionsToDB(data);
  // console.log('Transactions saved to IndexedDB', data);
  dispatch(setMessage(`Loading transactions...`));
  dispatch(setTransactions(data));
  dispatch(setProgress(`Total Transactions Loaded: ${data.length}`));

  } catch (error) {
    console.error("Error fetching transactions:", error);
  }


};




// Fetch all required data
export const fetchAndSaveData = async (dispatch) => {
  await fetchAndSaveTaxes(dispatch);
  await fetchAndSaveCategories(dispatch);
  await fetchAndSaveProducts(dispatch);
  await fetchAndSaveCustomers(dispatch);
  await fetchAndSaveOrders(dispatch);
  await fetchAndSaveTransactions(dispatch);
};
