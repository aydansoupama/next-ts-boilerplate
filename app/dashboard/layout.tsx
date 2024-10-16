import Navbar from "@/components/navbar/Navbar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Navbar />
            <main className="container mx-auto">
                <div className="flex flex-col mx-36 my-16 space-y-8">
                    {children}
                </div>
            </main >
        </>
    )
}
