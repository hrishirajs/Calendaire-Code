import Image from "next/image";
import Link from "next/link";
import calendaireLogo from "@/public/Calendaire Logo.png"
import { AuthModal } from "./AuthModal";

export function Navbar() {
	return(
		<div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-black to-gray-800 h-20 flex items-center justify-between px-6 md:px-12 shadow-md">
			<div className="flex items-center gap-2">
				<Link href="/" className="flex items-center gap-2">
					<Image src={calendaireLogo} alt="Calendaire Logo" className="h-20 w-auto"/>
				</Link>
			</div>
			
			{/* Desktop Navigation */}
			<div className="hidden md:flex items-center space-x-8">
				<Link href="#features" className="text-white hover:text-gray-300 transition-colors">
					Features
				</Link>
				<a 
					href="https://github.com/hrishirajs" 
					target="_blank" 
					rel="noopener noreferrer" 
					className="text-white hover:text-gray-300 transition-colors"
				>
					Developer
				</a>
			</div>
			
			<div className="flex items-center">
				<AuthModal/>
			</div>
		</div>
	);
}
