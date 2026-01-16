// import {
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuTrigger,
// } from "@/components/ui/navigation-menu";
// import { NavItem } from "@/types/dashboard.section";

// const NavDropdown = ({ item }: { item: NavItem }) => {
//   return (
//     <NavigationMenuItem>
//       <NavigationMenuTrigger className="px-4 py-2 hover:bg-[#ca428b] rounded-md transition-colors text-white data-[state=open]:bg-[#ca428b] border border-white/30 hover:border-white bg-transparent">
//         {item.title}
//       </NavigationMenuTrigger>
//       <NavigationMenuContent className="bg-[#6b205a] border-[#6b205a] text-white">
//         <div className="grid gap-3 p-6 md:w-100 lg:w-125 lg:grid-cols-2">
//           {item.featured && item.featured.length > 0 && (
//             <>
//               {item.featured.map((featuredItem) => (
//                 <Link
//                   key={featuredItem.title}
//                   href={featuredItem.href}
//                   className="block space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 focus:bg-white/10"
//                 >
//                   <div className="text-sm font-medium leading-none text-white">
//                     {featuredItem.title}
//                   </div>
//                   <p className="line-clamp-2 text-sm leading-snug text-white/80">
//                     {featuredItem.description}
//                   </p>
//                 </Link>
//               ))}
//               <div className="h-px bg-white/20 lg:col-span-2" />
//             </>
//           )}
//           <div className={`${item.featured ? "lg:col-span-2" : ""}`}>
//             <div className="grid grid-cols-2 gap-3">
//               {item.subItems?.map((subItem) => (
//                 <Link
//                   key={subItem.title}
//                   href={subItem.href}
//                   className="block space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 focus:bg-white/10"
//                 >
//                   <div className="text-sm font-medium leading-none text-white">
//                     {subItem.title}
//                   </div>
//                   {subItem.description && (
//                     <p className="line-clamp-2 text-sm leading-snug text-white/80">
//                       {subItem.description}
//                     </p>
//                   )}
//                   {/* Nested sub-items */}
//                   {subItem.subItems && (
//                     <div className="mt-2 space-y-1">
//                       {subItem.subItems.map((nestedItem) => (
//                         <Link
//                           key={nestedItem.title}
//                           href={nestedItem.href}
//                           className="block text-xs text-white/80 hover:text-white"
//                         >
//                           {nestedItem.title}
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       </NavigationMenuContent>
//     </NavigationMenuItem>
//   );
// };
