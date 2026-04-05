import { getMyProfile } from "@/action/user/user.action";
import ProfileContent from "@/components/modules/Dashboard/Profile/ProfileContent";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ProfilePage() {
  const profileRes = await getMyProfile();
  const userData = (profileRes as any)?.data;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent userData={userData} />
      </Suspense>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-64 w-full rounded-[2.5rem]" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton className="h-40 rounded-3xl" />
        <Skeleton className="h-40 rounded-3xl" />
        <Skeleton className="h-40 rounded-3xl" />
      </div>
    </div>
  );
}
