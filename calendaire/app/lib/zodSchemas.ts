import { conformZodMessage } from '@conform-to/zod';
import { url } from 'inspector';
import { title } from 'process';
import {z} from 'zod';
export const onboardingSchema =z.object({
	fullName:z.string().min(3).max(150),
	userName:z.string().min(3).max(150).regex(/^[a-zA-Z0-9_]+$/,{
		message:"Username must be alphanumeric and contain underscores"
	}),
});

export function onboardingSchemaValidation(options?:{
	isUserNameUnique:()=>Promise<boolean>;
}){
	return z.object({
		userName:z.string().min(3).max(150).regex(/^[a-zA-Z0-9_]+$/,{
			message:"Username must be alphanumeric and contain underscores"
		})
		.pipe(
			z.string().superRefine((_,ctx)=>{
				 if(typeof options?.isUserNameUnique !=="function"){
					 ctx.addIssue({
						code:"custom",
						message:conformZodMessage.VALIDATION_UNDEFINED,
						fatal:true,
					 });
					 return;
				 }
				 return options.isUserNameUnique().then((isUnique)=>{	
					if(!isUnique){
						ctx.addIssue({
							code:"custom",
							message:"Username already in use",
						});
					}
				});
			})
		),
		fullName:z.string().min(3).max(150),	
	});
}


export const settingsSchema=z.object({
	fullname:z.string().min(3).max(150)
})


export const eventTypeSchema=z.object({
	title:z.string().min(3).max(150),
	duration:z.number().min(15).max(60),
	url:z.string().min(3).max(150),
	description:z.string().min(3).max(500),
	videoCallSoftware:z.string().min(3).max(150)
});