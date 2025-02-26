import { SettingsForm } from "@/app/components/SettingsForm";
import prisma from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import { notFound } from "next/navigation";
async function getData(id:string){
	const data=await prisma.user.findUnique(
	{
		where:{
			id:id
		},
		select:{
			name:true,
			email:true,
		}
	});
	if(!data){
		return notFound();
	}
	return data;

}



export default async function Settingroute(){
	const session=await requireUser();
	const data=await getData(session.user?.id as string);
	return(
		<div className="w-screen mr-2 flex items-start"><SettingsForm email={data.email} fullname={data.name as string}/></div>
		
	)
}