import React, { useRef, useState, useEffect } from "react";
import { FilterObject, applyFilters, createFilter } from "../filters";

const HomePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const uploadFileRef = useRef<HTMLInputElement>(null);

  const [filters, setFilters] = useState<FilterObject[]>([]);

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }
    applyFilters(filters, canvasRef.current);
  }, [filters]);

  const uploadImage = () => {
    if (
      !(
        uploadFileRef.current &&
        uploadFileRef.current.files &&
        uploadFileRef.current.files[0]
      )
    ) {
      // file not uploaded
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.onload = () => {
        if (canvasRef.current === null) {
          return;
        }
        canvasRef.current.width = image.width;
        canvasRef.current.height = image.height;
        canvasRef.current.getContext("2d")?.drawImage(image, 0, 0);
      };
      const result = e.target?.result as string;
      image.src = result;
    };
    reader.readAsDataURL(uploadFileRef.current.files[0]);
  };

  return (
    <main className="App">
      <h1>F-Filter</h1>
      <div className="workspace">
        <div className="canvasWrapper">
          <canvas
            ref={canvasRef}
            width={window.innerWidth}
            height={window.innerHeight}
          />
        </div>
        <div className="controlPanel">
          <button
            onClick={() => {
              if (canvasRef.current === null) {
                return;
              }
              setFilters((f) => [...f, createFilter({ name: "grayscale" })]);
            }}
          >
            Grayscale
          </button>
          <button
            onClick={() => {
              if (canvasRef.current === null) {
                return;
              }
              setFilters((f) => [...f, createFilter({ name: "sepia" })]);
            }}
          >
            Sepia
          </button>
        </div>
      </div>
      <div className="inputFileWrapper">
        <p>Choose image</p>
        <input type="file" ref={uploadFileRef} onChange={uploadImage} />
      </div>
    </main>
  );
};

export default HomePage;
