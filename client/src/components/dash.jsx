import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiDocumentText, HiDocumentDuplicate } from "react-icons/hi";
import { PiCurrencyCircleDollarFill } from "react-icons/pi";

export default function dash() {
  const [totalVacancy, setTotalVacancy] = useState(0);
  const [totalApp, setTotalApp] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [monthName, setMonthName] = useState("");
  const [favoriteServices, setFavoriteServices] = useState([]);


  const { currentUser } = useSelector((state) => state.user);
 
  const [accApp, setAccApp] = useState(0); // accepted allpications
  const [penApp, setPenApp] = useState(0); // pen allpications

 

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        const res = await fetch("/API/post/getjobs");
        const data = await res.json();
        if (res.ok) {
          setTotalVacancy(data.totalVacancy);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchAppli = async () => {
      try {
        const res = await fetch("/API/application/getapplications");
        const data = await res.json();
        if (res.ok) {
          setTotalApp(data.totalApp);
          setAccApp(data.acceptedCount);
          setPenApp(data.pendingCount);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchVacancy();
      fetchAppli();
    }
  });

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        const res = await fetch("/API/post/getjobs");
        const data = await res.json();
        if (res.ok) {
          setTotalVacancy(data.totalVacancy);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchAppli = async () => {
      try {
        const res = await fetch("/API/application/getapplications");
        const data = await res.json();
        if (res.ok) {
          setTotalApp(data.totalApp);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchOrderRevenue = async () => {
      try {
        const res = await fetch("/API/order/getOrder");
        const data = await res.json();
        if (res.ok) {
          let totalRevenue = 0;
          data.order.forEach((order) => {
            totalRevenue += order.totalPrice;
          });
          setTotalRevenue(totalRevenue);
          setTotalOrder(data.totalOrder);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchMonthlyRevenue = async () => {
      try {
        const today = new Date();
        const monthIndex = today.getMonth() + 1; 
        const monthName = today.toLocaleString("default", { month: "long" });
        setMonthName(monthName);
        const res = await fetch(`/API/order/getOrdersByMonth/${monthIndex}`);
        const data = await res.json();
        if (res.ok) {
          let totalMonthlyRevenue = 0;
          data.orders.forEach((order) => {
            totalMonthlyRevenue += order.totalPrice;
          });
          setMonthlyRevenue(totalMonthlyRevenue);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const calculateFavoriteServices = (orders) => {
      const serviceCount = {};
      orders.forEach(order => {
        order.orderItems.forEach(item => {
          const serviceName = item.serviceName;
          if (serviceCount[serviceName]) {
            serviceCount[serviceName]++;
          } else {
            serviceCount[serviceName] = 1;
          }
        });
      });
      const sortedServices = Object.entries(serviceCount).sort((a, b) => b[1] - a[1]);
      return sortedServices.slice(0, 3);
    };

    const fetchOrders = async () => {
      try {
        const res = await fetch("/API/order/getOrder");
        const data = await res.json();
        if (res.ok) {
          const favoriteServices = calculateFavoriteServices(data.order);
          setFavoriteServices(favoriteServices);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    
    

    if (currentUser.isAdmin) {
      fetchVacancy();
      fetchAppli();
      fetchOrderRevenue();
      fetchMonthlyRevenue();
      fetchOrders();
    }
  }, [currentUser.isAdmin]);

  return (
    
      

    <div className="p-3 md:mx-auto">
    <h1 className="text-center   items-center mt-5 mb-7 text-5xl font-extrabold dark:text-white">Dashboard<span className="bg-blue-100  text-blue-800 text-2xl font-semibold me-2 px-2.5 py-0 items-center rounded dark:bg-blue-200 dark:text-blue-800 ms-2">Statistics</span></h1>

      <div className="flex-wrap flex gap-4 justify-center">
        <div className="flex flex-col gap-4 md:w-72 w-full rounded-md shadow-md">
          <Link to="/dashboard?tab=jobs">
            <div className="felx justify-between">
              <h3 className="text-gray-500 text-md uppercase">
                Total Vacancies
              </h3>
              <p className="text-2xl">{totalVacancy}</p>
              <HiDocumentText className="bg-teal-500 text-white rounded-full text-5xl p-3 " />
            </div>
          </Link>
        </div>
        <div className="flex flex-col gap-4 md:w-72 w-full rounded-md shadow-md">
          <Link to="/dashboard?tab=applications">
            <div className="felx justify-between">
              <h3 className="text-gray-500 text-md uppercase">
                Total Applications
              </h3>
              <p className="text-2xl">{totalApp}</p>
              <HiDocumentDuplicate className="bg-green-500 text-white rounded-full text-5xl p-3 " />
            </div>
          </Link>
        </div>
      </div>
      <div className="flex-wrap flex gap-4 justify-center">
        <div className="flex flex-col gap-4 md:w-72 w-full rounded-md shadow-md">
          <Link to="/dashboard?tab=jobs">
            <div className="felx justify-between">
              <h3 className="text-gray-500 text-md uppercase">
                Accepted Applications
              </h3>
              <p className="text-2xl">{accApp}</p>
              <HiDocumentText className="bg-teal-500 text-white rounded-full text-5xl p-3 " />
            </div>
          </Link>
        </div>
        <div className="flex flex-col gap-4 md:w-72 w-full rounded-md shadow-md">
          <Link to="/dashboard?tab=applications">
            <div className="felx justify-between">
              <h3 className="text-gray-500 text-md uppercase">
                Pending Applications
              </h3>
              <p className="text-2xl">{penApp}</p>
              <HiDocumentDuplicate className="bg-green-500 text-white rounded-full text-5xl p-3 " />
            </div>
          </Link>
        </div>
      </div>
      <div className="mt-5">
        <div className="inline-flex flex-col gap-4 md:w-72 w-full rounded-md shadow-md mx-auto">
          <Link to="/dashboard?tab=orders">
            <div className="felx justify-between">
              <h3 className="text-gray-500 text-md uppercase">
                Total Revenue
              </h3>
              <p className="text-2xl">$ {totalRevenue}</p>
              <PiCurrencyCircleDollarFill className="bg-black text-white rounded-full text-5xl p-3 " />
            </div>
          </Link>
        </div>
        <div className="inline-flex flex-col gap-4 md:w-72 w-full rounded-md shadow-md ml-5">
          <Link to="/dashboard?tab=orders">
            <div className="felx justify-between">
              <h3 className="text-gray-500 text-md uppercase">
                Total Orders
              </h3>
              <p className="text-2xl">{totalOrder}</p>
              <PiCurrencyCircleDollarFill className="bg-black text-white rounded-full text-5xl p-3 " />
            </div>
          </Link>
        </div>
      </div>
      
        
      <div className="mt-5 inline-flex">
        <div className="inline-flex flex-col gap-4 md:w-72 w-full rounded-md shadow-md mx-auto">
        <Link to="/dashboard?tab=orders">
          <div className="felx justify-between">
            <h3 className="text-gray-500 text-md uppercase">
              Revenue for the month of {monthName}
            </h3>
            <p className="text-2xl">$ {monthlyRevenue}</p>
            <PiCurrencyCircleDollarFill className="bg-black text-white rounded-full text-5xl p-3 " />
          </div>
          </Link>
        </div>
      
      
        <div className="inline-flex flex-col gap-4 md:w-72 w-full rounded-md shadow-md ml-5">
        <Link to="/dashboard?tab=orders">
          <div className="felx justify-between">
            <h3 className="text-gray-500 text-md uppercase">
              Favorite Services
            </h3>
            <ul className="">
              {favoriteServices.map(([serviceName, count]) => (
                <li className="text-l" key={serviceName}>{`${serviceName}: ${count}`}</li>
              ))}
            </ul>

          </div>
          </Link>
        </div>
        </div>
      
    
      
      
    
    </div>
  );
}
