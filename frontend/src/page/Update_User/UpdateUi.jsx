import React from "react";

const UpdateUi = ({
  id,
  setId,
  name,
  setName,
  age,
  setAge,
  country,
  setCountry,
  handleUpdate,
}) => {
  return (
    <div style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}>
      <h2>Update Student</h2>
      <form onSubmit={handleUpdate}>
        <label>
          Student ID:
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            placeholder="Enter student ID"
          />
        </label>
        <br />
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter student name"
          />
        </label>
        <br />
        <label>
          Age:
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter student age"
          />
        </label>
        <br />
        <label>
          Country:
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Enter student country"
          />
        </label>
        <br />
        <button type="submit">Update Student</button>
      </form>
    </div>
  );
};

export default UpdateUi;
