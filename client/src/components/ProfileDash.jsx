import { Button, TextInput } from "flowbite-react";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { signOutUserFailure, signOutUserStart, signOutUserSuccess } from "../redux/user/userSlice";

export default function ProfileDash() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      
      sessionStorage.removeItem("currentUser");
      sessionStorage.removeItem("token");
      sessionStorage.clear();
  
      dispatch(signOutUserStart());
      const res = await fetch('/API/auth/signOut');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data.message));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };
  

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
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
          defaultValue={currentUser.fullName}
          disabled
        ></TextInput>
        <TextInput
          type="text"
          defaultValue={currentUser.username}
          disabled
        ></TextInput>
        <TextInput
          type="text"
          defaultValue={currentUser.email}
          disabled
        ></TextInput>
        <Link  to={`/update-user/${currentUser._id}`}><Button  className="max-w-lg w-full bg-blue-500">Update User </Button></Link>
        
        <Button onClick={handleSignOut} className="bg-red-500">Sign Out </Button>
      </form>
      {currentUser.isAdmin && (
        <p className="my-7 text-center font-semibold text-2xl text-cyan-600">Actions</p>
      )}
      <div className="m-auto items-center text-center">
      {currentUser.isAdmin && (
        <Link to={"/add-vacancy"}>
          <Button className="bg-teal-600 inline-flex  mr-2">Add Job Vacancy</Button>
        </Link>
      )}
      {currentUser.isAdmin && (
        <Link to={"/add-service"}>
          <Button className="my-7 bg-teal-600 inline-flex ml-2">Add Extra Service</Button>
        </Link>
      )}
      </div>
    </div>
  );
}
