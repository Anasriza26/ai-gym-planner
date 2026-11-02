import { auth } from "@/auth";
import { redirect } from "next/navigation";
import WorkoutHistoryContent from "./workout-history-content";

export default async function WorkoutHistoryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return <WorkoutHistoryContent />;
}
