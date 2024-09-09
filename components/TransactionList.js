import React from 'react';

const TransactionList = ({ transactions }) => {
  return (
    <div className="products_list overflow-auto">
      <h2 className="text-lg font-bold mb-4">Transactions</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Transaction ID</th>
            <th className="p-2">Order ID</th>
            <th className="p-2">In</th>
            <th className="p-2">Out</th>
            <th className="p-2">Method</th>
            {/* <th className="p-2">Reference</th> */}
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-b">
              <td className="p-2">#{transaction.id}</td>
              <td className="p-2">#{transaction.order_id || '-'}</td>
              <td className={`p-2 ${transaction.in > 0 ? 'text-teal-600' : ''}`}>
                +${Number(transaction.in).toFixed(2)}
              </td>
              <td className={`p-2 ${transaction.out > 0 ? 'text-red-600' : ''}`}>
                -${Number(transaction.out).toFixed(2)}
              </td>
              <td className="p-2">{transaction.method}</td>
              {/* <td className="p-2">{transaction.reference || '-'}</td> */}
              <td className="p-2">{new Date(transaction.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
