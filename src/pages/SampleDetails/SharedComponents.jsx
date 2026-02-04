import React from "react";

export function InfoGrid({ children }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

export function Info({ label, value }) {
  return (
    <p className="text-sm">
      <span className="font-medium">{label}:</span> {value || "-"}
    </p>
  );
}

export function ImageGrid({ title, images }) {
  if (!Array.isArray(images) || images.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic mt-4">{title}: No images documented.</p>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="font-medium mb-3">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((file, i) => (
          <img
            key={i}
            src={file.data || file.previewUrl || file}
            alt={file.name || "image"}
            className="w-full h-40 object-cover rounded-lg shadow"
          />
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-2 italic">
        * Demo preview only (Base64, localStorage)
      </p>
    </div>
  );
}
