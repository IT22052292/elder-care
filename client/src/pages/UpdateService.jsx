import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";



export default function UpdateService(){

  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const { serviceId } = useParams();

  useEffect(() => {
    try {
      const fetchServices = async () => {
        const res = await fetch(`/API/service/getService?serviceId=${serviceId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.service[0]);
        }
      };
      fetchServices();
    } catch (error) {
      console.log(error);
    }
  }, [serviceId]);


  const handleSubmit = async (e) => {
    e.preventDefault(); //prevent refreshing
    try {
      const res = await fetch(`/API/service/updateService/${formData._id}`, {
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
        navigate("/dashboard?tab=services");
      }
    } catch (error) {
      setPublishError("Error in submiting data!!!");
    }
  };

    return(

       <div>
        <h1 class="mb-4 mt-5 text-2xl text-center font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-3xl dark:text-white">Add Service</h1>

        

<form class="max-w-md mx-auto" onSubmit={handleSubmit}>
  <div class="relative z-0 w-full mb-5 group">
      <input type="text" name="serviceName" id="serviceName" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required 
      onChange={(e) =>
        setFormData({ ...formData, serviceName: e.target.value })
      }
      value={formData.serviceName}
      />
      <label for="serviceName" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Service Name</label>
  </div>
  <div class="relative z-0 w-full mb-5 group">
      <textarea id="serviceDescription" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required 
      onChange={(e) =>
        setFormData({ ...formData, serviceDescription: e.target.value })
      }
      value={formData.serviceDescription}
      />
      <label for="serviceDescription" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Description</label>
  </div>
  <div class="relative z-0 w-full mb-5 group">
      <input type="number" name="servicePrice" id="servicePrice" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required 
      onChange={(e) =>
        setFormData({ ...formData, servicePrice: e.target.value })
      }
      value={formData.servicePrice}

      />
      <label for="servicePrice" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Price($)</label>
  </div>
  <div class="relative z-0 w-full mb-5 group">

  <select id="serviceCategory" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
  onChange={(e) =>
    setFormData({ ...formData, serviceCategory: e.target.value })
  }
        value={formData.serviceCategory}

  >

    <option disabled value="">Category</option>
    <option value="Physical Activities">Physical Activities</option>
    <option value="Arts and Crafts">Arts and Crafts</option>
    <option value="Music and Performing Arts">Music and Performing Arts</option>
    <option value="Cultural and Educational">Cultural and Educational</option>
  </select>
      
  </div>
 
  
  <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
</form>
</div>
    );
};