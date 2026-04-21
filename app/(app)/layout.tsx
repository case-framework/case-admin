import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/features/sidebar/app-sidebar";
import { LocaleSwitcher } from "@/components/common/locale-switcher";

export default function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="flex flex-col flex-1 min-w-0">
				<header className="flex flex-row items-center border-b">
					<section className="border-r p-4">
						<SidebarTrigger />
					</section>
					<section className="ml-auto p-3 pr-4">
						<LocaleSwitcher />
					</section>
				</header>
				{children}
			</main>
		</SidebarProvider>
	);
}
