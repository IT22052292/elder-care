import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableCell,
  TableRow,
  Modal,
  Button,
  ToggleSwitch,
} from "flowbite-react";
import { Link } from "react-router-dom";
import { HiDocumentText, HiOutlineExclamationCircle } from "react-icons/hi";
import { getStorage } from "firebase/storage";
import { app } from "../firebase";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ApplicationList() {
  const { currentUser } = useSelector((state) => state.user);
  const [userApp, setUserApp] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [appId, setAppId] = useState("");
  const storage = getStorage(app);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPending, setShowPending] = useState(false);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res = await fetch("/API/application/getapplications");
        const data = await res.json();
        if (res.ok) {
          setUserApp(data.application);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser && currentUser.isAdmin) {
      fetchApp();
    }
  }, [currentUser]);

  // Function to view CV file
  const viewPDF = async (pdfUrl) => {
    window.open(pdfUrl, "_blank");
  };

  const handleDeleteApp = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/API/application/deleteapp/${appId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        // Update the state directly without reloading the page
        setUserApp((prevApps) => prevApps.filter((app) => app._id !== appId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDownloadPDF = () => {
    const input = document.getElementById("applist");

    if (!input) {
      console.error("Element with ID 'applist' not found.");
      return;
    }

    const tableData = [];

    // Read table data
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
      head: [
        [
          "Date Submitted",
          "#Ref",
          "Name",
          "Phone",
          "E-mail",
          "CV",
          "STATUS",
          "Actions",
        ],
      ],
      body: tableData,
    });

    pdf.save("application_list.pdf");
  };

  
  const filterApp = () => {
    if (showPending) {
      return userApp.filter((app) => app.status === "PENDING");
    }
    return searchTerm.trim() === ""
      ? userApp
      : userApp.filter((app) => app.vacancyReference.includes(searchTerm));
  };

  return (
    <div className="table-auto md:mx-auto p-3">
      <h1 className="my-7 text-center font-semibold text-3xl">
        All Applications
      </h1>

     
      <form className="max-w-md mx-auto">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="ref"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Applications By Vacancy Reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            required
          />
        </div>
      </form>

      {/* Toggle  */}
      <div className="flex justify-center my-4">
        <ToggleSwitch
          checked={showPending}
          onChange={() => setShowPending(!showPending)}
          label="Show Pending Applications Only"
        />
      </div>

      
      <Table hoverable id="applist">
        <Table.Head>
          <Table.HeadCell>Date Submitted</Table.HeadCell>
          <Table.HeadCell>#Reference</Table.HeadCell>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Phone</Table.HeadCell>
          <Table.HeadCell>E-mail</Table.HeadCell>
          <Table.HeadCell>CV</Table.HeadCell>
          <Table.HeadCell>STATUS</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>

        {filterApp().map((apps) => (
          <Table.Body key={apps._id}>
            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell>
                {new Date(apps.updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Link
                  className="font-medium text-gray-900 dark:text-white"
                  to={""}
                >
                  {apps.vacancyReference}
                </Link>
              </TableCell>
              <TableCell className="text-gray-600">{apps.fullName}</TableCell>
              <TableCell className="text-gray-600">{apps.phone}</TableCell>
              <TableCell className="text-gray-600">{apps.email}</TableCell>
              <TableCell className="text-blue-600">
                <span
                  className="font-medium text-blue-600 dark:text-white cursor-pointer"
                  onClick={() => viewPDF(apps.cv)}
                >
                  <HiDocumentText className="inline-block mr-2" />
                  Click to View
                </span>
              </TableCell>
              <TableCell
                className={`${
                  apps.status === "ACCEPTED" ? "text-green-500" : "text-black"
                }`}
              >
                {apps.status}
              </TableCell>
              <TableCell>
                {apps.status === "ACCEPTED" ? (
                  <span className="font-medium text-red-500">.</span>
                ) : (
                  <span
                    className="font-medium text-red-500 hover:underline cursor-pointer"
                    onClick={() => {
                      setShowModal(true);
                      setAppId(apps._id);
                    }}
                  >
                    REJECT
                  </span>
                )}
              </TableCell>
              <TableCell>
                {apps.status === "ACCEPTED" ? (
                  <span className="font-medium text-blue-500">RECRUITED</span>
                ) : (
                  <Link
                    to={`/recruit/${apps.email}/${apps.fullName}/${apps._id}`}
                    className="font-medium text-yellow-500 hover:underline cursor-pointer"
                  >
                    RECRUIT
                  </Link>
                )}
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
              Are you sure you want to delete this application?
            </h3>
            <div className="flex justify-center gap-4">
              <Button onClick={handleDeleteApp} color="failure">
                Yes, Delete{" "}
              </Button>
              <Button onClick={() => setShowModal(false)} color="gray">
                No, Back{" "}
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
