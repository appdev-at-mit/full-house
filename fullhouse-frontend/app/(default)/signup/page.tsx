"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

interface FormField {
  name: string;
  label: string;
  type: string;
}

const SignupPage: React.FC = () => {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<{ [key: string]: string | boolean }>({});
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string[] }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the form fields from the API
    axios
      .get("http://127.0.0.1:8000/api/member_signup/") // Adjust URL if needed
      .then((response) => {
        setFormFields(response.data.form_fields);
        const initialData: { [key: string]: string | boolean } = {};
        response.data.form_fields.forEach((field: FormField) => {
          initialData[field.name] = field.type === "checkbox" ? false : ""; // Default checkbox to false
        });
        setFormData(initialData);
      })
      .catch((error) => {
        console.error("Error fetching form fields:", error);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    // Convert `formData` to URL-encoded format
    const formEncodedData = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      formEncodedData.append(key, String(value));
    });
  
    axios
      .post("http://127.0.0.1:8000/api/member_signup/", formEncodedData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        setSuccessMessage(response.data.message);
        setErrorMessages({});
        setFormData((prevData) =>
          Object.keys(prevData).reduce((acc, key) => {
            acc[key] = typeof prevData[key] === "boolean" ? false : ""; // Reset form
            return acc;
          }, {} as { [key: string]: string | boolean })
        );
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setErrorMessages(error.response.data);
        } else {
          console.error("Error submitting form:", error);
        }
      });
  };
  

  return (
    <div className="signup-container">
      <h1>Signup Page</h1>
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        {formFields.map((field) => (
          <div key={field.name} className="form-group">
            <label htmlFor={field.name}>{field.label}</label>
            {field.type === "textarea" && (
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name] as string}
                onChange={handleChange}
                className="border border-gray-500"
              />
            )}
            {field.type === "checkbox" && (
              <input
                id={field.name}
                name={field.name}
                type="checkbox"
                checked={formData[field.name] as boolean}
                onChange={handleChange}
              />
            )}
            {field.type === "select" && (
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name] as string}
                onChange={handleChange}
                className="border border-gray-500"
              >
                <option value="">Select an option</option>
                {field.options?.map((option: { value: number; label: string }) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            {field.type !== "textarea" && field.type !== "checkbox" && field.type !== "select" && (
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name] as string}
                onChange={handleChange}
                className="border border-gray-500"
              />
            )}
            {errorMessages[field.name] && (
              <p className="error-message">{errorMessages[field.name].join(", ")}</p>
            )}
          </div>
        ))}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupPage;
