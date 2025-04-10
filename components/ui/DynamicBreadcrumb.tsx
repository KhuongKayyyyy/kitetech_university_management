'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export function DynamicBreadcrumb() {
    const pathname = usePathname()

    // Example: "/dashboard/settings/profile"
    const pathSegments = pathname
        .split('/')
        .filter(Boolean) // remove empty strings

    const breadcrumbs = pathSegments.map((segment, index) => {
        const href = '/' + pathSegments.slice(0, index + 1).join('/')
        const label = segment
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase()) // Capitalize

        const isLast = index === pathSegments.length - 1

        return (
            <BreadcrumbItem key={href}>
                {isLast ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                    <BreadcrumbLink asChild>
                        <Link href={href}>{label}</Link>
                    </BreadcrumbLink>
                )}
                {!isLast && <BreadcrumbSeparator />}
            </BreadcrumbItem>
        )
    })

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {/* Optionally add static home/dashboard */}
                {/* <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem> */}
                {/* {pathSegments.length > 0 && <BreadcrumbSeparator className="hidden md:block" />} */}
                {breadcrumbs}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
