"use client";

import useDemoHook from "@/hooks/useDemoHook";
import DemoSection from "@/components/DemoSection";

export default function Demo() {
  const apiUrl = `${process.env.API_URL_BASE}${process.env.API_NAIVE_RKA_ENDPOINT_URL}`;
  const {
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
    fileInputOneRef,
    fileInputTwoRef,
    result,
    resultRef,
  } = useDemoHook({ apiUrl });
  return (
    <DemoSection
      headerTag="Naive Rabin-Karp Algorithm"
      subheader="Analyze the similarity between the two documents using the
              Naive Rabin-Karp Algorithm"
      displayContentOne={displayContentOne}
      handleDocumentSelection={handleDocumentSelection}
      extractText={extractText}
      wordCounts={wordCounts}
      extractedTexts={extractedTexts}
      handleCalculateSimilarity={handleCalculateSimilarity}
      handleClearDocument={handleClearDocument}
      getConfidenceString={getConfidenceString}
      calculateTriggered={calculateTriggered}
      resultLoading={resultLoading}
      fileInputOneRef={fileInputOneRef}
      fileInputTwoRef={fileInputTwoRef}
      result={result}
      resultRef={resultRef}
    />
  );
}
