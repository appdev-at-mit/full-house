"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type FormField = {
  type: string;
  required: boolean;
};

type FormFields = {
  [key: string]: FormField;
};

export default function PostListing() {
  const [formFields, setFormFields] = useState<FormFields>({});
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchFormFields();
  }, []);

  const fetchFormFields = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/listings/form_fields/", {
        credentials: "include",
      });
      const data = await response.json();
      setFormFields(data);
      // Initialize form data with empty values
      const initialData: { [key: string]: any } = {};
      Object.keys(data).forEach((key) => {
        initialData[key] = data[key].type === "checkbox" ? false : "";
      });
      setFormData(initialData);
    } catch (error) {
      console.error("Error fetching form fields:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/listings/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        router.push("/listings");
      } else {
        console.error("Error creating listing");
      }
    } catch (error) {
      console.error("Error:", error);
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
    const label = key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    if (field.type === "checkbox") {
      return (
        <div key={key} className="flex items-center space-x-2">
          <Checkbox
            id={key}
            checked={formData[key] as boolean}
            onCheckedChange={(checked) => handleChange(key, checked)}
          />
          <Label htmlFor={key}>{label}</Label>
        </div>
      );
    }

    return (
      <div key={key} className="space-y-2">
        <Label htmlFor={key}>{label}</Label>
        <Input
          id={key}
          type={field.type}
          required={field.required}
          value={formData[key] as string}
          onChange={(e) => handleChange(key, e.target.value)}
        />
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Post a New Listing</h2>
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