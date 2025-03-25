import { updateAvailabilityAction, updateHourlyAvailabilityAction } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButtons";
import prisma from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import { times } from "@/app/lib/times";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

async function getData(userId:string) {
	const data=await prisma.availability.findMany({
		where:{
			userId:userId,
		}
	});
	if(!data){
		return notFound();
	}
	return data;
}

export default async function Availability(){
	const session= await requireUser();
	const data=await getData(session.user?.id as string);
	
	return(
		<div className="mx-2 md:mx-4 my-4">
			<Card className="w-full">
				<CardHeader className="px-4 py-4">
					<CardTitle>
					Availability
					</CardTitle>
					<CardDescription>Manage your schedule availability</CardDescription>
				</CardHeader>
				
				<Tabs defaultValue="general" className="w-full">
					<TabsList className="grid w-full grid-cols-2 mx-4 mb-4">
						<TabsTrigger value="general">General Settings</TabsTrigger>
						<TabsTrigger value="hourly">Hourly Settings</TabsTrigger>
					</TabsList>
					
					<TabsContent value="general">
						<form action={updateAvailabilityAction}>
							<CardContent className="flex flex-col gap-y-4 px-4">
								<p className="text-sm text-muted-foreground mb-2">
									Set your general availability for each day. Your hourly availability settings will be preserved within this time range.
								</p>
								{data.map((item)=>(
									<div key={item.id} 
									className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-3">
										<input type="hidden" name={`id-${item.id}`} value={item.id}/>
										
										<div className="flex items-center gap-x-3">
											<Switch name={`isActive-${item.id}`} defaultChecked={item.isActive}/>
											<p>{item.day}</p>
										</div>	
										<Select name={`fromTime-${item.id}`} defaultValue={item.fromTime}>
											<SelectTrigger>
												<SelectValue placeholder="From Time"/>
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													{times.map((time)=>(
														<SelectItem key={time.id} value={time.time}>
															{time.time}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
										<Select name={`tillTime-${item.id}`} defaultValue={item.tillTime}>
											<SelectTrigger>
												<SelectValue placeholder="Till Time"/>
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													{times.map((time)=>(
														<SelectItem key={time.id} value={time.time}>
															{time.time}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									</div>
								))}
							</CardContent>
							<CardFooter>
								<SubmitButton className="bg-foreground text-background" text="Save General Settings"/>
							</CardFooter>
						</form>
					</TabsContent>
					
					<TabsContent value="hourly">
						<form action={updateHourlyAvailabilityAction}>
							<CardContent className="px-4">
								<p className="text-sm text-muted-foreground mb-4">
									Customize your hourly availability within your general availability time range. Hours outside your general time range will be automatically unavailable.
								</p>
								{data.map((item) => (
									<div key={item.id} className="mb-6">
										<div className="flex items-center gap-x-3 mb-3">
											<input type="hidden" name={`id-${item.id}`} value={item.id}/>
											<p className="font-medium">{item.day}</p>
											<span className="text-muted-foreground">
												({item.fromTime} - {item.tillTime})
											</span>
											{!item.isActive && (
												<span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-md">
													Day inactive
												</span>
											)}
										</div>
										
										<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
											{Array.from({ length: 24 }, (_, hour) => {
												const hourFieldName = `hour${hour}to${hour + 1}`;
												const hourValue = item[hourFieldName as keyof typeof item] as boolean;
												const hourString = `${hour.toString().padStart(2, '0')}:00`;
												const isWithinTimeRange = 
													hourString >= item.fromTime && 
													hourString < item.tillTime;
												
												return (
													<div 
														key={`${item.id}-${hour}`} 
														className={`flex items-center gap-x-1 border rounded-md p-1.5 ${
															!isWithinTimeRange ? 'bg-gray-100 dark:bg-gray-800 text-muted-foreground' : 
															!item.isActive ? 'bg-gray-50 dark:bg-gray-900 text-muted-foreground' : ''
														}`}
													>
														<Switch 
															name={`${hourFieldName}-${item.id}`} 
															defaultChecked={hourValue}
															disabled={!item.isActive || !isWithinTimeRange}
														/>
														<span className="text-sm whitespace-nowrap">
															{hour.toString().padStart(2, '0')}:00 - {(hour + 1).toString().padStart(2, '0')}:00
														</span>
													</div>
												);
											})}
										</div>
									</div>
								))}
							</CardContent>
							<CardFooter>
								<SubmitButton className="bg-foreground text-background" text="Save Hourly Settings"/>
							</CardFooter>
						</form>
					</TabsContent>
				</Tabs>
			</Card>
		</div>
	);
}