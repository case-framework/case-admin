interface PageHeaderProps {
	title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
	return (
		<div className="p-6">
			<h1 className="text-xl font-semibold">{title}</h1>
		</div>
	);
}
