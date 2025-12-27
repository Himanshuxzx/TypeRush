import TypingBox from "../components/TypingBox";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between gap-6 p-6">
      <Header />
      <TypingBox />
      <Footer />
    </div>
  );
}
