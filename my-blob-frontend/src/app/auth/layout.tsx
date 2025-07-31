import { AlertProvider } from "../../components/AlertProvider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AlertProvider>
      <main className="min-h-screen bg-gray-50">{children}</main>
    </AlertProvider>
  );
}
