import prisma from "@/app/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarX2, Clock, VideoIcon } from "lucide-react";
import { notFound } from "next/navigation";
async function getData(eventURL:string, userName:string){
	const data=await prisma.eventType.findFirst({
		where:{
			url:eventURL,
			User:{
				userName:userName,
			},
			active:true,
		},
		select:{
			id:true,
			description:true,
			title:true,
			duration:true,
			videoCallSoftware:true,
			User:{
				select:{
					image:true,
					name:true,
					availability:{
						select:{
							day:true,
							isActive:true,
						}
					}
				}


			}
		}
	});
	if(!data) {
		return notFound();
	}
	return data;
}

export default async function BookingFormRoute({params,}:{params:{username:string, eventURL:string}}) {
	const data=await getData(params.eventURL, params.username);
	return(
		<div className="min-h-screen w-screen flex items-center justify-center">
			<Card className="max-w-[1000px] w-full mx-auto">
				<CardContent className="p-5 md:grid-cols-[1fr,auto,1fr, auto,1fr]"> 
					<div>
						<img src={data.User?.image as string} alt="Profile Image" className="size-10 rounded-full"/>
						<p className="text-sm font-medium text-muted-foreground mt-1  ">{data.User?.name}</p>
						<h1 className="text-xl font-semibold mt-2 ">{data.title}</h1>
						<p className="text-sm font-medium text-muted-foreground">{data.description}</p>

						<div className="mt-5 flex felx-col gap-y-3">
							<p className="felx items-center" ><CalendarX2 className="size-4 mr-2 text-primary"/>
							 	<span className="text-sm font-medium text-muted-foreground">
							 		
							 	</span>
							</p>
							<p className="felx items-center" ><Clock className="size-4 mr-2 text-primary"/>
							 	<span className="text-sm font-medium text-muted-foreground">
							 		{data.duration} minutes
							 	</span>
							</p>
							<p className="felx items-center" ><VideoIcon className="size-4 mr-2 text-primary"/>
							 	<span className="text-sm font-medium text-muted-foreground">
							 		{data.videoCallSoftware}
							 	</span>
							</p>

						</div>
					</div>
					<Separator orientation="vertical" className="h-full w-[1px]"/>
				</CardContent>

			</Card>
		</div>
	)

}