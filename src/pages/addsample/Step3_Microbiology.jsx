import React, { useRef } from "react";
import { useSampleFormContext } from "../../context/SampleFormContext";
import StepNavigation from "../../components/StepNavigation";
import FormProgressBar from "../../components/FormProgressBar";

export default function Step3_Microbiology() {
  const { formData, updateSection } = useSampleFormContext();

  /* ================= SAFE DEFAULT ================= */
  const micro = {
    storageBox: {
      boxID: "",
      shelf: "",
      position: "",
      temperature: "",
      notes: ""
    },
    images: {
      isolated: null,
      macroscopic: null,
      microscopic: null
    },
    isolatedDescription: {
      shape: "",
      margin: "",
      elevation: "",
      color: "",
      texture: ""
    },
    macroscopicMorphology: {
      shape: "",
      arrangement: ""
    },
    microscopicMorphology: {
      shape: "",
      arrangement: ""
    },
    isolatedProfile: {
      gramReaction: "",
      motility: "",
      oxygenRequirement: "",
      temperaturePreference: "",
      agarMedia: "",
      incubationTime: "",
      enzymatic: ""
    },
    antibacterialAssay: {
      pathogen: "",
      method: "",
      antimalarial: "",
      molecularID: ""
    },
    molecularIdentification: {
      rawSequenceFiles: [],
      pcrPlatform: "",
      pcrProtocolType: "",
      sequencingMethod: "",
      bioinformaticsPipeline: "",
      accessionStatus: ""
    },
    biochemicalTests: [],
    testNotes: "",
    ...formData.microbiology
  };

  /* ================= REFS ================= */
  const isolatedRef = useRef();
  const macroRef = useRef();
  const microRef = useRef();
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

  const handleImage = (file, key) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateSection("microbiology", {
        images: { ...micro.images, [key]: reader.result }
      });
    };
    reader.readAsDataURL(file);
  };

  const dropZone = (ref, labelText, key, preview) => (
    <div
      className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
      onClick={() => ref.current.click()}
      onDrop={(e) => {
        e.preventDefault();
        if (e.dataTransfer.files?.[0]) handleImage(e.dataTransfer.files[0], key);
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      <p className="text-sm text-gray-600">{labelText}</p>
      {preview && (
        <img src={preview} className="mx-auto mt-4 max-h-48 rounded shadow" />
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files[0] && handleImage(e.target.files[0], key)}
      />
    </div>
  );

  const addRawSequenceFile = (file) => {
    const meta = {
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString()
    };
    updateSection("microbiology", {
      molecularIdentification: {
        ...micro.molecularIdentification,
        rawSequenceFiles: [...micro.molecularIdentification.rawSequenceFiles, meta]
      }
    });
  };

  const toggleTest = (test) => {
    updateSection("microbiology", {
      biochemicalTests: micro.biochemicalTests.includes(test)
        ? micro.biochemicalTests.filter(t => t !== test)
        : [...micro.biochemicalTests, test]
    });
  };

  return (
    <div className="container mx-auto max-w-5xl p-6 space-y-8">
      <FormProgressBar step={3} steps={6} />

      <h1 className="text-2xl font-bold">Microbiology</h1>

      {/* STORAGE */}
      {section("Sample Storage Box", (
        <div className="grid md:grid-cols-2 gap-4">
          {["boxID","shelf","position","temperature"].map(key => (
            <div key={key}>
              {label(key.replace(/([A-Z])/g," $1"))}
              {input(
                micro.storageBox[key],
                e => updateSection("microbiology", {
                  storageBox: { ...micro.storageBox, [key]: e.target.value }
                })
              )}
            </div>
          ))}
          <div className="md:col-span-2">
            {label("Notes")}
            <textarea
              className="w-full p-2 border rounded-md text-base"
              rows={3}
              value={micro.storageBox.notes}
              onChange={(e) =>
                updateSection("microbiology", {
                  storageBox: { ...micro.storageBox, notes: e.target.value }
                })
              }
            />
          </div>
        </div>
      ))}

      {dropZone(isolatedRef, "Drag & Drop Isolated Image Here", "isolated", micro.images.isolated)}

      {/* ISOLATED DESCRIPTION */}
      {section("Isolated Description", (
        <div className="grid md:grid-cols-2 gap-4">
          {[
            ["shape","Shape",["Circular","Irregular","Filamentous","Rhizoid"]],
            ["margin","Margin",["Entire","Undulate","Lobate","Filamentous"]],
            ["elevation","Elevation",["Flat","Raised","Convex","Umbonate"]],
            ["color","Color",["White","Cream","Yellow","Orange","Pink","Red"]],
            ["texture","Texture",["Smooth","Rough","Mucoid","Dry"]]
          ].map(([k,l,o]) => (
            <div key={k}>
              {label(l)}
              {select(
                micro.isolatedDescription[k],
                e => updateSection("microbiology", {
                  isolatedDescription: { ...micro.isolatedDescription, [k]: e.target.value }
                }),
                `Select ${l}`,
                o
              )}
            </div>
          ))}
        </div>
      ))}

      {dropZone(macroRef, "Drag & Drop Macroscopic Image Here", "macroscopic", micro.images.macroscopic)}

      {/* MACRO */}
      {section("Macroscopic Morphology", (
        <div className="grid md:grid-cols-2 gap-4">
          {[
            ["shape","Macroscopic Shape",["Circular","Irregular","Spreading"]],
            ["arrangement","Arrangement",["Single","Clustered","Confluent"]]
          ].map(([k,l,o]) => (
            <div key={k}>
              {label(l)}
              {select(
                micro.macroscopicMorphology[k],
                e => updateSection("microbiology", {
                  macroscopicMorphology: { ...micro.macroscopicMorphology, [k]: e.target.value }
                }),
                `Select ${l}`,
                o
              )}
            </div>
          ))}
        </div>
      ))}

      {dropZone(microRef, "Drag & Drop Microscopic Image Here", "microscopic", micro.images.microscopic)}

      {/* MICRO */}
      {section("Microscopic Morphology", (
        <div className="grid md:grid-cols-2 gap-4">
          {[
            ["shape","Microscopic Shape",["Coccus","Bacillus","Vibrio","Spirillum"]],
            ["arrangement","Arrangement",["Single","Diplo","Strepto","Staphylo"]]
          ].map(([k,l,o]) => (
            <div key={k}>
              {label(l)}
              {select(
                micro.microscopicMorphology[k],
                e => updateSection("microbiology", {
                  microscopicMorphology: { ...micro.microscopicMorphology, [k]: e.target.value }
                }),
                `Select ${l}`,
                o
              )}
            </div>
          ))}
        </div>
      ))}

      {/* ISOLATED PROFILE */}
      {section("Isolated Profile", (
        <div className="grid md:grid-cols-2 gap-4">
          {[
            ["gramReaction","Gram Reaction",["Gram Positive","Gram Negative"]],
            ["motility","Motility",["Motile","Non-motile"]],
            ["oxygenRequirement","Oxygen Requirement",["Aerobic","Anaerobic","Facultative"]],
            ["agarMedia","Agar Media",["NA","TSA","Marine Agar"]],
            ["enzymatic","Enzymatic",["Amylase","Protease","Lipase"]]
          ].map(([k,l,o]) => (
            <div key={k}>
              {label(l)}
              {select(
                micro.isolatedProfile[k],
                e => updateSection("microbiology", {
                  isolatedProfile: { ...micro.isolatedProfile, [k]: e.target.value }
                }),
                `Select ${l}`,
                o
              )}
            </div>
          ))}
          {["temperaturePreference","incubationTime"].map(k => (
            <div key={k}>
              {label(k)}
              {input(
                micro.isolatedProfile[k],
                e => updateSection("microbiology", {
                  isolatedProfile: { ...micro.isolatedProfile, [k]: e.target.value }
                })
              )}
            </div>
          ))}
        </div>
      ))}

      {/* MOLECULAR IDENTIFICATION */}
      {section("Molecular Identification", (
        <>
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

          <div className="grid md:grid-cols-2 gap-4">
            {[
              ["pcrPlatform","PCR Platform",["Conventional PCR","qPCR","Digital PCR"]],
              ["pcrProtocolType","PCR Protocol Type",["Standard","Touchdown","Nested"]],
              ["sequencingMethod","Sequencing Method",["Sanger","Illumina","Nanopore"]],
              ["bioinformaticsPipeline","Bioinformatics Pipeline",["QIIME2","Mothur","Custom"]],
              ["accessionStatus","Accession / Submission",["Not Submitted","Submitted","Published"]]
            ].map(([k,l,o]) => (
              <div key={k}>
                {label(l)}
                {select(
                  micro.molecularIdentification[k],
                  e => updateSection("microbiology", {
                    molecularIdentification: {
                      ...micro.molecularIdentification,
                      [k]: e.target.value
                    }
                  }),
                  `Select ${l}`,
                  o
                )}
              </div>
            ))}
          </div>
        </>
      ))}

      {/* BIOCHEMICAL */}
      {section("Biochemical Tests", (
        <>
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
                  onChange={() => toggleTest(test)}
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
        </>
      ))}

      <StepNavigation backPath="/add/step2" nextPath="/add/step4" />
    </div>
  );
}
