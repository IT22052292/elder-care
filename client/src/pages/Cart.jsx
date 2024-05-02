import React, {useState} from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

export default function Cart() {
  //Retrieve cart details from session storage
  const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
  const total = JSON.parse(sessionStorage.getItem("total")) || 0;
  console.log("Retrieved cart from sessionStorage:", cart);
  console.log("Retrieved total from sessionStorage:", total);
  const { currentUser } = useSelector((state) => state.user);
  const [showConfirmation, setShowConfirmation] = useState(false);

  //Function to remove an item 
  const removeFromCart = (index, price) => {
    const updatedCart = [...cart];
    const removedItem = updatedCart.splice(index, 1)[0]; // Remove item at index and get the removed item
    sessionStorage.setItem("cart", JSON.stringify(updatedCart)); // Update session storage
  
    //the total reduction when item removed
    const newTotal = total - removedItem.servicePrice;
    sessionStorage.setItem("total", JSON.stringify(newTotal)); // Update session storage with new total
  
    //refresh to reload cart page
    window.location.reload(); 
  };
  
  const handleCheckout = async () => {
    setShowConfirmation(true);
  };
  const confirmOrder = async()=>{
    try {
      const orderItems = cart.map((item) => ({
        serviceName: item.serviceName,
        servicePrice: item.servicePrice,
      }));

      const orderData = {
        customerName: currentUser.username,
        orderItems: orderItems, 
        totalPrice: total,
        customerEmail: currentUser.email, 
      };
      await axios.post('/API/order/createOrder',orderData);
      
      // Clear cart and total from session storage
      sessionStorage.removeItem("cart");
      sessionStorage.removeItem("total");

      console.log('Order saved successfully');
      
      window.location.href = "/dashboard?tab=profile"; // Change the URL to your user profile page
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  return (
    <section class="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div class="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Shopping Cart</h2>

        <div class="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8" >
          <div class="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div class="space-y-6">
              {cart.map((service, index) => (
                <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6" key={index}>
                  <div class="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                    <a href="#" class="shrink-0 md:order-1">
                      <img class="h-20 w-20 dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg" alt="imac image" />
                      <img class="hidden h-20 w-20 dark:block" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg" alt="imac image" />
                    </a>

                    <label for="counter-input" class="sr-only">Choose quantity:</label>
                    <div class="flex items-center justify-between md:order-3 md:justify-end">
                      <div class="text-end md:order-4 md:w-32">
                        <p class="text-base font-bold text-gray-900 dark:text-white">Price: ${service.servicePrice}</p>
                      </div>
                    </div>

                    <div class="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                      <a href="#" class="text-base font-medium text-gray-900 hover:underline dark:text-white">{service.serviceName}</a>

                      <div class="flex items-center gap-4">
                        <button type="button" class="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500" onClick={() => removeFromCart(index)}>
                          <svg class="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div class="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
            <div class="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <p class="text-xl font-semibold text-gray-900 dark:text-white">Order summary</p>
              <div class="space-y-4">
                <div class="space-y-2">
                  <dl class="flex items-center justify-between gap-4">
                    <dt class="text-base font-normal text-gray-500 dark:text-gray-400">Original price</dt>
                    <dd class="text-base font-medium text-gray-900 dark:text-white">${total}</dd>
                  </dl>
                  <dl class="flex items-center justify-between gap-4">
                    <dt class="text-base font-normal text-gray-500 dark:text-gray-400">Savings</dt>
                    <dd class="text-base font-medium text-green-600">-$0</dd>
                  </dl>
                </div>
                <dl class="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <dt class="text-base font-bold text-gray-900 dark:text-white">Total</dt>
                  <dd class="text-base font-bold text-gray-900 dark:text-white">${total}</dd>
                </dl>
              </div>
              <a href="#" onClick={handleCheckout} class="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-black hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Place Service Order</a>
              <div class="flex items-center justify-center gap-2">
                <span class="text-sm font-normal text-gray-500 dark:text-gray-400"> or </span>
                <a href="/servicepage" title="" class="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500">Continue Shopping
                  <svg class="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="text-lg font-semibold mb-4">Confirm Order</p>
            <p className="mb-4">Are you sure you want to place this order?</p>
            <div className="flex justify-center space-x-4">
              <button onClick={confirmOrder} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Confirm</button>
              <button onClick={() => setShowConfirmation(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
      
    </section>
  );
}
