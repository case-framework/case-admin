import Link from "next/link";

export default async function Page() {
    return (
        <div>
            TODO: page
            <Link href='/tools/admin-v1'>
                test
            </Link>
            <Link href='/service-status'>
                Service Status
            </Link>
        </div>
    )
}
