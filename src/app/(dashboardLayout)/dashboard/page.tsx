import { redirect } from "next/navigation";
import { getMyProfile } from "@/action/user/user.action";
import { getUserSession } from "@/helpers/getUserSesssion";

const DashboardRootPage = async () => {
  const getUser = await getMyProfile();
  const session = await getUserSession();
  
  let role: "SUPER_ADMIN" | "ADMIN" | "USER" = "USER";
  
  if ((getUser as any)?.success && (getUser as any).data) {
    role = ((getUser as any).data.role || "USER") as "SUPER_ADMIN" | "ADMIN" | "USER";
  } else if (session?.user) {
    role = (session.user.role || "USER") as "SUPER_ADMIN" | "ADMIN" | "USER";
  }

  // If the user's role is just "USER", redirect them to their specific dashboard
  if (role === "USER") {
    redirect("/dashboard/user");
  }

  // Placeholder for Admins
  return (
    <div>
      <h1>Welcome to the Admin Dashboard Component!</h1>
    </div>
  );
};

export default DashboardRootPage;
