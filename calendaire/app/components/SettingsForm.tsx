
"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "./SubmitButtons";
import { useActionState } from "react";
import { settingsSchema } from "../lib/zodSchemas";
import { SettingAction } from "../actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

interface iAppProps {
	fullname: string;
	email: string;
}


export function SettingsForm({fullname,email}: iAppProps) {
const [state, formAction] = useActionState(SettingAction, undefined);
const[form, fields]=useForm({
	lastResult: state,
	onValidate({formData}){
		return parseWithZod(formData,{
			schema:settingsSchema,
		});
	},
	shouldValidate:"onBlur",
	shouldRevalidate:"onInput",
});
	return(
	<Card >
		<CardHeader>
			<CardTitle>Settings</CardTitle>
			<CardDescription>Manage your account settings</CardDescription>
		</CardHeader>
		<form id={form.id}onSubmit={form.onSubmit} action={formAction} noValidate>
			<CardContent className=" flex flex-col gap-y-4">
				<div className="flex flex-col gap-y-2">
					<Label>Full Name</Label>
					<Input name={fields.fullname.name}
					key={fields.fullname.key }	
					defaultValue={fullname} 
					placeholder="Your Name Here"/>
					<p className="text-red-500 text-sm">{fields.fullname.errors}</p>
				</div>
				<div>
					<Label>Email</Label>
					<Input disabled defaultValue={email} placeholder="Your Email Here"/>
				</div>

			</CardContent>
			<CardFooter>
				<SubmitButton className="bg-primary text-primary-foreground" text="Save Changes"/>
			</CardFooter>
		</form>
	</Card>
	);
}
