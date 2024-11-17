"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  
  // Fetch the form from the backend
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/member_signup/');
        const data = await response.json();
        setFormData(data); // Assuming the backend sends back the form structure
      } catch (error) {
        console.error('Error fetching form:', error);
      }
    };

    fetchForm();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/member_signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Profile created successfully!');
        // Optionally redirect or update UI
      } else {
        const errorData = await response.json();
        setErrors(errorData); // Update errors state if validation fails
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold mb-2">Create Your Member Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(formData).map((key) => (
            <div key={key} className="mb-4">
              <label htmlFor={key} className="block text-gray-700">
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </label>
              <input
                type="text"
                id={key}
                name={key}
                value={formData[key] || ''}
                onChange={handleChange}
                className="border rounded-md p-2 w-full"
              />
              {errors[key] && <p className="text-red-500">{errors[key]}</p>}
            </div>
          ))}
          <Button type="submit" className="w-full" variant="default">
            Create Profile
          </Button>
        </form>
      </div>
    </div>
  );
}
