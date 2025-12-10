import React from 'react';
import { useSampleFormContext } from '../../context/SampleFormContext';
import StepNavigation from '../../components/StepNavigation';
import FormProgressBar from '../../components/FormProgressBar';


export default function Step5_Publication(){
const { formData, updateSection } = useSampleFormContext();
const pubs = formData.publication;


const handleLinkChange = (i, v) => { const arr = [...(pubs.links || [])]; arr[i] = v; updateSection('publication',{ links: arr }); };
const addLink = () => updateSection('publication',{ links: [...(pubs.links||[]), ''] });
const removeLink = (i) => updateSection('publication',{ links: (pubs.links||[]).filter((_,idx)=>idx!==i) });


return (
<div>
<FormProgressBar step={5} steps={6} />
<h3 className="font-semibold mb-2">Publication Links</h3>
<div className="grid gap-4">
{(pubs.links||[]).map((l,i)=> (
<div key={i} className="flex gap-2">
<input type="url" value={l} onChange={(e)=>handleLinkChange(i,e.target.value)} className="flex-1 p-2 border rounded" placeholder="https://..." />
<button type="button" onClick={()=>removeLink(i)} className="px-3 py-2 bg-red-500 text-white rounded">Remove</button>
</div>
))}
<button type="button" onClick={addLink} className="px-4 py-2 bg-green-500 text-white rounded w-36">Add Link</button>


<StepNavigation backPath={'/add/step4'} nextPath={'/add/review'} />
</div>
</div>
);
}