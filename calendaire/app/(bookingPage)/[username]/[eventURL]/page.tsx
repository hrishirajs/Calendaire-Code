import prisma from "@/app/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, VideoIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { RenderCalendar } from "@/app/components/bookingForm/RenderCalendar";

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
							id: true,
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

type BookingParams = {
	params: {
		username: string;
		eventURL: string;
	};
};

export default async function BookingFormRoute({ params }: BookingParams) {
	// Await params to ensure they're ready before use
	const resolvedParams = await Promise.resolve(params);
	const { username, eventURL } = resolvedParams;
	
	const data = await getData(eventURL, username);
	
	// Format availability data for the RenderCalendar component
	const availability = data.User?.availability || [];
	
	return(
		<div className="min-h-screen w-full flex items-center justify-center py-10 px-4">
			<Card className="w-full max-w-6xl shadow-lg">
				<CardContent className="p-0">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr,auto,1fr]">
						{/* Event Information */}
						<div className="p-6 md:p-8">
							<div className="flex items-center space-x-3 mb-4">
								<img 
									src={data.User?.image as string} 
									alt={`${data.User?.name}'s profile`} 
									className="size-12 rounded-full object-cover border"
								/>
								<div>
									<p className="text-sm font-medium text-muted-foreground">{data.User?.name}</p>
								</div>
							</div>
							
							<h1 className="text-2xl font-bold mb-2">{data.title}</h1>
							<p className="text-muted-foreground mb-5">{data.description}</p>

							<div className="space-y-3">
								<div className="flex items-center">
									<Clock className="size-5 mr-3 text-primary"/>
									<span className="text-sm">
										{data.duration} minutes
									</span>
								</div>
								
								{data.videoCallSoftware && (
									<div className="flex items-center">
										<VideoIcon className="size-5 mr-3 text-primary"/>
										<span className="text-sm">
											{data.videoCallSoftware}
										</span>
									</div>
								)}
							</div>
						</div>
						
						{/* Separator (only visible on larger screens) */}
						<div className="hidden lg:block">
							<Separator orientation="vertical" className="h-full" />
						</div>
						
						{/* Calendar */}
						<div className="p-6 md:p-8 border-t md:border-t-0 md:border-l">
							<h2 className="text-lg font-semibold mb-4">Select a Date & Time</h2>
							<RenderCalendar daysofWeek={availability} />
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}