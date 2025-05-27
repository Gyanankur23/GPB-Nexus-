import { useRef, useState } from "react";
import { generateVerifiableCode, downloadCertificatePDF } from "../lib/certificateUtils";
import { useTheme } from "../lib/theme";
import { auth } from "../lib/firebase";

export default function Certificate({ roadmapTitle }) {
  const [name, setName] = useState(auth.currentUser?.displayName || "");
  const [entered, setEntered] = useState(false);
  const certificateRef = useRef();
  const date = new Date().toLocaleDateString();
  const code = generateVerifiableCode(name, date, roadmapTitle);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleDownload = () => {
    downloadCertificatePDF(certificateRef, "certificate.pdf");
  };

  if (!entered) {
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          setEntered(true);
        }}
        className="max-w-sm mx-auto bg-white dark:bg-black shadow-md rounded p-6 flex flex-col gap-4"
      >
        <label className="font-bold">Enter your name as it should appear on the certificate:</label>
        <input
          className="p-2 border rounded"
          value={name}
          required
          onChange={e => setName(e.target.value)}
          placeholder="Your full name"
        />
        <button
          className="bg-accent text-white py-2 rounded hover:opacity-90"
          type="submit"
        >Generate Certificate</button>
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        ref={certificateRef}
        className="bg-white text-black border-8 border-accent rounded-2xl shadow-lg p-10 max-w-2xl w-full relative"
        style={{
          background: "linear-gradient(135deg, #FFDAB9 0%, #FFF5C3 100%)"
        }}
      >
        <div className="text-center">
          <img src="/images/logo.png" alt="Logo" className="h-12 mx-auto mb-2" />
          <h1 className="text-3xl font-bold mb-2">Certificate of Accomplishment</h1>
          <p className="mb-4 font-semibold">Presented to</p>
          <div className="text-2xl font-bold mb-2">{name}</div>
          <p className="mb-4">for successfully passing the <span className="font-semibold">{roadmapTitle} Certification Exam</span></p>
          <div className="flex justify-between mt-8">
            <div>
              <img src="/images/signature.png" alt="Signature" className="h-10" />
              <div className="text-xs">GPB Nexus Team</div>
            </div>
            <div className="text-xs text-right">
              Date: {date}<br />
              Code: <span className="font-mono">{code}</span>
            </div>
          </div>
        </div>
      </div>
      <button
        className="bg-accent text-white px-6 py-2 rounded font-bold hover:opacity-90"
        onClick={handleDownload}
      >
        Download as PDF
      </button>
      <div className="flex gap-4 justify-center">
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
          target="_blank" rel="noopener noreferrer"
          className="text-accent underline"
        >Share on LinkedIn</a>
        <a
          href={`https://wa.me/?text=I%20just%20earned%20a%20${encodeURIComponent(roadmapTitle)}%20certificate%20from%20GPB%20Nexus!%20${encodeURIComponent(shareUrl)}`}
          target="_blank" rel="noopener noreferrer"
          className="text-accent underline"
        >Share on WhatsApp</a>
        <a
          href={`https://twitter.com/intent/tweet?text=I%20just%20earned%20a%20${encodeURIComponent(roadmapTitle)}%20certificate%20from%20GPB%20Nexus!%20${encodeURIComponent(shareUrl)}`}
          target="_blank" rel="noopener noreferrer"
          className="text-accent underline"
        >Share on X</a>
      </div>
    </div>
  );
}
