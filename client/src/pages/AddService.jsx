import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddService() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission
    try {
      const res = await fetch("/API/service/createService", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        // Set error message if response is not OK
        setErrors(data.errors);
        return;
      }
      // Reset form data and errors
      setFormData({});
      setErrors({});
      // Navigate to dashboard
      navigate("/dashboard?tab=services");
    } catch (error) {
      console.error('Error creating service:', error.message);
    }
  };

  return (
    <div>
      <h1 className="mb-7 mt-10 text-2xl text-center font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-3xl dark:text-white">Add Service</h1>

      <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
        <div></div>
        <div className="relative z-0 w-full mb-5 group">
          <div>
          <input
            type="text"
            name="serviceName"
            id="serviceName"
            className="inline-flex  py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            onChange={(e) =>
              setFormData({ ...formData, serviceName: e.target.value })
            }
          />
          {errors.serviceName && <span className="text-red-500 inline-flex">{errors.serviceName}</span>}
          </div>
          <label
            htmlFor="serviceName"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Service Name
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <div>
          <textarea
            id="serviceDescription"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            onChange={(e) =>
              setFormData({ ...formData, serviceDescription: e.target.value })
            }
          />
          {errors.serviceDescription && <span className="text-red-500">{errors.serviceDescription}</span>}
          </div>
          <label
            htmlFor="serviceDescription"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Description
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <div>
          <input
            type="number"
            name="servicePrice"
            id="servicePrice"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            onChange={(e) =>
              setFormData({ ...formData, servicePrice: e.target.value })
            }
          />
          {errors.servicePrice && <span className="text-red-500">{errors.servicePrice}</span>}
          </div>
          <label
            htmlFor="servicePrice"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Price($)
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <select
            id="serviceCategory"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            onChange={(e) =>
              setFormData({ ...formData, serviceCategory: e.target.value })
            }
          >
            <option disabled selected>Category</option>
            <option value="Physical Activities">Physical Activities</option>
            <option value="Arts and Crafts">Arts and Crafts</option>
            <option value="Music and Performing Arts">Music and Performing Arts</option>
            <option value="Cultural and Educational">Cultural and Educational</option>
          </select>
          {errors.serviceCategory && <span className="text-red-500">{errors.serviceCategory}</span>}
        </div>
        <button
          type="submit"
          className="mx-auto  text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 flex dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
