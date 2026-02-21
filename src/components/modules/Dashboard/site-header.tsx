import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UserDropdown from "./UserDropDrown";
import { IUserCreate } from "@/types/User.interface";
interface DashboardNavbarProps {
  userInfo: IUserCreate | null;
}

export function SiteHeader({ userInfo }: DashboardNavbarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-100 bg-white transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
      <div className="flex w-full items-center gap-2 px-6">
        <SidebarTrigger className="-ml-1 hover:bg-gray-100 rounded-lg" />
        <Separator orientation="vertical" className="mx-2 h-6 bg-gray-200" />
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold text-gray-900">Dashboard</h1>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          <UserDropdown userInfo={userInfo} />
        </div>
      </div>
    </header>
  );
}
