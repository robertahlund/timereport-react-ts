import React, { FunctionComponent } from "react";

interface LogoProps {
  width: string;
}

const Logo: FunctionComponent<LogoProps> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width}
      height="38.5"
      viewBox="0 0 115 38.5"
    >
      <g transform="translate(-62.5 -45.5)">
        <text
          transform="translate(142.5 76)"
          fill="#393e41"
          fontSize="30"
          fontFamily="Roboto-Light, Roboto"
          fontWeight="300"
        >
          <tspan x="-34.46" y="0">
            TIME
          </tspan>
        </text>
        <g transform="translate(63 46)">
          <path
            d="M1,0V7"
            transform="translate(16 16)"
            fill="none"
            stroke="#393e41"
            strokeLinecap="square"
            strokeMiterlimit="10"
            strokeWidth="1"
          />
          <path
            d="M0,0H7"
            transform="translate(17 16)"
            fill="none"
            stroke="#393e41"
            strokeLinecap="square"
            strokeMiterlimit="10"
            strokeWidth="1"
          />
          <circle
            cx="17.5"
            cy="17.5"
            r="17.5"
            fill="none"
            stroke="#393e41"
            strokeMiterlimit="10"
            strokeWidth="1"
          />
        </g>
      </g>
    </svg>
  );
};

export default Logo;
