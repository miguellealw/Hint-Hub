import React from "react";

function Waves({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      // height="100%"
      viewBox="0 0 1440 700"
      {...props}
    >
      <defs>
        <linearGradient id="gradient" x1="0%" x2="100%" y1="50%" y2="50%">
          <stop offset="5%" stopColor="#3b5bdb"></stop>
          <stop offset="95%" stopColor="#6741d9"></stop>
        </linearGradient>
      </defs>
      <path
        fill="url(#gradient)"
        fillOpacity="0.4"
        strokeWidth="0"
        d="M0 700V175c131.282-6.727 262.565-13.455 337-6s92.024 29.09 185 44 261.34 23.09 364-3c102.66-26.09 139.617-86.455 221-98 81.383-11.545 207.191 25.727 333 63v525z"
      ></path>
      <defs>
        <linearGradient x1="0%" x2="100%" y1="50%" y2="50%">
          <stop offset="5%" stopColor="#3b5bdb"></stop>
          <stop offset="95%" stopColor="#6741d9"></stop>
        </linearGradient>
      </defs>
      <path
        fill="url(#gradient)"
        fillOpacity="0.53"
        strokeWidth="0"
        d="M0 700V350c113.502-22.316 227.005-44.632 311-48 83.995-3.368 138.483 12.21 232 13 93.517.79 226.062-13.21 345 0 118.938 13.21 224.268 53.632 314 64 89.732 10.368 163.866-9.316 238-29v350z"
      ></path>
      <defs>
        <linearGradient x1="0%" x2="100%" y1="50%" y2="50%">
          <stop offset="5%" stopColor="#3b5bdb"></stop>
          <stop offset="95%" stopColor="#6741d9"></stop>
        </linearGradient>
      </defs>
      <path
        fill="url(#gradient)"
        strokeWidth="0"
        d="M0 700V525c115.416-8.89 230.833-17.78 318 0s146.086 62.23 238 44c91.914-18.23 216.823-99.139 331-100 114.177-.861 217.622 78.325 308 101 90.378 22.675 167.689-11.163 245-45v175z"
      ></path>
    </svg>
  );
}

export default Waves;
