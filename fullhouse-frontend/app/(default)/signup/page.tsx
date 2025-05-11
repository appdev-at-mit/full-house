"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface FormField {
  name: string;
  label: string;
  type: string;
}

const fields: Record<string, string> = {
  "Year": "Class year",
  "Phone num": "Phone number",
  "Sleep time weekday": "Typical bedtime on weekdays",
  "Sleep time weekend": "Typical bedtime on weekends",
  "Wake time weekday": "Typical wake time on weekdays",
  "Wake time weekend": "Typical wake time on weekends",
  "Animals": "Allow animals in living space",
  "Pref same gender": "Do you prefer to live with people of the same gender?",
  "Pref smoking": "Do you prefer to allow smoking in the living space?",
  "Pref cleanliness": "How clean do you prefer your living space to be?",
  "Pref temperature": "What is your preferred room temperature?",
  "Pref age min": "What is the minimum age of your preferred roommate?",
  "Pref age max": "What is the maximum age of your preferred roommate?",
  "Pref day guests": "How do you feel about having guests over in the day?",
  "Pref night guests": "How do you feel about having guests over at night?",
  "Pref animals": "Do you have pets?",
  "Pref sleep light": "What light do you prefer when sleeping?"
};

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
    if (formData["email"] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData["email"] as string)) {
      setErrorMessages({ email: ["Please enter a valid email address."] });
      return;
    }
    
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
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 font-medium"
      >
        ← Back
      </button>
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-5xl mb-6 text-center text-gray-800">Sign Up</h1>
        {successMessage && <p className="text-green-600 bg-green-100 p-3 rounded mb-4">{successMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
        {formFields.map((field) => {
          const labelText = fields[field.label] || field.label;
          const isRequired = field.required;

          return (
            <div key={field.name} className="flex flex-col space-y-1">
              <label htmlFor={field.name} className="text-gray-700 font-medium">
                {labelText}{" "}
                {isRequired && <span className="text-red-600">*</span>}
              </label>

              {/* Convert checkboxes to Yes/No select */}
              {field.type === "checkbox" && (
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] ? "yes" : "no"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [field.name]: e.target.value === "yes",
                    })
                  }
                  className="p-2 border rounded-md focus:ring focus:ring-blue-300"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              )}

              {field.type === "textarea" && (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] as string}
                  onChange={handleChange}
                  className="p-2 border rounded-md focus:ring focus:ring-blue-300"
                />
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
                <input
                  id={field.name}
                  name={field.name}
                  type="date"
                  value={formData[field.name] as string}
                  onChange={handleChange}
                  className="p-2 border rounded-md focus:ring focus:ring-blue-300"
                  min={field.options?.[0]?.value}
                  max={field.options?.[1]?.value}
                />
              )}

              {field.type === "number" && (
                <input
                  id={field.name}
                  name={field.name}
                  type="number"
                  value={formData[field.name] as string}
                  onChange={handleChange}
                  className="p-2 border rounded-md focus:ring focus:ring-blue-300"
                  min={0}
                />
              )}

              {field.type !== "number" &&
                field.type !== "date" &&
                field.type !== "textarea" &&
                field.type !== "checkbox" &&
                field.type !== "select" && (
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
          );
        })}
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
