import Image from "next/image";
import Link from "next/link";
import calendaireLogo from "@/public/Calendaire Logo.png"
import { AuthModal } from "./AuthModal";
export function Navbar()
{
	return(
		<div className=" bg-muted/100 flex py-3 items-center justify-between ">
			<Link href="/" className="flex items-center gap-2 pl-4">
				<Image src={calendaireLogo} alt="Calendaire Logo" width={155} height={185}/>
				
			</Link>
			<AuthModal/>

			
		</div>
	);
}
