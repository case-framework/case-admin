"use client";

import { LoadingButton } from "@/components/c-ui/loading-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Home() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
			<main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
				<Button
					onClick={() => toast.success("Hello")}
				>Click me</Button>

				<LoadingButton
					onClick={() => toast.success("Hello")}
					isLoading={true}
					variant="outline"
				>
					Click me
				</LoadingButton>

				<div className="flex flex-col gap-4">
					<div>

					</div>
					<div>

					</div>
				</div>

				<div className="@container">
					<div className={cn(
						"bg-zinc-500 dark:bg-black  size-5",
						"animate-pulse",
						1 < 2 ? "bg-red-500" : "bg-blue-500",
						{
							"bg-red-500": true,
						}
					)}>

					</div>
					<div className="bg-zinc-50 dark:bg-black h-5">

					</div>
				</div>
			</main>
		</div>
	);
}
