// src/pages/addsample/Step4_Molecular.jsx
import { useState } from "react";
import FormProgressBar from "../../components/FormProgressBar";
import StepNavigation from "../../components/StepNavigation";
import { FileDropzone } from "../../components/FileDropzone";
import { useSampleForm } from "../../context/SampleFormContext";

/* ================= DROPDOWN OPTIONS ================= */
const MARKER_GENES = ["16S rRNA","18S rRNA","ITS","COI","rbcL","H3"];
const DNA_SOURCES = ["Tissue Sample","Isolated Colony","Environmental DNA (eDNA)","Whole Organism","Mixed Community"];
const EXTRACTION_KITS = ["Qiagen DNeasy","Zymo Research","Promega","Invitrogen","Chelex Resin","Other"];
const EXTRACTION_METHODS = ["Chelex 10%","Invitrogen"];
const PCR_METHODS = ["HS Red Mix","Hot Start Green"];
const PCR_PROTOCOLS = ["Standard PCR","Touchdown PCR","Nested PCR"];
const SEQUENCING_METHODS = ["Sanger","Illumina","Oxford Nanopore"];
const SEQUENCING_QUALITY = ["Excellent","Good","Moderate","Poor"];
const BIOINFO_PIPELINES = ["QIIME2","DADA2","Mothur","Custom Pipeline"];
const DNA_CONCENTRATION = ["<10 ng/µL","10–50 ng/µL","50–100 ng/µL",">100 ng/µL"];
const ACCESSION_STATUS = ["Not Submitted","Submitted","Published"];

/* ================= MAIN ================= */
export default function Step4_Molecular() {
  const { formData, updateSection, normalizeImage } = useSampleForm();
  const molecular = formData.molecular || {};

  const [open, setOpen] = useState({ files: true, metadata: true, notes: true });
  const toggle = (key) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  const setValue = (field, value) => updateSection("molecular", { [field]: value });

  /* ================= FILE HANDLERS ================= */
  const handleGelImage = async (files) => {
    const normalized = files.map(normalizeImage);
    setValue("gelImage", normalized);
  };

  const handleRawFiles = async (files) => {
    const normalized = files.map(normalizeImage);
    setValue("rawSequenceFiles", normalized);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <FormProgressBar step={4} steps={6} />

        <header className="border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Molecular Analysis</h1>
          <p className="text-sm text-gray-500">DNA extraction, amplification, sequencing, and analysis metadata</p>
        </header>

        {/* ================= FILE UPLOADS ================= */}
        <Box title="Gel & RAW Sequence Files" open={open.files} toggle={() => toggle("files")}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Gel Image</Label>
              <FileDropzone
                accept="image/*"
                multiple={false}
                existing={molecular.gelImage ? [molecular.gelImage] : []}
                onFiles={handleGelImage}
              />
            </div>

            <div>
              <Label>RAW Sequence Files</Label>
              <FileDropzone
                multiple
                accept=".fastq,.fq,.ab1,.fasta,.fa,.txt"
                existing={molecular.rawSequenceFiles || []}
                onFiles={handleRawFiles}
              />
            </div>
          </div>
        </Box>

        {/* ================= METADATA ================= */}
        <Box title="Molecular Metadata" open={open.metadata} toggle={() => toggle("metadata")}>
          <Grid>
            <Select label="Marker Gene / Target" value={molecular.markerGene || ""} onChange={(v) => setValue("markerGene", v)} options={MARKER_GENES} />
            <Select label="DNA Source" value={molecular.dnaSource || ""} onChange={(v) => setValue("dnaSource", v)} options={DNA_SOURCES} />
            <Select label="Extraction Kit Used" value={molecular.extractionKit || ""} onChange={(v) => setValue("extractionKit", v)} options={EXTRACTION_KITS} />
            <Select label="DNA Extraction Method" value={molecular.extractionMethod || ""} onChange={(v) => setValue("extractionMethod", v)} options={EXTRACTION_METHODS} />
            <Input label="Primer – Forward" value={molecular.primerForward || ""} onChange={(v) => setValue("primerForward", v)} />
            <Input label="Primer – Reverse" value={molecular.primerReverse || ""} onChange={(v) => setValue("primerReverse", v)} />
            <Select label="PCR Method" value={molecular.pcrMethod || ""} onChange={(v) => setValue("pcrMethod", v)} options={PCR_METHODS} />
            <Select label="PCR Protocol Type" value={molecular.pcrProtocolType || ""} onChange={(v) => setValue("pcrProtocolType", v)} options={PCR_PROTOCOLS} />
            <Select label="Sequencing Method" value={molecular.sequencingMethod || ""} onChange={(v) => setValue("sequencingMethod", v)} options={SEQUENCING_METHODS} />
            <Select label="Sequencing Quality" value={molecular.sequencingQuality || ""} onChange={(v) => setValue("sequencingQuality", v)} options={SEQUENCING_QUALITY} />
            <Select label="Bioinformatics Pipeline" value={molecular.bioinformaticsPipeline || ""} onChange={(v) => setValue("bioinformaticsPipeline", v)} options={BIOINFO_PIPELINES} />
            <Select label="DNA Concentration Range" value={molecular.dnaConcentrationRange || ""} onChange={(v) => setValue("dnaConcentrationRange", v)} options={DNA_CONCENTRATION} />
            <Select label="Accession / Submission Status" value={molecular.accessionStatus || ""} onChange={(v) => setValue("accessionStatus", v)} options={ACCESSION_STATUS} />
            {molecular.accessionStatus === "Published" && <Input label="Accession Number" value={molecular.accessionNumber || ""} onChange={(v) => setValue("accessionNumber", v)} />}
          </Grid>
        </Box>

        {/* ================= NOTES ================= */}
        <Box title="Phylogenetic Description / Notes" open={open.notes} toggle={() => toggle("notes")}>
          <Label>Description / Notes</Label>
          <textarea
            rows={4}
            value={molecular.phylogeneticNotes || ""}
            onChange={(e) => setValue("phylogeneticNotes", e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-base"
          />
        </Box>

        <StepNavigation />
      </div>
    </div>
  );
}

/* ================= REUSABLE UI ================= */
function Box({ title, open, toggle, children }) {
  return (
    <section className="border rounded-xl shadow-sm">
      <button type="button" onClick={toggle} className="w-full flex justify-between items-center px-6 py-4 bg-gray-100 rounded-t-xl">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-sm">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="p-6 space-y-4">{children}</div>}
    </section>
  );
}

function Grid({ children }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>;
}

function Label({ children }) {
  return <label className="block text-sm mb-1">{children}</label>;
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <Label>{label}</Label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-base" />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <Label>{label}</Label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-base">
        <option value="">Select {label}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
