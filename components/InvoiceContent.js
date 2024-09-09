import React from "react";
import { useQRCode } from "next-qrcode";
import { useBarcode } from "next-barcode";
import logo from "@/public/logo.svg";
import Image from "next/image";
import Cookies from "js-cookie";
import { FaUndo } from "react-icons/fa";
import config from "@/lib/config";

const InvoiceContent = ({ invoiceData, outletDetails }) => {
  const cashierName = Cookies.get("user_name");
  const { SVG } = useQRCode();
  const { inputRef } = useBarcode({
    value: `${invoiceData.id}`,
    options: {
      format: "CODE128", // Barcode format
      lineColor: "#000", // Line color
      width: 1, // Line width
      height: 35, // Barcode height
      displayValue: false, // Do not display the text below the barcode
    },
  });

  // Create a new Date object from the date string
  const date = new Date(invoiceData.order_date);

  // Extract and format the date
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  // Function to safely format a number to 2 decimal places
  const formatToFixed = (value) => {
    const num = Number(value);
    return !isNaN(num) ? num.toFixed(2) : "0.00";
};

  return (
    <div className="invoice">
      <h3 className="text-center invoice_txt">REÇU VENTE</h3>
      <Image
        width={logo.width}
        height={logo.height}
        src={logo.src}
        alt="Nutrizone Supplements"
        className="h-16 object-contain invoice_logo"
      />
      <p className="text-center outlet_name">
        <strong>{outletDetails.name}</strong>
        <br />
        <strong>{outletDetails.address1}</strong>
        <br />
        {outletDetails.phone}
      </p>

      <div className="invoice_head">
        <div className="invoice_head_left">
          <p>Order - #{invoiceData.order_id}</p>
          <p>Date: {formattedDate}</p>
          <p>
            Customer: {invoiceData?.billing?.fname} {invoiceData?.billing?.lname}
          </p>
        </div>
        <div style={{ textAlign: "right" }} className="invoice_head_right">
          <p>{invoiceData?.billing?.address1} </p>
          <p>Tel No: {invoiceData?.billing?.phone}</p>
        </div>
      </div>
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th className="text-right">Unit Price</th>
            <th className="text-right">Quantity</th>
            <th className="text-right">Total Price</th>
          </tr>
        </thead>

        <tbody>
          {invoiceData.products.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td className="text-right">${formatToFixed(item.uf)}</td>
              <td className="text-right">{item.quantity} {item.returned_quantity?(<span className="text-teal-500 flex items-center"><FaUndo className="ms-3 mr-1 -rotate-45"  />{item.returned_quantity}</span>): ""}</td>
              <td className="text-right">
                ${formatToFixed(item.uf * item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="table_footer">
        <p className="border-top">
          <span>SubTotal:</span>
          <span> ${formatToFixed(invoiceData.order_subtotal)}</span>
        </p>
        {invoiceData?.tax_lines?.map((item, index) => (
          <p key={index}>
            <span>Tax({item.label}):</span>
            <span> ${formatToFixed(item.total)}</span>
          </p>
        ))}
        <p>
          <span>Discount:</span>{" "}
          <span>-${formatToFixed(invoiceData.discount).replace("-", "")}</span>
        </p>
        <p className="border-top">
          <span>Total:</span> <span>${formatToFixed(invoiceData.order_total)}</span>
        </p>   
        {
          invoiceData.order_refunded !=0? (        
          <p className="border-top">
            <span>Refunded:</span> <span>${formatToFixed(invoiceData.order_refunded)}</span>
          </p>
          ) : ""
        }     

        {invoiceData.payment_methods.map((item, index) => (
          <p key={index}>
            <span>{item.name}:</span> <span>${formatToFixed(item.amount)}</span>
          </p>
        ))}
        <p>
          <span>Tendered:</span> <span>${formatToFixed(invoiceData.tendered)}</span>
        </p>
        <p>
          <span>Change:</span> <span>${formatToFixed(invoiceData.change)}</span>
        </p>
        <p>
          <span>Loyalty Earned:</span>{" "}
          <span>${formatToFixed(invoiceData.earned_loyalty)}</span>
        </p>
      </div>
      <div className="text-center footer_promotion">
        <p className="cashier">Cashier: {cashierName}</p>
        <div className="brcode_box">
          <Image alt="Logo" className="text-center brcode" ref={inputRef} />
        </div>
        {
          invoiceData.loyalty_claim?(
            <div className="qrcode_wrap">
            <p>
              Inscrivez-vous au Nutrizone Programme Points Fidélité. Register your
              details with the Nutrizone Loyalty Program: {config.loyaltySignUpLink}?order_id={invoiceData.order_id}&claim={invoiceData.loyalty_claim}
            </p>
            <SVG
              className="svgqrcode text-center"
              text={
                `${config.loyaltySignUpLink}?order_id=${invoiceData.order_id}&claim=${invoiceData.loyalty_claim}`
              }
              options={{
                margin: 2,
                width: 100,
                color: {
                  dark: "#000",
                  light: "#fff",
                },
              }}
            />
          </div>
  
          ): 
          ""
        }
    

      <div className="footer_bottom">
        <p>
          Merci de magasiner chez Nutrizone! Politique de Retour: Les achats sont echangeables (ou credit magasin) uniquement, dans leur condition originale, dans les 30 jours suivant la date de l&apos;achat de <strong>l&apos;original du reçu de caisse. www.nutrizonequebec.com</strong>

        </p>
        <p className="tps_tvq">
          T.P.S: [894630003RT0001]
          <br />
          T.V.Q: [1202786193TQ0001]
        </p>
      </div>







      </div>
    </div>
  );
};

export default InvoiceContent;
