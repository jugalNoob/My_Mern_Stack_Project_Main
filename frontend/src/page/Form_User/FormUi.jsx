import React from 'react';
import './style/form.css';
import { FaUser, FaEnvelope, FaCalendarAlt, FaGlobe, FaHeart, FaMoneyBillWave } from 'react-icons/fa';

const FormUi = ({ formData, onChange, onSubmit }) => {
  const { name, price, age, birthDate, bloodGroup, email, country, bio, isEligible, gender, hobbies } = formData;

  return (
    <form onSubmit={onSubmit} className="modern-form">
      <h2>Signup Form</h2>

      <div className="input-group">
        <FaUser className="icon" />
        <input type="text" name="name" value={name} onChange={onChange} placeholder="Name" required />
      </div>

      <div className="input-group">
        <FaMoneyBillWave className="icon" />
        <input type="number" name="price" value={price} onChange={onChange} placeholder="Price" required />
      </div>

      <div className="input-group">
        <FaCalendarAlt className="icon" />
        <input type="number" name="age" value={age} onChange={onChange} placeholder="Age" required />
      </div>

      <div className="input-group">
        <FaCalendarAlt className="icon" />
        <input type="date" name="birthDate" value={birthDate} onChange={onChange} placeholder="Birth Date" required />
      </div>

      <div className="input-group">
        <FaHeart className="icon" />
        <select name="bloodGroup" value={bloodGroup} onChange={onChange} required>
          <option value="">Select Blood Group</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
      </div>

      <div className="input-group">
        <FaEnvelope className="icon" />
        <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
      </div>

      <div className="input-group horizontal">
        <input
          type="text"
          name="hobby1"
          value={hobbies[0]}
          onChange={onChange}
          placeholder="Hobby 1"
          required
        />
        <input
          type="text"
          name="hobby2"
          value={hobbies[1]}
          onChange={onChange}
          placeholder="Hobby 2"
          required
        />
      </div>

      <div className="input-group">
        <FaGlobe className="icon" />
        <select name="country" value={country} onChange={onChange} required>
          <option value="">Select Country</option>
          <option value="USA">USA</option>
          <option value="Canada">Canada</option>
          <option value="India">India</option>
          <option value="UK">UK</option>
        </select>
      </div>

      <div className="input-group">
        <textarea name="bio" value={bio} onChange={onChange} placeholder="Bio" required />
      </div>

      <div className="radio-group">
        <label>Is Eligible:</label>
        <label>
          <input type="radio" name="isEligible" value="true" checked={isEligible === 'true'} onChange={onChange} />
          Yes
        </label>
        <label>
          <input type="radio" name="isEligible" value="false" checked={isEligible === 'false'} onChange={onChange} />
          No
        </label>
      </div>

      <div className="radio-group">
        <label>Gender:</label>
        <label>
          <input type="radio" name="gender" value="male" checked={gender === 'male'} onChange={onChange} />
          Male
        </label>
        <label>
          <input type="radio" name="gender" value="female" checked={gender === 'female'} onChange={onChange} />
          Female
        </label>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default FormUi;
