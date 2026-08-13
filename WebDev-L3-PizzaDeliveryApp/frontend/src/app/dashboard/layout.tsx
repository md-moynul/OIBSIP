import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { getServerSession } from "@/lib/sessions/serverSession";

const DashboardLayout = async({children }: Readonly<{
  children: React.ReactNode;
}>) => {
    const user = await getServerSession();
    return (
        <div className="flex flex-col md:flex-row">
            <DashboardSidebar user={user} />
            <main className="flex-1">
            {children}
            </main>
        </div>
    );
};

export default DashboardLayout;