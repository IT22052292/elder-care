import React, { useState } from "react";
import SidebarDash from "../components/SidebarDash";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, TableCell, TableRow, Modal, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

import jsPDF from "jspdf";

import "jspdf-autotable";


export default function JobList() {
  const { currentUser } = useSelector((state) => state.user);
  const [userJobs, setUserJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [jobId, setJobId] = useState("");

  const handleDeleteJob = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/API/post/deleteJob/${jobId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserJobs((prev) => prev.filter((job) => job._id !== jobId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDownloadPDF = () => {
    const input = document.getElementById("joblist");

    if (!input) {
      console.error("Element with ID 'joblist' not found.");
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
      head: [
        [
          "Date Updated",
          "#Ref",
          "Image",
          "Title",
          "Salary(USD)",
          "Category",
          "Update",
          "Delete",
        ],
      ],
      body: tableData,
    });

    pdf.save("vacancy_list.pdf");
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/API/post/getjobs");

        const data = await res.json();
        if (res.ok) {
          setUserJobs(data.job);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser && currentUser.isAdmin) {
      fetchJobs();
    }
  }, [currentUser]);

  return (
    <div className="table-auto md:mx-auto p-3">
      {currentUser.isAdmin && (
        <Link to={"/add-vacancy"}>
          <Button className="bg-teal-600">Add Job Vacancy</Button>
        </Link>
      )}
      <h1 className="my-7 text-center font-semibold text-3xl">All Vacancies</h1>
      <Button className="" onClick={handleDownloadPDF}>
        Download List
      </Button>{" "}
      
      {currentUser.isAdmin && userJobs.length > 0 ? (
        <div>
          <Table hoverable className="shadow-md" id="joblist">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>#Ref</Table.HeadCell>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Salary(USD)</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Update</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>

            {userJobs.map((jobs) => (
              <Table.Body key={jobs._id}>
                <TableRow className="bg-blue-100">
                  <TableCell>
                    {new Date(jobs.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={""}
                    >
                      {jobs.reference}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <img src={jobs.image} alt="" className="w-20 h-10" />
                  </TableCell>
                  <TableCell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={""}
                    >
                      {jobs.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-green-600">
                    {jobs.salary}
                  </TableCell>
                  <TableCell className="font-bold">{jobs.category}</TableCell>
                  <TableCell>
                    <Link
                      className="text-yellow-400 hover:underline"
                      to={`/update-vacancy/${jobs._id}`}
                    >
                      <span>EDIT</span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setJobId(jobs._id);
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
        <p className="text-center">No Vacancies available at the moment</p>
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
              Are you sure you want to delete this job vacancy?
            </h3>
            <div className="flex justify-center gap-4">
              <Button onClick={handleDeleteJob} color="failure">
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
