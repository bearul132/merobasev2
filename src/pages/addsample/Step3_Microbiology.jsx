import React from "react";
import { useSampleForm } from "../../hooks/useSampleForm";
import FileDropzone from "../../components/FileDropzone";

export default function Step3_Microbiology() {
  const { formData, updateField } = useSampleForm();

  const Select = ({ label, field, options }) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        className="w-full border rounded-lg p-2 text-base"
        value={formData.microbiology?.[field] || ""}
        onChange={(e) =>
          updateField("microbiology", field, e.target.value)
        }
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );

  const Input = ({ label, field }) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        className="w-full border rounded-lg p-2 text-base"
        value={formData.microbiology?.[field] || ""}
        onChange={(e) =>
          updateField("microbiology", field, e.target.value)
        }
      />
    </div>
  );

  const Section = ({ title, children }) => (
    <section className="bg-white border rounded-xl p-5 space-y-4 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Microbiology</h1>

      {/* SAMPLE STORAGE BOX */}
      <Section title="Sample Storage Box">
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Box ID" field="boxId" />
          <Input label="Shelf" field="shelf" />
          <Input label="Position in Box" field="positionInBox" />
          <Input label="Storage Temperature" field="storageTemperature" />
        </div>
        <Input label="Notes" field="storageNotes" />
      </Section>

      {/* MACROSCOPIC MORPHOLOGY */}
      <Section title="Macroscopic Morphology">
        <FileDropzone
          label="Drag and Drop Isolated Image Here"
          file={formData.microbiology?.isolatedImage}
          onChange={(file) =>
            updateField("microbiology", "isolatedImage", file)
          }
        />
        <div className="grid md:grid-cols-2 gap-4">
          <Select
            label="Macroscopic Shape"
            field="macroscopicShape"
            options={[
              "Circular",
              "Irregular",
              "Filamentous",
              "Rhizoid",
            ]}
          />
          <Select
            label="Macroscopic Arrangement"
            field="macroscopicArrangement"
            options={[
              "Single",
              "Clustered",
              "Spreading",
            ]}
          />
        </div>
      </Section>

      {/* ISOLATED DESCRIPTION */}
      <Section title="Isolated Description">
        <div className="grid md:grid-cols-3 gap-4">
          <Select
            label="Shape"
            field="isolatedShape"
            options={["Circular", "Irregular"]}
          />
          <Select
            label="Margin"
            field="margin"
            options={[
              "Entire",
              "Undulate",
              "Lobate",
              "Filamentous",
            ]}
          />
          <Select
            label="Elevation"
            field="elevation"
            options={[
              "Flat",
              "Raised",
              "Convex",
              "Umbonate",
            ]}
          />
          <Select
            label="Color"
            field="color"
            options={[
              "White",
              "Cream",
              "Yellow",
              "Orange",
              "Pink",
            ]}
          />
          <Select
            label="Texture"
            field="texture"
            options={[
              "Smooth",
              "Rough",
              "Mucoid",
              "Dry",
            ]}
          />
        </div>
      </Section>

      {/* MICROSCOPIC MORPHOLOGY */}
      <Section title="Microscopic Morphology">
        <FileDropzone
          label="Drag and Drop Microscopic Image Here"
          file={formData.microbiology?.microscopicImage}
          onChange={(file) =>
            updateField("microbiology", "microscopicImage", file)
          }
        />
        <div className="grid md:grid-cols-2 gap-4">
          <Select
            label="Microscopic Shape"
            field="microscopicShape"
            options={[
              "Cocci",
              "Bacilli",
              "Spirilla",
              "Vibrio",
            ]}
          />
          <Select
            label="Microscopic Arrangement"
            field="microscopicArrangement"
            options={[
              "Single",
              "Pairs",
              "Chains",
              "Clusters",
            ]}
          />
        </div>
      </Section>

      {/* ISOLATED PROFILE */}
      <Section title="Isolated Profile">
        <div className="grid md:grid-cols-3 gap-4">
          <Select
            label="Gram Reaction"
            field="gramReaction"
            options={["Positive", "Negative"]}
          />
          <Select
            label="Motility"
            field="motility"
            options={["Motile", "Non-motile"]}
          />
          <Select
            label="Oxygen Requirement"
            field="oxygenRequirement"
            options={[
              "Aerobic",
              "Anaerobic",
              "Facultative Anaerobe",
            ]}
          />
          <Input
            label="Temperature Preference"
            field="temperaturePreference"
          />
          <Select
            label="Agar Media"
            field="agarMedia"
            options={[
              "Nutrient Agar",
              "TSA",
              "Marine Agar",
              "Blood Agar",
            ]}
          />
          <Input
            label="Incubation Time"
            field="incubationTime"
          />
          <Select
            label="Enzymatic"
            field="enzymaticActivity"
            options={[
              "Catalase",
              "Oxidase",
              "Amylase",
              "Protease",
            ]}
          />
        </div>
      </Section>

      {/* ANTIBACTERIAL ASSAY */}
      <Section title="Antibacterial Assay">
        <div className="grid md:grid-cols-2 gap-4">
          <Select
            label="Pathogen"
            field="pathogen"
            options={[
              "Escherichia coli",
              "Staphylococcus aureus",
              "Pseudomonas aeruginosa",
            ]}
          />
          <Select
            label="Method"
            field="assayMethod"
            options={[
              "Disk Diffusion",
              "Well Diffusion",
            ]}
          />
          <Select
            label="Antimalarial Assay"
            field="antimalarialAssay"
            options={["Yes", "No"]}
          />
          <Select
            label="Molecular ID"
            field="molecularId"
            options={[
              "Pending",
              "Confirmed",
            ]}
          />
        </div>
      </Section>

      {/* MOLECULAR IDENTIFICATION */}
      <Section title="Molecular Identification">
        <FileDropzone
          label="Drag and Drop RAW Sequence File Here"
          file={formData.microbiology?.rawSequenceFile}
          onChange={(file) =>
            updateField("microbiology", "rawSequenceFile", file)
          }
        />
        <div className="grid md:grid-cols-2 gap-4">
          <Select
            label="PCR Platform"
            field="pcrPlatform"
            options={[
              "Conventional PCR",
              "qPCR",
            ]}
          />
          <Select
            label="PCR Protocol Type"
            field="pcrProtocolType"
            options={[
              "16S rRNA",
              "ITS",
              "COI",
            ]}
          />
          <Select
            label="Sequencing Method"
            field="sequencingMethod"
            options={[
              "Sanger",
              "Illumina",
              "Nanopore",
            ]}
          />
          <Select
            label="Bioinformatics Pipeline"
            field="bioinformaticsPipeline"
            options={[
              "QIIME2",
              "Mothur",
              "Custom",
            ]}
          />
          <Select
            label="Accession / Submission"
            field="accessionSubmission"
            options={[
              "GenBank",
              "ENA",
              "DDBJ",
              "Not Submitted",
            ]}
          />
        </div>
      </Section>

      {/* BIOCHEMICAL TESTS */}
      <Section title="Biochemical Tests">
        <div className="grid md:grid-cols-3 gap-2">
          {[
            "Catalase",
            "Oxidase",
            "Urease",
            "Gelatin hydrolysis",
            "Sulfide production",
            "Nitrate reduction",
            "Fermentation",
            "Indole",
            "Citrate",
          ].map((test) => (
            <label
              key={test}
              className="flex items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                checked={
                  formData.microbiology?.biochemicalTests?.includes(test) ||
                  false
                }
                onChange={(e) => {
                  const prev =
                    formData.microbiology?.biochemicalTests || [];
                  const updated = e.target.checked
                    ? [...prev, test]
                    : prev.filter((t) => t !== test);
                  updateField(
                    "microbiology",
                    "biochemicalTests",
                    updated
                  );
                }}
              />
              {test}
            </label>
          ))}
        </div>
        <Input label="Test Notes" field="biochemicalNotes" />
      </Section>
    </div>
  );
}
