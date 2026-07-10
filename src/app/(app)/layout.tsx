import { GNB } from "@/components/layout/GNB";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh min-h-screen bg-dd-black">
      <GNB />
      <main className="flex-1 overflow-hidden rounded-tl-none rounded-tr-[20px] bg-dd-gray-100">
        {children}
      </main>
    </div>
  );
}
