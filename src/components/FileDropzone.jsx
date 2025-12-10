import React from 'react';

export function FileDropzone({ multiple = false, accept = 'image/*,.fastq,.fq,.ab1,.txt,.fasta,.fa', onFiles, existing = [] }) {
  const inputRef = React.useRef();

  const toBase64File = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, type: file.type, data: reader.result });
    reader.onerror = reject; reader.readAsDataURL(file);
  });

  const handleFiles = async (fileList) => {
    const arr = Array.from(fileList || []);
    const converted = await Promise.all(arr.map(f => toBase64File(f)));
    onFiles(multiple ? converted : (converted[0] ? converted[0] : null));
  };

  const handleDrop = (e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e)=>e.preventDefault()}
      onClick={()=>inputRef.current && inputRef.current.click()}
      className="border-2 border-dashed p-3 rounded cursor-pointer text-center"
    >
      <p className="text-sm">Drag & drop or click to choose file(s)</p>

      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={(e)=>handleFiles(e.target.files)}
        className="hidden"
      />

      <div className="mt-2 flex flex-wrap gap-2 justify-center">
        {Array.isArray(existing)
          ? existing.map((f,i)=> (
              <div key={i} className="w-20 h-20 border rounded overflow-hidden flex items-center justify-center text-xs">
                {f.name}
              </div>
            ))
          : existing
            ? <div className="w-36 h-20 border rounded overflow-hidden flex items-center justify-center text-xs">{existing.name}</div>
            : null
        }
      </div>
    </div>
  );
}

export default FileDropzone;
