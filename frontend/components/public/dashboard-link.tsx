"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDemoUser } from "@/lib/demo-auth";

export function DashboardLink() {
  const [href, setHref] = useState("/login");

  useEffect(() => {
    const user = getDemoUser();
    setHref(user?.role === "admin" ? "/admin" : user?.role === "researcher" ? "/hacker" : "/login");
  }, []);

  return (
    <Link
      href={href}
      className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
    >
      Dashboard
    </Link>
  );
}
