// src/app/page.js
import FileUploader from "../components/FileUploader";

export default function Home() {
  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📂 CSV/Excel Sheet Validator</h1>
      <FileUploader />
    </main>
  );
}
