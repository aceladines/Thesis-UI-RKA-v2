"use client";

import { useState, useEffect, useRef } from "react";

import extractTextFromPdf from "@/utils/extract-pdfText";

import { Bounce, ToastContainer, toast } from "react-toastify";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "react-toastify/dist/ReactToastify.css";

type ResultObject = {
  percentage: number;
  classification: string;
  breakdown: {
    intersection: string[];
    union: string[];
  };
};

export default function DataSection() {
  const [wordCounts, setWordCounts] = useState<number[]>([0, 0]);
  const [extractedTexts, setExtractedTexts] = useState<string[]>(["", ""]);
  const [displayContentOne, setDisplayContentOne] = useState<boolean>(true);
  const [result, setResult] = useState<ResultObject>({
    percentage: 0,
    classification: "",
    breakdown: { intersection: [], union: [] },
  });
  const [resultLoading, setResultLoading] = useState<boolean>(false);

  const fileInputRefOne = useRef<HTMLInputElement | null>(null);
  const fileInputRefTwo = useRef<HTMLInputElement | null>(null);

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

  const handleDocumentClearText = (documentNum: number) => {
    const updatedTexts = [...extractedTexts];
    updatedTexts[documentNum] = "";
    setExtractedTexts(updatedTexts);

    const currentRef = documentNum === 0 ? fileInputRefOne : fileInputRefTwo;
    if (currentRef.current) {
      currentRef.current.value = "";
    }
  };

  const extractText = (
    e: React.ChangeEvent<HTMLInputElement>,
    documentNum: number
  ): void => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileExtenstion = file.name.split(".").pop();

      if (fileExtenstion !== "pdf") {
        toast.error("Invalid file type, PDF is only allowed", {
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

        // Clear the file input reference
        const currentRef =
          documentNum === 0 ? fileInputRefOne : fileInputRefTwo;
        if (currentRef.current) {
          currentRef.current.value = "";
        }

        return;
      }
      extractTextFromPdf(file)
        .then((text) => {
          if (typeof text === "string") {
            const updatedTexts = [...extractedTexts];
            updatedTexts[documentNum] = text ?? "";
            setExtractedTexts(updatedTexts);
          }
        })
        .catch((error) => {
          console.error(error.message);
          showToast(error.message, "error");
        });
    } else {
      console.warn("No file selected");
      const updatedTexts = [...extractedTexts];
      updatedTexts[documentNum] = "";
      setExtractedTexts(updatedTexts);
    }
  };

  const handleSumit = (e: React.FormEvent<HTMLFormElement>) => {
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

    setResultLoading(true);

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

  const handleDocumentSelection = (documentNum: number): void => {
    setDisplayContentOne(documentNum === 0);
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
    const updatedWordCounts = extractedTexts.map(
      (text) => text.trim().split(" ").filter(Boolean).length || 0
    );
    setWordCounts(updatedWordCounts);
  }, [extractedTexts]);

  return (
    <div className="h-full ">
      <ToastContainer />
      <div className="mb-4 flex gap-4">
        <button
          type="button"
          onClick={() => handleDocumentSelection(0)}
          className={`rounded-lg px-3 py-2 text-sm font-semibold lg:px-4 lg:text-base ${
            displayContentOne
              ? "bg-black text-white"
              : "bg-white hover:bg-black hover:text-white"
          }`}
        >
          Document 1
        </button>

        <button
          type="button"
          onClick={() => handleDocumentSelection(1)}
          className={`rounded-lg px-3 py-2 text-sm font-semibold lg:px-4 lg:text-base ${
            !displayContentOne
              ? "bg-black text-white"
              : "bg-white hover:bg-black hover:text-white"
          }`}
        >
          Document 2
        </button>
      </div>

      <div className="flex flex-col lg:grid w-full gap-4 lg:grid-cols-3 lg:grid-flow-col h-[1000px] lg:h-[700px]">
        <form
          onSubmit={handleSumit}
          className="relative flex flex-col rounded-xl bg-white shadow-xl lg:col-span-2 min-h-[450px]"
        >
          <div className="flex justify-between border-b px-4 py-2">
            <h1 className="text-base font-semibold">Content</h1>
            <button
              type="button"
              onClick={() => handleDocumentClearText(displayContentOne ? 0 : 1)}
              className={`rounded-lg px-2 text-sm font-medium text-white ${
                wordCounts[displayContentOne ? 0 : 1] > 0
                  ? "bg-red-600 hover:bg-red-400"
                  : "bg-red-200"
              }`}
            >
              Clear
            </button>
          </div>

          <textarea
            name={`content${displayContentOne ? "One" : "Two"}`}
            id={`content${displayContentOne ? "One" : "Two"}`}
            className="flex-1 resize-none px-4 py-2 text-justify focus:outline-none text-xs md:text-sm lg:text-base"
            value={extractedTexts[displayContentOne ? 0 : 1]}
            readOnly
          />

          <button
            type="submit"
            className="absolute bottom-20 right-8 rounded-3xl bg-black px-4 py-2 font-medium text-white opacity-80 hover:opacity-100"
          >
            Calculate
          </button>

          <div className="flex items-center justify-between border-t px-4 py-3">
            <div className="flex w-full items-center justify-between">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => extractText(e, 0)}
                ref={fileInputRefOne}
                className={`w-52 cursor-pointer text-xs text-slate-500 file:mr-2 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-violet-700 hover:file:bg-violet-100 ${
                  displayContentOne ? "" : "hidden"
                }`}
              />

              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => extractText(e, 1)}
                ref={fileInputRefTwo}
                className={`w-52 cursor-pointer text-xs text-slate-500 file:mr-2 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-violet-700 hover:file:bg-violet-100 ${
                  !displayContentOne ? "" : "hidden"
                }`}
              />

              <h1 className="text-xs">
                Words: {wordCounts[displayContentOne ? 0 : 1]}
              </h1>
            </div>
          </div>
        </form>

        <div className="flex w-full flex-col rounded-xl shadow-xl bg-white overflow-hidden flex-1 lg:col-span-1 ">
          <div className="border-b px-4 py-2">
            <h1 className="text-base font-semibold">Results</h1>
          </div>
          {resultLoading ? (
            <div className="flex flex-col justify-center h-full items-center gap-4">
              <span className="loader"></span>
              <p className="text-md mt-6 font-light italic">
                Working on it! Please wait...
              </p>
            </div>
          ) : (
            <div className="relative flex h-full flex-col px-4 py-2">
              <div className="flex flex-1 flex-col">
                <h1 className="mb-4 lg:mb-8 text-base font-bold text-gray-700">
                  Similarity
                </h1>
                <div className="mx-auto mb-7 aspect-square w-[100px] md:w-28 lg:w-36 relative-">
                  {result.classification.length !== 0 ? (
                    <CircularProgressbar
                      value={Math.floor(result.percentage)}
                      text={`${Math.floor(result.percentage)}%`}
                    />
                  ) : (
                    <CircularProgressbar value={0} text={`0%`} />
                  )}
                </div>
                <p className="text-sm italic lg:text-base">
                  {result.percentage ? (
                    getConfidenceString(result.percentage)
                  ) : (
                    <>
                      Please click the{" "}
                      <span className="font-medium underline">Calculate</span>{" "}
                      button to see the result
                    </>
                  )}
                </p>
              </div>

              <div className="flex flex-1 flex-col">
                <h1 className="mb-1 text-base font-bold text-gray-700">
                  Breakdown of similarity
                </h1>
                <p className="mb-6 text-sm font-extralight">
                  The data are cleaned and only unique strings per document are
                  processed to avoid redudancy.
                </p>
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
                <p className="absolute inset-x-2 bottom-4 text-center italic text-sm lg:text-base">
                  Similarty percentage are computed using{" "}
                  <span className="font-medium">Jaccard Similarity</span>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
