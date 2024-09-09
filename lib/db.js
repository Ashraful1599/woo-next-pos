import Dexie from 'dexie';

const db = new Dexie('POSDatabase');

db.version(1).stores({
  carts: '++id,items,discountType,discount,loyaltyPoints,totalAmount',
  categories: '++id,name',
  countries_and_states: '++id',
  coupon: '++id',
  customers: '++id,firstName,lastName,email',
  discount: '++id',
  orders: '++id,orderData',
  outlet: 'id,name',
  products: '++id,name,price,categories',
  settings: '++id',
  taxes: '++id,label,rate,compound,shipping',
  temp: '++id',
  transactions: 'id,cashier_id,outlet_id,order_id,in,out,method,reference,date',
  heldCarts: '++id,items,discountType,discount,loyaltyPoints,totalAmount',
  offlineOrders: '++id'
});

// Carts
export const saveCart = async (cart) => {
  const id = await db.carts.add(cart);
  return id;
};

export const getCarts = async () => {
  return await db.carts.toArray();
};

export const getCart = async (id) => {
  return await db.carts.get(id);
};

export const deleteCart = async (id) => {
  // console.log('Deleting cart with id:', id);
  await db.carts.delete(id);
}

export const updateCart = async (id, updates) => {
  await db.carts.update(id, updates);
};

export const clearIndexCart = async () => {
  await db.carts.clear();
};

// Categories
export const addCategoriesToDB = async (categories) => {
  await db.categories.bulkPut(categories);
};

export const getCategoriesFromDB = async () => {
  return await db.categories.toArray();
};

export const clearCategoriesFromDB = async () => {
  await db.categories.clear();
};

// Countries and States
// No functions defined for countries_and_states

// Coupon
// No functions defined for coupon

// Customers
export const addCustomerToDB = async (customer) => {
  await db.customers.add(customer);
};
export const updateCustomerToDB = async (id, customer) => {
  await db.customers.update(id, customer);
};
export const addCustomersToDB = async (customers) => {
  await db.customers.bulkPut(customers);
};

export const getCustomersFromDB = async () => {
  return await db.customers.toArray();
};
export const getCustomerFromDB = async (custId) => {
  return await db.customers.get(custId);
};
export const deleteCustomersFromDB = async (custId) => {
  return await db.customers.delete(custId);
};

export const clearCustomersFromDB = async () => {
  await db.customers.clear();
};

// Discount
// No functions defined for discount

// Orders
export const addOrdersToDB = async (orderData) => {
  await db.orders.bulkPut(orderData);
};

export const addOrderToindexDB = async (orderData) => {
  return await db.orders.add(orderData);

};
export const updateOrderToindexDB = async (id, orderData) => {
  return await db.orders.update(id, orderData);

};

export const getOrders = async () => {
  return await db.orders.toArray();
};

export const clearOrdersFromDB = async () => {
  await db.orders.clear();
};

// Outlet
export const saveOutlet = async (outlet) => {
  return await db.outlet.add(outlet);
};

export const getOutlet = async (id) => {
  return await db.outlet.get(id);
};

export const clearOutlet = async () => {
  await db.outlet.clear();
};

// Products
export const addProductsToDB = async (products) => {
  await db.products.bulkPut(products);
};

export const getProductsFromDB = async () => {
  const products = await db.products.toArray();
  return products.filter(product => product.parent === 0);
};

export const getProductFromDB = async (id) => {
  return await db.products.get(id);
};

export const clearProductsFromDB = async () => {
  await db.products.clear();
};

// Settings
// No functions defined for settings

// Taxes
export const addTaxesToDB = async (taxes) => {
  await db.taxes.bulkPut(taxes);
};

export const getTaxesFromDB = async () => {
  return await db.taxes.toArray();
};

export const clearTaxesFromDB = async () => {
  await db.taxes.clear();
};

// Temp
// No functions defined for temp

// Transactions
export const addTransactionsToDB = async (transactions) => {
    // Convert 'id' values to numbers
    const updatedTransactions = transactions.map(transaction => ({
        ...transaction,
        id: parseInt(transaction.id, 10)
    }));
    // Sort the transactions by 'id'
    //updatedTransactions.sort((a, b) => a.id - b.id);

    // Bulk add the sorted transactions to IndexedDB
    try {
        await db.transactions.bulkPut(updatedTransactions);
        // console.log('Transactions successfully added in order');
    } catch (error) {
        console.error('Error occurred during bulk put operation:', error);
    }
};

export const getTransactions = async () => {
  return  await db.transactions.toArray();
};
export const addTransactionToindexDB = async (transaction) => {
  const updatedTransactions = {
    ...transaction,
    id: parseInt(transaction.id, 10)
};
  return await db.transactions.add(updatedTransactions);

};


// Held Carts
export const saveHeldCart = async (cart) => {
  const id = await db.heldCarts.add(cart);
  return id;
};

export const getHeldCarts = async () => {
  return await db.heldCarts.toArray();
};

export const getHeldCart = async (id) => {
  return await db.heldCarts.get(id);
};

export const deleteHeldCart = async (id) => {
  try {
    await db.heldCarts.delete(id);
  } catch (error) {
    console.error('Error deleting held cart:', error);
  }
};
// OfflineOrders
export const addOfflineOrdersToDB = async (orderData) => {
  await db.offlineOrders.bulkPut(orderData);
};

export const addOfflineOrderToindexDB = async (orderData) => {
  return await db.offlineOrders.add(orderData);

};
export const updateOfflineOrderToindexDB = async (id, orderData) => {
  return await db.offlineOrders.update(id, orderData);

};
export const deleteOfflineOrdertoDB = async(id) =>{
  return await db.offlineOrders.delete(id);
}

export const getOfflineOrders = async () => {
  return await db.offlineOrders.toArray();
};

export const clearOfflineOrdersFromDB = async () => {
  await db.offlineOrders.clear();
};





export default db;
