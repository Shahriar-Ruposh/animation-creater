import dynamic from "next/dynamic";
import ColorForm from "../components/ColorForm";

const AnimationDisplay = dynamic(() => import("../components/AnimationDisplay"), { ssr: false });

export default function Home() {
  return (
    <>
      <main className="min-h-screen flex flex-col bg-gray-100">
        {/* Header containing ColorForm */}
        <div className="bg-white p-4 shadow-md z-10">
          <h1 className="text-2xl font-bold mb-4 text-center">Color Animation Playground</h1>
          <ColorForm />
        </div>

        {/* AnimationDisplay fills the remaining space */}
        <div className="flex-grow relative overflow-hidden" style={{ height: "calc(100vh - 0px)" }}>
          <AnimationDisplay />
        </div>

        {/* Add some space before the footer */}
        <div style={{ height: "150px" }}></div>
      </main>

      {/* Footer always sticks to the bottom */}
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2023 Color Animation Playground. All rights reserved.</p>
      </footer>
    </>
  );
}
