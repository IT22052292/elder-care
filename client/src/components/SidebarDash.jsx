import React from "react";
import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
  HiDocumentDuplicate,
  
} from "react-icons/hi";
import { MdDesignServices } from "react-icons/md";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";

import { FaList } from "react-icons/fa6";
import "../SidebarDash.css";

export default function SidebarDash() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParam = new URLSearchParams(location.search);
    const tabFormURL = urlParam.get("tab");
    if (tabFormURL) {
      setTab(tabFormURL);
    }
  }, [location.search]);

  return (
    <Sidebar className=" w-full">
      <Sidebar.Items className="bg-slate-300">
        <Sidebar.ItemGroup className="gap-4">
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor={currentUser.isAdmin ? "green" : "dark"}
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=jobs">
              <Sidebar.Item
                active={tab === "jobs"}
                icon={HiDocumentText}
                as="div"
              >
                Vacancies
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=applications">
              <Sidebar.Item
                active={tab === "applications"}
                icon={HiDocumentDuplicate}
                as="div"
              >
                Applications
              </Sidebar.Item>
            </Link>
          )}

          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=users">
              <Sidebar.Item
                active={tab === "users"}
                icon={HiOutlineUserGroup}
                as="div"
              >
                Users
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=services">
              <Sidebar.Item
                active={tab === "services"}
                icon={MdDesignServices}
                as="div"
              >
                Services
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=orders">
              <Sidebar.Item
                active={tab === "orders"}
                icon={BiSolidPurchaseTagAlt }
                as="div"
              >
                Orders
              </Sidebar.Item>
            </Link>
          )}

          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer text-red-500"
          >
            SignOut
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
