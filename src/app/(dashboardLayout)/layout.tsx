import { getMyProfile } from "@/action/user/user.action";
import { AppSidebar } from "@/components/modules/Dashboard/AppSideBar";
import { SiteHeader } from "@/components/modules/Dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getUserSession } from "@/helpers/getUserSesssion";
import { getNavItemsByRole } from "@/lib/navItems.confiq";

export default async function AdminDashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const getUser = await getMyProfile();
  console.log(getUser);
  const session = await getUserSession();
  let userInfo = null;
  let role: "SUPER_ADMIN" | "ADMIN" | "USER" = "USER";
  if ((getUser as any)?.success && (getUser as any).data) {
    userInfo = (getUser as any)?.data;
    role = (userInfo?.role || "USER") as "SUPER_ADMIN" | "ADMIN" | "USER";
  } else if (session?.user) {
    userInfo = {
      id: session?.user?.id,
      name: session?.user?.name,
      email: session?.user?.email,
      role: session?.user?.role as "SUPER_ADMIN" | "ADMIN" | "USER",
      image: session?.user?.image,
    };
    role = session?.user?.role as "SUPER_ADMIN" | "ADMIN" | "USER";
  }

  const navItems = getNavItemsByRole(role);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "18rem",
            "--header-height": "4rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar userInfo={userInfo} navItems={navItems} variant="inset" />
        <SidebarInset className="bg-transparent">
          <SiteHeader userInfo={userInfo} />
          <main className="flex-1 overflow-y-auto dashboard-gradient-bg">
            <div className="mx-auto w-full max-w-7xl animate-in fade-in duration-700">
              <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
                {children}
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
