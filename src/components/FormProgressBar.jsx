import React from 'react';


export default function FormProgressBar({ step = 1, steps = 6 }) {
const pct = Math.round((step - 1) / (steps - 1) * 100);
return (
<div className="mb-4">
<div className="text-sm text-gray-600">Step {step} of {steps - 1}</div>
<div className="w-full bg-gray-200 h-2 rounded mt-1 overflow-hidden">
<div style={{ width: `${pct}%` }} className="h-2 bg-blue-600" />
</div>
</div>
);
}