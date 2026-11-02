"use client";

import ProfileSummary from "@/features/fitness-profile/components/profile-summary";
import FitnessProfileForm from "@/features/fitness-profile/components/fitness-profile-form";

import { useFitnessProfile } from "@/features/fitness-profile/hooks/use-fitness-profile";

export default function OnboardingPage() {
  const {
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
  } = useFitnessProfile();

  return (
    <main className="min-h-screen bg-slate-950 p-4 py-10 text-white sm:p-8">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        <FitnessProfileForm
          name={name}
          age={age}
          height={height}
          weight={weight}
          goal={goal}
          experience={experience}
          errors={errors}
          formError={formError}
          isLoadingProfile={isLoadingProfile}
          isSaving={isSaving}
          hasProfile={profile !== null}
          onSubmit={handleSubmit}
          onFieldChange={updateField}
          onGoalChange={setGoal}
          onExperienceChange={setExperience}
        />

        <ProfileSummary
          profile={profile}
          isLoading={isLoadingProfile}
          error={fetchError}
          isSaving={isSaving}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}
