
"use client"
import { cn } from "@/lib/utils";
import { CalendarCheck, Home, LucideProps, Settings, User2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes } from "react";
interface iAppProps{
	id:number;
	name:string;
	href:string;
	icon:ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
}
export const dashboardLinks: iAppProps[] = [
	{
		id:0,
		name:"Event Types",
		href:"/dashboard/",
		icon:Home,
	},
	{
		id:1,
		name:"Meetings",
		href:"/dashboard/meetings",
		icon:User2

	},
	{
		id	:2,
		name:"Availibility",
		href:"/dashboard/availibility",
		icon:CalendarCheck
	},
	{
		id:3,
		name:"Settings",
		href:"/dashboard/settings",
		icon:Settings
	},

];

export function DashBoardLinks() {
  const pathname=usePathname();

	return(
		<>
		{
			dashboardLinks.map((link) => (
				<Link 
					
					className={cn(
						
						pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/dashboard/")
							? "text-primary bg-primary/10"

							: "text-muted-foreground hover:text-foreground",
							"flex items-center gap-3 rounded-lg px-3 py-2  transition-all  hover:text-primary"
				
					)}
					key={link.id} 
					href={link.href} >
					<link.icon className="size-8" />
					{link.name}
				</Link>
				))
		}
		</>
	);
}