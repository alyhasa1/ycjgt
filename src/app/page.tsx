import { Sidebar } from "@/components/sidebar";
import { ChatDemo } from "@/components/chat-demo";

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-mesh">
      {/* Sidebar */}
      <Sidebar />

      {/* Chat area */}
      <main className="relative z-10 h-screen w-full md:ml-[72px] md:w-[calc(100%-72px)]">
        <ChatDemo />
      </main>
    </div>
  );
}
