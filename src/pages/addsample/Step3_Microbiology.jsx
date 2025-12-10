// src/pages/Step3_Microbiology.jsx
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSampleFormContext } from '../../context/SampleFormContext';
import StepNavigation from '../../components/StepNavigation';
import FormProgressBar from '../../components/FormProgressBar';

export default function Step3_Microbiology() {
  const { formData, updateSection } = useSampleFormContext();
  const navigate = useNavigate();
  const micro = formData.microbiology;

  const isolatedInputRef = useRef();
  const microInputRef = useRef();

  // Handle dropdown changes for isolatedDescription
  const handleIsolatedDescChange = (field, value) => {
    updateSection('microbiology', {
      isolatedDescription: {
        ...micro.isolatedDescription,
        [field]: value
      }
    });
  };

  // Handle dropdown changes for isolatedProfile
  const handleIsolatedProfileChange = (field, value) => {
    updateSection('microbiology', {
      isolatedProfile: {
        ...micro.isolatedProfile,
        [field]: value
      }
    });
  };

  // Handle image uploads
  const handleImageChange = (file, type) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateSection('microbiology', {
        images: { ...micro.images, [type]: reader.result }
      });
    };
    reader.readAsDataURL(file);
  };

  // Drag & Drop handler
  const handleDrop = (e, type) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0], type);
    }
  };

  // Toggle biochemical test
  const toggleTest = (test) => {
    const arr = micro.biochemicalTests || [];
    const exists = arr.includes(test);
    const updated = exists ? arr.filter(x => x !== test) : [...arr, test];
    updateSection('microbiology', { biochemicalTests: updated });
  };

  return (
    <div className="container mx-auto p-4">
      <FormProgressBar step={3} steps={6} />
      <h3 className="font-semibold mb-2">Microbiology</h3>

      <div className="grid gap-4">

        {/* Sample Storage Box */}
        <div className="border p-4 rounded bg-gray-50">
          <h4 className="font-medium mb-2">Sample Storage Box</h4>
          <div className="grid gap-2">
            <div>
              <label className="block mb-1">Box ID</label>
              <input
                type="text"
                value={micro.storageBox?.boxID || ''}
                onChange={(e) =>
                  updateSection('microbiology', {
                    storageBox: { ...micro.storageBox, boxID: e.target.value }
                  })
                }
                className="w-full p-2 border rounded"
                placeholder="e.g., Box A"
              />
            </div>

            <div>
              <label className="block mb-1">Shelf</label>
              <input
                type="text"
                value={micro.storageBox?.shelf || ''}
                onChange={(e) =>
                  updateSection('microbiology', {
                    storageBox: { ...micro.storageBox, shelf: e.target.value }
                  })
                }
                className="w-full p-2 border rounded"
                placeholder="e.g., Shelf 2"
              />
            </div>

            <div>
              <label className="block mb-1">Position in Box</label>
              <input
                type="text"
                value={micro.storageBox?.position || ''}
                onChange={(e) =>
                  updateSection('microbiology', {
                    storageBox: { ...micro.storageBox, position: e.target.value }
                  })
                }
                className="w-full p-2 border rounded"
                placeholder="e.g., Slot 3"
              />
            </div>

            <div>
              <label className="block mb-1">Storage Temperature</label>
              <select
                value={micro.storageBox?.temperature || ''}
                onChange={(e) =>
                  updateSection('microbiology', {
                    storageBox: { ...micro.storageBox, temperature: e.target.value }
                  })
                }
                className="w-full p-2 border rounded"
              >
                <option value="">Select temperature</option>
                <option value="4C">Refrigerator 4°C</option>
                <option value="-20C">Freezer -20°C</option>
                <option value="Room">Room Temperature</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Notes</label>
              <textarea
                value={micro.storageBox?.notes || ''}
                onChange={(e) =>
                  updateSection('microbiology', {
                    storageBox: { ...micro.storageBox, notes: e.target.value }
                  })
                }
                className="w-full p-2 border rounded"
                placeholder="Any extra notes about the sample"
              />
            </div>
          </div>
        </div>

        {/* Isolated Image Upload (Top) */}
        <div
          className="border border-dashed p-4 rounded text-center cursor-pointer"
          onClick={() => isolatedInputRef.current.click()}
          onDrop={(e) => handleDrop(e, 'isolated')}
          onDragOver={(e) => e.preventDefault()}
        >
          <p className="text-sm mb-2">Drag & drop isolated image here, or click to select</p>
          {micro.images?.isolated && (
            <img
              src={micro.images.isolated}
              alt="isolated preview"
              className="mt-2 max-w-xs mx-auto border rounded"
            />
          )}
          <input
            ref={isolatedInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files[0] && handleImageChange(e.target.files[0], 'isolated')}
          />
        </div>

        {/* Isolated Description */}
        <div className="grid gap-2 border p-2 rounded">
          <h4 className="font-medium mb-1">Isolated Description (Colony + Microscopic)</h4>
          {[
            ['colonyShape','Shape',['Circular','Irregular','Filamentous','Rhizoid','Spindle']],
            ['colonyMargin','Margin',['Entire','Undulate','Lobate','Filamentous']],
            ['colonyElevation','Elevation',['Flat','Raised','Convex','Umbonate','Pulvinate']],
            ['colonyColor','Color',['White','Cream','Yellow','Orange','Pink','Red','Brown','Green']],
            ['colonyTexture','Texture',['Smooth','Rough','Mucoid','Dry','Wrinkled']],
            ['microscopicShape','Microscopic Shape',['Coccus','Rod','Vibrio','Spirillum','Filamentous']],
            ['microscopicArrangement','Microscopic Arrangement',['Single','Pair','Chains','Clusters','Tetrads']]
          ].map(([field,label,options]) => (
            <div key={field}>
              <label className="block mb-1">{label}</label>
              <select
                value={micro.isolatedDescription?.[field] || ''}
                onChange={(e) => handleIsolatedDescChange(field, e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select {label}</option>
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          ))}
        </div>

        {/* Microscopic Image Upload */}
        <div
          className="border border-dashed p-4 rounded text-center cursor-pointer"
          onClick={() => microInputRef.current.click()}
          onDrop={(e) => handleDrop(e, 'microscopic')}
          onDragOver={(e) => e.preventDefault()}
        >
          <p className="text-sm mb-2">Drag & drop microscopic image here, or click to select</p>
          {micro.images?.microscopic && (
            <img
              src={micro.images.microscopic}
              alt="microscopic preview"
              className="mt-2 max-w-xs mx-auto border rounded"
            />
          )}
          <input
            ref={microInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files[0] && handleImageChange(e.target.files[0], 'microscopic')}
          />
        </div>

        {/* Isolated Profile */}
        <div className="grid gap-2 border p-2 rounded">
          <h4 className="font-medium mb-1">Isolated Profile (Functional / Physiological)</h4>
          {[
            ['gramReaction','Gram Reaction',['Positive','Negative','Variable']],
            ['motility','Motility',['Motile','Non-motile','Swarming','Gliding']],
            ['oxygenRequirement','Oxygen Requirement',['Aerobic','Anaerobic','Facultative','Microaerophilic']],
            ['halotolerance','Halotolerance',['Non-halophilic','Slightly halophilic','Moderately halophilic','Extremely halophilic']],
            ['temperaturePreference','Temperature Preference',['Psychrophilic','Mesophilic','Thermophilic']],
            ['agarMedia','Agar Media',['NA','TSA','PCA','R2A','MacConkey','Marine Agar']],
            ['incubationTime','Incubation Time (h)',['12','24','48','72','>72']],
            ['enzymatic','Enzymatic',['Amylase','Protease','Lipase','DNase','Catalase','Oxidase']],
            ['antibacterialAssay','Antibacterial Assay',['MRSA','E. coli','P. aeruginosa','B. subtilis','Salmonella typhi','S. typhimurium']],
            ['antimalarialAssay','Antimalarial Assay',['Plasmodium falciparum','P. vivax','P. malariae','P. ovale']],
            ['molecularIdentification','Molecular ID',['16S rRNA','ITS','COI','Other']]
          ].map(([field,label,options]) => (
            <div key={field}>
              <label className="block mb-1">{label}</label>
              <select
                value={micro.isolatedProfile?.[field] || ''}
                onChange={(e) => handleIsolatedProfileChange(field, e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select {label}</option>
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          ))}
        </div>

        {/* Biochemical Tests (Bottom) */}
        <div>
          <label className="block mb-1">Biochemical Tests</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              'Catalase','Oxidase','Urease','Gelatin hydrolysis','Sulfide production',
              'Nitrate reduction','Fermentation','Indole','Citrate'
            ].map(t => (
              <label key={t} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(micro.biochemicalTests || []).includes(t)}
                  onChange={() => toggleTest(t)}
                />
                <span className="text-sm">{t}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Step Navigation */}
        <StepNavigation backPath={'/add/step2'} nextPath={'/add/step4'} />
      </div>
    </div>
  );
}
