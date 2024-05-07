import { Link, useLocation } from "react-router-dom";

import {
  Avatar,
  Dropdown,
  Navbar,
  TextInput,
  Button,
  DropdownHeader,
} from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector } from "react-redux";
import { FaShoppingCart } from "react-icons/fa";

export default function Header() {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);
  if (currentUser) {
  }
  return (
    <Navbar className="bg-gradient-to-r from-sky-600 to-green-800 ...">
      <Link
        to="/home"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1  text-white">Seni</span>
        Care
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      <Navbar.Collapse className="text-white ">
        <Navbar.Link active={path === "/Home"} href="/home" className="text-white">
          Home
        </Navbar.Link>
       
        <Navbar.Link
          active={path === "/ServicePage"}
          href="/servicepage"
          className="text-white"
        >
          Services
        </Navbar.Link>
        <Navbar.Link
          active={path === "/JobPage"}
          href="/jobpage"
          className="text-white"
        >
          Career
        </Navbar.Link>
        <Navbar.Link
          active={path === "/About"}
          href="/about"
          className="text-white"
        >
          About
        </Navbar.Link>

        {currentUser && !currentUser.isAdmin && ( 
          <Navbar.Link active={path === "/Cart"} href="/cart" className="text-white mt-1">
            <FaShoppingCart />
          </Navbar.Link>
        )}

        {currentUser ? (
          <p style={{ color: "white", textAlign: "left" }}>
            Welcome, {currentUser.username}
          </p>
        ) : null}
      </Navbar.Collapse>

      {currentUser ? (
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar alt="profile pic" img={currentUser.profilePic} rounded />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">
              Username: {currentUser.username}
            </span>
            <span className="block text-sm">{currentUser.email}</span>
          </Dropdown.Header>
          
          {currentUser.isAdmin &&(
          <Link to={"/dashboard?tab=dash"}>
            <Dropdown.Item>Dashboard</Dropdown.Item>
          </Link>
            )}

          <Dropdown.Divider></Dropdown.Divider>
          <Link to={"/dashboard?tab=profile"}>
            <Dropdown.Item>Profile</Dropdown.Item>
          </Link>
          
        </Dropdown>
      ) : (
        <Link to="/signin">
          <Button gradientDuoTone="purpleToBlue" outline>
            Sign In
          </Button>
        </Link>
      )}

      <Navbar.Toggle />
    </Navbar>
  );
}
