"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectTrigger } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SelectItem, SelectLabel, SelectValue } from "@/components/ui/select";
import { ButtonGroup } from "@/components/ButtonGroup";
import { Button } from "@/components/ui/button";
import { useActionState, useState } from "react";
import { Video } from "lucide-react";
import Link from "next/link";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { CreateEventType } from "@/app/actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { eventTypeSchema } from "@/app/lib/zodSchemas";


type VideoCallProvider = "Google Meet" | "Zoom" | "Microsoft Teams";

export default function NewEventRoute() {
	const[activePlatform, setActivePlatform] = useState<VideoCallProvider>("Google Meet");
	const [state, formAction] = useActionState(CreateEventType, undefined);
	const [form, fields] = useForm({
		lastResult:state,
		onValidate({ formData }) {
			return parseWithZod(formData, {
				schema: eventTypeSchema,
			});
		},

		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	})
	  return (
	
		<div className="w-full h-full flex flex-1 items-center justify-center">
			<Card>
				<CardHeader>
					<CardTitle>Add new appointment type</CardTitle>
					<CardDescription>Create appointment with custom duration</CardDescription>
				</CardHeader>
				<form id={form.id} onSubmit={form.onSubmit} action={formAction} noValidate >
					<CardContent className="grid gap-y-4">
						<div className="flex flex-col gap-y-2">
							<Label>Title</Label>
							<Input name={fields.title.name} key={fields.title.key} 
							  defaultValue={fields.title.initialValue}
							   placeholder="30 minutes meeting"></Input>
							<p className="text-red-600" text-sm>{fields.title.errors}</p>
						</div>
						<div className="flex flex-col gap-y-2">
							<Label>URL Sug</Label>
							<div className="flex rounded-md">
								<span className="inline-flex items-center px-2
								rounded-l-md border border-r-0 border-muted bg-muted text-sm
								text-muted-foreground">calendaire.in/</span>
								<Input name={fields.url.name} key={fields.url.key} 
								defaultValue={fields.url.initialValue} className="rounded-l-none" placeholder="Your custom URL here"></Input>
								<p className="text-red-600" text-sm>{fields.title.errors}</p>
							</div>

						</div>

						<div className="flex flex-col gap-y-2">
							<Label>Description</Label>
							<Textarea name={fields.description.name} key={fields.description.key} 
							  defaultValue={fields.description.initialValue} placeholder="Add description about your event here" />
							  <p className="text-red-600" text-sm>{fields.title.errors}</p>
						</div>

						<div className="flex flex-col gap-y-2">
							<Label>Duration</Label>
							<Select name={fields.duration.name} key={fields.duration.key} 
							  defaultValue={fields.duration.initialValue}>
								<SelectTrigger>
									<SelectValue placeholder="Select meeting duration"/>
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
									 <SelectLabel>Duration</SelectLabel>
									
									 <SelectItem value="15">15 Minutes</SelectItem>
									 <SelectItem value="30">30 Minutes</SelectItem>
									 <SelectItem value="45">45 Minutes</SelectItem>
									 <SelectItem value="60">1 Hour</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
							<p className="text-red-600" text-sm>{fields.title.errors}</p>
						</div>

						<div className="grid gap-y-2">
							<Label>
								<input type="hidden"name={fields.videoCallSoftware.name}  value={activePlatform}  />
								<ButtonGroup >
								  <Button  onClick={()=>setActivePlatform("Zoom")} 
								   className="w-full"
								   variant={activePlatform === "Zoom" ? "default" : "outline"}>
								   
									Zoom</Button>
								  <Button  onClick={()=>setActivePlatform("Google Meet")}  
								  className="w-full"
								  variant={activePlatform === "Google Meet" ? "default" : "outline"}>
									Google Meet</Button>
								  <Button  onClick={()=>setActivePlatform("Microsoft Teams")} 
								   className="w-full"
								   variant={activePlatform === "Microsoft Teams" ? "default" : "outline"}>
									Microsoft Teams</Button>

								</ButtonGroup>
							</Label>
							<p className="text-red-600" text-sm>{fields.title.errors}</p>
						</div>
					</CardContent>
					<CardFooter className="w-full flex justify-between">
						<Button asChild variant="secondary">
							<Link href="/dashboard">Cancel</Link>
						</Button>
						<SubmitButton text="Create Event Type "/>
					</CardFooter>
				</form>
			</Card>
		</div>
  );
}