import { updateHourlyAvailabilityAction } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButtons";
import prisma from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import { times } from "@/app/lib/times";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
	
	// Define different hour ranges for tabs
	const morningHours = Array.from({ length: 6 }, (_, i) => i);
	const dayHours = Array.from({ length: 12 }, (_, i) => i + 6);
	const eveningHours = Array.from({ length: 6 }, (_, i) => i + 18);
	
	return(
		<div className="mx-2 md:mx-4 my-4">
			<Card className="w-full">
				<CardHeader className="px-4 py-4">
					<CardTitle>
					Hourly Availability
					</CardTitle>
					<CardDescription>Toggle your availability for each hour of the day</CardDescription>
				</CardHeader>
				<form action={updateHourlyAvailabilityAction}>
					<CardContent className="px-4">
						<Tabs defaultValue="all" className="w-full">
							<TabsList className="mb-4 w-full justify-start">
								<TabsTrigger value="all">All Hours</TabsTrigger>
								<TabsTrigger value="morning">Morning (0-6)</TabsTrigger>
								<TabsTrigger value="day">Day (6-18)</TabsTrigger>
								<TabsTrigger value="evening">Evening (18-24)</TabsTrigger>
							</TabsList>
							
							<TabsContent value="all" className="overflow-x-auto">
								<HourlyTable data={data} hours={Array.from({ length: 24 }, (_, i) => i)} />
							</TabsContent>
							
							<TabsContent value="morning" className="overflow-x-auto">
								<HourlyTable data={data} hours={morningHours} />
							</TabsContent>
							
							<TabsContent value="day" className="overflow-x-auto">
								<HourlyTable data={data} hours={dayHours} />
							</TabsContent>
							
							<TabsContent value="evening" className="overflow-x-auto">
								<HourlyTable data={data} hours={eveningHours} />
							</TabsContent>
						</Tabs>
					</CardContent>
					<CardFooter>
						<SubmitButton className="bg-foreground text-background" text="Save Changes"/>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}

// Extract the table into a reusable component
function HourlyTable({ data, hours }: { data: any[], hours: number[] }) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="sticky left-0 bg-background z-10">Day</TableHead>
					{hours.map(hour => (
						<TableHead key={hour} className="text-center whitespace-nowrap">
							{hour.toString().padStart(2, '0')}:00 - {(hour + 1).toString().padStart(2, '0')}:00
						</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((item) => (
					<TableRow key={item.id}>
						<TableCell className="sticky left-0 bg-background z-10 font-medium">
							<div className="flex items-center gap-x-3">
								<input type="hidden" name={`id-${item.id}`} value={item.id} />
								<Switch name={`isActive-${item.id}`} defaultChecked={item.isActive} />
								<p>{item.day}</p>
							</div>
						</TableCell>
						{hours.map(hour => {
							const hourFieldName = `hour${hour}to${hour + 1}`;
							const hourValue = item[hourFieldName as keyof typeof item] as boolean;
							return (
								<TableCell key={`${item.id}-${hour}`} className="text-center">
									<Switch 
										name={`${hourFieldName}-${item.id}`} 
										defaultChecked={hourValue}
										disabled={!item.isActive}
									/>
								</TableCell>
							);
						})}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}