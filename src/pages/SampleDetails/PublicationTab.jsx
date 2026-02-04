import React from "react";
import { InfoGrid, Info } from "./SharedComponents";

export default function PublicationTab({ publication }) {
  if (!publication) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Publication / Links</h2>

      {Array.isArray(publication.links) && publication.links.length > 0 ? (
        <ul className="list-disc pl-6">
          {publication.links.map((link, i) => (
            <li key={i}>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400 italic">No publications documented.</p>
      )}
    </div>
  );
}
