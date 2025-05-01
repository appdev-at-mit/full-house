"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface FormField {
  name: string;
  label: string;
  type: string;
}


const SignupPage: React.FC = () => {
  const router = useRouter();
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<{ [key: string]: string | boolean }>({});
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string[] }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/member_signup/")
      .then((response) => {
        setFormFields(response.data.form_fields);
        const initialData: { [key: string]: string | boolean } = {};
        response.data.form_fields.forEach((field: FormField) => {
          initialData[field.name] = field.type === "checkbox" ? false : "";
        });
        setFormData(initialData);
        console.log("forms: ", response.data.form_fields)
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
            acc[key] = typeof prevData[key] === "boolean" ? false : "";
            return acc;
          }, {} as { [key: string]: string | boolean })
        );
		redirectToLoginPage();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setErrorMessages(error.response.data);
        } else {
          console.error("Error submitting form:", error);
        }
      });
  };

  const redirectToLoginPage = ()  => {
	  router.push("/")
  }


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-5xl mb-6 text-center text-gray-800">Sign Up</h1>
        {successMessage && <p className="text-green-600 bg-green-100 p-3 rounded mb-4">{successMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {formFields.map((field) => (
            <div key={field.name} className="flex flex-col space-y-1">
              <label htmlFor={field.name} className="text-gray-700 font-medium">
                {field.label}
              </label>
              {field.type === "textarea" && (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] as string}
                  onChange={handleChange}
                  className="p-2 border rounded-md focus:ring focus:ring-blue-300"
                />
              )}
              {field.type === "checkbox" && (
                <div className="flex items-center space-x-2">
                  <input
                    id={field.name}
                    name={field.name}
                    type="checkbox"
                    checked={formData[field.name] as boolean}
                    onChange={handleChange}
                    className="h-5 w-5 text-blue-600 focus:ring focus:ring-blue-300 rounded"
                  />
                  <label htmlFor={field.name} className="text-gray-700">
                    {field.label}
                  </label>
                </div>
              )}
              {field.type === "select" && (
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] as string}
                  onChange={handleChange}
                  className="p-2 border rounded-md focus:ring focus:ring-blue-300"
                >
                  <option value="">Select an option</option>
                  {field.options?.map((option: { value: number; label: string }) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
              {field.type === "date" && (
                <div>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={formData[field.name] as string}
                    onChange={handleChange}
                    className="p-2 border rounded-md focus:ring focus:ring-blue-300"
                    min={field.options[0].value}
                    max={field.options[1].value}
                  />
                </div>
              )}
              {field.type === "number" && (
                <div>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={formData[field.name] as string}
                    onChange={handleChange}
                    className="p-2 border rounded-md focus:ring focus:ring-blue-300"
                    min={field.options.find(obj => obj.label === 'min') ? field.options.find(obj => obj.label === 'min').value : -Infinity}
                    max={field.options.find(obj => obj.label === 'max') ? field.options.find(obj => obj.label === 'max').value : Infinity}
                  />
                </div>
              )}
              {field.type !== "number" && field.type !== "date" && field.type !== "textarea" && field.type !== "checkbox" && field.type !== "select" && (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name] as string}
                  onChange={handleChange}
                  className="p-2 border rounded-md focus:ring focus:ring-blue-300"
                />
              )}
              {errorMessages[field.name] && (
                <p className="text-red-600 text-sm">{errorMessages[field.name].join(", ")}</p>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition duration-200"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
