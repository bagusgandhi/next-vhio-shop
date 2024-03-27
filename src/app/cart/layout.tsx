import NavMenu from "@/components/NavMenu";
import { Metadata } from "next";

export function metadata(): Metadata {
    return {
        title: "Your cart",
        description: "All your product in cart",
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
