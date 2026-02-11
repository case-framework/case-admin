import { auth } from '@/lib/auth/auth';
import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { headers } from 'next/headers';


async function createContextFromHeaders(headers: Headers) {
  const session = await auth.api.getSession({
    headers,
  });

  return {
    session: session ?? null,
    user: session?.user ?? null,
  };
}

export async function createContext(opts: FetchCreateContextFnOptions) {
  return createContextFromHeaders(opts.req.headers);
}

export async function createServerContext() {
  const headersList = await headers();
  return createContextFromHeaders(headersList);
}

export type Context = Awaited<ReturnType<typeof createContext>>;
