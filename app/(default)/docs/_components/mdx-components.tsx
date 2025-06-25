import ContentLink from './content-link'
import { cn } from '@/lib/utils'


import * as runtime from 'react/jsx-runtime'

const sharedComponents = {
    a: ({ href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <ContentLink href={href || ''}>
            {props.children}
        </ContentLink>
    ),
    h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h1
            className={cn(
                "font-heading mt-2 scroll-m-20 text-4xl font-bold",
                className
            )}
            {...props}
        />
    ),
    h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h2
            className={cn(
                "font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0",
                className
            )}
            {...props}
        />
    ),
    h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h3
            className={cn(
                "font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
                className
            )}
            {...props}
        />
    ),
    h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h4
            className={cn(
                "font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
                className
            )}
            {...props}
        />
    ),
    h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h5
            className={cn(
                "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
                className
            )}
            {...props}
        />
    ),
    h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h6
            className={cn(
                "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
                className
            )}
            {...props}
        />
    ),
    p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
        <p
            className={cn("leading-7 not-first:mt-6", className)}
            {...props}
        />
    ),
    ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
        <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
    ),
    ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
        <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
    ),
    li: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
        <li className={cn("mt-2", className)} {...props} />
    ),
    blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
        <blockquote
            className={cn("mt-6 border-l-2 pl-6 italic", className)}
            {...props}
        />
    ),
}





// parse the Velite generated MDX code into a React component function
const useMDXComponent = (code: string) => {
    const fn = new Function(code)
    return fn({ ...runtime }).default
}

interface MDXProps {
    source: string
    components?: Record<string, React.ComponentType>
}

// MDXContent component
export const MDXContent = ({ source: content, components }: MDXProps) => {
    const Component = useMDXComponent(content)
    return <Component components={{ ...sharedComponents, ...components }} />
}


/*
// MDXContent component
export const MDXContent = (props: MDXRemoteProps) => {

    return <MDXRemote
        {...props}
        components={{ ...sharedComponents, ...(props.components || {}) }}
        options={{
            mdxOptions: {
                remarkPlugins: [
                    remarkGfm,
                ]
            }
        }}
    />
}
*/
