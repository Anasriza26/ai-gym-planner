import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import WorkoutHistoryContent from "./workout-history-content";

async function WorkoutHistoryPageContent() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return <WorkoutHistoryContent />;
}

export default function WorkoutHistoryPage() {
  return (
    <Suspense fallback={<div>Loading workout history...</div>}>
      <WorkoutHistoryPageContent />
    </Suspense>
  );
}
