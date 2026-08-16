export const dynamic = "force-dynamic";

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
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "18rem",
            "--sidebar-width-icon": "6rem",
            "--header-height": "4rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar userInfo={userInfo} navItems={navItems} variant="inset" />
        <SidebarInset className="bg-slate-50 flex flex-col flex-1 overflow-y-auto scrollbar-premium h-screen">
          <SiteHeader userInfo={userInfo} />
          <div className="flex-1 bg-slate-50 shadow-none border-none outline-none ring-0">
            <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-1000 shadow-none">
              <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 shadow-none">
                {children}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
