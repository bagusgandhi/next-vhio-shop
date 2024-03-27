import NavMenu from "@/components/NavMenu";
import { Metadata } from "next";

export function metadata(): Metadata {
    return {
        title: "Products Page",
        description: "All Products vhio shop",
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
