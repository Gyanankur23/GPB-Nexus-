import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function generateVerifiableCode(name, date, roadmapTitle) {
  // Example: hash-like code
  const raw = `${name}-${date}-${roadmapTitle}`;
  return btoa(unescape(encodeURIComponent(raw))).substring(0, 10).toUpperCase();
}

export async function downloadCertificatePDF(certificateRef, fileName = "certificate.pdf") {
  const canvas = await html2canvas(certificateRef.current, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF("landscape", "px", [canvas.width, canvas.height]);
  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save(fileName);
}
