import { redirect } from "next/navigation";
import { auth } from "../lib/auth";
import { requireUser } from "../lib/hooks";

export default  async function DashboardPage() {
const session=await requireUser();
	return (
		<div>
			<h1> DASHBOARD COMPONENTS UNDER DEVELOPMENT. <br />
				TILL THEN HAVE A LOOK AT OUR ALREADY DEVELOPED FUNCTIONALITY.
			</h1>
		</div>
	);
}
