"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const academicYearName = searchParams.get("name"); // Get from ?name=2023-2024

  const pathSegments = pathname.split("/").filter(Boolean);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const isLast = index === pathSegments.length - 1;

    // If it's the last segment and matches a numeric ID, replace with academic year name if available
    const label =
      isLast && academicYearName
        ? academicYearName
        : segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

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
    );
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>{breadcrumbs}</BreadcrumbList>
    </Breadcrumb>
  );
}
