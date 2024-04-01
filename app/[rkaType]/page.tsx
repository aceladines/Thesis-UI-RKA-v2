"use client";

import { useState, useRef, useEffect } from "react";

import { Bounce, ToastContainer, toast } from "react-toastify";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "react-toastify/dist/ReactToastify.css";

import extractTextFromPdf from "@/utils/extract-pdfText";

import Label from "@/components/Label";
import Textarea from "@/components/Textarea";
import Input from "@/components/Input";
import Button from "@/components/Button";

type ResultObject = {
  percentage: number;
  classification: string;
  breakdown: {
    intersection: string[];
    union: string[];
  };
};

export default function Page({
  params,
}: Readonly<{ params: { rkaType: string } }>) {
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

    const URL = process.env.API_URL ?? "";

    fetch(URL, {
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
        console.log(error);
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

  return (
    <div className="mx-auto w-[calc(100vw-3rem)] lg:w-[1200px] flex flex-col ">
      <div className="flex items-center lg:h-[100vh] relative">
        <div
          className={`absolute -left-24 ${
            displayContentOne ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          <Button
            type="button"
            style="circle"
            color="info"
            onClick={() => handleDocumentSelection(0)}
            classname="text-white lg:w-14"
          >
            {"<-"}
          </Button>
        </div>
        <div
          className={`absolute -right-24 ${
            displayContentOne ? "" : "opacity-60 pointer-events-none"
          }`}
        >
          <Button
            type="button"
            style="circle"
            color="info"
            onClick={() => handleDocumentSelection(1)}
            classname="text-white lg:w-14"
          >
            {"->"}
          </Button>
        </div>
        <ToastContainer />
        <div className="flex flex-col w-full">
          <div className="grid">
            <div className="flex justify-between items-center bg-white py-2  rounded-t-lg px-4 dark:bg-gray-950 dark:text-gray-300 border-b-2 border-gray-200">
              <Label htmlFor={`content${displayContentOne ? "One" : "Two"}`}>
                {displayContentOne ? "Document 1" : "Document 2"}
              </Label>

              <Button
                type="button"
                style="square"
                color="danger"
                classname="text-gray-50 px-2"
                onClick={() => handleClearDocument(displayContentOne ? 0 : 1)}
              >
                Clear
              </Button>
            </div>
            <form
              className="w-full lg:h-[70vh] relative"
              onSubmit={handleCalculateSimilarity}
            >
              <Textarea
                name={`content${displayContentOne ? "One" : "Two"}`}
                id={`content${displayContentOne ? "One" : "Two"}`}
                placeholder="Please upload a document to continue..."
                onChange={() => {}}
                value={extractedTexts[displayContentOne ? 0 : 1]}
                classname="p-4"
              />

              <div className="absolute right-6 bottom-8">
                <Button
                  type="submit"
                  color="dark"
                  style="square"
                  classname="lg:px-3 lg:py-1 text-white"
                >
                  Calculate
                </Button>
              </div>
            </form>
            <div className="flex items-center justify-between bg-white py-2 px-4 rounded-b-lg border-t-2 border-gray-200 dark:bg-black shadow-lg">
              <div className={`${displayContentOne ? "" : "hidden"}`}>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={extractText}
                  ref={fileInputOneRef}
                />
              </div>

              <div className={`${displayContentOne ? "hidden" : ""}`}>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={extractText}
                  ref={fileInputTwoRef}
                />
              </div>

              <p className="font-medium">
                Word Count: {wordCounts[displayContentOne ? 0 : 1]}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={resultRef}
        className={`bg-white p-4 rounded-xl mb-12 shadow-lg${
          calculateTriggered ? "" : "hidden"
        }`}
      >
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-8">
          Similarity Analysis
        </h1>

        {resultLoading ? (
          <div className="flex flex-col justify-center h-full items-center gap-4 py-12">
            <span className="loader"></span>
            <p className="text-md mt-6 font-light italic">
              Working on it! Please wait...
            </p>
          </div>
        ) : (
          <div className="w-full border-2 rounded-xl">
            <div className="flex flex-col w-fit mx-auto p-6 rounded-xl justify-center items-start gap-6">
              <div className="flex items-center gap-12">
                <div className="aspect-square w-[100px] md:w-28 lg:w-36 relative">
                  <CircularProgressbar
                    value={Math.floor(result.percentage)}
                    text={`${Math.floor(result.percentage)}%`}
                  />
                </div>
                <p>{getConfidenceString(result.percentage)}</p>
              </div>
              <div className="">
                <h1 className="mb-1 text-base font-bold text-gray-700">
                  Breakdown of similarity
                </h1>
                <p className=" text-sm font-extralight">
                  The data are cleaned and only unique strings per document are
                  processed to avoid redudancy.
                </p>
              </div>
              <div className="flex flex-col">
                <p className="mb-4 italic text-sm lg:text-base">
                  <span className="mb-4 rounded-lg bg-red-500 px-2 py-1 font-medium not-italic text-white">
                    {result.breakdown.intersection.length}
                  </span>{" "}
                  number of strings in the intersection set.
                </p>
                <p className="mb-4 italic text-sm lg:text-base">
                  <span className="mb-4 rounded-lg bg-green-600 px-2 py-1 font-medium not-italic text-white">
                    {result.breakdown.union.length}
                  </span>{" "}
                  number of strings in union set.
                </p>
              </div>
              <p className="italic text-sm lg:text-base">
                Similarty percentage are computed using{" "}
                <span className="font-medium">Jaccard Similarity</span>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
