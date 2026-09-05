import React, { useState, useRef } from "react";
import axios from "axios";
import UpdateUi from "./UpdateUi";

const Update = () => {
  const [id, setId] = useState(""); 
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");

  const timeoutRef = useRef(null);
  const countRef = useRef(0);

  const handleUpdate = (e) => {
    e.preventDefault();

    countRef.current++;
    console.log("Count:", countRef.current);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      try {
        const data = { name, age, country };
        const response = await axios.patch(
          `http://localhost:9000/updates/${id}`,
          data,
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.status === 200) {
          alert("Student updated successfully!");
        } else {
          alert("Failed to update student data.");
        }
      } catch (error) {
        console.error("Error updating student:", error);
        alert("An error occurred while updating student data.");
      }
    }, 2000);
  };

  return (
    <UpdateUi
      id={id}
      setId={setId}
      name={name}
      setName={setName}
      age={age}
      setAge={setAge}
      country={country}
      setCountry={setCountry}
      handleUpdate={handleUpdate}
    />
  );
};

export default Update;
