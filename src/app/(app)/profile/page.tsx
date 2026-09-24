import { ModuleStatus } from "@/components/shared/module-status";

export default function ProfilePage() {
  return (
    <ModuleStatus
      title="Profile"
      description="User profile — placeholder until Supabase Auth."
      countLabel="Profiles"
      count={1}
    />
  );
}
