import React, { useRef } from "react";
import { useSampleFormContext } from "../../context/SampleFormContext";
import StepNavigation from "../../components/StepNavigation";
import FormProgressBar from "../../components/FormProgressBar";

export default function Step4_Molecular() {
  const { formData, updateSection } = useSampleFormContext();

  /* ================= SAFE DEFAULT ================= */
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

  /* ================= REFS ================= */
  const gelRef = useRef();
  const rawSeqRef = useRef();

  /* ================= HELPERS ================= */
  const section = (title, children) => (
    <section className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {children}
    </section>
  );

  const label = (text) => (
    <label className="block text-sm text-gray-600 mb-1">{text}</label>
  );

  const input = (value, onChange, placeholder = "") => (
    <input
      className="w-full p-2 border rounded-md text-base focus:ring"
      value={value}
      placeholder={placeholder}
      onChange={onChange}
    />
  );

  const select = (value, onChange, placeholder, options) => (
    <select
      className="w-full p-2 border rounded-md text-base focus:ring"
      value={value}
      onChange={onChange}
    >
      <option value="">{placeholder}</option>
      {options.map(o => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );

  const handleImage = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateSection("molecular", { gelImage: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const addRawSequenceFile = (file) => {
    const meta = {
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString()
    };
    updateSection("molecular", {
      rawSequenceFiles: [...molecular.rawSequenceFiles, meta]
    });
  };

  return (
    <div className="container mx-auto max-w-5xl p-6 space-y-8">
      <FormProgressBar step={4} steps={6} />

      <h1 className="text-2xl font-bold">Molecular</h1>

      {/* GEL IMAGE */}
      {section("Gel Image", (
        <div
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
          onClick={() => gelRef.current.click()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) handleImage(e.dataTransfer.files[0]);
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <p className="text-sm text-gray-600">Drag & Drop Gel Image Here</p>
          {molecular.gelImage && (
            <img
              src={molecular.gelImage}
              alt="Gel"
              className="mx-auto mt-4 max-h-48 rounded shadow"
            />
          )}
          <input
            ref={gelRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files[0] && handleImage(e.target.files[0])}
          />
        </div>
      ))}

      {/* RAW SEQUENCE */}
      {section("Raw Sequence Data", (
        <div
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
          onClick={() => rawSeqRef.current.click()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) addRawSequenceFile(e.dataTransfer.files[0]);
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <p className="text-sm text-gray-600">Drag & Drop RAW Sequence File Here</p>
          <input
            ref={rawSeqRef}
            type="file"
            className="hidden"
            onChange={(e) => e.target.files[0] && addRawSequenceFile(e.target.files[0])}
          />
        </div>
      ))}

      {/* METADATA */}
      {section("Molecular Metadata", (
        <div className="grid md:grid-cols-2 gap-4">
          {[
            ["markerGene","Marker Gene / Target",["16S rRNA","18S rRNA","ITS","COI","rbcL"]],
            ["dnaSource","DNA Source",["Isolated colony","Environmental sample","Tissue"]],
            ["extractionKit","Extraction Kit Used",["Qiagen","Zymo","Promega","Other"]],
            ["extractionMethod","DNA Extraction Method",["Phenol-Chloroform","Silica column","Magnetic bead"]],
            ["primerSet","Primer Set Used",["Universal","Bacteria-specific","Fungi-specific"]],
            ["pcrPlatform","PCR Platform",["Conventional PCR","qPCR","Digital PCR"]],
            ["pcrProtocol","PCR Protocol Type",["Standard","Touchdown","Nested"]],
            ["sequencingMethod","Sequencing Method",["Sanger","Illumina","Nanopore"]],
            ["sequencingVendor","Sequencing Vendor / Lab",["In-house","Macrogen","BGI","Other"]],
            ["sequencingQuality","Sequencing Quality",["Excellent","Good","Moderate","Poor"]],
            ["bioinformaticsPipeline","Bioinformatics Pipeline",["QIIME2","Mothur","DADA2","Custom"]],
            ["accessionStatus","Accession / Submission",["Not Submitted","Submitted","Published"]],
            ["dnaConcentration","DNA Concentration Range",["<10 ng/µL","10–50 ng/µL","50–100 ng/µL",">100 ng/µL"]]
          ].map(([k,l,o]) => (
            <div key={k}>
              {label(l)}
              {select(
                molecular[k],
                e => updateSection("molecular", { [k]: e.target.value }),
                `Select ${l}`,
                o
              )}
            </div>
          ))}
        </div>
      ))}

      {/* NOTES */}
      {section("Phylogenetic Description / Notes", (
        <>
          {label("Description / Notes")}
          <textarea
            className="w-full p-2 border rounded-md text-base"
            rows={4}
            value={molecular.phylogeneticNotes}
            onChange={(e) =>
              updateSection("molecular", { phylogeneticNotes: e.target.value })
            }
          />
        </>
      ))}

      <StepNavigation backPath="/add/step3" nextPath="/add/step5" />
    </div>
  );
}
