import { generatePageMetadata } from "@/lib/config/page-metadata";
import { pageStudies } from "@/lib/config/pages";

export const generateMetadata = () => generatePageMetadata(pageStudies);

const StudiesPage = () => {
	return (
		<div>
			<h1>Studies Page</h1>
		</div>
	)
}

export default StudiesPage;