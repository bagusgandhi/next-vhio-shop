import { Metadata } from "next";

export function metadata(): Metadata {
    return {
        title: "Authtenticate to vhio shop",
        description: "Please login or register to access vhio shop",
    };
}

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="h-screen">
                <div className="flex items-center justify-center">
                    <div className="flex flex-col gap-4 mx-auto lg:w-1/3 pt-8">
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Layout;
