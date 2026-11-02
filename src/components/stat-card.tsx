import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  title: string;
  value: string;
};

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <Card>
      <CardContent className="space-y-2 p-5">
        <p className="text-sm text-muted-foreground">{title}</p>

        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
