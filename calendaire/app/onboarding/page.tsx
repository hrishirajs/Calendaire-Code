"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { OnboardingAction } from "../actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { onboardingSchema } from "../lib/zodSchemas";
import { SubmitButton } from "../components/SubmitButtons";
export default function OnboardingPage() {
	const [state, formAction] = useActionState(OnboardingAction, undefined);
	const[form, fields]=useForm({
		lastResult: state, 
		onValidate({formData}){
			return parseWithZod(formData,{
				schema:onboardingSchema,
			});

		},
	
		shouldValidate:"onBlur",
		shouldRevalidate:"onInput",

	});

	return (
		<div className="h-screen w-screen flex items-center justify-center">
			<Card>
				<CardHeader>
					<CardTitle>
						Welcome to Calendaire
					</CardTitle>
					<CardDescription>Kindly provide the following information</CardDescription>
				</CardHeader>
				<form id={form.id} onSubmit={form.onSubmit} action={formAction}
				noValidate>
				 <CardContent className="flex flex-col gap-y-5">
					<div className=" grid gap-y-2">
						<Label>Full Name</Label>
						<Input 
						name={fields.fullName.name} 
						defaultValue={fields.fullName.initialValue}
						key={fields.fullName.key} 
						placeholder="Your Name Here" />
						<p className="text-red-600" text-sm>{fields.fullName.errors}</p>
					</div>
					<div className="grid gap-y-2">
						<Label>Username</Label>
						<div className="flex rounded-md">
							<span className="inline-flex items-center px-3 rounded-l-md border border-r-0 
							border-muted bg-muted text-sm text-muted-foreground">calendaire.com/
							</span>
							<Input
							placeholder="username"
							className="rounded-l-none" 
							name={fields.userName.name}
							key={fields.userName.key}
							defaultValue={fields.userName.initialValue}
							/>
							<p className="text-red-600 text-sm">{fields.userName.errors}</p>
						</div>

					</div>
				 </CardContent>
				 <CardFooter>
					<SubmitButton text="Submit"/>
				 </CardFooter>
			    </form>
			</Card>
		</div>
	);
}