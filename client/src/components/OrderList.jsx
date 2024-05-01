import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, TableCell, TableRow, Modal, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import jsPDF from "jspdf";
import "jspdf-autotable";


export default function OrderList(){
    const { currentUser } = useSelector((state) => state.user);
    const [userOrders, setUserOrders] = useState([]);

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

    return( 
    <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Customer Email</th>
            <th>Service Name</th>
            <th>Service Price</th>
            <th>Total Price</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {userOrders.map(order => (
            order.orderItems.map((item, index) => (
              <tr key={order._id + '-' + index}>
                {index === 0 && (
                  <td rowSpan={order.orderItems.length}>{order.orderId}</td>
                )}
                {index === 0 && (
                  <td rowSpan={order.orderItems.length}>{order.customerName}</td>
                )}
                {index === 0 && (
                  <td rowSpan={order.orderItems.length}>{order.customerEmail}</td>
                )}
                <td>{item.serviceName}</td>
                <td>{item.servicePrice}</td>
                {index === 0 && (
                  <td rowSpan={order.orderItems.length}>{order.totalPrice}</td>
                )}
                {index === 0 && (
                  <td rowSpan={order.orderItems.length}>{new Date(order.createdAt).toLocaleDateString()}</td>
                )}
              </tr>
            ))
          ))}
        </tbody>
      </table>);

}