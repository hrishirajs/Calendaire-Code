import { EditEventForm } from "@/app/components/EditEventTypeForm";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

async function getData(eventTypeId: string) {
	const data = await prisma.eventType.findUnique({
		where: {
			id: eventTypeId,
		},
		select: {
			id: true,
			description: true,
			active: true,
			title: true,
			url: true,
			duration: true,
			videoCallSoftware: true,
		},
	});

	if (!data) {
		return notFound();
	}
	return data;
}

export default async function EditRoute({
	params,
}: {
	params: { eventTypeId: string };
}) {
	const data = await getData(params.eventTypeId);
	
	return (
		<EditEventForm
			
		/>
	);
}