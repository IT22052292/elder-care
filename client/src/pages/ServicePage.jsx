import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function ServiceList() {
  const { currentUser } = useSelector((state) => state.user);
  const [userServices, setUserServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/API/service/getService");
        const data = await res.json();
        if (res.ok) {
          setUserServices(data.service);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser && currentUser.isAdmin) {
      fetchServices();
    }
  }, [currentUser]);

  // Load cart data from session storage on component mount
  useEffect(() => {
    const savedCart = JSON.parse(sessionStorage.getItem("cart"));
    if (savedCart) {
      setCart(savedCart);
    }
  }, []);

  // Save cart data to session storage whenever cart state changes
  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Save total to session storage whenever total state changes
  useEffect(() => {
    sessionStorage.setItem("total", total);
  }, [total]);

  // Function to add an item to the cart
  const addToCart = (service) => {
    setCart([...cart, service]);
  };

  // Function to calculate the total price of items in the cart
  useEffect(() => {
    const calculateTotal = () => {
      const totalPrice = cart.reduce((acc, service) => acc + service.servicePrice, 0);
      setTotal(totalPrice);
    };
    calculateTotal();
  }, [cart]);

  return (
    <div>
      <h2 className="mb-5 mt-5 text-3xl font-bold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white text-center">
        Services
      </h2>
      {userServices.map((service) => (
        <div
          className="m-3 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col"
          key={service._id}
        >
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {service.serviceName}
          </h5>
          <p className="mb-1 max-w-70 font-normal text-gray-700 dark:text-gray-400 flex-grow">
            {service.serviceDescription}
          </p>
          <div className="flex justify-between items-center">
            <div>
              <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">
                {service.serviceCategory}
              </p>
            </div>
            <div className="flex items-center">
              <p className="mr-3 font-normal text-gray-700 dark:text-gray-400">
                Price: ${service.servicePrice}
              </p>
              <button
                onClick={() => addToCart(service)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Add to cart
                <HiOutlineExclamationCircle className="rtl:rotate-180 w-3.5 h-3.5 ms-2" />
              </button>
            </div>
          </div>
        </div>
      ))}
      
    </div>
  );
}
