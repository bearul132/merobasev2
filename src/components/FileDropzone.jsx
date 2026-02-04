import React, { useEffect, useRef } from "react";

export function FileDropzone({
  multiple = false,
  accept = "image/*,.fastq,.fq,.ab1,.txt,.fasta,.fa",
  onFiles,
  existing = [],
  demoOnly = false
}) {
  const inputRef = useRef(null);

  /* ================= FILE → BASE64 (IMAGES ONLY) ================= */
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  /* ================= NORMALIZE FILE ================= */
  const normalizeFile = async (file) => {
    const isImage = file.type?.startsWith("image/");

    return {
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type || "unknown",
      size: file.size,

      /* DEMO STORAGE */
      data: isImage ? await fileToBase64(file) : null,

      /* runtime-only fallback */
      previewUrl: !isImage ? null : undefined
    };
  };

  /* ================= HANDLE FILES ================= */
  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    const normalized = await Promise.all(files.map(normalizeFile));

    onFiles(multiple ? normalized : normalized[0]);
    inputRef.current.value = "";
  };

  /* ================= DRAG & DROP ================= */
  const handleDrop = async (e) => {
    e.preventDefault();
    await handleFiles(e.dataTransfer.files);
  };

  /* ================= REMOVE ================= */
  const removeFile = (id) => {
    if (multiple) {
      onFiles(existing.filter((f) => f.id !== id));
    } else {
      onFiles(null);
    }
  };

  /* ================= UI ================= */
  const filesArray = Array.isArray(existing)
    ? existing
    : existing
    ? [existing]
    : [];

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed rounded-md p-4 text-center transition"
    >
      <div
        className="cursor-pointer hover:border-blue-400"
        onClick={() => inputRef.current?.click()}
      >
        <p className="text-sm text-gray-600">
          Drag & drop or click to select file{multiple ? "s" : ""}
        </p>

        {demoOnly && (
          <p className="text-xs text-orange-600 mt-1">
            ⚠ DEMO ONLY — files stored locally (not uploaded)
          </p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* ================= PREVIEW ================= */}
      <div className="mt-4 flex flex-wrap gap-3 justify-center">
        {filesArray.map((file) => (
          <div
            key={file.id}
            className="relative w-24 h-24 border rounded bg-gray-50 overflow-hidden"
            title={file.name}
          >
            {file.data ? (
              <img
                src={file.data}
                alt={file.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-xs px-1 text-center">
                {file.name}
              </div>
            )}

            <button
              type="button"
              onClick={() => removeFile(file.id)}
              className="absolute top-1 right-1 bg-white/80 text-red-600 rounded-full px-1 text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileDropzone;
