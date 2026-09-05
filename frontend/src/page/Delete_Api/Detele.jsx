import React, { useState } from "react";

function DeleteUser() {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");


  let timeout; // Make sure this is defined in the appropriate scope
  let count = 0; // Initialize count

  const handleDelete = async () => {
    if (!userId || !userName) {
      alert("Please enter both User ID and Name.");
      return;
    }

    console.log("Count:", count++); // Track click count
  

  
    clearTimeout(timeout); // Clear previous timeout

    timeout = setTimeout(async () => {

    try {
      const response = await fetch(`http://localhost:9000/v1/delId/${userId}/${userName}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (response.ok) {
        alert("User deleted successfully!");
        setUserId("");
        setUserName("");
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Something went wrong!");
    }

  }, 2000);
  };

  return (
    <div>
      <h1>Delete User</h1>
      <input
        type="text"
        placeholder="Enter User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Enter User Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <br />
      <button onClick={handleDelete}>Delete User</button>
    </div>
  );
}

export default DeleteUser;
