"use client";

import { Switch } from "@/components/ui/switch";
import { useTransition } from "react";
import { UpdateEventTypeStatusAction } from "../actions";
import { toast } from "sonner";

export function MenuActiveSwitch({initialChecked, eventTypeId}:
	 {initialChecked: boolean;
		eventTypeId: string;}) {
	const [isPending, startTransition] = useTransition();

	const handleToggle = async (isChecked: boolean) => {
		startTransition(async () => {
			try {
				const result = await UpdateEventTypeStatusAction(undefined, { eventTypeId, isChecked });
				if (result?.status === "success") {
					toast.success("Event type status updated");
				} else {
					toast.error("Error updating event type status");
				}
			} catch (error) {
				toast.error("Error updating event type status");
			}
		});
	};

	return (
		<Switch 
			disabled={isPending} 
			defaultChecked={initialChecked}
			onCheckedChange={handleToggle}
		/>
	);
}		