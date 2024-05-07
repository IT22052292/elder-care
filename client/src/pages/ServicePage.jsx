import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function ServiceList() {
  const { currentUser } = useSelector((state) => state.user);
  const [userServices, setUserServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("name");

  const filteredServices = userServices.filter((service) => {
    if (searchBy === "name") {
      return (
        service.serviceName &&
        service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      return (
        service.serviceCategory &&
        service.serviceCategory.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  });

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



    if (currentUser || !currentUser ) {
      fetchServices();
    }
  }, [currentUser]);

  useEffect(() => {
    const savedCart = JSON.parse(sessionStorage.getItem("cart"));
    if (savedCart) {
      setCart(savedCart);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    sessionStorage.setItem("total", total);
  }, [total]);

  const addToCart = (service) => {
    const isAlreadyInCart = cart.some((item) => item._id === service._id);
    if (isAlreadyInCart) {
      alert("This item is already in the cart.");
    } else {
      setSelectedService(service);
      setShowConfirmation(true);
    }
  };

  const confirmAddToCart = () => {
    if (selectedService) {
      setCart([...cart, selectedService]);
      setShowConfirmation(false);
      window.location.href = "/cart";
    }
  };

  useEffect(() => {
    const calculateTotal = () => {
      const totalPrice = cart.reduce(
        (acc, service) => acc + service.servicePrice,
        0
      );
      setTotal(totalPrice);
    };
    calculateTotal();
  }, [cart]);

  return (
    <div>
      <h2 className="mb-5 mt-5 text-3xl font-bold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white text-center">
        Services
      </h2>
      <form className="max-w-md mx-auto flex items-center justify-center m-4">
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="ref"
              className="block w-max p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={`Search Services`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              required
            />
            <select
          className="block w-3 ml-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Select"
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="category">Category</option>
        </select>
          </div>
        </form>
      {filteredServices.map((service) => (
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
                {!currentUser || !currentUser.isAdmin && ( // Render only if the user is not an admin

                <button
                  onClick={() => addToCart(service)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Add to cart
                  <HiOutlineExclamationCircle className="rtl:rotate-180 w-3.5 h-3.5 ms-2" />
                </button>
                )}
              </div>
            
          </div>
        </div>
      ))}

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="text-lg font-semibold mb-4">
              Add {selectedService?.serviceName} to cart?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmAddToCart}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
