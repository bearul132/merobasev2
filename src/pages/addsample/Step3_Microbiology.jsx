import React, { useRef } from "react";
import { useSampleFormContext } from "../../context/SampleFormContext";
import StepNavigation from "../../components/StepNavigation";
import FormProgressBar from "../../components/FormProgressBar";

export default function Step3_Microbiology() {
  const { formData, updateSection } = useSampleFormContext();

  /* ================= SAFE DEFAULT STRUCTURE ================= */
  const micro = {
    storageBox: { boxID: "", shelf: "", position: "", temperature: "", notes: "" },
    images: { isolated: null, macroscopic: null, microscopic: null },
    isolatedDescription: { shape: "", margin: "", elevation: "", color: "", texture: "" },
    macroscopicMorphology: { shape: "", arrangement: "" },
    microscopicMorphology: { shape: "", arrangement: "" },
    isolatedProfile: {
      gramReaction: "",
      motility: "",
      oxygenRequirement: "",
      temperaturePreference: "",
      agarMedia: "",
      incubationTime: "",
      enzymatic: ""
    },
    antibacterialAssay: { pathogen: "", method: "", antimalarial: "", molecularID: "" },
    biochemicalTests: [],
    testNotes: "",
    ...formData.microbiology
  };

  /* ================= REFS ================= */
  const isolatedRef = useRef();
  const macroRef = useRef();
  const microRef = useRef();

  /* ================= IMAGE HANDLING ================= */
  const handleImage = (file, type) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateSection("microbiology", {
        images: { ...micro.images, [type]: reader.result }
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) handleImage(e.dataTransfer.files[0], type);
  };

  /* ================= BIOCHEM TOGGLE ================= */
  const toggleTest = (test) => {
    updateSection("microbiology", {
      biochemicalTests: micro.biochemicalTests.includes(test)
        ? micro.biochemicalTests.filter((t) => t !== test)
        : [...micro.biochemicalTests, test]
    });
  };

  return (
    <div className="container mx-auto p-4">
      <FormProgressBar step={3} steps={6} />
      <h3 className="font-semibold mb-4">Microbiology</h3>

      <div className="grid gap-6">

        {/* ================= SAMPLE STORAGE BOX ================= */}
        <section className="border p-4 rounded bg-gray-50">
          <h4 className="font-medium mb-3">Sample Storage Box</h4>
          {[
            ["boxID", "Box ID"],
            ["shelf", "Shelf"],
            ["position", "Position in Box"],
            ["temperature", "Storage Temperature"]
          ].map(([key, label]) => (
            <div key={key} className="mb-2">
              <label className="block mb-1">{label}</label>
              <input
                className="w-full p-2 border rounded"
                value={micro.storageBox[key]}
                onChange={(e) =>
                  updateSection("microbiology", {
                    storageBox: { ...micro.storageBox, [key]: e.target.value }
                  })
                }
              />
            </div>
          ))}
          <label className="block mt-2 mb-1">Notes</label>
          <textarea
            className="w-full p-2 border rounded"
            value={micro.storageBox.notes}
            onChange={(e) =>
              updateSection("microbiology", {
                storageBox: { ...micro.storageBox, notes: e.target.value }
              })
            }
          />
        </section>

        {/* ================= ISOLATED IMAGE ================= */}
        <div
          className="border border-dashed p-4 rounded text-center cursor-pointer"
          onClick={() => isolatedRef.current.click()}
          onDrop={(e) => handleDrop(e, "isolated")}
          onDragOver={(e) => e.preventDefault()}
        >
          <p className="text-sm">Drag & Drop Isolated Image Here</p>
          {micro.images.isolated && (
            <img src={micro.images.isolated} className="mx-auto mt-2 max-w-xs rounded" />
          )}
          <input
            ref={isolatedRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => e.target.files[0] && handleImage(e.target.files[0], "isolated")}
          />
        </div>

        {/* ================= ISOLATED DESCRIPTION ================= */}
        <section className="border p-4 rounded">
          <h4 className="font-medium mb-3">Isolated Description</h4>
          {[
            ["shape", "Shape", ["Circular", "Irregular", "Filamentous", "Rhizoid", "Punctiform"]],
            ["margin", "Margin", ["Entire", "Undulate", "Lobate", "Curled", "Filamentous"]],
            ["elevation", "Elevation", ["Flat", "Raised", "Convex", "Umbonate", "Pulvinate"]],
            ["color", "Color", ["White","Cream","Yellow","Orange","Pink","Red","Brown","Green","Transparent"]],
            ["texture", "Texture", ["Smooth","Rough","Mucoid","Dry","Wrinkled"]]
          ].map(([key, label, options]) => (
            <div key={key} className="mb-2">
              <label className="block mb-1">{label}</label>
              <select
                className="w-full p-2 border rounded"
                value={micro.isolatedDescription[key]}
                onChange={(e) =>
                  updateSection("microbiology", {
                    isolatedDescription: { ...micro.isolatedDescription, [key]: e.target.value }
                  })
                }
              >
                <option value="">Select {label}</option>
                {options.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </section>

        {/* ================= MACROSCOPIC IMAGE ================= */}
        <div
          className="border border-dashed p-4 rounded text-center cursor-pointer"
          onClick={() => macroRef.current.click()}
          onDrop={(e) => handleDrop(e, "macroscopic")}
          onDragOver={(e) => e.preventDefault()}
        >
          <p className="text-sm">Drag & Drop Macroscopic Image Here</p>
          {micro.images.macroscopic && (
            <img src={micro.images.macroscopic} className="mx-auto mt-2 max-w-xs rounded" />
          )}
          <input
            ref={macroRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => e.target.files[0] && handleImage(e.target.files[0], "macroscopic")}
          />
        </div>

        {/* ================= MACROSCOPIC MORPHOLOGY ================= */}
        <section className="border p-4 rounded">
          <h4 className="font-medium mb-3">Macroscopic Morphology</h4>
          {[
            ["shape", "Macroscopic Shape", ["Circular", "Irregular", "Filamentous"]],
            ["arrangement", "Macroscopic Arrangement", ["Single","Paired","Clustered","Spreading"]]
          ].map(([key, label, options]) => (
            <div key={key} className="mb-2">
              <label className="block mb-1">{label}</label>
              <select
                className="w-full p-2 border rounded"
                value={micro.macroscopicMorphology[key]}
                onChange={(e) =>
                  updateSection("microbiology", {
                    macroscopicMorphology: { ...micro.macroscopicMorphology, [key]: e.target.value }
                  })
                }
              >
                <option value="">Select {label}</option>
                {options.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </section>

        {/* ================= MICROSCOPIC IMAGE ================= */}
        <div
          className="border border-dashed p-4 rounded text-center cursor-pointer"
          onClick={() => microRef.current.click()}
          onDrop={(e) => handleDrop(e, "microscopic")}
          onDragOver={(e) => e.preventDefault()}
        >
          <p className="text-sm">Drag & Drop Microscopic Image Here</p>
          {micro.images.microscopic && (
            <img src={micro.images.microscopic} className="mx-auto mt-2 max-w-xs rounded" />
          )}
          <input
            ref={microRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => e.target.files[0] && handleImage(e.target.files[0], "microscopic")}
          />
        </div>

        {/* ================= MICROSCOPIC MORPHOLOGY ================= */}
        <section className="border p-4 rounded">
          <h4 className="font-medium mb-3">Microscopic Morphology</h4>
          {[
            ["shape", "Microscopic Shape", ["Coccus","Bacillus","Vibrio","Spirillum","Filamentous"]],
            ["arrangement", "Microscopic Arrangement", ["Single","Diplo","Strepto","Staphylo","Palisade"]]
          ].map(([key, label, options]) => (
            <div key={key} className="mb-2">
              <label className="block mb-1">{label}</label>
              <select
                className="w-full p-2 border rounded"
                value={micro.microscopicMorphology[key]}
                onChange={(e) =>
                  updateSection("microbiology", {
                    microscopicMorphology: { ...micro.microscopicMorphology, [key]: e.target.value }
                  })
                }
              >
                <option value="">Select {label}</option>
                {options.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </section>

        {/* ================= ISOLATED PROFILE ================= */}
        <section className="border p-4 rounded">
          <h4 className="font-medium mb-3">Isolated Profile</h4>
          {[
            ["gramReaction", "Gram Reaction", ["Gram Positive","Gram Negative","Gram Variable","Not Tested"]],
            ["motility", "Motility", ["Motile","Non-motile","Swarming","Gliding"]],
            ["oxygenRequirement", "Oxygen Requirement", ["Aerobic","Anaerobic","Facultative anaerobe","Microaerophilic"]],
            ["agarMedia", "Agar Media", ["NA","TSA","PCA","R2A","Marine Agar","MacConkey"]],
            ["enzymatic", "Enzymatic", ["Amylase","Protease","Lipase","DNase","Cellulase","Chitinase"]]
          ].map(([key,label,options]) => (
            <div key={key} className="mb-2">
              <label className="block mb-1">{label}</label>
              <select
                className="w-full p-2 border rounded"
                value={micro.isolatedProfile[key]}
                onChange={(e) =>
                  updateSection("microbiology", {
                    isolatedProfile: { ...micro.isolatedProfile, [key]: e.target.value }
                  })
                }
              >
                <option value="">Select {label}</option>
                {options.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          {["temperaturePreference","incubationTime"].map((key) => (
            <div key={key} className="mb-2">
              <label className="block mb-1">{key}</label>
              <input
                className="w-full p-2 border rounded"
                value={micro.isolatedProfile[key]}
                onChange={(e) =>
                  updateSection("microbiology", {
                    isolatedProfile: { ...micro.isolatedProfile, [key]: e.target.value }
                  })
                }
              />
            </div>
          ))}
        </section>

        {/* ================= ANTIBACTERIAL ASSAY ================= */}
        <section className="border p-4 rounded">
          <h4 className="font-medium mb-3">Antibacterial Assay</h4>
          {[
            ["pathogen","Pathogen",["E. coli","S. aureus","P. aeruginosa","V. harveyi","B. subtilis"]],
            ["method","Method",["Disk diffusion","Well diffusion","MIC","MBC"]],
            ["antimalarial","Antimalarial Assay",["Positive","Negative","Not tested"]],
            ["molecularID","Molecular ID",["16S rRNA","ITS","COI","rbcL"]]
          ].map(([key,label,options]) => (
            <div key={key} className="mb-2">
              <label className="block mb-1">{label}</label>
              <select
                className="w-full p-2 border rounded"
                value={micro.antibacterialAssay[key]}
                onChange={(e) =>
                  updateSection("microbiology", {
                    antibacterialAssay: { ...micro.antibacterialAssay, [key]: e.target.value }
                  })
                }
              >
                <option value="">Select {label}</option>
                {options.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </section>

        {/* ================= BIOCHEMICAL TESTS ================= */}
        <section className="border p-4 rounded">
          <h4 className="font-medium mb-2">Biochemical Tests</h4>
          {[
            "Catalase","Oxidase","Urease","Gelatin hydrolysis",
            "Sulfide production","Nitrate reduction",
            "Fermentation","Indole","Citrate"
          ].map((test) => (
            <label key={test} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={micro.biochemicalTests.includes(test)}
                onChange={() => toggleTest(test)}
              />
              {test}
            </label>
          ))}
          <label className="block mt-2 mb-1">Test Notes</label>
          <textarea
            className="w-full p-2 border rounded"
            value={micro.testNotes}
            onChange={(e) =>
              updateSection("microbiology", { testNotes: e.target.value })
            }
          />
        </section>

        <StepNavigation backPath="/add/step2" nextPath="/add/step4" />
      </div>
    </div>
  );
}
