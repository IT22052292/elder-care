import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateOrder(){

const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const { orderId } = useParams();

  useEffect(() => {
    try {
      const fetchOrders = async () => {
        const res = await fetch(`/API/order/getOrder?orderId=${orderId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.order[0]);
        }
      };
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  }, [orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault(); //prevent refreshing
    try {
      const res = await fetch(`/API/order/updateOrder/${formData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate("/dashboard?tab=orders");
      }
    } catch (error) {
      setPublishError("Error in submiting data!!!");
    }
  };


  return(

    <div>
     <h1 class="mb-6 mt-5 text-2xl text-center font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-3xl dark:text-white">Update Order Status</h1>
<form class="max-w-md mx-auto" onSubmit={handleSubmit}>
<div class="relative z-0 w-full mb-5 group">
   <input  disabled type="text" name="customerName" id="customerName" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required 
   value={formData.customerName}
   />
   <label for="customerName" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Customer Name</label>
</div>
<div class="relative z-0 w-full mb-5 group">
   <input  disabled type="text" name="customerEmail" id="customerEmail" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required 
   value={formData.customerEmail}
   />
   <label for="customerEmail" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Customer Email</label>
</div>

<div class="relative z-0 w-full mb-5 group">

<label     
 className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
> Services Requested </label>

{formData.orderItems && formData.orderItems.length > 0 && (
      formData.orderItems.map((item, index) => (
        <div key={index} className="relative z-0 w-full mb-5 group inline-flex">
          <input  
            disabled
            type="text"
            name={`itemName_${index}`}
            id={`itemName_${index}`}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={item.serviceName}
            required 
          />
          <input  
            disabled
            type="text"
            name={`itemPrice_${index}`}
            id={`itemPrice_${index}`}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=""
            value={`$ ${item.servicePrice}`}
            required 
          />
          
         
        </div>
      ))
    )}
    <div class="relative z-0 w-full mb-5 group">
   <input  disabled type="text" name="totalAmount" id="totalAmount" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="$" required 
   value={`$ ${formData.totalPrice}`}
   />
   <label for="totalAmount" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Total Amount</label>
</div>
<div class="relative z-0 w-full mb-5 group">

<label     
 className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
>Update order status here: </label>
    
<div class="flex items-center mb-4 ">
    <input 
    checked={formData.orderStatus === "Unfulfilled"} 
    onChange={(e) => setFormData({ ...formData, orderStatus: e.target.value })}
    id="default-radio-1" type="radio" value="Unfulfilled" name="default-radio" class="w-4 h-4 mt-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
    <label for="default-radio-1" class="ms-2 mt-5 text-sm font-medium text-gray-900 dark:text-gray-300">Unfulfilled</label>
</div>
<div class="flex items-center mb-4">
    <input 
    checked={formData.orderStatus === "On hold"} 
    onChange={(e) => setFormData({ ...formData, orderStatus: e.target.value })}
    id="default-radio-2" type="radio" value="On hold" name="default-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
    <label for="default-radio-2" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">On-hold</label>
</div>
<div class="flex items-center">
    <input 
    checked={formData.orderStatus === "Fulfilled"} 
    onChange={(e) => setFormData({ ...formData, orderStatus: e.target.value })}
    id="default-radio-3" type="radio" value="Fulfilled" name="default-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
    <label for="default-radio-3" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Fulfilled</label>
</div>

</div>
</div>




<button type="submit" class="text-white mx-auto bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
</form>
</div>
 )
}