// Loading.js
import React, { useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";


export default function Loading() {
  const toastId = useRef(null);
  const { loading, progress, message } = useSelector((state) => state.loading);

  useEffect(() => {

    if (toastId.current === null) {
      toastId.current = toast(
        <div className="flex items-center">
        <div className="spinner" style={{ marginRight: "10px" }}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="black"
              strokeWidth="4"
              fill="none"
              strokeDasharray="31.4"
              strokeLinecap="round"
              strokeDashoffset="0.1"
            />
          </svg>
        </div>
        <div>
          <p>{message}</p>
          <p>{progress}</p>
        </div>
      </div>,
        { autoClose: false, closeOnClick: false }
      );
    } else {
      toast.update(toastId.current, {
        render: (
          <div className="flex items-center">
            <div className="spinner" style={{ marginRight: "10px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="black"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="31.4"
                  strokeLinecap="round"
                  strokeDashoffset="0.1"
                />
              </svg>
            </div>
            <div>
              <p>{message}</p>
              <p>{progress}</p>
            </div>
          </div>
        ),
      });
    }
  }, [message, progress, loading]);

  return <></>;
}
