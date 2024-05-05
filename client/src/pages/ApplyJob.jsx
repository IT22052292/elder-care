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
        body: JSON.stringify(dataToSend), // converts a JavaScript object or value to a JSON string.
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
      setPublishError("Error in submiting data!!!");
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
        contentType: "application/pdf", // Specify content type as PDF
      };

      // Adjust content type based on the file type (PDF or DOCX)
      if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        metadata.contentType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"; // DOCX content type
      }

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
      <a
        href="/jobpage"
        class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <img
          class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
          src={job.image}
          alt=""
        />
        <div class="flex flex-col justify-between p-4 leading-normal">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {job.title}
          </h5>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
            Salary:{job.salary}
          </p>
        </div>
      </a>

      <h1 className="my-7 text-center font-semibold text-3xl">
        Please fill this Applications
      </h1>

      <div>
        <form class="max-w-md mx-auto" onSubmit={handleSubmit}>
          <div class="relative z-0 w-full mb-5 group">
            <input
              type="text"
              id="fullName"
              class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              pattern="[a-zA-Z\s]+"
              y
              title="Please enter letters only."
              required
            />
            <label class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Applicant's Full Name
            </label>
          </div>
          <div class="relative z-0 w-full mb-5 group">
            <input
              type="email"
              id="email"
              class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <label class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Email address
            </label>
          </div>

          <div class="grid md:grid-cols-2 md:gap-6">
            <div class="relative z-0 w-full mb-5 group">
              <input
                pattern="0[0-9]{9}"
                title="Enter valid 10 digits"
                id="phone"
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
              <label
                for="floating_phone"
                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Phone number
              </label>
            </div>
          </div>
          <div className="flex gap-4 items-center justify-between border-4 border-grey-500 border-dotted p-3">
            <FileInput
              typeof="file"
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
          <p
            class="mt-1 text-sm text-gray-500 dark:text-gray-300"
            id="file_input_help"
          >
            .pdf, .doc or docx only
          </p>
          <br />
          {publishError && <Alert color="failure">{publishError}</Alert>}

          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}
