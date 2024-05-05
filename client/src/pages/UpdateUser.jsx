import React,{useState,useEffect} from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { Button, TextInput } from "flowbite-react";



export default function UpdateUser() {
    const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const { userId } = useParams();
  const [publishError, setPublishError] = useState(null);

  useEffect(() => {
    try {
      const fetchUsers = async () => {
        const res = await fetch(`/API/auth/getUsers?userId=${userId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.user[0]);
        }
      };
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault(); //prevent refreshing
    try {
      const res = await fetch(`/API/auth/updateUser/${formData._id}`, {
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
        navigate("/dashboard?tab=profile");
      }
    } catch (error) {
      setPublishError("Error in submiting data!!!");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          <img
            src="../src/img/dp.jpeg"
            alt=""
            className="rounded-full w-full h-full object-cover"
            style={{ objectFit: "cover" }}
          />
        </div>
        <TextInput
          type="text"
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
          value={formData.fullName}
        ></TextInput>
        <TextInput
          type="text"
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          value={formData.username}
        ></TextInput>
        <TextInput
          type="text"
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          value={formData.email}
        ></TextInput>
        <Button type="submit" className="bg-red-500">Update User </Button>
      </form>
     
    </div>
  )
}
