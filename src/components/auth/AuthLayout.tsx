import { AuthCarousel } from "./AuthCarousel";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dd-gray-100 p-4">
      <div className="grid w-full max-w-[1220px] overflow-hidden rounded-lg bg-white shadow-sm lg:grid-cols-2 lg:grid-rows-1">
        <div className="hidden h-[675px] lg:block">
          <AuthCarousel />
        </div>
        <div className="relative flex h-[675px] items-center justify-center px-12 lg:min-h-[675px]">
          {children}
        </div>
      </div>
    </div>
  );
}
