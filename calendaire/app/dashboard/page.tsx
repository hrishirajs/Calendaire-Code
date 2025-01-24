import { redirect } from "next/navigation";
import { auth } from "../lib/auth";

export default  async function DashboardPage() {
const session=await auth();
if(!session?.user){
	redirect("/")
}
	return (
		<div>
			<h1> HELLO FROM DASHBOARD</h1>
		</div>
	);
}
