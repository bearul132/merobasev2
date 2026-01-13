import React, { useRef, useState } from "react";
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
    primerForward: "",
    primerReverse: "",
    pcrMethod: "",
    pcrProtocol: "",
    sequencingMethod: "",
    sequencingQuality: "",
    bioinformaticsPipeline: "",
    accessionStatus: "",
    accessionNumber: "",
    dnaConcentration: "",
    phylogeneticNotes: "",
    ...formData.molecular
  };

  /* ================= COLLAPSE STATE ================= */
  const [open, setOpen] = useState({
    files: true,
    metadata: true,
    notes: true
  });

  /* ================= REFS ================= */
  const gelRef = useRef(null);
  const rawSeqRef = useRef(null);

  /* ================= UI HELPERS ================= */
  const Section = ({ title, sectionKey, children }) => (
    <section className="bg-white border rounded-xl shadow-sm">
      <button
        type="button"
        onClick={() =>
          setOpen(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }))
        }
        className="w-full flex justify-between items-center px-6 py-4"
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-sm text-gray-500">
          {open[sectionKey] ? "−" : "+"}
        </span>
      </button>
      {open[sectionKey] && (
        <div className="px-6 pb-6 pt-2 space-y-4">{children}</div>
      )}
    </section>
  );

  const Label = ({ children }) => (
    <label className="block text-sm text-gray-600 mb-1">{children}</label>
  );

  const Input = ({ value, onChange, placeholder }) => (
    <input
      type="text"
      className="w-full p-2 border rounded-md text-base focus:ring"
      value={value}
      placeholder={placeholder}
      onChange={onChange}
    />
  );

  const Select = ({ value, onChange, placeholder, options }) => (
    <select
      className="w-full p-2 border rounded-md text-base focus:ring"
      value={value}
      onChange={onChange}
    >
      <option value="">{placeholder}</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );

  /* ================= FILE HANDLERS ================= */
  const handleGelImage = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateSection("molecular", { gelImage: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleRawSequence = (file) => {
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

  /* ================= RENDER ================= */
  return (
    <div className="container mx-auto max-w-5xl p-6 space-y-8">
      <FormProgressBar step={4} steps={6} />

        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Molecular
          </h2>
          <p className="text-sm text-gray-500">
            Molecular Information
          </p>
        </div>

      {/* FILES */}
      <Section title="Gel & Raw Sequence Files" sectionKey="files">
        {/* GEL IMAGE */}
        <div
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
          onClick={() => gelRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            e.dataTransfer.files?.[0] &&
              handleGelImage(e.dataTransfer.files[0]);
          }}
        >
          <p className="text-sm text-gray-600">
            Drag & Drop Gel Image Here
          </p>
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
            onChange={(e) =>
              e.target.files?.[0] && handleGelImage(e.target.files[0])
            }
          />
        </div>

        {/* RAW SEQUENCE */}
        <div
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
          onClick={() => rawSeqRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            e.dataTransfer.files?.[0] &&
              handleRawSequence(e.dataTransfer.files[0]);
          }}
        >
          <p className="text-sm text-gray-600">
            Drag & Drop RAW Sequence File Here
          </p>
          <input
            ref={rawSeqRef}
            type="file"
            className="hidden"
            onChange={(e) =>
              e.target.files?.[0] && handleRawSequence(e.target.files[0])
            }
          />
        </div>
      </Section>

      {/* METADATA */}
      <Section title="Molecular Metadata" sectionKey="metadata">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Marker Gene / Target</Label>
            <Select
              value={molecular.markerGene}
              onChange={(e) =>
                updateSection("molecular", { markerGene: e.target.value })
              }
              placeholder="Select marker"
              options={["16S rRNA","18S rRNA","ITS","COI","rbcL","H3"]}
            />
          </div>

          <div>
            <Label>DNA Source</Label>
            <Select
              value={molecular.dnaSource}
              onChange={(e) =>
                updateSection("molecular", { dnaSource: e.target.value })
              }
              placeholder="Select DNA source"
              options={[
                "Isolated colony",
                "Environmental DNA",
                "Tissue sample"
              ]}
            />
          </div>

          <div>
            <Label>Extraction Kit Used</Label>
            <Select
              value={molecular.extractionKit}
              onChange={(e) =>
                updateSection("molecular", { extractionKit: e.target.value })
              }
              placeholder="Select kit"
              options={["Qiagen","Zymo","Promega","Invitrogen","Other"]}
            />
          </div>

          <div>
            <Label>DNA Extraction Method</Label>
            <Select
              value={molecular.extractionMethod}
              onChange={(e) =>
                updateSection("molecular", { extractionMethod: e.target.value })
              }
              placeholder="Select method"
              options={["Chelex 10%","Invitrogen"]}
            />
          </div>

          <div>
            <Label>Primer – Forward</Label>
            <Input
              value={molecular.primerForward}
              onChange={(e) =>
                updateSection("molecular", { primerForward: e.target.value })
              }
              placeholder="Forward primer"
            />
          </div>

          <div>
            <Label>Primer – Reverse</Label>
            <Input
              value={molecular.primerReverse}
              onChange={(e) =>
                updateSection("molecular", { primerReverse: e.target.value })
              }
              placeholder="Reverse primer"
            />
          </div>

          <div>
            <Label>PCR Method</Label>
            <Select
              value={molecular.pcrMethod}
              onChange={(e) =>
                updateSection("molecular", { pcrMethod: e.target.value })
              }
              placeholder="Select PCR method"
              options={["HS Red Mix","Hot Start Green"]}
            />
          </div>

          <div>
            <Label>PCR Protocol Type</Label>
            <Select
              value={molecular.pcrProtocol}
              onChange={(e) =>
                updateSection("molecular", { pcrProtocol: e.target.value })
              }
              placeholder="Select protocol"
              options={["Standard","Touchdown","Nested"]}
            />
          </div>

          <div>
            <Label>Sequencing Method</Label>
            <Select
              value={molecular.sequencingMethod}
              onChange={(e) =>
                updateSection("molecular", { sequencingMethod: e.target.value })
              }
              placeholder="Select method"
              options={["Sanger","Illumina","Nanopore"]}
            />
          </div>

          <div>
            <Label>Sequencing Quality</Label>
            <Select
              value={molecular.sequencingQuality}
              onChange={(e) =>
                updateSection("molecular", { sequencingQuality: e.target.value })
              }
              placeholder="Select quality"
              options={["Excellent","Good","Moderate","Poor"]}
            />
          </div>

          <div>
            <Label>Bioinformatics Pipeline</Label>
            <Select
              value={molecular.bioinformaticsPipeline}
              onChange={(e) =>
                updateSection("molecular", { bioinformaticsPipeline: e.target.value })
              }
              placeholder="Select pipeline"
              options={["QIIME2","Mothur","DADA2","Custom"]}
            />
          </div>

          <div>
            <Label>DNA Concentration Range</Label>
            <Select
              value={molecular.dnaConcentration}
              onChange={(e) =>
                updateSection("molecular", { dnaConcentration: e.target.value })
              }
              placeholder="Select range"
              options={[
                "<10 ng/µL",
                "10–50 ng/µL",
                "50–100 ng/µL",
                ">100 ng/µL"
              ]}
            />
          </div>

          <div>
            <Label>Accession / Submission</Label>
            <Select
              value={molecular.accessionStatus}
              onChange={(e) =>
                updateSection("molecular", { accessionStatus: e.target.value })
              }
              placeholder="Select status"
              options={["Not Submitted","Submitted","Published"]}
            />
          </div>

          {molecular.accessionStatus === "Published" && (
            <div>
              <Label>Accession Number</Label>
              <Input
                value={molecular.accessionNumber}
                onChange={(e) =>
                  updateSection("molecular", { accessionNumber: e.target.value })
                }
                placeholder="e.g. GenBank ID"
              />
            </div>
          )}
        </div>
      </Section>

      {/* NOTES */}
      <Section title="Phylogenetic Description / Notes" sectionKey="notes">
        <Label>Description / Notes</Label>
        <textarea
          className="w-full p-2 border rounded-md text-base"
          rows={4}
          value={molecular.phylogeneticNotes}
          onChange={(e) =>
            updateSection("molecular", { phylogeneticNotes: e.target.value })
          }
        />
      </Section>

      <StepNavigation />
    </div>
  );
}
