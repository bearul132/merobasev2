import React, { useRef } from "react";
import { useSampleFormContext } from "../../context/SampleFormContext";
import StepNavigation from "../../components/StepNavigation";
import FormProgressBar from "../../components/FormProgressBar";

export default function Step2_Microbiology() {
  const { formData, updateSection } = useSampleFormContext();

  /* ================= SAFE DEFAULT STRUCTURE ================= */
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

  const dropZone = (ref, label, type, image) => (
    <div
      className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition"
      onClick={() => ref.current.click()}
      onDrop={(e) => {
        e.preventDefault();
        if (e.dataTransfer.files?.[0]) handleImage(e.dataTransfer.files[0], type);
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      <p className="text-sm text-gray-600">{label}</p>
      {image && (
        <img src={image} className="mx-auto mt-4 max-w-xs rounded shadow" />
      )}
      <input
        ref={ref}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => e.target.files[0] && handleImage(e.target.files[0], type)}
      />
    </div>
  );

  const section = (title, children) => (
    <section className="bg-white border rounded-xl p-6 shadow-sm">
      <h4 className="text-lg font-semibold mb-4">{title}</h4>
      {children}
    </section>
  );

  const input = (value, onChange) => (
    <input
      className="w-full p-2 border rounded-md focus:outline-none focus:ring"
      value={value}
      onChange={onChange}
    />
  );

  const select = (value, onChange, label, options) => (
    <select
      className="w-full p-2 border rounded-md focus:outline-none focus:ring"
      value={value}
      onChange={onChange}
    >
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );

  const toggleTest = (test) => {
    updateSection("microbiology", {
      biochemicalTests: micro.biochemicalTests.includes(test)
        ? micro.biochemicalTests.filter((t) => t !== test)
        : [...micro.biochemicalTests, test]
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <FormProgressBar step={2} steps={6} />

      <h2 className="text-2xl font-bold mb-6">Microbiology</h2>

      <div className="grid gap-8">

        {section("Sample Storage Box", (
          <div className="grid md:grid-cols-2 gap-4">
            {["boxID","shelf","position","temperature"].map((key) => (
              <div key={key}>
                <label className="block mb-1 capitalize">{key.replace(/([A-Z])/g," $1")}</label>
                {input(
                  micro.storageBox[key],
                  (e) => updateSection("microbiology", {
                    storageBox: { ...micro.storageBox, [key]: e.target.value }
                  })
                )}
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block mb-1">Notes</label>
              <textarea
                className="w-full p-2 border rounded-md"
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

        {section("Isolated Description", (
          <div className="grid md:grid-cols-2 gap-4">
            {[
              ["shape","Shape",["Circular","Irregular","Filamentous","Rhizoid"]],
              ["margin","Margin",["Entire","Undulate","Lobate"]],
              ["elevation","Elevation",["Flat","Raised","Convex"]],
              ["color","Color",["White","Cream","Yellow","Orange","Pink"]],
              ["texture","Texture",["Smooth","Rough","Mucoid"]]
            ].map(([key,label,opts]) => (
              <div key={key}>
                <label className="block mb-1">{label}</label>
                {select(
                  micro.isolatedDescription[key],
                  (e)=>updateSection("microbiology",{
                    isolatedDescription:{...micro.isolatedDescription,[key]:e.target.value}
                  }),
                  `Select ${label}`,
                  opts
                )}
              </div>
            ))}
          </div>
        ))}

        {dropZone(macroRef, "Drag & Drop Macroscopic Image Here", "macroscopic", micro.images.macroscopic)}

        {section("Macroscopic Morphology", (
          <div className="grid md:grid-cols-2 gap-4">
            {[
              ["shape","Macroscopic Shape",["Circular","Irregular","Filamentous"]],
              ["arrangement","Macroscopic Arrangement",["Single","Clustered","Spreading"]]
            ].map(([key,label,opts]) => (
              <div key={key}>
                <label className="block mb-1">{label}</label>
                {select(
                  micro.macroscopicMorphology[key],
                  (e)=>updateSection("microbiology",{
                    macroscopicMorphology:{...micro.macroscopicMorphology,[key]:e.target.value}
                  }),
                  `Select ${label}`,
                  opts
                )}
              </div>
            ))}
          </div>
        ))}

        {dropZone(microRef, "Drag & Drop Microscopic Image Here", "microscopic", micro.images.microscopic)}

        {section("Microscopic Morphology", (
          <div className="grid md:grid-cols-2 gap-4">
            {[
              ["shape","Microscopic Shape",["Coccus","Bacillus","Vibrio","Spirillum"]],
              ["arrangement","Microscopic Arrangement",["Single","Diplo","Strepto","Staphylo"]]
            ].map(([key,label,opts]) => (
              <div key={key}>
                <label className="block mb-1">{label}</label>
                {select(
                  micro.microscopicMorphology[key],
                  (e)=>updateSection("microbiology",{
                    microscopicMorphology:{...micro.microscopicMorphology,[key]:e.target.value}
                  }),
                  `Select ${label}`,
                  opts
                )}
              </div>
            ))}
          </div>
        ))}

        {section("Isolated Profile", (
          <div className="grid md:grid-cols-2 gap-4">
            {[
              ["gramReaction","Gram Reaction",["Gram Positive","Gram Negative"]],
              ["motility","Motility",["Motile","Non-motile"]],
              ["oxygenRequirement","Oxygen Requirement",["Aerobic","Anaerobic","Facultative"]],
              ["agarMedia","Agar Media",["NA","TSA","Marine Agar"]],
              ["enzymatic","Enzymatic",["Amylase","Protease","Lipase"]]
            ].map(([key,label,opts]) => (
              <div key={key}>
                <label className="block mb-1">{label}</label>
                {select(
                  micro.isolatedProfile[key],
                  (e)=>updateSection("microbiology",{
                    isolatedProfile:{...micro.isolatedProfile,[key]:e.target.value}
                  }),
                  `Select ${label}`,
                  opts
                )}
              </div>
            ))}
            {["temperaturePreference","incubationTime"].map((key)=>(
              <div key={key}>
                <label className="block mb-1 capitalize">{key}</label>
                {input(
                  micro.isolatedProfile[key],
                  (e)=>updateSection("microbiology",{
                    isolatedProfile:{...micro.isolatedProfile,[key]:e.target.value}
                  })
                )}
              </div>
            ))}
          </div>
        ))}

        {section("Antibacterial Assay", (
          <div className="grid md:grid-cols-2 gap-4">
            {[
              ["pathogen","Pathogen",["E. coli","S. aureus","P. aeruginosa"]],
              ["method","Method",["Disk diffusion","MIC"]],
              ["antimalarial","Antimalarial Assay",["Positive","Negative"]],
              ["molecularID","Molecular ID",["16S rRNA","ITS"]]
            ].map(([key,label,opts]) => (
              <div key={key}>
                <label className="block mb-1">{label}</label>
                {select(
                  micro.antibacterialAssay[key],
                  (e)=>updateSection("microbiology",{
                    antibacterialAssay:{...micro.antibacterialAssay,[key]:e.target.value}
                  }),
                  `Select ${label}`,
                  opts
                )}
              </div>
            ))}
          </div>
        ))}

        {section("Biochemical Tests", (
          <>
            <div className="grid md:grid-cols-3 gap-2">
              {[
                "Catalase","Oxidase","Urease","Gelatin hydrolysis",
                "Sulfide production","Nitrate reduction",
                "Fermentation","Indole","Citrate"
              ].map((test)=>(
                <label key={test} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={micro.biochemicalTests.includes(test)}
                    onChange={()=>toggleTest(test)}
                  />
                  {test}
                </label>
              ))}
            </div>
            <label className="block mt-4 mb-1">Test Notes</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={3}
              value={micro.testNotes}
              onChange={(e)=>updateSection("microbiology",{ testNotes:e.target.value })}
            />
          </>
        ))}

        <StepNavigation backPath="/add/step1" nextPath="/add/step3" />
      </div>
    </div>
  );
}
