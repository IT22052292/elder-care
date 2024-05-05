import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Table, TableCell, TableRow, Modal, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ServiceList() {
  const { currentUser } = useSelector((state) => state.user);
  const [userServices, setUserServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [serviceId, setServiceId] = useState("");
  const contentRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("name");

  const handleDownloadPDF = () => {
    const input = document.getElementById("ServiceList");

    if (!input) {
      console.error("Element with ID 'ServiceList' not found.");
      return;
    }

    const tableData = [];

    // read table data
    const rows = input.querySelectorAll("tr");
    rows.forEach((row) => {
      const rowData = [];
      const cells = row.querySelectorAll("td, th");
      cells.forEach((cell) => {
        rowData.push(cell.textContent.trim());
      });
      tableData.push(rowData);
    });

    // Convert table data to PDF
    const pdf = new jsPDF();
    pdf.autoTable({
      body: tableData,
    });

    pdf.save("service_list.pdf");
  };

  const handleDeleteService = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/API/service/deleteService/${serviceId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserServices((prev) =>
          prev.filter((service) => service._id !== serviceId)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

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

  return (
    <div className="table-auto md:mx-auto p-3" ref={contentRef}>
      <h1 className="my-7 text-center font-semibold text-3xl">All Services</h1>
      <div className="flex items-center justify-center mb-4">
        <form className="max-w-md mx-auto">
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
        
      </div>
      {currentUser.isAdmin && filteredServices.length > 0 ? (
        <div>
          <Table hoverable className="shadow-md " id="ServiceList">
            <Table.Head>
              <Table.HeadCell>Service name</Table.HeadCell>
              <Table.HeadCell>Description</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Price ($)</Table.HeadCell>
              <Table.HeadCell>Update</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>

            {filteredServices.map((service) => (
              <Table.Body key={service._id}>
                <TableRow className="bg-blue-100">
                  <TableCell>{service.serviceName}</TableCell>
                  <TableCell className="text-green-600">
                    {service.serviceDescription}
                  </TableCell>
                  <TableCell>{service.serviceCategory}</TableCell>
                  <TableCell className="font-bold">
                    {service.servicePrice}
                  </TableCell>
                  <TableCell>
                    <Link
                      className="text-yellow-400 hover:underline"
                      to={`/update-service/${service._id}`}
                    >
                      <span>EDIT</span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setServiceId(service._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      DELETE
                    </span>
                  </TableCell>
                </TableRow>
              </Table.Body>
            ))}
          </Table>
        </div>
      ) : (
        <p className="text-center">No services added!</p>
      )}

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
              Are you sure you want to delete this service?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteService}>
                Yes, Delete{" "}
              </Button>
              <Button onClick={() => setShowModal(false)} color="gray">
                No,Back{" "}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Button
        className="mx-auto mt-5"
        onClick={handleDownloadPDF}
        color="success"
      >
        Download as PDF
      </Button>
    </div>
  );
}
