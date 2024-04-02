import { Bounce, toast } from "react-toastify";
import { useState, useRef, useEffect } from "react";
import extractTextFromPdf from "@/utils/extract-pdfText";

type useDemoHookOptions = {
  apiUrl: string;
};

type ResultObject = {
  percentage: number;
  classification: string;
  breakdown: {
    intersection: string[];
    union: string[];
  };
};

export default function useDemoHook({ apiUrl }: useDemoHookOptions) {
  const fileInputOneRef = useRef<HTMLInputElement | null>(null);
  const fileInputTwoRef = useRef<HTMLInputElement | null>(null);
  const [extractedTexts, setExtractedTexts] = useState<string[]>(["", ""]);
  const [wordCounts, setWordCounts] = useState<number[]>([0, 0]);
  const [displayContentOne, setDisplayContentOne] = useState<boolean>(true);
  const [calculateTriggered, setCalculateTriggered] = useState<boolean>(false);
  const [resultLoading, setResultLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ResultObject>({
    percentage: 0,
    classification: "",
    breakdown: { intersection: [], union: [] },
  });

  const [shouldScrollToResult, setShouldScrollToResult] =
    useState<boolean>(false);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const showToast = (message: string, notificationType: "warn" | "error") => {
    switch (notificationType) {
      case "warn":
        toast.warn(message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        break;
      case "error":
        toast.error(message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        break;
      default:
        toast.error("Invalid notification type!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
    }
  };

  const documentNumber = displayContentOne ? 0 : 1;

  const extractText = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files?.length != 0) {
      const file = e.target.files[0];
      const fileType = file.name.split(".").pop();

      if (fileType !== "pdf") {
        showToast("Invalid file type, PDF is only allowed", "error");

        const currentRef =
          documentNumber === 0 ? fileInputOneRef : fileInputTwoRef;
        if (currentRef.current) {
          currentRef.current.value = "";
        }

        return;
      }

      extractTextFromPdf(file)
        .then((text) => {
          if (typeof text === "string") {
            const updatedTexts = [...extractedTexts];
            updatedTexts[documentNumber] = text ?? "";
            setExtractedTexts(updatedTexts);
          }
        })
        .catch((error) => {
          console.error(error.message);
          showToast(error.message, "error");
        });
    } else {
      showToast("No file selected", "warn");
      const updatedTexts = [...extractedTexts];
      updatedTexts[documentNumber] = "";
      setExtractedTexts(updatedTexts);
    }
  };

  const handleDocumentSelection = (documentNum: number): void => {
    setDisplayContentOne(documentNum === 0);
  };

  const handleCalculateSimilarity = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (extractedTexts[0].length === 0 && extractedTexts[1].length === 0) {
      showToast("Documents 1 and 2 are empty!", "warn");
      return;
    } else if (extractedTexts[0].length === 0) {
      showToast("Document 1 is empty!", "warn");
      return;
    } else if (extractedTexts[1].length === 0) {
      showToast("Document 2 is empty!", "warn");
      return;
    }
    setCalculateTriggered(true);
    setResultLoading(true);
    setShouldScrollToResult(true);

    const postData = {
      documentOne: extractedTexts[0].trim(),
      documentTwo: extractedTexts[1].trim(),
    };

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => response.json())
      .then((data: ResultObject) => {
        setResult({
          ...result,
          percentage: data.percentage,
          classification: data.classification,
          breakdown: data.breakdown,
        });
        setResultLoading(false);
      })
      .catch((error) => {
        setResultLoading(false);
        showToast("Failed fetching data from the server", "error");
      });
  };

  const handleClearDocument = (documentNumber: number): void => {
    const currentTexts = [...extractedTexts];
    currentTexts[documentNumber] = "";

    setExtractedTexts(currentTexts);

    // Clear the file reference
    const currentRef = documentNumber === 0 ? fileInputOneRef : fileInputTwoRef;
    if (currentRef.current) {
      currentRef.current.value = "";
    }
  };

  const getConfidenceString = (percentage: number) => {
    if (percentage >= 90) {
      return "The documents are virtually identical. They almost certainly contain the same information.";
    } else if (percentage >= 70) {
      return "The documents are highly similar. There's a strong likelihood they contain similar information.";
    } else if (percentage >= 50) {
      return "The documents are moderately similar. They likely share some content.";
    } else if (percentage >= 20) {
      return "The documents are somewhat dissimilar. There's a low chance they contain much common content.";
    } else {
      return "The documents are very different. They probably don't share much content.";
    }
  };

  useEffect(() => {
    const currentWordCountArray = extractedTexts.map(
      (text) => text.trim().split(" ").filter(Boolean).length || 0
    );

    setWordCounts(currentWordCountArray);
  }, [extractedTexts]);

  useEffect(() => {
    if (shouldScrollToResult && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
      setShouldScrollToResult(false);
    }
  }, [shouldScrollToResult]);

  return {
    displayContentOne,
    handleDocumentSelection,
    extractText,
    wordCounts,
    extractedTexts,
    handleCalculateSimilarity,
    handleClearDocument,
    getConfidenceString,
    calculateTriggered,
    resultLoading,
    resultRef,
    fileInputOneRef,
    fileInputTwoRef,
    result,
  };
}
