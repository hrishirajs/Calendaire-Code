"use client"

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState, useState } from "react";
import { eventTypeSchema } from "../lib/zodSchemas";
import { CreateEventType, EditEventTypeAction } from "../actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ButtonGroup } from "@/components/ButtonGroup";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SubmitButton } from "./SubmitButtons";
import { id } from "date-fns/locale";

type VideoCallProvider = "Google Meet" | "Zoom" | "Microsoft Teams";

 interface iAppProps{
	id:string;
	title:string;		
	description:string;
	url:string;
	duration:string;
	videoCallSoftware:VideoCallProvider;
	


}

export function EditEventForm({videoCallSoftware,id,description,duration,title, url}:iAppProps) {
	
	
		const[activePlatform, setActivePlatform] = useState<VideoCallProvider>( videoCallSoftware as VideoCallProvider);
		const [state, formAction] = useActionState(EditEventTypeAction, undefined);
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
						<CardTitle>Edit your Event type here</CardTitle>
						<CardDescription>Edit appointment with custom duration</CardDescription>
					</CardHeader>
					<form id={form.id} onSubmit={form.onSubmit} action={formAction} noValidate >
						<Input type="hidden" name="id" value={id} />
						
						
						<CardContent className="grid gap-y-4">
							<div className="flex flex-col gap-y-2">
								<Label>Title</Label>
								<Input name={fields.title.name} key={fields.title.key} 
								  defaultValue={title}
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
									defaultValue={url} className="rounded-l-none" placeholder="Your custom URL here"></Input>
									<p className="text-red-600" text-sm>{fields.url.errors}</p>
								</div>
	
							</div>
	
							<div className="flex flex-col gap-y-2">
								<Label>Description</Label>
								<Textarea name={fields.description.name} key={fields.description.key} 
								  defaultValue={description} placeholder="Add description about your event here" />
								  <p className="text-red-600" text-sm>{fields.description.errors}</p>
							</div>
	
							<div className="flex flex-col gap-y-2">
								<Label>Duration</Label>
								<Select name={fields.duration.name} key={fields.duration.key} 
								  defaultValue={String(duration)} > 
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
								<p className="text-red-600" text-sm>{fields.duration.errors}</p>
							</div>
	
							<div className="grid gap-y-2">
								<Label>
									<input type="hidden" name={fields.videoCallSoftware.name} value={activePlatform} />
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
								<p className="text-red-600" text-sm>{fields.videoCallSoftware.errors}</p>
							</div>
						</CardContent>
						<CardFooter className="w-full flex justify-between">
							<Button asChild variant="secondary">
								<Link href="/dashboard">Cancel</Link>
							</Button>
							<SubmitButton text="Save Changes"/>
						</CardFooter>
					</form>
				</Card>
			</div>


	)

}