import { conformZodMessage } from '@conform-to/zod';
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