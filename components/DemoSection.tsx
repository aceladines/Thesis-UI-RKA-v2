"use client";

import Link from "next/link";

import { ToastContainer } from "react-toastify";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "react-toastify/dist/ReactToastify.css";

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

interface DemoSectionProps {
  headerTag: string;
  subheader: string;
  displayContentOne: boolean;
  handleDocumentSelection: (documentNum: number) => void;
  extractText: (e: React.ChangeEvent<HTMLInputElement>) => void;
  wordCounts: number[];
  extractedTexts: string[];
  handleCalculateSimilarity: (e: React.FormEvent<HTMLFormElement>) => void;
  handleClearDocument: (documentNumber: number) => void;
  getConfidenceString: (percentage: number) => string;
  calculateTriggered: boolean;
  resultLoading: boolean;
  resultRef: React.MutableRefObject<HTMLDivElement | null>;
  fileInputOneRef: React.MutableRefObject<HTMLInputElement | null>;
  fileInputTwoRef: React.MutableRefObject<HTMLInputElement | null>;
  result: ResultObject;
}

export default function DemoSection(props: Readonly<DemoSectionProps>) {
  const {
    headerTag,
    subheader,
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
  } = props;

  return (
    <section className="mx-auto w-[calc(100vw-2rem)] md:w-[700px] lg:w-[900px">
      {/* Back button */}
      <div className="absolute left-4 top-4">
        <Link href="/" className="text-sm font-extralight hover:font-normal">
          Go back
        </Link>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col gap-2 justify-center h-[100vh]">
          <div className="mb-4">
            <h1 className="font-bold text-xl lg:text-3xl tracking-tighter">
              {headerTag}
            </h1>
            <p className="text-sm font-light">{subheader}</p>
          </div>
          {/* Navigation for small devices */}
          <div className="flex gap-3 lg:hidden">
            <Button
              type="button"
              style="square"
              color="info"
              onClick={() => handleDocumentSelection(0)}
              classname={`text-white w-fit px-2 py-1 ${
                displayContentOne ? "" : "opacity-60"
              }`}
            >
              {"Document 1"}
            </Button>
            <Button
              type="button"
              style="square"
              color="info"
              onClick={() => handleDocumentSelection(1)}
              classname={`text-white w-fit px-2 py-1 ${
                displayContentOne ? "opacity-60" : ""
              }`}
            >
              {"Document 2"}
            </Button>
          </div>
          {/* Navigation for md and up devices */}
          <div className="flex items-center h-fit relative">
            <div className="hidden lg:block">
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
            </div>
            <ToastContainer />
            <div className="flex flex-col w-full">
              <div className="grid">
                <div className="flex justify-between items-center bg-white py-2  rounded-t-lg px-4 dark:bg-gray-950 dark:text-gray-300 border-b-2 border-gray-200">
                  <Label
                    htmlFor={`content${displayContentOne ? "One" : "Two"}`}
                    styles="text-lg"
                  >
                    {displayContentOne ? "Document 1" : "Document 2"}
                  </Label>

                  <Button
                    type="button"
                    style="square"
                    color="danger"
                    classname="text-gray-50 px-2"
                    onClick={() =>
                      handleClearDocument(displayContentOne ? 0 : 1)
                    }
                  >
                    Clear
                  </Button>
                </div>
                <form
                  className="w-full h-[calc(100vh-22rem)] lg:h-[70vh] relative"
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
                      classname="px-3 py-1 text-white"
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

                  <p className="text-xs font-medium lg:text-base">
                    Word Count: {wordCounts[displayContentOne ? 0 : 1]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={resultRef}
          className={`bg-white p-4 rounded-xl mb-12 shadow-lg ${
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
              <div className="flex flex-col mx-auto p-6 rounded-xl justify-center items-start gap-6 w-full">
                <div className="flex items-center gap-6 w-full">
                  <div className="aspect-square w-80 md:w-28 lg:w-36 relative">
                    <CircularProgressbar
                      value={Math.floor(result.percentage)}
                      text={`${Math.floor(result.percentage)}%`}
                    />
                  </div>
                  <p className="text-md">
                    {getConfidenceString(result.percentage)}
                  </p>
                </div>
                <div className="">
                  <h1 className="mb-1 text-base font-bold text-gray-700">
                    Breakdown of similarity
                  </h1>
                  <p className=" text-sm font-extralight">
                    The data are cleaned and only unique strings per document
                    are processed to avoid redudancy.
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
    </section>
  );
}
