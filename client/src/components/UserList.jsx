import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, TableCell, TableRow, Modal, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiDocumentText, HiOutlineExclamationCircle } from "react-icons/hi";

export default function ApplicationList() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/API/auth/getusers");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.user);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser && currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser]);

  
  const filteredUsers = users.filter(
    (user) =>
      user.fullName &&
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/API/auth/deleteuser/${selectedUserId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUsers(users.filter((user) => user._id !== selectedUserId));
        setShowModal(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  
  return (
    <div className="table-auto md:mx-auto p-3">
      <h1 className="my-7 text-center font-semibold text-3xl">All Users</h1>

      <form className="max-w-md mx-auto">
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only">
          Search
        </label>
        <div className="relative">
          <input
            type="search"
            id="ref"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search Users By Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            required
          />
          <div className="absolute inset-y-0 start-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              aria-hidden="true"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 19l-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
        </div>
      </form>

      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Full Name</Table.HeadCell>
          <Table.HeadCell>Username</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>

        {filteredUsers.map((user) => (
          <Table.Body key={user._id}>
            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <span
                  className="font-medium text-red-500 hover:underline cursor-pointer"
                  onClick={() => {
                    setShowModal(true);
                    setSelectedUserId(user._id);
                  }}
                >
                  Delete
                </span>
              </TableCell>
            </TableRow>
          </Table.Body>
        ))}
      </Table>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button onClick={handleDeleteUser} color="failure">
                Yes, Delete{" "}
              </Button>
              <Button onClick={() => setShowModal(false)} color="gray">
                No,Back{" "}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
