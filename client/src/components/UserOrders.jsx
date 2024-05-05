import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";

export default function UserOrders() {
    const { currentUser } = useSelector((state) => state.user);
    const [userOrders, setUserOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const res = await fetch(`/API/order/getOrdersByUserName/${currentUser.username}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data = await res.json();
                // Sort orders by date in descending order
                const sortedOrders = data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setUserOrders(sortedOrders);
            } catch (error) {
                setError(error.message);
            }
        };

        if (currentUser) {
            fetchUserOrders();
        }
    }, [currentUser]);

    return (
        <div className="mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl text-center m-5">Orders</h2>
            {error && <p className="text-red-500">{error}</p>}
            <div href="#" className="block max-w max-h-6xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Order Id
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Product name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Product price
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Total Price
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Order Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {userOrders.map((order) => (
                                order.orderItems.map((item, itemIndex) => (
                                    <tr key={`${order._id}_${itemIndex}`} className="bg-blue-100 border-b dark:bg-gray-800 dark:border-gray-700">
                                        {itemIndex === 0 && (
                                            <td rowSpan={order.orderItems.length} className="px-6 py-4 border border-gray-300">
                                                {order._id}
                                            </td>
                                        )}
                                        <td className="px-6 py-4 border border-gray-300">{item.serviceName}</td>
                                        <td className="px-6 py-4 border border-gray-300">$ {item.servicePrice}</td>
                                        {itemIndex === 0 && (
                                            <>
                                                <td rowSpan={order.orderItems.length} className="px-6 py-4 border border-gray-300">
                                                    $ {order.totalPrice}
                                                </td>
                                                <td rowSpan={order.orderItems.length} className="px-6 py-4 border border-gray-300">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                                <td rowSpan={order.orderItems.length} className="px-6 py-4 border border-gray-300">
                                                    {order.orderStatus}
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
