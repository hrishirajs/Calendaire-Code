import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import calendaireLogo from "../../public/Calendaire Logo Inside.png"
import { signIn } from "../lib/auth";
import { GithubAuthButton, GoogleAuthButton, SlackAuthButton } from "./SubmitButtons";
export function AuthModal(){
	return(
			<Dialog>
				<DialogTrigger asChild>
					<Button className="mr-4">
						Login Now </Button>  
				</DialogTrigger>
				
				<DialogContent className="sm:max-w-[580px]">
                 <DialogHeader className="flex flex-row justify-center items center gap-2">
					<Image src={calendaireLogo} alt="Calendaire Logo" width={155} height={185}/>

					
				 </DialogHeader>
				 <div className="flex flex-col-mt-5 gap-3">
					<form action={async()=>{
						"use server"
						await signIn("google");
					}}  ><GoogleAuthButton/></form>
					<form action={async()=>{
						"use server"
						await signIn("github");
					}}  >
						<GithubAuthButton/>
						</form>
					<form action={async()=>{
						"use server"
						await signIn("slack");
					}}  > <SlackAuthButton/></form>
				 </div>
				</DialogContent>
			</Dialog>
	);
}