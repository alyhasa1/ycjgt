import { Sidebar } from "@/components/sidebar";
import { ChatDemo } from "@/components/chat-demo";

export default function Home() {
  return (
    <div className="relative h-screen overflow-hidden bg-mesh">
      {/* Sidebar */}
      <Sidebar />

      {/* Chat area */}
      <main className="relative z-10 ml-0 md:ml-[72px] flex h-screen flex-col">
        <ChatDemo />
      </main>
    </div>
  );
}
