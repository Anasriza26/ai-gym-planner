"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { FitnessProfile } from "../types/fitness-profile";

type ProfileSummaryProps = {
  profile: FitnessProfile | null;
  isLoading: boolean;
  error: string;
  isSaving: boolean;
  onDelete: () => void;
};

export default function ProfileSummary({
  profile,
  isLoading,
  error,
  isSaving,
  onDelete,
}: ProfileSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile Summary</CardTitle>
        <CardDescription>
          Your saved fitness details appear here.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <p role="status" className="text-sm text-muted-foreground">
            Your profile is loading...
          </p>
        ) : error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : profile ? (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Your Fitness Profile</h2>

            <p>Name: {profile.name}</p>
            <p>Age: {profile.age}</p>
            <p>Height: {profile.height} cm</p>
            <p>Weight: {profile.weight} kg</p>
            <p>Goal: {profile.goal}</p>
            <p>Experience: {profile.experience}</p>

            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              disabled={isLoading || isSaving}
            >
              {isSaving ? "Processing..." : "Delete Profile"}
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No saved profile found. Complete the form to create one.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
