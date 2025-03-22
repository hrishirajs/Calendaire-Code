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
        
        // First, get the current availability to preserve hourly settings
        const currentAvailability = await prisma.availability.findUnique({
          where: { id: item.id }
        });
        
        if (!currentAvailability) {
          console.error(`Availability with ID ${item.id} not found`);
          continue;
        }
        
        // Create data object with basic fields
        const data: any = {
          isActive: item.isActive,
          fromTime: item.fromTime,
          tillTime: item.tillTime,
        };
        
        // Set hours outside the range to false, but preserve user settings within the range
        for (let hour = 0; hour < 24; hour++) {
          const fieldName = `hour${hour}to${hour + 1}`;
          
          if (hour >= fromHour && hour < tillHour) {
            // Within the time range - preserve existing value if the day is active
            if (item.isActive) {
              // Keep the current setting if within range
              data[fieldName] = currentAvailability[fieldName as keyof typeof currentAvailability] as boolean;
            } else {
              // If day is not active, all hours are false
              data[fieldName] = false;
            }
          } else {
            // Outside the range - should be false
            data[fieldName] = false;
          }
        }
        
        // Update availability with all fields
		await prisma.availability.update({
		  where: { id: item.id },
		  data: data
		});
		
		console.log(`Updated availability for ID ${item.id} with hours ${fromHour}-${tillHour}`);
	  }
	  
	  revalidatePath("/dashboard/availability");
	} catch (error) {
	  console.error("Error updating availability:", error);
	}
}

export async function updateHourlyAvailabilityAction(formData:FormData) {
  const session = await requireUser();
  
  const rawData = Object.fromEntries(formData.entries());
  const availabilityIds = Object.keys(rawData)
    .filter((key) => key.startsWith("id-"))
    .map((key) => key.replace("id-", ""));
  
  try {
    // Process each availability item one by one
    for (const id of availabilityIds) {
      // Get the current availability to know the time range and active status
      const currentAvailability = await prisma.availability.findUnique({
        where: { id }
      });
      
      if (!currentAvailability) {
        console.error(`Availability with ID ${id} not found`);
        continue;
      }
      
      const fromHour = parseInt(currentAvailability.fromTime.split(':')[0], 10);
      const tillHour = parseInt(currentAvailability.tillTime.split(':')[0], 10);
      
      // Create data object - maintain existing isActive state
      const data: any = {};
      
      // Add hourly availability data (hour0to1, hour1to2, etc.)
      for (let hour = 0; hour < 24; hour++) {
        const hourFieldName = `hour${hour}to${hour + 1}`;
        const formKey = `${hourFieldName}-${id}`;
        const hourString = `${hour.toString().padStart(2, '0')}:00`;
        const isWithinTimeRange = hourString >= currentAvailability.fromTime && hourString < currentAvailability.tillTime;
        
        if (isWithinTimeRange && currentAvailability.isActive) {
          // Within time range and day is active - use form value
          data[hourFieldName] = rawData[formKey] === "on";
        } else if (!isWithinTimeRange) {
          // Outside time range - set to false
          data[hourFieldName] = false;
        }
        // For within range but inactive days, we don't update the hourly settings
      }
      
      await prisma.availability.update({
        where: { id },
        data: data
      });
      
      console.log(`Updated hourly availability for ID ${id}`);
    }
    
    revalidatePath("/dashboard/availability");
  } catch (error) {
    console.error("Error updating hourly availability:", error);
  }
}
  