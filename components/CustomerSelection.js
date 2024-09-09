import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setSelectedCustomer, setCustomers } from "@/lib/slices/customersSlice";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import Cookies from "js-cookie";
import axios from "axios";
import config from "@/lib/config";
import { addCustomerToDB, getCustomersFromDB, updateCustomerToDB,deleteCustomersFromDB } from "@/lib/db";
import { toast } from "react-toastify";
import { setLoading, setMessage, setProgress } from "@/lib/slices/loadingSlice";

const CustomerSelection = ({ customers }) => {
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState(null);
  const [customerForm, setCustomerForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address_1: "",
    address_2: "",
    country: "",
    state: "",
    city: "",
    postcode: "",
  });

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSelectCustomer = (cust) => {
    dispatch(setSelectedCustomer(cust));
    router.push("/");
  };

  const handleCustomerEdit = (event, customer) => {
    event.stopPropagation();
    setIsEditMode(true);
    setCurrentCustomerId(customer.id);
    setCustomerForm({
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      phone: customer.phone,
      address_1: customer.address_1,
      address_2: customer.address_2,
      country: customer.country,
      state: customer.state,
      city: customer.city,
      postcode: customer.postcode,
    });
    setShowModal(true);
  };

  const handleCustomerDelete = async (event, custId) => {
    event.stopPropagation();
    const cashier_id = Cookies.get("user_id");
  
    // Ask for confirmation before deleting
    const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
    
    if (!confirmDelete) {
      return; // Exit the function if the user cancels the deletion
    }

    dispatch(setLoading(true));
    dispatch(
      setMessage("Deleting customer")
    );
    dispatch(setProgress(""));
  
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/delete-customer`,
        {
          cashier_id: cashier_id,
          customer_id: custId,
        },
        {
          withCredentials: true,
        }
      );
      // console.log('response data', response)
  
      const res = response.data;
      if (res) {
        await deleteCustomersFromDB(res);
        const updatedCustomers = await getCustomersFromDB();
        dispatch(setCustomers(updatedCustomers));
        dispatch(setLoading(false));
        toast.success("Customer deleted");
  
      } else {
        dispatch(setLoading(false));
        toast.warning("Something went wrong!");
      }
    } catch (error) {
      console.error(error);
      dispatch(setLoading(false));
      toast.error("Something went wrong!");
    }
  };
  

  const handleCustomerAdd = () => {
    setIsEditMode(false);
    setCurrentCustomerId('');
    setCustomerForm({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address_1: "",
      address_2: "",
      country: "",
      state: "",
      city: "",
      postcode: "",
    });
    setShowModal(true);
  };

  const handleSaveCustomer = async () => {
    dispatch(setLoading(true));
    dispatch(
      setMessage(isEditMode ? "Updating customer..." : "Saving customer...")
    );
    dispatch(setProgress(""));

    const cashier_id = Cookies.get("user_id");
    const outlet_id = Cookies.get("outlet_id");
    const customer_data = { ...customerForm, id: currentCustomerId };

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/manage-customer`,
        {
          cashier_id: cashier_id,
          outlet_id: outlet_id,
          customer_data: customer_data,
        },
        {
          withCredentials: true,
        }
      );
      // console.log(customer_data)
      // console.log(response)

      const res = response.data;
      if (res.success) {

        if(!isEditMode){
          await addCustomerToDB(res.data);
          const updatedCustomers = await getCustomersFromDB();
          dispatch(setCustomers(updatedCustomers));
          dispatch(setLoading(false));
          toast.success(res.message);
          setShowModal(false);
        }else{
          await updateCustomerToDB(currentCustomerId, res.data);
          const updatedCustomers = await getCustomersFromDB();
          dispatch(setCustomers(updatedCustomers));
          dispatch(setLoading(false));
          toast.success(res.message);
          setShowModal(false);
        }


      } else {
        dispatch(setLoading(false));
        toast.warning(res.message);
      }
    } catch (error) {
      console.error(error);
      dispatch(setLoading(false));
      toast.error("Something went wrong!");
    }
  };

  const handleChange = (e) => {
    setCustomerForm({
      ...customerForm,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="customer_lists overflow-auto">
      <div className="flex justify-between">
        <h2 className="text-lg font-bold mb-2">Customers</h2>
        <button
          className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg items-center mb-2 add_new_customer"
          onClick={handleCustomerAdd}
        >
          Add new customer
        </button>
      </div>
      <ul className="grid grid-cols-1 gap-2 overflow-auto">
        {customers.map((cust) => (
          <li
  onClick={() => handleSelectCustomer(cust)}
  key={cust.id}
  className="flex self-start items-center justify-betweenr gap-4 cursor-pointer"
>
  <div className="flex items-center gap-2 flex-auto w-1/2">
    <div className="w-16">
      <FaUserCircle className="w-full h-full" />
    </div>
    <div>
      <p className="font-bold capitalize">
        {cust.display_name
          ? cust.display_name
          : `${cust.first_name} ${cust.last_name}`}
      </p>
      <p className="text-sm">{cust.email}</p>
      <p className="text-sm">{cust.phone}</p>
    </div>
  </div>
  <div className="flex-1">
    Loyalty: <span className="font-bold">{Number(cust.customer_total_loyalty).toFixed(2) || 0.00}</span>
  </div>
  <div className="flex gap-4 customer_action flex-1">
    <button
      className="bg-teal-500 hover:bg-teal-600 text-white rounded-lg"
      onClick={(event) => handleCustomerEdit(event, cust)}
    >
      Edit
    </button>
    <button
      className="bg-red-500 hover:bg-red-600 text-white rounded-lg"
      onClick={(event) => handleCustomerDelete(event, cust.id)}
    >
      Delete
    </button>
  </div>
</li>

        ))}
      </ul>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit Customer" : "Add New Customer"}
            </h2>
            <form>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={customerForm.first_name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Enter First Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={customerForm.last_name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Enter Last Name"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={customerForm.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter Email"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={customerForm.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter Phone Number"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="address_1"
                  value={customerForm.address_1}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter Address Line 1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="address_2"
                  value={customerForm.address_2}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter Address Line 2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={customerForm.country}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Enter Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">State</label>
                  <input
                    type="text"
                    name="state"
                    value={customerForm.state}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Enter State"
                  />{" "}
                </div>{" "}
              </div>{" "}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {" "}
                <div>
                  {" "}
                  <label className="block text-sm font-medium">City</label>{" "}
                  <input
                    type="text"
                    name="city"
                    value={customerForm.city}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Enter City"
                  />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="block text-sm font-medium">
                    Postcode
                  </label>{" "}
                  <input
                    type="text"
                    name="postcode"
                    value={customerForm.postcode}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Enter Postcode"
                  />{" "}
                </div>{" "}
              </div>{" "}
              <div className="flex justify-end">
                {" "}
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 hover
text-white rounded-lg px-4 py-2 mr-2"
                >
                  Cancel
                </button>{" "}
                <button
                  type="button"
                  onClick={handleSaveCustomer}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-2"
                >
                  {isEditMode ? "Update Customer" : "Save Customer"}
                </button>{" "}
              </div>{" "}
            </form>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </div>
  );
};

export default CustomerSelection;
