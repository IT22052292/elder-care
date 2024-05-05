import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Alert, Button, FileInput } from "flowbite-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function ApplyJob() {
  const [publishError, setPublishError] = useState(null);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [cvUploadSuccess, setCvUploadSuccess] = useState(false);

  const { reference } = useParams();
  const [error, setError] = useState(false);
  const [job, setJob] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData, vacancyReference: reference };
      const res = await fetch("/API/application/submitapplication", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        window.alert("Application submitted successfully!");
        navigate("/jobpage");
      }
    } catch (error) {
      setPublishError("Error in submitting data!!!");
    }
  };

  const uploadFile = async () => {
    try {
      if (!file) {
        setFileUploadError("File Error");
        return;
      }
      setFileUploadError(null);
      

      const storage = getStorage(app);
      const fileName = new Date().getTime() + "_" + file.name;
      const storageRef = ref(storage, fileName);
      const metadata = {
        contentType: file.type, // Set the correct content type based on the file type
      };

      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFileUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setFileUploadError("Upload file failed");
          setFileUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              setFileUploadProgress(null);
              setFileUploadError(null);
              setFormData({ ...formData, cv: downloadURL });
              // Set success state to show success toast
              setCvUploadSuccess(true);
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
              setFileUploadError("Failed to get download URL");
              setFileUploadProgress(null);
            });
        }
      );
    } catch (error) {
      console.log(error);
      setFileUploadError("Upload failed");
      setFileUploadProgress(null);
    }
  };

  const hideSuccessToast = () => {
    setCvUploadSuccess(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/API/post/getjobs?reference=${reference}`);
        if (!res.ok) {
          setError(true);
          return;
        }
        const data = await res.json();
        setJob(data.job[0]);
        setError(false);
      } catch (error) {
        setError(true);
      }
    };

    fetchData();
  }, [reference]);

  if (error) {
    return <div>Error occurred while fetching data.</div>;
  }

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-center">
        <a
          href="/jobpage"
          className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <img
            className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
            src={job.image}
            alt=""
          />
          <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {job.title}
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Salary: {job.salary}
            </p>
          </div>
        </a>
      </div>

      <h1 className="my-7 text-center font-semibold text-3xl">
        Please fill out this Application
      </h1>

      <div>
        <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
          <div className="relative z-0 w-full mb-5 group">
            {/* full name input */}
            <input
              type="text"
              id="fullName"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              pattern="[a-zA-Z\s]+"
              title="Please enter letters only."
              required
            />
            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Applicant's Full Name
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="email"
              id="email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Email address
            </label>
          </div>

          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="tel"
                pattern="0[0-9]{9}"
                title="Enter a valid 10-digit phone number"
                id="phone"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Phone Number
              </label>
            </div>
          </div>

          <div className="flex gap-4 items-center justify-between border-4 border-grey-500 border-dotted p-3">
            <FileInput
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <Button type="button" size="sm" outline onClick={uploadFile}>
              Upload CV
            </Button>
            {fileUploadError && (
              <Alert color="failure">{fileUploadError}</Alert>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
            Only .pdf, .doc, or .docx files are accepted
          </p>
          <br />
          {publishError && <Alert color="failure">{publishError}</Alert>}

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit Application
          </button>
        </form>
      </div>

      {cvUploadSuccess && (
        <div
          id="toast-success"
          className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
          role="alert"
        >
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            <span className="sr-only">Check icon</span>
          </div>
          <div className="ms-3 text-sm font-normal">
            CV uploaded successfully!
          </div>
          <button
            type="button"
            className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            onClick={hideSuccessToast}
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns=""
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
