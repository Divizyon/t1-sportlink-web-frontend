import { AuthDemo } from "@/app/components/AuthDemo";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">
        Example Usage Zustand Auth State Management
      </h1>
      <AuthDemo />
    </main>
  );
}
