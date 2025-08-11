import React from "react";
import TermTooltip from "@/components/TermTooltip";

// Dictionary of terms and their definitions
const termDefinitions: Record<string, string> = {
  SAT: "Self Assessment Tool - alat bantu penilaian mandiri untuk mengukur kesiapan dalam budidaya kelapa sawit berkelanjutan",
  RSPO: "Roundtable on Sustainable Palm Oil - organisasi yang menetapkan standar untuk produksi minyak kelapa sawit berkelanjutan",
  PADI: "Platform untuk Agroindustri Digital Indonesia - platform digital untuk mendukung sektor pertanian",
  "P&C":
    "Prinsip dan Kriteria - standar dan persyaratan yang harus dipenuhi untuk sertifikasi RSPO",
};

export const parseTextWithTooltips = (text: string): React.ReactNode => {
  const words = text.split(" ");

  return words.map((word, index) => {
    // Remove punctuation for matching
    const cleanWord = word.replace(/[.,!?;:]$/, "");
    const punctuation = word.match(/[.,!?;:]$/) ? word.slice(-1) : "";

    if (termDefinitions[cleanWord]) {
      return (
        <span key={index}>
          {cleanWord}
          <TermTooltip
            term={cleanWord}
            definition={termDefinitions[cleanWord]}
          />
          {punctuation}{" "}
        </span>
      );
    }

    return word + " ";
  });
};
