import React from "react";
import { useSampleFormContext } from "../../context/SampleFormContext";
import { FileDropzone } from "../../components/FileDropzone";
import StepNavigation from "../../components/StepNavigation";
import FormProgressBar from "../../components/FormProgressBar";

export default function Step4_Molecular() {
  const { formData, updateSection } = useSampleFormContext();

  /* ================= SAFE DEFAULT STRUCTURE ================= */
  const molecular = {
    gelImage: null,
    rawSequenceFiles: [],

    markerGene: "",
    dnaSource: "",
    extractionKit: "",
    extractionMethod: "",
    primerSet: "",
    pcrPlatform: "",
    pcrProtocol: "",
    sequencingMethod: "",
    sequencingVendor: "",
    sequencingQuality: "",
    bioinformaticsPipeline: "",
    accessionStatus: "",
    dnaConcentration: "",
    phylogeneticNotes: "",

    ...formData.molecular
  };

  /* ================= FILE HANDLERS ================= */
  const handleGelImage = (file) => {
    updateSection("molecular", {
      gelImage: file ? file.data : null
    });
  };

  const handleRawSequences = (files) => {
    updateSection("molecular", {
      rawSequenceFiles: Array.isArray(files)
        ? files
        : files
        ? [files]
        : []
    });
  };

  /* ================= DROPDOWN CONFIG ================= */
  const dropdowns = [
    ["markerGene", "Marker Gene / Target", ["COI", "16S rRNA", "18S rRNA", "ITS", "rbcL", "matK", "Other"]],
    ["dnaSource", "DNA Source", ["Isolate", "Tissue", "Whole Organism", "Culture", "Environmental DNA (eDNA)"]],
    ["extractionKit", "Extraction Kit Used", ["Qiagen", "Zymo", "Macherey-Nagel", "Invitrogen", "Other"]],
    ["extractionMethod", "DNA Extraction Method", ["CTAB", "Phenol-Chloroform", "Kit-based", "Boiling", "Other"]],
    ["primerSet", "Primer Set Used", ["LCO1490 / HCO2198", "27F / 1492R", "ITS1 / ITS4", "341F / 785R", "Other"]],
    ["pcrPlatform", "PCR Platform", ["Conventional PCR", "qPCR", "Digital PCR"]],
    ["pcrProtocol", "PCR Protocol Type", ["Standard PCR", "Touchdown PCR", "Nested PCR", "Multiplex PCR"]],
    ["sequencingMethod", "Sequencing Method", ["Sanger", "Illumina", "Nanopore", "PacBio"]],
    ["sequencingVendor", "Sequencing Vendor / Lab", ["Internal Laboratory", "Macrogen", "BGI", "Novogene", "1st BASE", "Other"]],
    ["sequencingQuality", "Sequencing Quality", ["Excellent", "Good", "Moderate", "Poor", "Failed"]],
    ["bioinformaticsPipeline", "Bioinformatics Pipeline", ["Manual BLAST", "QIIME2", "DADA2", "Mothur", "Custom Pipeline"]],
    ["accessionStatus", "Accession / Submission", ["Not submitted", "Submitted to GenBank", "Accession received", "BOLD submission"]],
    ["dnaConcentration", "DNA Concentration Range", ["< 5 ng/µL", "5–20 ng/µL", "20–50 ng/µL", "> 50 ng/µL"]]
  ];

  /* ================= RENDER ================= */
  return (
    <div className="max-w-6xl mx-auto p-6">
      <FormProgressBar step={4} steps={6} />

      <h2 className="text-xl font-semibold mb-6">Molecular</h2>

      <div className="grid gap-8">

        {/* ================= FILE UPLOADS ================= */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-2">Gel Image</h4>
            <FileDropzone
              multiple={false}
              accept="image/*"
              onFiles={handleGelImage}
              existing={molecular.gelImage ? [{ name: "gel-image" }] : []}
            />
            {molecular.gelImage && (
              <img
                src={molecular.gelImage}
                alt="Gel Preview"
                className="mt-3 w-full max-h-40 object-cover rounded border"
              />
            )}
          </div>

          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-2">RAW Sequence Files</h4>
            <FileDropzone
              multiple
              accept=".fastq,.fq,.ab1,.fasta,.fa"
              onFiles={handleRawSequences}
              existing={molecular.rawSequenceFiles}
            />
          </div>
        </section>

        {/* ================= METADATA ================= */}
        <section className="border rounded-lg p-6">
          <h4 className="font-medium mb-4">Molecular Metadata</h4>

          <div className="grid md:grid-cols-2 gap-4">
            {dropdowns.map(([key, label, options]) => (
              <div key={key}>
                <label className="block mb-1 text-sm font-medium">{label}</label>
                <select
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
                  value={molecular[key]}
                  onChange={(e) =>
                    updateSection("molecular", { [key]: e.target.value })
                  }
                >
                  <option value="">Select {label}</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </section>

        {/* ================= NOTES ================= */}
        <section className="border rounded-lg p-6">
          <h4 className="font-medium mb-2">Phylogenetic Description / Notes</h4>
          <textarea
            className="w-full p-3 border rounded min-h-[140px] focus:ring focus:ring-blue-200"
            placeholder="Describe phylogenetic results, clustering, similarity, or remarks..."
            value={molecular.phylogeneticNotes}
            onChange={(e) =>
              updateSection("molecular", {
                phylogeneticNotes: e.target.value
              })
            }
          />
        </section>

        {/* ================= NAVIGATION ================= */}
        <StepNavigation backPath="/add/step3" nextPath="/add/step5" />
      </div>
    </div>
  );
}
