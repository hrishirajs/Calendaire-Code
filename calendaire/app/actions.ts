"use server";

import { nylas } from "./lib/nylas";
import prisma from "../lib/prisma";
import { requireUser } from "./lib/hooks";
import { parseWithZod } from "@conform-to/zod";
import { eventTypeSchema, onboardingSchema, onboardingSchemaValidation, settingsSchema } from "./lib/zodSchemas";
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
						hour0to1: false,
						hour1to2: false,
						hour2to3: false,
						hour3to4: false,
						hour4to5: false,
						hour5to6: false,
						hour6to7: false,
						hour7to8: false,
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
						hour18to19: false,
						hour19to20: false,
						hour20to21: false,
						hour21to22: false,
						hour22to23: false,
						hour23to24: false,
					},
					{
						day:"Tuesday",
						fromTime:"08:00",
						tillTime:"18:00",
						hour0to1: false,
						hour1to2: false,
						hour2to3: false,
						hour3to4: false,
						hour4to5: false,
						hour5to6: false,
						hour6to7: false,
						hour7to8: false,
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
						hour18to19: false,
						hour19to20: false,
						hour20to21: false,
						hour21to22: false,
						hour22to23: false,
						hour23to24: false,
					},
					{
						day:"Wednesday",
						fromTime:"08:00",
						tillTime:"18:00",
						hour0to1: false,
						hour1to2: false,
						hour2to3: false,
						hour3to4: false,
						hour4to5: false,
						hour5to6: false,
						hour6to7: false,
						hour7to8: false,
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
						hour18to19: false,
						hour19to20: false,
						hour20to21: false,
						hour21to22: false,
						hour22to23: false,
						hour23to24: false,
					},
					{
						day:"Thursday",
						fromTime:"08:00",
						tillTime:"18:00",
						hour0to1: false,
						hour1to2: false,
						hour2to3: false,
						hour3to4: false,
						hour4to5: false,
						hour5to6: false,
						hour6to7: false,
						hour7to8: false,
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
						hour18to19: false,
						hour19to20: false,
						hour20to21: false,
						hour21to22: false,
						hour22to23: false,
						hour23to24: false,
					},
					{
						day:"Friday",
						fromTime:"08:00",
						tillTime:"18:00",
						hour0to1: false,
						hour1to2: false,
						hour2to3: false,
						hour3to4: false,
						hour4to5: false,
						hour5to6: false,
						hour6to7: false,
						hour7to8: false,
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
						hour18to19: false,
						hour19to20: false,
						hour20to21: false,
						hour21to22: false,
						hour22to23: false,
						hour23to24: false,
					},
					{
						day:"Saturday",
						fromTime:"08:00",
						tillTime:"18:00",
						hour0to1: false,
						hour1to2: false,
						hour2to3: false,
						hour3to4: false,
						hour4to5: false,
						hour5to6: false,
						hour6to7: false,
						hour7to8: false,
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
						hour18to19: false,
						hour19to20: false,
						hour20to21: false,
						hour21to22: false,
						hour22to23: false,
						hour23to24: false,
					},
					{
						day:"Sunday",
						fromTime:"08:00",
						tillTime:"18:00",
						hour0to1: false,
						hour1to2: false,
						hour2to3: false,
						hour3to4: false,
						hour4to5: false,
						hour5to6: false,
						hour6to7: false,
						hour7to8: false,
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
						hour18to19: false,
						hour19to20: false,
						hour20to21: false,
						hour21to22: false,
						hour22to23: false,
						hour23to24: false,
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
            // Within the time range - set to true by default if the day is active
            if (item.isActive) {
              // Set to true by default for all hours within the range
              data[fieldName] = true;
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
          // Within time range and day is active - use form value if provided, otherwise set to true
          data[hourFieldName] = rawData[formKey] !== undefined ? rawData[formKey] === "on" : true;
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
  

export async function CreateEventType(prevState:any, formData:FormData){
	const session=await requireUser();
	const submission = await parseWithZod(formData,{
		schema:eventTypeSchema,
	});
	if(submission.status!=="success"){
		return submission.reply();
	}
	const data=await prisma.eventType.create({
		data:{
			title:submission.value.title,
			duration:submission.value.duration,
			url:submission.value.url,
			description:submission.value.description,
			videoCallSoftware:submission.value.videoCallSoftware,
			userId:session.user?.id,
		},
	});
	return redirect("/dashboard");
}

export async function createMeetingAction(formData: FormData) {
	try {
		console.log("Starting createMeetingAction with form data:", Object.fromEntries(formData.entries()));
		
		// Check if required form fields are present
		const requiredFields = ['userName', 'eventTypeId', 'name', 'email', 'fromTime', 'eventDate', 'meetingLength'];
		for (const field of requiredFields) {
			if (!formData.get(field)) {
				console.error(`Missing required field: ${field}`);
				throw new Error(`Missing required field: ${field}`);
			}
		}

		const userName = formData.get("userName") as string;
		console.log(`Looking up user with userName: ${userName}`);
		
		const getUserData = await prisma.user.findUnique({
		  where: {
			userName,
		  },
		  select: {
			grantEmail: true,
			grantId: true,
			name: true,
		  },
		});
	  
		if (!getUserData) {
		  console.error(`User not found with userName: ${userName}`);
		  throw new Error(`User not found with userName: ${userName}`);
		}

		console.log("Found user:", JSON.stringify({
			name: getUserData.name,
			hasGrantId: !!getUserData.grantId,
			hasGrantEmail: !!getUserData.grantEmail
		}));

		if (!getUserData.grantId || !getUserData.grantEmail) {
		  console.error("User has not connected their calendar");
		  throw new Error("User has not connected their calendar");
		}
	  
		const eventTypeId = formData.get("eventTypeId") as string;
		console.log(`Looking up event type with ID: ${eventTypeId}`);
		
		const eventTypeData = await prisma.eventType.findUnique({
		  where: {
			id: eventTypeId,
		  },
		  select: {
			title: true,
			description: true,
		  },
		});

		if (!eventTypeData) {
		  console.error(`Event type not found with ID: ${eventTypeId}`);
		  throw new Error(`Event type not found with ID: ${eventTypeId}`);
		}

		console.log("Found event type:", eventTypeData);
	  
		const formTime = formData.get("fromTime") as string;
		const meetingLength = Number(formData.get("meetingLength"));
		const eventDate = formData.get("eventDate") as string;
	  
		const startDateTime = new Date(`${eventDate}T${formTime}:00`);
		const endDateTime = new Date(startDateTime.getTime() + meetingLength * 60000);

		console.log("Meeting time details:", {
			formTime,
			meetingLength,
			eventDate,
			startDateTime: startDateTime.toISOString(),
			endDateTime: endDateTime.toISOString()
		});
	  
		console.log("Attempting to create event with Nylas API", {
			identifier: getUserData.grantId,
			calendarId: getUserData.grantEmail,
			title: eventTypeData.title,
			startTime: Math.floor(startDateTime.getTime() / 1000),
			endTime: Math.floor(endDateTime.getTime() / 1000),
		});
		
		try {
			await nylas.events.create({
			  identifier: getUserData.grantId,
			  requestBody: {
				title: eventTypeData.title,
				description: eventTypeData.description,
				when: {
				  startTime: Math.floor(startDateTime.getTime() / 1000),
				  endTime: Math.floor(endDateTime.getTime() / 1000),
				},
				conferencing: {
				  autocreate: {},
				  provider: "Google Meet",
				},
				participants: [
				  {
					name: formData.get("name") as string,
					email: formData.get("email") as string,
					status: "yes",
				  },
				],
			  },
			  queryParams: {
				calendarId: getUserData.grantEmail,
				notifyParticipants: true,
			  },
			});
			
			console.log("Successfully created Nylas event!");
		} catch (nylasError: any) {
			console.error("Nylas API error:", nylasError);
			throw new Error(`Nylas API error: ${nylasError?.message || 'Unknown error'}`);
		}
	  
		console.log("Redirecting to success page");
		return redirect(`/success`);
	} catch (error) {
		console.error("Error creating meeting:", error);
		// Rethrow for UI handling
		throw error;
	}
}
  
  


export async function cancelMeetingAction(formData: FormData) {
  try {
    const session = await requireUser();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized - Please sign in" };
    }

    const eventId = formData.get("eventId") as string;
    if (!eventId) {
      return { success: false, error: "Event ID is required" };
    }

    const userData = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        grantId: true,
        grantEmail: true,
      },
    });

    if (!userData) {
      return { success: false, error: "User not found" };
    }

    if (!userData.grantId || !userData.grantEmail) {
      return { success: false, error: "User has not connected their calendar" };
    }

    // Delete event from Nylas
    try {
      await nylas.events.destroy({
        eventId,
        identifier: userData.grantId,
        queryParams: {
          calendarId: userData.grantEmail,
        },
      });
    } catch (nylasError: any) {
      console.error("Nylas API error:", nylasError);
      return { success: false, error: `Failed to delete event from calendar: ${nylasError.message}` };
    }

    // Update the specific meeting's status in our database
    try {
      // First find the meeting that matches this Nylas event
      const meeting = await prisma.meeting.findFirst({
        where: {
          nylasEventId: eventId,
          status: "SCHEDULED"
        }
      });

      if (meeting) {
        await prisma.meeting.update({
          where: {
            id: meeting.id
          },
          data: {
            status: "CANCELLED"
          }
        });
      }
    } catch (dbError: any) {
      console.error("Database error:", dbError);
      return { success: false, error: "Failed to update meeting status" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error cancelling meeting:", error);
    return { success: false, error: "Failed to cancel meeting" };
  }
}



