import { useEffect, useState } from "react";
import Image from "next/image";

type ImageFilePreviewProps = {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
};

export default function ImageFilePreview({
  file,
  setFile,
}: ImageFilePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);

    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url); // cleanup
  }, [file]);

  if (!file || !previewUrl) return null;

  return (
    <div className="position-relative d-inline-block" style={{ width: 100, height: 100 }}>
      <Image
        src={previewUrl}
        alt="Preview"
        width={80}
        height={80}
        className="rounded border object-fit-cover"
      />

      <button
        type="button"
        onClick={() => setFile(null)}
        className="btn-close position-absolute translate-middle bg-white rounded-circle shadow-sm"
        aria-label="Remove image"
        style={{
          top: 15,
          right: -8,
        }}
      />
    </div>
  );
}
