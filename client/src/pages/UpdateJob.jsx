import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { async } from "@firebase/util";

export default function UpdateJob() {
  const [file, setFile] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const { jobId } = useParams();

  useEffect(() => {
    try {
      const fetchJobs = async () => {
        const res = await fetch(`/API/post/getjobs?jobId=${jobId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.job[0]);
        }
      };
      fetchJobs();
    } catch (error) {
      console.log(error);
    }
  }, [jobId]);
  //console.log(formData);

  //function for submit form data to DB

  const handleSubmit = async (e) => {
    e.preventDefault(); //prevent refreshing
    try {
      const res = await fetch(`/API/post/updatejob/${formData._id}`, {
        
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate("/dashboard?tab=jobs");
      }
    } catch (error) {
      setPublishError("Error in submiting data!!!");
    }
  };

  const uploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Image Error");
        return;
      }
      setImageUploadError(null);

      const storage = getStorage(app);
      const fileName = new Date().getTime() + "_" + file.name;
      const storageRef = ref(storage, fileName);
      const metadata = {
        contentType: "image/*", // Specify content type as image
      };

      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Upload image failed");
          setImageUploadProgress(null);
        },
        () => {
          // This callback is called when the upload is complete
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              setImageUploadProgress(null);
              setImageUploadError(null);
              setFormData({ ...formData, image: downloadURL });
            })
            .catch((error) => {
              // Handle  errors that occur during getting download URL
              console.error("Error getting download URL:", error);
              setImageUploadError("Failed to get download URL");
              setImageUploadProgress(null);
            });
        }
      );
    } catch (error) {
      console.log(error);
      setImageUploadError("Upload failed");
      setImageUploadProgress(null);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Edit Job Vacancy
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Job Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          ></TextInput>
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
          >
            <option value=" ">Select Job category</option>
            <option value="Caregiver">Caregiver</option>
            <option value="Nurse">Nurse</option>
            <option value="HouseKeeping">House Keeping</option>
            <option value="Therapists">Therapists</option>

            <option value="AdministrativeStaff:">Administrative Staff:</option>
          </Select>
          <TextInput
            type="text"
            placeholder="Salary"
            id="salary"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, salary: e.target.value })
            }
            value={formData.salary}
          ></TextInput>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            typeof="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button type="button" size="sm" outline onClick={uploadImage}>
            Upload cover Photo
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt=""
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Enter job description"
          className="h-50 mb-5"
          onChange={(value) => {
            setFormData({ ...formData, description: value });
          }}
          value={formData.description}
        />
        {publishError && <Alert color="failure">{publishError}</Alert>}
        <Button type="submit" size="sm" className="bg-yellow-400 ">
          Update
        </Button>
      </form>
    </div>
  );
}
