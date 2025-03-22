import { updateAvailabilityAction } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButtons";
import prisma from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import { times } from "@/app/lib/times";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { notFound } from "next/navigation";

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
					Availabilty
					</CardTitle>
					<CardDescription>In this section you can acces your schedule availabilty</CardDescription>
				</CardHeader>
				<form action={updateAvailabilityAction}>
					<CardContent className="flex flex-col gap-y-4 px-4">
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
						<SubmitButton className="bg-foreground text-background" text="Save Changes"/>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}