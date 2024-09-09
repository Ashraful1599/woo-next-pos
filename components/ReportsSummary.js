import React from 'react';

const Reports = ({ reports }) => {

  const openCashDrawerAmount = reports.find(t => t.method === 'opencash')?.in || 0;
  const cashTransactions = reports.filter(t => t.method === 'cash');
  const cashIn = cashTransactions.reduce((total, t) => total + parseFloat(t.in || 0), 0);
  const cashOut = cashTransactions.reduce((total, t) => total + parseFloat(t.out || 0), 0);
  const todaysCashSale = cashIn - cashOut;  
  
  const loyaltyTransactions = reports.filter(t => t.method === 'loyalty');
  const loyaltyIn = loyaltyTransactions.reduce((total, t) => total + parseFloat(t.in || 0), 0);
  const loyaltyOut = loyaltyTransactions.reduce((total, t) => total + parseFloat(t.out || 0), 0);
  const todaysloyaltySale = loyaltyIn - loyaltyOut;

  const totalIn = reports.reduce((total, t) => total + parseFloat(t.in || 0), 0);
  const totalOut = reports.reduce((total, t) => total + parseFloat(t.out || 0), 0);
  const todaysTotalSale = totalIn - totalOut - openCashDrawerAmount;

  const expectedDrawerAmount = parseFloat(openCashDrawerAmount) + todaysCashSale;

  return (
    <div className="grid grid-cols-5 gap-4 mb-4 reports">
      <div className="bg-white p-4 rounded shadow-lg text-center">
        <h3 className="text-gray-700">Open Cash Drawer Amount</h3>
        <p className="text-red-600 text-2xl">${Number(openCashDrawerAmount).toFixed(2)}</p>
      </div>
      <div className="bg-white p-4 rounded shadow-lg text-center">
        <h3 className="text-gray-700">{"Today's Cash Sale"}</h3>
        <p className="text-teal-600 text-2xl">${Number(todaysCashSale).toFixed(2)}</p>
      </div>      
      <div className="bg-white p-4 rounded shadow-lg text-center">
        <h3 className="text-gray-700">{"Today's Loyalty Sale"}</h3>
        <p className="text-green-600 text-2xl">${Number(todaysloyaltySale).toFixed(2)}</p>
      </div>
      <div className="bg-white p-4 rounded shadow-lg text-center">
        <h3 className="text-gray-700">{"Today's Total Sale"}</h3>
        <p className="text-blue-600 text-2xl">${Number(todaysTotalSale).toFixed(2)}</p>
      </div>
      <div className="bg-white p-4 rounded shadow-lg text-center">
        <h3 className="text-gray-700">Expected Drawer Amount</h3>
        <p className="text-yellow-600 text-2xl">${Number(expectedDrawerAmount).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Reports;
