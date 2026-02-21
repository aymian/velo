"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function ResponsiveGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkResolution = () => {
            // Threshold for mobile devices (standard is usually 768px for tablets, 640px for small mobiles)
            // User requested "mobile small devices screen"
            const isMobile = window.innerWidth < 640;

            if (isMobile && pathname !== "/unsupported") {
                router.push("/unsupported");
            } else if (!isMobile && pathname === "/unsupported") {
                router.push("/");
            }
        };

        // Check on mount
        checkResolution();

        // Check on resize
        window.addEventListener("resize", checkResolution);
        return () => window.removeEventListener("resize", checkResolution);
    }, [pathname, router]);

    return <>{children}</>;
}
