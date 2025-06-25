import { SidebarTrigger } from "@/components/ui/sidebar";
import { docs } from ".velite"
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCategoryPathBySlug } from "../_components/utils";
import Toc from "../_components/toc";
import { MDXContent } from "../_components/mdx-components";


interface DocPageProps {
    params: Promise<{
        slug: string[]
    }>
}

export async function generateMetadata(props: DocPageProps): Promise<Metadata> {
    const params = await props.params;
    const doc = docs.find(doc => doc.slugAsParams === params.slug?.join("/"));
    if (!doc) {
        return {
            title: "404 - Not found",
        };
    }

    return {
        title: doc.title,
    };
}

export async function generateStaticParams(): Promise<
    DocPageProps["params"][]
> {
    return docs.map(doc => {
        return {
            slug: doc.slugAsParams.split("/")
        }
    })
}


export default async function Page(props: DocPageProps) {
    const params = await props.params;
    const doc = docs.find(doc => doc.slugAsParams === params.slug?.join("/"));
    if (!doc) {
        redirect("/docs/overview");
    }

    const categoryPath = getCategoryPathBySlug(doc.slugAsParams);

    return (
        <main className="max-w-full">
            <div className="flex items-start gap-4 border-b border-border mb-4 bg-sidebar p-4 fixed top-0 w-full">
                <SidebarTrigger />
                <h1>
                    <span className="block text-muted-foreground text-xs">
                        {categoryPath.join(' / ')}
                    </span>
                    <span className="font-bold text-2xl">
                        {doc.title}
                    </span>
                </h1>
            </div>

            <div className="flex w-full min-w-full gap-8 pt-[81px] overflow-x-auto">
                <div className="px-4 md:px-12 grow py-12 max-w-2xl">
                    <MDXContent
                        source={doc.content}
                    />
                </div>

                <aside className="hidden lg:block relative min-w-[256px] ">
                    <div className="fixed top-[81px] py-4">
                        <Toc
                            toc={doc.toc}
                        />
                    </div>
                </aside>
            </div>

        </main>




    );
}
