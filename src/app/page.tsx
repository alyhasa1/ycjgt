import { Sidebar } from "@/components/sidebar";
import { ChatDemo } from "@/components/chat-demo";

export default function Home() {
  return (
    <div className="relative h-[100svh] min-h-[100svh] w-full overflow-hidden overscroll-none bg-mesh supports-[height:100dvh]:h-[100dvh] supports-[height:100dvh]:min-h-[100dvh]">
      {/* Sidebar */}
      <Sidebar />

      {/* Chat area */}
      <main className="relative z-10 h-full w-full md:ml-[72px] md:w-[calc(100%-72px)]">
        <ChatDemo />
      </main>
    </div>
  );
}
