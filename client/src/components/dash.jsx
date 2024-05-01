import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
  HiDocumentDuplicate,
} from "react-icons/hi";

export default function dash() {
  const [vacancy, setvacancy] = useState([]);
  const [application, setApplication] = useState([]);

  const [totalVacancy, setTotalVacancy] = useState(0);
  const [totalApp, setTotalApp] = useState(0);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        const res = await fetch("/API/post/getjobs");
        const data = await res.json();
        if (res.ok) {
          setTotalVacancy(data.totalVacancy);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchAppli = async () => {
      try {
        const res = await fetch("/API/application/getapplications");
        const data = await res.json();
        if (res.ok) {
          setTotalApp(data.totalApp);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchVacancy();
      fetchAppli();
    }
  });

  return (
    <div className="p-3 md:mx-auto">
      <div className="flex-wrap flex gap-4 justify-center">
        <div className="flex flex-col gap-4 md:w-72 w-full rounded-md shadow-md">
          <Link to="/dashboard?tab=jobs">
            <div className="felx justify-between">
              <h3 className="text-gray-500 text-md uppercase">
                Total Vacancies
              </h3>
              <p className="text-2xl">{totalVacancy}</p>
              <HiDocumentText className="bg-teal-500 text-white rounded-full text-5xl p-3 " />
            </div>
          </Link>
        </div>
        <div className="flex flex-col gap-4 md:w-72 w-full rounded-md shadow-md">
          <Link to="/dashboard?tab=applications">
            <div className="felx justify-between">
              <h3 className="text-gray-500 text-md uppercase">
                Total Applications
              </h3>
              <p className="text-2xl">{totalApp}</p>
              <HiDocumentDuplicate className="bg-green-500 text-white rounded-full text-5xl p-3 " />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
