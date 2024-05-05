import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {Button} from "flowbite-react";

import jsPDF from "jspdf";
import "jspdf-autotable";
import { NavLink } from "react-router-dom";

export default function OrderList() {
  const { currentUser } = useSelector((state) => state.user);
  const [userOrders, setUserOrders] = useState([]);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/API/order/getOrder");

        const data = await res.json();
        if (res.ok) {
          setUserOrders(data.order);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser && currentUser.isAdmin) {
      fetchOrders();
    }
  }, [currentUser]);

  const handleDownloadPDF = () => {
    const input = document.getElementById("OrderList");

    if (!input) {
      console.error("Element with ID 'OrderList' not found.");
      return;
    }

    const tableData = [];

    //read table data
    const rows = input.querySelectorAll("tr");
    rows.forEach((row) => {
      const rowData = [];
      const cells = row.querySelectorAll("td, th");
      cells.forEach((cell) => {
        rowData.push(cell.textContent.trim());
      });
      tableData.push(rowData);
    });

    //convert table data to PDF
    const pdf = new jsPDF();
    pdf.autoTable({
      
      body: tableData,
    });

    pdf.save("order_list.pdf");
  };

  return (
    <div className="table-auto md:mx-auto p-3">
      <h1 className="my-7 text-center font-semibold text-3xl">All Orders</h1>
      {currentUser.isAdmin && userOrders.length > 0 ? (
        <div>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-collapse" id="OrderList">

          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                
                <th scope="col" className="px-6 py-3  border border-gray-300">Customer Name</th>
                <th scope="col" className="px-6 py-3  border border-gray-300">Customer Email</th>
                <th scope="col" className="px-6 py-3  border border-gray-300">Service Name</th>
                <th scope="col" className="px-6 py-3  border border-gray-300">Service Price</th>
                <th scope="col" className="px-6 py-3  border border-gray-300">Total Price</th>
                <th scope="col" className="px-6 py-3  border border-gray-300">Date</th>
                <th scope="col" className="px-6 py-3  border border-gray-300">Status</th>
                <th scope="col" className="px-6 py-3  border border-gray-300">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {userOrders.map((order) => (
                order.orderItems.map((item, itemIndex) => (
                  <tr key={`${order._id}_${itemIndex}`} className="bg-blue-100 border-b dark:bg-gray-800 dark:border-gray-700">
                    {itemIndex === 0 && (
                      <>
                      
                        <td rowSpan={order.orderItems.length} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white  border border-gray-300">
                          {order.customerName}
                        </td>
                        <td rowSpan={order.orderItems.length} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white  border border-gray-300">
                          {order.customerEmail}
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4  border border-gray-300">{item.serviceName}</td>
                    <td className="px-6 py-4  border border-gray-300">$ {item.servicePrice}</td>
                    {itemIndex === 0 && (
                      <>
                        <td rowSpan={order.orderItems.length} className="px-6 py-4  border border-gray-300">
                          $ {order.totalPrice}
                        </td>
                        <td rowSpan={order.orderItems.length} className="px-6 py-4  border border-gray-300">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td rowSpan={order.orderItems.length} className="px-6 py-4  border border-gray-300">
                          {order.orderStatus}
                        </td>
                        <td rowSpan={order.orderItems.length} className="px-6 py-4 center  border border-gray-300">
                        <NavLink  to={`/update-order/${order._id}`}>
                        <span
                          className="font-medium text-red-500 hover:underline cursor-pointer"  >
                        Update
                        </span>
                        </NavLink>
                        </td>

                      </>
                    )}
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center">No orders placed!</p>
      )}
      <Button
        className="mx-auto mt-5"
        onClick={handleDownloadPDF}
        color="success"
      >
        Download as PDF
      </Button>
      
    </div>
  )
}
