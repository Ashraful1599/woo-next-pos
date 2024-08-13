// InvoiceContent.js
import React from "react";

const InvoiceContent = ({ invoiceData }) => {
  return (
    <div id="invoice" className="invoice">
      <h3 className="text-center">REÇU VENTE</h3>
      <p className="text-center">
        Nutrizone Hochelaga
        <br />
        4305 rue Hochelaga
        <br />
        514-253-8008
      </p>

      <div className="invoice_head">
        <div>
          <p>Order - #{invoiceData.orderId}</p>
          <p>Date: {invoiceData.date}</p>
          <p>Customer: {invoiceData.billing.first_name} {invoiceData.billing.last_name}</p>
        </div>
        <div>
          <p style={{textAlign: 'right'}}>
            4305 
            <br/>
            HOCHELAGA
            <br />
            Montreal QC
          </p>
          <p>Tel No: </p>
        </div>
      </div>

      <table className="invoice-table">
        <thead>
          <tr>
            <th>Product</th>
            <th className="text-right">U.Price</th>
            <th className="text-right">Qty</th>
            <th className="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.items.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td className="text-right">${item.price}</td>
              <td className="text-right">{item.quantity}</td>
              <td className="text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-top">SubTotal: ${invoiceData.subTotal}</p>
      {invoiceData.tax.map((item, index)=>(
        <p key={index}>Tax({item.label}): ${item.tax_total}</p>
      ))}
      <p>Discount: ${invoiceData.discount}</p>
      <p className="border-top">Total: ${invoiceData.total}</p>
      <p>Cash Payment: ${invoiceData.cashPayment}</p>
      <p>Other Payments: {invoiceData.otherPayments}</p>
      <p>Change: ${invoiceData.change}</p>
      <p>Loyalty Earned: ${invoiceData.loyaltyEarned}</p>
      <p className="text-center">Merci de magasiner chez Nutrizone!</p>
      <p className="text-center">
        Politique de Retour: 
      </p>
    </div>
  );
};

export default InvoiceContent;
