import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const extractTextFromPdf = async (file: Blob): Promise<string | Error> => {
  try {
    const url = URL.createObjectURL(file);
    const loadingTask = pdfjs.getDocument(url);

    const pdf = await loadingTask.promise;

    // Get pdf file total pages
    const totalPages = pdf.numPages;

    if (totalPages <= 0) return new Error("Error in extracting text from pdf");

    let extractedTexts: string = "";

    // Loop through all the page and get text data
    for (let x = 1; x <= totalPages; x++) {
      const page = await pdf.getPage(x);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(" ");
      extractedTexts += pageText;
    }

    URL.revokeObjectURL(url);
    return extractedTexts;
  } catch (error) {
    return new Error("Error in extracting text from pdf");
  }
};

export default extractTextFromPdf;
