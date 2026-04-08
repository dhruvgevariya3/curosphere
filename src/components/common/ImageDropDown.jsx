import { useState, useRef, useEffect } from "react";
import patavatar from "../../assets/designs/img/patientavatar.png";
import { useNavigate } from "react-router-dom";

function ImageDropDown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleProfile = () => {
    const roleId = localStorage.getItem("roleId");

    if (roleId === "67c5270436ac361840173a1a") {
      navigate("/patientdashboard"); // Patient dashboard
    } else if (roleId === "67c5c2418f21d7911dd5c66e") {
      navigate("/doctordashboard"); // Doctor dashboard
    } else {
      navigate("/"); // Default route if roleId is unknown or not set
    }
  };
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <img
        src={patavatar}
        className=""
        style={{ width: "74px", cursor: "pointer" }}
        alt="Avatar"
        onClick={handleClick}
      />
      {isOpen && (
        <div
          ref={dropdownRef}
          style={{
            position: "absolute",
            top: "80px", // Adjust as needed
            left: "-100px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "10px",
            zIndex: 1000, // Ensure it's above other elements
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          {/* Dropdown content goes here */}
          <button
            onClick={handleProfile}
            type="submit"
            className="btn btn-primary rounded-0 py-2 px-lg-5 d-none d-lg-block"
            style={{ width: "149px" }}
          >
            Profile
          </button>
          <br />
          <button
            onClick={handleLogout}
            type="submit"
            className="btn btn-primary rounded-0 py-2 px-lg-5 d-none d-lg-block"
          >
            Logout
          </button>

          {/* Add more dropdown items as needed */}
        </div>
      )}
    </div>
  );
}

export default ImageDropDown;
