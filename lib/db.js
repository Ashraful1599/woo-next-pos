import Dexie from 'dexie';

const db = new Dexie('POSDatabase');

db.version(1).stores({
  products: '++id,name,price,categories',
  customers: '++id,firstName,lastName,email',
  categories: '++id,name',
  taxes: '++id,name,rate',
  heldCarts: '++id,items,discountType,discount,loyaltyPoints,totalAmount',
  carts: '++id,items,discountType,discount,loyaltyPoints,totalAmount',
  orders: '++id,orderData' // Adding orders store
});

export const addProductsToDB = async (products) => {
  await db.products.bulkPut(products);
};
export const addOrdersToDB = async (orderData) => {
  await db.orders.bulkPut(orderData);
};
export const addOrderToindexDB = async (orderData) => {
  const id = await db.orders.add(orderData);
  return id;
};

export const getProductsFromDB = async () => {
  return await db.products.toArray();
};

export const clearProductsFromDB = async () => {
  await db.products.clear();
};
export const clearOrdersFromDB = async () => {
  await db.orders.clear();
};

export const addTaxesToDB = async (taxes) => {
  await db.taxes.bulkPut(taxes);
};

export const getTaxesFromDB = async () => {
  return await db.taxes.toArray();
};

export const clearTaxesFromDB = async () => {
  await db.taxes.clear();
};

export const addCustomersToDB = async (customers) => {
  await db.customers.bulkPut(customers);
};

export const getCustomersFromDB = async () => {
  return await db.customers.toArray();
};

export const clearCustomersFromDB = async () => {
  await db.customers.clear();
};

export const addCategoriesToDB = async (categories) => {
  await db.categories.bulkPut(categories);
};

export const getCategoriesFromDB = async () => {
  return await db.categories.toArray();
};

export const clearCategoriesFromDB = async () => {
  await db.categories.clear();
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

// New Carts
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
  console.log('Deleting cart with id:', id);
  await db.carts.delete(id);
}

export const updateCart = async (id, updates) => {
  await db.carts.update(id, updates);
};
export const clearIndexCart = async () => {
  await db.carts.clear();
};

export const getOrders = async () => {
  return await db.orders.toArray();
};

export default db;
