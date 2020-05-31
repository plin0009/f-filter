import React, { useRef, useState, useEffect } from "react";
import update from "immutability-helper";

import { FilterObject } from "../types";
import { applyFilters } from "../filters";
import Filter from "../components/Filter";

const HomePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const uploadFileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [filters, setFilters] = useState<FilterObject[]>([]);

  useEffect(() => {
    drawImage();
  });

  const drawImage = () => {
    const image = imageRef.current;
    if (canvasRef.current === null || image === null) {
      return;
    }
    canvasRef.current.width = image.width;
    canvasRef.current.height = image.height;
    canvasRef.current.getContext("2d")?.drawImage(image, 0, 0);
    applyFilters(filters, canvasRef.current);
  };

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
      imageRef.current = new Image();
      const image = imageRef.current;
      image.onload = () => {
        drawImage();
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
          <div>
            <button
              onClick={() => {
                if (canvasRef.current === null) {
                  return;
                }
                setFilters((f) =>
                  update(f, {
                    $push: [{ name: "grayscale", args: {}, hidden: false }],
                  })
                );
              }}
            >
              Grayscale
            </button>
            <button
              onClick={() => {
                if (canvasRef.current === null) {
                  return;
                }
                setFilters((f) =>
                  update(f, {
                    $push: [{ name: "sepia", args: {}, hidden: false }],
                  })
                );
              }}
            >
              Sepia
            </button>
            <button
              onClick={() => {
                if (canvasRef.current === null) {
                  return;
                }
                setFilters((f) =>
                  update(f, {
                    $push: [
                      {
                        name: "tint",
                        args: {
                          hue: 360,
                          positiveIntensity: 100,
                        },
                        hidden: false,
                      },
                    ],
                  })
                );
              }}
            >
              Tint
            </button>
          </div>
          <div className="filters">
            {filters.map((filter, filterIndex) => (
              <Filter
                filterObject={filter}
                onChangeHue={
                  filter.args.hue !== undefined
                    ? (newHue) => {
                        setFilters((f) =>
                          update(f, {
                            [filterIndex]: {
                              args: { hue: { $set: newHue } },
                            },
                          })
                        );
                      }
                    : undefined
                }
                onChangePositiveIntensity={
                  filter.args.positiveIntensity !== undefined
                    ? (newPositiveIntensity) => {
                        setFilters((f) =>
                          update(f, {
                            [filterIndex]: {
                              args: {
                                positiveIntensity: {
                                  $set: newPositiveIntensity,
                                },
                              },
                            },
                          })
                        );
                      }
                    : undefined
                }
                onToggleHide={() => {
                  setFilters((f) =>
                    update(f, {
                      [filterIndex]: { hidden: { $set: !filter.hidden } },
                    })
                  );
                }}
                onRemove={() => {
                  setFilters((f) => update(f, { $splice: [[filterIndex, 1]] }));
                }}
              />
            ))}
          </div>
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
