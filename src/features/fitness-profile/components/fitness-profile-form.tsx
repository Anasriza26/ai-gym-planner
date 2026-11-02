"use client";

import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormField from "@/components/form-field";

type FitnessProfileFormProps = {
  name: string;
  age: string;
  height: string;
  weight: string;
  goal: string;
  experience: string;

  errors: Partial<Record<"name" | "age" | "height" | "weight", string>>;

  formError: string;
  isLoadingProfile: boolean;
  isSaving: boolean;
  hasProfile: boolean;

  onSubmit: (event: FormEvent<HTMLFormElement>) => void;

  onFieldChange: (
    field: "name" | "age" | "height" | "weight",
    value: string,
  ) => void;

  onGoalChange: (value: string) => void;
  onExperienceChange: (value: string) => void;
};

export default function FitnessProfileForm({
  name,
  age,
  height,
  weight,
  goal,
  experience,
  errors,
  formError,
  isLoadingProfile,
  isSaving,
  hasProfile,
  onSubmit,
  onFieldChange,
  onGoalChange,
  onExperienceChange,
}: FitnessProfileFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Build Your Fitness Profile</CardTitle>
        <CardDescription>
          Tell us about yourself and your fitness goals.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          {formError && (
            <p role="alert" className="text-sm text-destructive">
              {formError}
            </p>
          )}

          <FormField
            id="name"
            label="Full name"
            value={name}
            placeholder="Enter your name"
            error={errors.name}
            onChange={(value) => onFieldChange("name", value)}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              id="age"
              label="Age"
              type="number"
              value={age}
              placeholder="e.g. 22"
              error={errors.age}
              onChange={(value) => onFieldChange("age", value)}
            />

            <FormField
              id="height"
              label="Height (cm)"
              type="number"
              value={height}
              placeholder="e.g. 170"
              error={errors.height}
              onChange={(value) => onFieldChange("height", value)}
            />
          </div>

          <FormField
            id="weight"
            label="Weight (kg)"
            type="number"
            value={weight}
            placeholder="e.g. 65"
            error={errors.weight}
            onChange={(value) => onFieldChange("weight", value)}
          />

          <div className="space-y-2">
            <label htmlFor="goal" className="text-sm font-medium">
              Fitness goal
            </label>

            <select
              id="goal"
              value={goal}
              onChange={(event) => onGoalChange(event.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
            >
              <option>Muscle Gain</option>
              <option>Weight Loss</option>
              <option>General Fitness</option>
              <option>Improve Endurance</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="experience" className="text-sm font-medium">
              Experience level
            </label>

            <select
              id="experience"
              value={experience}
              onChange={(event) => onExperienceChange(event.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <Button type="submit" disabled={isLoadingProfile || isSaving}>
            {isSaving
              ? hasProfile
                ? "Updating..."
                : "Saving..."
              : hasProfile
                ? "Update Profile"
                : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
