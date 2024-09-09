// dbClearFunctions.js
import db from '@/lib/db';

export const clearDatabase = async () => {
  await db.taxes.clear();
  await db.categories.clear();
  await db.products.clear();
  await db.customers.clear();
//  await db.outlet.clear(); //outlet load when cashier log in and clear when logout. 
  await db.orders.clear();
  await db.transactions.clear();
};