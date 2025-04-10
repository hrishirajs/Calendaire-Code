import { notFound, redirect } from "next/navigation";
import { auth } from "../lib/auth";
import { requireUser } from "../lib/hooks";
import prisma from "../lib/db";
import { EmptyState } from "../components/EmptyState";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink, Link2Icon, Pen, Settings, Trash, User2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuGroup, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";


async function getData(userId: string) {
	 const data=await prisma.user.findUnique({
		where:{
			id: userId,

		},
		select:{
			userName:true,
			eventType:{
				select:{
					id:true,
					active:true,
					title:true,
					url:true,
					duration:true,

				},
			},

		},
		
	 });
	 if(!data){
		return notFound();

	 }
	 return data;
	}

export default  async function DashboardPage() {
const session=await requireUser();
const data=await getData(session.user?.id as string);

return(
	<>
	{data.eventType.length===0 ?(
		<EmptyState
			title="No events found"
			description="You have not created any events yet."
			buttonText="Create event"
			href="/dashboard/new"
		/>
	):(
		<div className="w-full px-6 py-6">
			<div className="flex items-center justify-between mb-8">
				<div className="hidden sm:block">
					<h1 className="text-3xl md:text-4xl font-semibold">Event Types</h1>
					<p className="text-muted-foreground text-lg">Create and manage your events here</p>
				</div>
				<Button asChild>
					<Link href="/dashboard/new">Create New Event</Link>
				</Button>
			</div>

			<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{data.eventType.map((item) => (
					<div className="overflow-hidden shadow-rounded-lg border relative" key={item.id}>
						<div className="absolute top-2 right-2">
							<DropdownMenu>
								<DropdownMenuTrigger>
									<Button variant="outline" size="icon">
										<Settings className="size-4"/>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuLabel>
										Event
									</DropdownMenuLabel>
									<DropdownMenuSeparator/>
									<DropdownMenuGroup>
										<DropdownMenuItem asChild>
											<Link href={`/${data.userName}/${item.url}`} className="flex items-center">
												<ExternalLink className="mr-2 size-4"/>
												<span>Preview</span>
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem>
											<Link2Icon className="mr-2 size-4"/>
											<span>Copy</span>
										</DropdownMenuItem>
										<DropdownMenuItem>
											<Pen className="mr-2 size-4"/>
											<span>Edit</span>
										</DropdownMenuItem>
									</DropdownMenuGroup>
									<DropdownMenuSeparator/>
									<DropdownMenuItem>
										<Trash className="mr-2 size-4"/>
										<span>Delete</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<Link className="flex items-center p-5" href="/">
							<div className="flex-shrink-0">
								<User2 className="size-6"/>
							</div>
							<div className="ml-5 w-0- flex-1">
								<dl>
									<dt className="text-sm font-medium text-muted-foreground">
										{item.duration} Minutes Meeting
									</dt>
									<dd className="text-lg font-medium">
										{item.url}
									</dd>
								</dl>
							</div>
						</Link>
						<div className="bg-muted px-5 py-3 flex items-center justify-between">
							<Switch/>
							<Button>
								Edit Event
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	)}
	</>
);

}



