import { Footer } from "@/components/organisms/footer";
import { Header } from "@/components/organisms/header";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-text">
      <Header />
      <main className="min-h-[calc(100vh-117px)] px-5 pt-[80px] pb-5 lg:px-[25px] lg:pt-[85px] xl:px-[30px] xl:pt-[90px]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
