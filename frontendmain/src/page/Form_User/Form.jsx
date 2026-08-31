import React, { useState } from 'react';
import axios from 'axios';
import FormUi from './FormUi';
import './style/form.css';

const FormComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    age: '',
    birthDate: '',
    bloodGroup: '',
    email: '',
    country: '',
    bio: '',
    isEligible: '',
    gender: '',
    hobbies: ['', ''],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle hobbies separately
    if (name === 'hobby1') {
      setFormData((prev) => ({ ...prev, hobbies: [value, prev.hobbies[1]] }));
    } else if (name === 'hobby2') {
      setFormData((prev) => ({ ...prev, hobbies: [prev.hobbies[0], value] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:9000/v1/signup', formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      alert(response.data.message);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      alert('Failed to submit form.');
    }
  };

  return (
    <FormUi
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
};

export default FormComponent;
