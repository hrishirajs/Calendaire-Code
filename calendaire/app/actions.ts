"use server";

import prisma from "./lib/db";
import { requireUser } from "./lib/hooks";
import { parseWithZod } from "@conform-to/zod";
import { onboardingSchema, onboardingSchemaValidation, settingsSchema } from "./lib/zodSchemas";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


export async function OnboardingAction(prevState: any, formData:FormData){
	const session=await requireUser();
	const submission = await parseWithZod(formData,{
		schema:onboardingSchemaValidation({
			async isUserNameUnique(){
				const existingUser=await prisma.user.findUnique({
					where:{
						userName:formData.get("userName")as string,
					},
				});
				return !existingUser;
			},	
		}),	
		async:true,
	});
	if(submission.status!=="success"){
		return submission.reply();
	}
	const data=await prisma.user.update({
		where:{
		id:session.user?.id,
	},
	data:{
		userName:submission.value.userName,
		name:submission.value.fullName,
		availability:{
			createMany:{
				data:[
					{
						day:"Monday",
						fromTime:"08:00",
						tillTime:"18:00",
						hour8to9: true,
						hour9to10: true,
						hour10to11: true,
						hour11to12: true,
						hour12to13: true,
						hour13to14: true,
						hour14to15: true,
						hour15to16: true,
						hour16to17: true,
						hour17to18: true,
					},
					{
						day:"Tuesday",
						fromTime:"08:00",
						tillTime:"18:00",
						hour8to9: true,
						hour9to10: true,
						hour10to11: true,
						hour11to12: true,
						hour12to13: true,
						hour13to14: true,
						hour14to15: true,
						hour15to16: true,
						hour16to17: true,
						hour17to18: true,
					},
					{
						day:"Wednesday",
						fromTime:"08:00",
						tillTime:"18:00",
						hour8to9: true,
						hour9to10: true,
						hour10to11: true,
						hour11to12: true,
						hour12to13: true,
						hour13to14: true,
						hour14to15: true,
						hour15to16: true,
						hour16to17: true,
						hour17to18: true,
					},
					{
						day:"Thursday",
						fromTime:"08:00",
						tillTime:"18:00",
						hour8to9: true,
						hour9to10: true,
						hour10to11: true,
						hour11to12: true,
						hour12to13: true,
						hour13to14: true,
						hour14to15: true,
						hour15to16: true,
						hour16to17: true,
						hour17to18: true,
					},
					{
						day:"Friday",
						fromTime:"08:00",
						tillTime:"18:00",
						hour8to9: true,
						hour9to10: true,
						hour10to11: true,
						hour11to12: true,
						hour12to13: true,
						hour13to14: true,
						hour14to15: true,
						hour15to16: true,
						hour16to17: true,
						hour17to18: true,
					},
					{
						day:"Saturday",
						fromTime:"08:00",
						tillTime:"18:00",
						hour8to9: true,
						hour9to10: true,
						hour10to11: true,
						hour11to12: true,
						hour12to13: true,
						hour13to14: true,
						hour14to15: true,
						hour15to16: true,
						hour16to17: true,
						hour17to18: true,
					},
					{
						day:"Sunday",
						fromTime:"08:00",
						tillTime:"18:00",
						hour8to9: true,
						hour9to10: true,
						hour10to11: true,
						hour11to12: true,
						hour12to13: true,
						hour13to14: true,
						hour14to15: true,
						hour15to16: true,
						hour16to17: true,
						hour17to18: true,
					},
				]
			}
		}
	},
	});
	return redirect("/onboarding/grant-id");	
}

export async function SettingAction(prevState:any,formData:FormData){
	const session=await requireUser();
	const submission = await parseWithZod(formData,{
		schema:settingsSchema,
		
	});
	if(submission.status!=="success"){
		return submission.reply();
	}
	const user = await prisma.user.update({
		where:{
			id:session.user?.id,
		},
		data:{
			name:submission.value.fullname,
		},
	});
	return redirect("/dashboard");
}






export async function updateAvailabilityAction(formData:FormData) {
	const session = await requireUser();
  
	const rawData = Object.fromEntries(formData.entries());
	const availabilityData = Object.keys(rawData)
	  .filter((key) => key.startsWith("id-"))
	  .map((key) => {
		const id = key.replace("id-", "");
		return {
		  id,
		  isActive: rawData[`isActive-${id}`] === "on",
		  fromTime: rawData[`fromTime-${id}`] as string,
		  tillTime: rawData[`tillTime-${id}`] as string,
		};
	  });
  
	try {
	  // Process each availability item one by one
	  for (const item of availabilityData) {
        // Parse fromTime and tillTime to integers representing hours
        const fromHour = parseInt(item.fromTime.split(':')[0], 10);
        const tillHour = parseInt(item.tillTime.split(':')[0], 10);
        
        // Create data object with basic fields
        const data: any = {
          isActive: item.isActive,
          fromTime: item.fromTime,
          tillTime: item.tillTime,
          // Set all hours to false by default
          hour0to1: false,
          hour1to2: false,
          hour2to3: false,
          hour3to4: false,
          hour4to5: false,
          hour5to6: false,
          hour6to7: false,
          hour7to8: false,
          hour8to9: false,
          hour9to10: false,
          hour10to11: false,
          hour11to12: false,
          hour12to13: false,
          hour13to14: false,
          hour14to15: false,
          hour15to16: false,
          hour16to17: false,
          hour17to18: false,
          hour18to19: false,
          hour19to20: false,
          hour20to21: false,
          hour21to22: false,
          hour22to23: false,
          hour23to24: false
        };
        
        // Set hours within range to true
        for (let hour = fromHour; hour < tillHour; hour++) {
          if (hour >= 0 && hour < 24) {
            const fieldName = `hour${hour}to${hour + 1}`;
            data[fieldName] = true;
          }
        }
        
        // Update availability with all fields
		await prisma.availability.update({
		  where: { id: item.id },
		  data: data
		});
		
		console.log(`Updated availability for ID ${item.id} with hours ${fromHour}-${tillHour}`);
	  }
	  
	  revalidatePath("/dashboard");
	} catch (error) {
	  console.error("Error updating availability:", error);
	}
}
  