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
    <div>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar userInfo={userInfo} navItems={navItems} variant="inset" />
        <SidebarInset>
          <SiteHeader userInfo={userInfo} />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 p-3">{children}</div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
