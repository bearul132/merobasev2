export function generateSampleID({ samples = [], projectType = 'A', projectNumber = '', sampleNumber = null }){
// samples: existing array to compute max. If sampleNumber provided, use it.
if (sampleNumber !== null && sampleNumber !== undefined && sampleNumber !== ''){
return `${projectType}-${projectNumber}-${String(sampleNumber).padStart(3,'0')}`;
}
const filtered = samples.filter(s => s.projectType === projectType && Number(s.projectNumber) === Number(projectNumber));
const maxNum = filtered.reduce((max, s) => Math.max(max, s.sampleNumber || 0), 0);
const next = maxNum + 1;
return `${projectType}-${projectNumber}-${String(next).padStart(3,'0')}`;
}