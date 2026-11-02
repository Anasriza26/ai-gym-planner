"use client";

import { Input } from "@/components/ui/input";

type FormFieldProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  type?: string;
  error?: string;
  onChange: (value: string) => void;
};

export default function FormField({
  id,
  label,
  value,
  placeholder,
  type = "text",
  error,
  onChange,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>

      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
      />

      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
