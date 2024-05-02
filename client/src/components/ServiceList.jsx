import React, { useState, useRef } from "react";
import SidebarDash from "../components/SidebarDash";
import { useEffect } from "react";
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
  const [serviceId, setServiceId] = useState(" ");
  const contentRef = useRef(null);

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

  console.log(userServices);
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

  return (
    <div className="table-auto md:mx-auto p-3" ref={contentRef}>
      <h1 className="my-7 text-center font-semibold text-3xl">All Services</h1>
      {currentUser.isAdmin && userServices.length > 0 ? (
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

            {userServices.map((Services) => (
              <Table.Body key={Services._id}>
                <TableRow className="bg-blue-100">
                  <TableCell>{Services.serviceName}</TableCell>
                  <TableCell className="text-green-600">
                    {Services.serviceDescription}
                  </TableCell>
                  <TableCell>{Services.serviceCategory}</TableCell>
                  <TableCell className="font-bold">{Services.servicePrice}</TableCell>
                  <TableCell>
                    <Link
                      className="text-yellow-400 hover:underline"
                      to={`/update-service/${Services._id}`}
                    >
                      <span>EDIT</span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setServiceId(Services._id);
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
              <Button color="failure" onClick={handleDeleteService} >
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
    )
}