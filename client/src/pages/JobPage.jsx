import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function JobPage() {
  const { reference } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [userJobs, setUserJobs] = useState([]);

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

    fetchJobs();
  }, []);

  // to remove quil html tags
  const removeHTMLTags = (htmlContent) => {
    const div = document.createElement("div");

    div.innerHTML = htmlContent;
    

    return div.textContent || div.innerText;
  };

  return (
    <div>
      <section className="bg-center bg-no-repeat bg-[url('https://www.vestaeldercare.com/wp-content/uploads/2021/05/vesta-eldercare.png')] bg-gray-700 bg-blend-multiply">
        <div className="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
            Explore Fulfilling Careers in Eldercare
          </h1>
          <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">
            Here at Flowbite we focus on markets where technology, innovation,
            and capital can unlock long-term value and drive economic
            growth.Here at Flowbite we focus on markets where technology,
            innovation, and capital can unlock long-term value and drive
            economic growth.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-3 gap-4 p-10">
        {userJobs.map((job) => (
          <div
            key={job.id}
            className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
          >
            <a href="#">
              <img className="rounded-t-lg" src={job.image} alt="" />
            </a>
            <div className="p-5">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {job.title}
              </h5>
              <p>
                <b>Salary: {job.salary}</b>
              </p>
              <br />

              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {removeHTMLTags(job.description)}
              </p>

              <Link to={`/apply/${job.reference}`}>
                <a className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Apply Now
                  <svg
                    className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </a>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
