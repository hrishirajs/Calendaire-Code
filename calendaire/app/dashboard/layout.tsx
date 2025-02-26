import Image from "next/image";
import { ReactNode } from "react";
import calendaireLogo from "@/public/Calendaire Logo.png"
import Link from "next/link";
import { DashBoardLinks } from "../components/DashBoardLinks";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { auth, signOut } from "../lib/auth";
import { requireUser } from "../lib/hooks";
import prisma from "../lib/db";
import { redirect } from "next/navigation";

async function getData(userId:string) {
	const data=await prisma.user.findUnique({
		where:{
			id:userId
		},
		select:{
			userName:true,}

	});
	if(!data?.userName){
		return redirect("/onboarding");
	}	
	return data;

	
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
	const session=await requireUser();
	const data=await getData(session.user?.id as string);
	return(
		<> 
		 <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
			<div className="hidden border-r bg-muted/40 md:block">
			<div className="flex h-full max-h-screen flex-col">
				<div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
					<Link href="/" className="pl-2">
						<Image src={calendaireLogo} alt="Calendaire Logo" width={155} height={185}/>
					</Link>
					</div>
				 		<nav className="grid items-start px-2 lg:px-4">
								<DashBoardLinks/>
					 	</nav>
			    	</div>
		    	</div>
			
			<div className="flex flex-col">

				<header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px lg:px-6" >
					<Sheet>
						<SheetTrigger>
							<Button className=" shrink-0 md:hidden " size="icon" variant="outline">
								<Menu className="size-5"></Menu>
							</Button>
						
						</SheetTrigger>
						<SheetContent side="left" className="flex flex-col">
							<nav className="grid gap-2 mt-5">
								<DashBoardLinks/>
							</nav>
						</SheetContent> 
					</Sheet>
					<div className="ml-auto flex items-center gap-x-4">
						<ThemeToggle/>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="secondary" size="icon" className="rounded-full">
									<img src={session?.user?.image as string} alt="Profile Image" width={20}height={20} className="w-full h-full rounded-full" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>My Account</DropdownMenuLabel>
								 <DropdownMenuSeparator/>
									<DropdownMenuItem asChild>
										<Link href="/dashboard/settings">Settings</Link> 
								  	</DropdownMenuItem>
									<DropdownMenuItem asChild> 
										<form className="w-full" action={async () => {"use server"
											await signOut()}}>
												<button className="w-full text-left">Logout</button> 
										</form>
									</DropdownMenuItem>
							</DropdownMenuContent>
							
						</DropdownMenu>
					</div>
			
				</header>
				<main className="flex flex-1 flex-cols gap-4 p-4 lg:p-6 lg:gap-6"> 
					{children}
				</main>
			</div>
	    </div>
		</>
	);
}