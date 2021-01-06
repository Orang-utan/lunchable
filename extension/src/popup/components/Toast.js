import { useEffect, useState } from "react";

const Toast = ({ toast, setToast }) => {
  useEffect(() => {
    if (!toast.show) {
      setTimeout(() => {
        setToast({ show: false, message: toast.message });
      }, 2500);
    }
  }, [toast, setToast]);

  if (toast.show) {
    return (
      <p
        style={{
          margin: "0px 0px 5px 0px",
          padding: "2px",
          fontSize: "12px",
          fontFamily: "Avenir",
          fontWeight: 500,
          color: "white",
          textAlign: "center",
        }}
      >
        {toast.message}
      </p>
    );
  }

  return <></>;
};

export default Toast;
