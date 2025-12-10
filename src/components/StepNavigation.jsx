import React from 'react';
import { useNavigate } from 'react-router-dom';


export default function StepNavigation({ backPath, nextPath, isLast = false, onFinish, disabled = false }){
const navigate = useNavigate();
return (
<div className="flex justify-between mt-4">
<button type="button" onClick={() => navigate(backPath)} className="px-4 py-2 border rounded">Back</button>
{!isLast ? (
<button type="button" onClick={() => navigate(nextPath)} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>
) : (
<button type="button" onClick={onFinish} disabled={disabled} className="px-4 py-2 bg-green-600 text-white rounded">{disabled ? 'Submitting...' : 'Finish'}</button>
)}
</div>
);
}