import NavMenu from "@/components/NavMenu";
import { Metadata } from "next";

export function metadata(): Metadata {
    return {
        title: "Payment",
        description: "",
    };
}

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <NavMenu />
            {children}
        </>
    )
}

export default Layout;
