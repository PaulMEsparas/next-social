"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [darkMode, setDarkmode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") setDarkmode(false);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);
  return (
    <div
      className="relative w-14 h-7 flex items-center dark:bg-gray-500 bg-blue-500 cursor-pointer rounded-full p-1"
      onClick={() => setDarkmode((darkMode) => !darkMode)}
    >
      <Image className="mr-auto" src="/sun.png" alt="" width={18} height={18} />
      <div
        className="absolute bg-white dark:bg-medium w-5 h-5 rounded-full shadow-md transform transition-transform duration-300"
        style={darkMode ? { left: "4px" } : { right: "3px" }}
      />

      <Image
        src="/moon.png"
        className="ml-auto"
        alt=""
        width={17}
        height={18}
      />
    </div>
  );
};

export default ThemeToggle;
