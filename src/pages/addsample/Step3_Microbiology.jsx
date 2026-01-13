import React, { useRef, useState } from "react";
import { useSampleFormContext } from "../../context/SampleFormContext";
import StepNavigation from "../../components/StepNavigation";
import FormProgressBar from "../../components/FormProgressBar";

/* =========================================================
   COLLAPSIBLE CATEGORY BOX
========================================================= */
const CategoryBox = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="bg-white border rounded-xl shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-4"
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-xl">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="p-6 pt-2 space-y-6">{children}</div>}
    </section>
  );
};

export default function Step3_Microbiology() {
  const { formData, updateSection } = useSampleFormContext();

  /* =========================================================
     SAFE DEFAULT STRUCTURE
  ========================================================= */
  const micro = {
    primaryIsolatedData: {
      isolatedID: "",
      shelf: "",
      position: "",
      storageTemperature: "",
      agarMedia: "",
      solvent: "",
      incubationTemperature: "",
      incubationTime: "",
      oxygenRequirement: "",
      notes: ""
    },
    images: {
      isolated: null,
      microscopic: null
    },
    macroscopicMorphology: {
      shape: "",
      arrangement: ""
    },
    colonyDescription: {
      shape: "",
      margin: "",
      elevation: "",
      color: "",
      texture: "",
      motility: ""
    },
    microscopicMorphology: {
      shape: "",
      arrangement: "",
      gramReaction: ""
    },
    antibacterialAssay: {
      pathogen: "",
      method: "",
      antimalarial: "",
      molecularID: ""
    },
    biochemicalTests: [],
    enzymaticTests: [],
    testNotes: "",
    molecularIdentification: {
      rawSequenceFiles: [],
      pcrPlatform: "",
      pcrProtocolType: "",
      sequencingMethod: "",
      bioinformaticsPipeline: "",
      accessionStatus: "",
      accessionNumber: "",
      isIdentified: "",
      speciesName: ""
    },
    ...formData.microbiology
  };

  /* =========================================================
     REFS
  ========================================================= */
  const isolatedRef = useRef();
  const microscopicRef = useRef();
  const rawSeqRef1 = useRef();
  const rawSeqRef2 = useRef();

  /* =========================================================
     UI HELPERS
  ========================================================= */
  const label = (text) => (
    <label className="block text-sm text-gray-600 mb-1">{text}</label>
  );

  const input = (value, onChange, placeholder = "") => (
    <input
      type="text"
      className="w-full p-2 border rounded-md text-base"
      value={value}
      placeholder={placeholder}
      onChange={onChange}
    />
  );

  const select = (value, onChange, placeholder, options) => (
    <select
      className="w-full p-2 border rounded-md text-base"
      value={value}
      onChange={onChange}
    >
      <option value="">{placeholder}</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );

  const dropImage = (file, key) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateSection("microbiology", {
        images: { ...micro.images, [key]: reader.result }
      });
    };
    reader.readAsDataURL(file);
  };

  const imageDropZone = (ref, labelText, key, preview) => (
    <div
      className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
      onClick={() => ref.current.click()}
      onDrop={(e) => {
        e.preventDefault();
        if (e.dataTransfer.files?.[0]) dropImage(e.dataTransfer.files[0], key);
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      <p className="text-sm text-gray-600">{labelText}</p>
      {preview && (
        <img src={preview} alt="" className="mx-auto mt-4 max-h-48 rounded shadow" />
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files[0] && dropImage(e.target.files[0], key)}
      />
    </div>
  );

  const addRawSequence = (file) => {
    updateSection("microbiology", {
      molecularIdentification: {
        ...micro.molecularIdentification,
        rawSequenceFiles: [
          ...micro.molecularIdentification.rawSequenceFiles,
          {
            name: file.name,
            size: file.size,
            uploadedAt: new Date().toISOString()
          }
        ]
      }
    });
  };

  const toggleCheckbox = (list, value, key) => {
    updateSection("microbiology", {
      [key]: list.includes(value)
        ? list.filter(v => v !== value)
        : [...list, value]
    });
  };

  /* =========================================================
     RENDER
  ========================================================= */
  return (
    <div className="container mx-auto max-w-5xl p-6 space-y-8">
      <FormProgressBar step={3} steps={6} />

        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Microbiology
          </h2>
          <p className="text-sm text-gray-500">
            Isolated Information
          </p>
        </div>

      {/* PRIMARY ISOLATED DATA */}
      <CategoryBox title="Primary Isolated Data">
        <div className="grid md:grid-cols-2 gap-4">
          {label("Isolated ID")}
          {input(micro.primaryIsolatedData.isolatedID, e =>
            updateSection("microbiology", {
              primaryIsolatedData: { ...micro.primaryIsolatedData, isolatedID: e.target.value }
            })
          )}

          {label("Shelf")}
          {input(micro.primaryIsolatedData.shelf, e =>
            updateSection("microbiology", {
              primaryIsolatedData: { ...micro.primaryIsolatedData, shelf: e.target.value }
            })
          )}

          {label("Position in Box")}
          {input(micro.primaryIsolatedData.position, e =>
            updateSection("microbiology", {
              primaryIsolatedData: { ...micro.primaryIsolatedData, position: e.target.value }
            })
          )}

          {label("Storage Temperature")}
          {select(
            micro.primaryIsolatedData.storageTemperature,
            e => updateSection("microbiology", {
              primaryIsolatedData: { ...micro.primaryIsolatedData, storageTemperature: e.target.value }
            }),
            "Select temperature",
            ["-20°C", "-80°C"]
          )}

          {label("Agar Media")}
          {select(
            micro.primaryIsolatedData.agarMedia,
            e => updateSection("microbiology", {
              primaryIsolatedData: { ...micro.primaryIsolatedData, agarMedia: e.target.value }
            }),
            "Select agar media",
            ["Nutrient Agar", "Marine Agar", "TSA", "R2A", "Blood Agar"]
          )}

          {label("Solvent")}
          {select(
            micro.primaryIsolatedData.solvent,
            e => updateSection("microbiology", {
              primaryIsolatedData: { ...micro.primaryIsolatedData, solvent: e.target.value }
            }),
            "Select solvent",
            ["Aquades", "Seawater 70% : Aquades 30%"]
          )}

          {label("Incubation Temperature")}
          {input(micro.primaryIsolatedData.incubationTemperature, e =>
            updateSection("microbiology", {
              primaryIsolatedData: {
                ...micro.primaryIsolatedData,
                incubationTemperature: e.target.value
              }
            })
          )}

          {label("Incubation Time")}
          {input(micro.primaryIsolatedData.incubationTime, e =>
            updateSection("microbiology", {
              primaryIsolatedData: {
                ...micro.primaryIsolatedData,
                incubationTime: e.target.value
              }
            })
          )}

          {label("Oxygen Requirement")}
          {select(
            micro.primaryIsolatedData.oxygenRequirement,
            e => updateSection("microbiology", {
              primaryIsolatedData: {
                ...micro.primaryIsolatedData,
                oxygenRequirement: e.target.value
              }
            }),
            "Select oxygen requirement",
            ["Aerobic", "Anaerobic", "Facultative Anaerobe", "Microaerophilic"]
          )}
        </div>

        {label("Notes")}
        <textarea
          className="w-full p-2 border rounded-md text-base"
          rows={3}
          value={micro.primaryIsolatedData.notes}
          onChange={(e) =>
            updateSection("microbiology", {
              primaryIsolatedData: { ...micro.primaryIsolatedData, notes: e.target.value }
            })
          }
        />
      </CategoryBox>

      {imageDropZone(isolatedRef, "Drag & Drop Isolated Image Here", "isolated", micro.images.isolated)}

      {/* MACROSCOPIC */}
      <CategoryBox title="Macroscopic Morphology">
        <div className="grid md:grid-cols-2 gap-4">
          {label("Macroscopic Shape")}
          {select(
            micro.macroscopicMorphology.shape,
            e => updateSection("microbiology", {
              macroscopicMorphology: { ...micro.macroscopicMorphology, shape: e.target.value }
            }),
            "Select shape",
            ["Circular", "Irregular", "Filamentous", "Spreading"]
          )}

          {label("Macroscopic Arrangement")}
          {select(
            micro.macroscopicMorphology.arrangement,
            e => updateSection("microbiology", {
              macroscopicMorphology: { ...micro.macroscopicMorphology, arrangement: e.target.value }
            }),
            "Select arrangement",
            ["Single", "Clustered", "Confluent"]
          )}
        </div>
      </CategoryBox>

      {/* COLONY DESCRIPTION */}
      <CategoryBox title="Colony Description">
        <div className="grid md:grid-cols-2 gap-4">
          {["Shape","Margin","Elevation","Color","Texture","Motility"].map(field => (
            <div key={field}>
              {label(field)}
              {select(
                micro.colonyDescription[field.toLowerCase()],
                e => updateSection("microbiology", {
                  colonyDescription: {
                    ...micro.colonyDescription,
                    [field.toLowerCase()]: e.target.value
                  }
                }),
                `Select ${field}`,
                [
                  "Circular","Irregular","Entire","Undulate","Flat","Convex",
                  "White","Cream","Yellow","Orange","Smooth","Rough","Motile","Non-motile"
                ]
              )}
            </div>
          ))}
        </div>
      </CategoryBox>

      {imageDropZone(microscopicRef, "Drag & Drop Microscopic Image Here", "microscopic", micro.images.microscopic)}

      {/* MICROSCOPIC */}
      <CategoryBox title="Microscopic Morphology">
        <div className="grid md:grid-cols-2 gap-4">
          {label("Microscopic Shape")}
          {select(
            micro.microscopicMorphology.shape,
            e => updateSection("microbiology", {
              microscopicMorphology: { ...micro.microscopicMorphology, shape: e.target.value }
            }),
            "Select shape",
            ["Coccus", "Bacillus", "Vibrio", "Spirillum"]
          )}

          {label("Microscopic Arrangement")}
          {select(
            micro.microscopicMorphology.arrangement,
            e => updateSection("microbiology", {
              microscopicMorphology: { ...micro.microscopicMorphology, arrangement: e.target.value }
            }),
            "Select arrangement",
            ["Single", "Diplo", "Strepto", "Staphylo"]
          )}

          {label("Gram Reaction")}
          {select(
            micro.microscopicMorphology.gramReaction,
            e => updateSection("microbiology", {
              microscopicMorphology: { ...micro.microscopicMorphology, gramReaction: e.target.value }
            }),
            "Select reaction",
            ["Gram Positive", "Gram Negative"]
          )}
        </div>
      </CategoryBox>

      {/* ANTIBACTERIAL */}
      <CategoryBox title="Antibacterial Assay">
        <div className="grid md:grid-cols-2 gap-4">
          {label("Pathogen")}
          {select(
            micro.antibacterialAssay.pathogen,
            e => updateSection("microbiology", {
              antibacterialAssay: { ...micro.antibacterialAssay, pathogen: e.target.value }
            }),
            "Select pathogen",
            ["E. coli", "S. aureus", "P. aeruginosa", "B. subtilis"]
          )}

          {label("Method")}
          {select(
            micro.antibacterialAssay.method,
            e => updateSection("microbiology", {
              antibacterialAssay: { ...micro.antibacterialAssay, method: e.target.value }
            }),
            "Select method",
            ["Disk diffusion", "Well diffusion", "MIC"]
          )}

          {label("Antimalarial Assay")}
          {select(
            micro.antibacterialAssay.antimalarial,
            e => updateSection("microbiology", {
              antibacterialAssay: { ...micro.antibacterialAssay, antimalarial: e.target.value }
            }),
            "Select result",
            ["Not tested", "Active", "Inactive"]
          )}

          {label("Molecular ID")}
          {select(
            micro.antibacterialAssay.molecularID,
            e => updateSection("microbiology", {
              antibacterialAssay: { ...micro.antibacterialAssay, molecularID: e.target.value }
            }),
            "Select status",
            ["Pending", "Confirmed"]
          )}
        </div>
      </CategoryBox>

      {/* BIOCHEMICAL */}
      <CategoryBox title="Biochemical Tests">
        <div className="grid md:grid-cols-3 gap-2">
          {[
            "Catalase","Oxidase","Urease","Gelatin hydrolysis",
            "Sulfide production","Nitrate reduction",
            "Fermentation","Indole","Citrate"
          ].map(test => (
            <label key={test} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={micro.biochemicalTests.includes(test)}
                onChange={() =>
                  toggleCheckbox(micro.biochemicalTests, test, "biochemicalTests")
                }
              />
              {test}
            </label>
          ))}
        </div>
      </CategoryBox>

      {/* ENZYMATIC */}
      <CategoryBox title="Enzymatic">
        <div className="grid md:grid-cols-3 gap-2">
          {[
            "Amylase","Protease","Lipase","Cellulase",
            "Alkane hydroxylase","Manganese peroxidase (MnP)","Laccase"
          ].map(test => (
            <label key={test} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={micro.enzymaticTests.includes(test)}
                onChange={() =>
                  toggleCheckbox(micro.enzymaticTests, test, "enzymaticTests")
                }
              />
              {test}
            </label>
          ))}
        </div>

        {label("Test Notes")}
        <textarea
          className="w-full p-2 border rounded-md text-base"
          rows={3}
          value={micro.testNotes}
          onChange={(e) => updateSection("microbiology", { testNotes: e.target.value })}
        />
      </CategoryBox>

      {/* MOLECULAR IDENTIFICATION */}
      <CategoryBox title="Molecular Identification">
        <div
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer"
          onClick={() => rawSeqRef1.current.click()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) addRawSequence(e.dataTransfer.files[0]);
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <p className="text-sm text-gray-600">Drag & Drop RAW Sequence File Here</p>
          <input ref={rawSeqRef1} type="file" className="hidden"
            onChange={(e) => e.target.files[0] && addRawSequence(e.target.files[0])}
          />
        </div>

        {label("Is the sample has been identified?")}
        {select(
          micro.molecularIdentification.isIdentified,
          e => updateSection("microbiology", {
            molecularIdentification: {
              ...micro.molecularIdentification,
              isIdentified: e.target.value
            }
          }),
          "Select answer",
          ["No", "Yes"]
        )}

        {micro.molecularIdentification.isIdentified === "Yes" && (
          <>
            {label("Species Name")}
            {input(
              micro.molecularIdentification.speciesName,
              e => updateSection("microbiology", {
                molecularIdentification: {
                  ...micro.molecularIdentification,
                  speciesName: e.target.value
                }
              })
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {label("PCR Platform")}
              {select(
                micro.molecularIdentification.pcrPlatform,
                e => updateSection("microbiology", {
                  molecularIdentification: {
                    ...micro.molecularIdentification,
                    pcrPlatform: e.target.value
                  }
                }),
                "Select platform",
                ["Conventional PCR", "qPCR", "Digital PCR"]
              )}

              {label("PCR Protocol Type")}
              {select(
                micro.molecularIdentification.pcrProtocolType,
                e => updateSection("microbiology", {
                  molecularIdentification: {
                    ...micro.molecularIdentification,
                    pcrProtocolType: e.target.value
                  }
                }),
                "Select protocol",
                ["Standard", "Touchdown", "Nested"]
              )}

              {label("Sequencing Method")}
              {select(
                micro.molecularIdentification.sequencingMethod,
                e => updateSection("microbiology", {
                  molecularIdentification: {
                    ...micro.molecularIdentification,
                    sequencingMethod: e.target.value
                  }
                }),
                "Select method",
                ["Sanger", "Illumina", "Nanopore"]
              )}

              {label("Bioinformatics Pipeline")}
              {select(
                micro.molecularIdentification.bioinformaticsPipeline,
                e => updateSection("microbiology", {
                  molecularIdentification: {
                    ...micro.molecularIdentification,
                    bioinformaticsPipeline: e.target.value
                  }
                }),
                "Select pipeline",
                ["QIIME2", "Mothur", "Custom"]
              )}

              {label("Accession / Submission")}
              {select(
                micro.molecularIdentification.accessionStatus,
                e => updateSection("microbiology", {
                  molecularIdentification: {
                    ...micro.molecularIdentification,
                    accessionStatus: e.target.value
                  }
                }),
                "Select status",
                ["Unsubmitted", "Submitted", "Published"]
              )}
            </div>

            {micro.molecularIdentification.accessionStatus === "Published" && (
              <>
                {label("Accession Number")}
                {input(
                  micro.molecularIdentification.accessionNumber,
                  e => updateSection("microbiology", {
                    molecularIdentification: {
                      ...micro.molecularIdentification,
                      accessionNumber: e.target.value
                    }
                  })
                )}
              </>
            )}
          </>
        )}
      </CategoryBox>


    </div>
  );
}
