
// InvoicePopup.js
import React, { useRef, useEffect } from 'react';
import ReactToPrint from 'react-to-print';
import InvoiceContent from '@/components/InvoiceContent';

const InvoicePopup = ({ isOpen, onClose, invoiceData,outletDetails }) => {
  const componentRef = useRef();

  if (!isOpen) return null;



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Order Placed Successfully!</h2>
        <div id="invoice" style={{ display: 'none' }}>
          <div ref={componentRef}>
          
          {Object.keys(invoiceData).length> 0 && Object.keys(outletDetails).length> 0? <InvoiceContent invoiceData={invoiceData} outletDetails={outletDetails} /> : ""} 
          </div>
        </div>
        <ReactToPrint 
          trigger={() => (
            <button
              className="w-full py-2 mb-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            >
              Print Invoice
            </button>
          )}
          content={() => componentRef.current}
        />
        <button
          onClick={onClose}
          className="w-full py-2 mt-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default InvoicePopup;
