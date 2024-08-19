// InvoicePopup.js
import React, { useRef, useState } from 'react';
import InvoiceContent from '@/components/InvoiceContent';

const InvoicePopup = ({ isOpen, onClose, invoiceData }) => {
  const iframeRef = useRef(null);
  const [showInvoice, setShowInvoice] = useState(false);

  if (!isOpen) return null;

  const printInvoice = () => {
    setShowInvoice(true);

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    doc.open();
    doc.write('<html><head><title></title>');
    doc.write(`
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 5px;
          font-size: 15px;
          width: 72mm;
          max-width: 72mm;
          margin: 0 auto;
        }
        title{
          text-align: right;
        }
        .invoice {
          width: 100%;
          max-width: 100%;
        }
        .text-right {
          text-align: right;
        }
        .text-center {
          text-align: center;
        }
        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          margin-bottom: 10px;
        }
        .invoice-table th, .invoice-table thead td {
          border-bottom: 1px solid #000;
        }
        .invoice-table th, .invoice-table td {
          padding: 2px;
        }
        .border-top {
          border-top: 1px solid #000;
          padding-top: 5px;
        }
        .invoice_head{
            display: flex;
            justify-content: space-between;
        }
      </style>
    `);
    doc.write('</head><body>');
    doc.write('<div class="invoice">' + document.getElementById('invoice').innerHTML + '</div>');
    doc.write('</body></html>');
    doc.close();

    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    setShowInvoice(false);  // Hide the invoice after printing
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Order Placed Successfully!</h2>
        <div id="invoice" style={{ display: showInvoice ? 'block' : 'none' }}>
          <InvoiceContent invoiceData={invoiceData} />
        </div>
        <button
          onClick={printInvoice}
          className="w-full py-2 mb-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Print Invoice
        </button>
        <button
          onClick={onClose}
          className="w-full py-2 mt-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Close
        </button>
      </div>
      <iframe ref={iframeRef} style={{ display: 'none', width: '100%' }}></iframe>
    </div>
  );
};

export default InvoicePopup;
