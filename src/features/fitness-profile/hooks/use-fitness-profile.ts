"use client";

import { useEffect, useState, type FormEvent } from "react";

import type { FitnessProfile } from "../types/fitness-profile";
import {
  validateFitnessProfile,
  type FitnessFormErrors,
} from "../lib/validation";

import {
  getProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
} from "../lib/profile-api";

export function useFitnessProfile() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const [goal, setGoal] = useState("Muscle Gain");
  const [experience, setExperience] = useState("Beginner");

  const [errors, setErrors] = useState<FitnessFormErrors>({});

  const [profile, setProfile] = useState<FitnessProfile | null>(null);

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [fetchError, setFetchError] = useState("");
  const [formError, setFormError] = useState("");

  // அடுத்த படியில் மற்ற functions-ஐ இங்கே சேர்ப்போம்.

  function fillForm(savedProfile: FitnessProfile) {
    setName(savedProfile.name);
    setAge(String(savedProfile.age));
    setHeight(String(savedProfile.height));
    setWeight(String(savedProfile.weight));
    setGoal(savedProfile.goal);
    setExperience(savedProfile.experience);
  }

  useEffect(() => {
    async function loadProfile() {
      try {
        const result = await getProfiles();
        const latestProfile = result.data?.[0];

        if (latestProfile) {
          const savedProfile: FitnessProfile = {
            id: Number(latestProfile.id),
            name: latestProfile.name,
            age: Number(latestProfile.age),
            height: Number(latestProfile.height_cm),
            weight: Number(latestProfile.weight_kg),
            goal: latestProfile.goal,
            experience: latestProfile.experience,
          };

          setProfile(savedProfile);
          fillForm(savedProfile);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);

        setFetchError(
          error instanceof Error
            ? error.message
            : "Unable to retrieve your saved information.",
        );
      } finally {
        setIsLoadingProfile(false);
      }
    }

    loadProfile();
  }, []);

  function validateForm() {
    const newErrors = validateFitnessProfile({
      name,
      age,
      height,
      weight,
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) return;

    setFormError("");

    if (!validateForm()) return;

    setIsSaving(true);

    try {
      const payload = {
        name: name.trim(),
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
        goal,
        experience,
      };

      const result = profile
        ? await updateProfile({
            id: profile.id,
            ...payload,
          })
        : await createProfile(payload);

      const savedProfile: FitnessProfile = {
        id: Number(result.data.id),
        name: result.data.name,
        age: Number(result.data.age),
        height: Number(result.data.height_cm),
        weight: Number(result.data.weight_kg),
        goal: result.data.goal,
        experience: result.data.experience,
      };

      setProfile(savedProfile);
      fillForm(savedProfile);
      setErrors({});
      setFormError("");
      setFetchError("");

      alert(
        profile
          ? "Your information has been updated successfully!"
          : "Your information has been saved successfully!",
      );
    } catch (error) {
      console.error("Profile save error:", error);

      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to connect to the server.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function updateField(
    field: "name" | "age" | "height" | "weight",
    value: string,
  ) {
    if (field === "name") setName(value);
    if (field === "age") setAge(value);
    if (field === "height") setHeight(value);
    if (field === "weight") setWeight(value);

    setErrors((previous) => ({ ...previous, [field]: "" }));
    setFormError("");
  }

  async function handleDelete() {
    if (!profile || isSaving) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete your fitness profile?",
    );

    if (!confirmed) return;

    setIsSaving(true);
    setFormError("");

    try {
      await deleteProfile(profile.id);

      setProfile(null);
      setName("");
      setAge("");
      setHeight("");
      setWeight("");
      setGoal("Muscle Gain");
      setExperience("Beginner");

      setErrors({});
      setFormError("");
      setFetchError("");

      alert("Your fitness profile has been deleted successfully!");
    } catch (error) {
      console.error("Delete profile error:", error);

      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to delete your profile.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return {
    name,
    age,
    height,
    weight,
    goal,
    experience,
    errors,
    profile,
    isLoadingProfile,
    isSaving,
    fetchError,
    formError,
    setGoal,
    setExperience,
    updateField,
    handleSubmit,
    handleDelete,
  };
}
