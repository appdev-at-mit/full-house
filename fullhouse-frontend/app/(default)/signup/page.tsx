"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [formFields, setFormFields] = useState([]);

  // Fetch the form structure from the backend
  useEffect(() => {
    // Directly set the base URL in the axios request
    axios
      .get("http://127.0.0.1:8000/api/member_signup/")  // Directly use the full URL here
      .then((response) => {
        setFormFields(response.data.form_fields); // Assuming the backend returns field metadata
      })
      .catch((error) => console.error("Error fetching form fields:", error));
  }, []);

  // Handle form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit the form
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/api/member_signup/", formData)  // Directly use the full URL here
      .then((response) => {
        alert("Member profile created successfully!");
        setFormData({});
        setErrors({});
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setErrors(error.response.data); // Display errors from backend validation
        } else {
          console.error("Error submitting form:", error);
        }
      });
  };

  return (
    <div className="signup-page">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        {formFields.map((field) => (
          <div key={field.name} className="form-group">
            <label htmlFor={field.name}>{field.label}</label>
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              className={`form-control ${errors[field.name] ? "is-invalid" : ""}`}
            />
            {errors[field.name] && (
              <div className="invalid-feedback">{errors[field.name]}</div>
            )}
          </div>
        ))}
        <Button type="submit">Create Account</Button>
      </form>
    </div>
  );
}
