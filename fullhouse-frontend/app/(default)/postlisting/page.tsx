"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from '../../../axios.config';

type FormField = {
  type: string;
};

const fields: Record<string, string> = {
  "Start Date": "Lease earliest start date",
  "End Date": "Lease latest end date",
  "Address": "Accomodation address",
  "Housing Image Base64": "Image of accomodation",
  "Num Bedrooms": "Number of bedrooms",
  "Num Bathrooms": "Number of bathrooms",
  "Has Ac": "Has AC",
  "Has Wifi": "Has WiFi",
  "Num Roommates Needed": "Number of roommates looking for",
  "Rent": "Monthly rent",
};

type FormFields = {
  [key: string]: FormField;
};

export default function PostListing() {
  const [formFields, setFormFields] = useState<FormFields>({});
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("authKey");
      if (!token) {
        router.push("/");
        return;
      }
  
      try {
        const response = await axios.get("/api/member_profile/", {
          headers: { Authorization: `Token ${token}` },
        });
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          console.warn("Unauthorized — redirecting to login");
          localStorage.removeItem("authKey");
          router.push("/");
        } else {
          console.error("Unexpected error during auth check", error);
        }
      }
    };
  
    checkLoggedIn();
  }, [router]);  

  useEffect(() => {
    fetchFormFields();
  }, []);

  const fetchFormFields = async () => {
    try {
      console.log("Fetching form fields...");
      const response = await fetch("http://localhost:8000/api/listings/form_fields/", {
        credentials: "include",
        headers: {
          'Accept': 'application/json',
        },
      });
      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Received form fields:", data);
      setFormFields(data);
      // Initialize form data with empty values
      const initialData: { [key: string]: any } = {};
      Object.keys(data).forEach((key) => {
        initialData[key] = data[key].type === "checkbox" ? false : "";
      });
      setFormData(initialData);
      setError(null);
    } catch (error) {
      console.error("Error fetching form fields:", error);
      setError("Failed to load form fields. Please try again later.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("authKey");

      const response = await fetch("http://localhost:8000/api/listings/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/listings");
      } else {
        console.error("Error creating listing");
        setError("Failed to create listing. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const renderField = (key: string, field: FormField) => {
    let label = key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    label =
      fields[label] || label;
  
    const isRequired = true; // add asterisk to all fields

    if (field.type === "date") {
      const today = new Date().toISOString().split("T")[0];
      const minDate = key === "end_date" ? today : undefined;
    
      return (
        <div key={key} className="space-y-2">
          <Label htmlFor={key}>
            {label}
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id={key}
            type="date"
            required={isRequired}
            value={formData[key] as string}
            min={minDate}
            onChange={(e) => handleChange(key, e.target.value)}
          />
        </div>
      );
    }
  
    if (field.type === "checkbox") {
      return (
        <div key={key} className="space-y-2">
          <Label htmlFor={key}>
            {label}
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <select
            id={key}
            value={formData[key] ? "Yes" : "No"}
            onChange={(e) => handleChange(key, e.target.value === "Yes")}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      );
    }

    if (key === "housing_image_base64") {
      return (
        <div key={key} className="space-y-2">
          <Label>
            Image of Accommodation
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="flex items-center space-x-4">
            <input
              id="hidden-file-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    handleChange(key, (reader.result as string).split(",")[1]); // save base64 data
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <Button
              type="button"
              onClick={() => document.getElementById("hidden-file-input")?.click()}
            >
              Upload Image
            </Button>
            {formData[key] && (
              <span className="text-sm text-muted-foreground">Image selected</span>
            )}
          </div>
        </div>
      );
    }    
  
    return (
      <div key={key} className="space-y-2">
        <Label htmlFor={key}>
          {label}
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id={key}
          type={field.type}
          required={isRequired}
          value={formData[key] as string}
          onChange={(e) => handleChange(key, e.target.value)}
        />
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Post a New Listing</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {Object.entries(formFields).map(([key, field]) => renderField(key, field))}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/listings")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Posting..." : "Post Listing"}
          </Button>
        </div>
      </form>
    </div>
  );
} 