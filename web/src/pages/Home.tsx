import React, { useRef, useState, useEffect } from "react";
import update from "immutability-helper";

import { FilterObject, FAArg, DefaultFilterObjects } from "../types";
import { applyFilters, defaultFilterObjects } from "../filters";
import Filter from "../components/Filter";
import Microphone from "../components/Microphone";
import textToFilter from "../textToFilter";
import { codeToFilter, filterToCode } from "../filterCodes";
import { PlusSVG, ShareSVG } from "../components/svgs";

const HomePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const uploadFileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [fileName, setFileName] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterObject[]>([]);

  const [codeInput, setCodeInput] = useState<string>("");

  //const [savedFilterCode, setSavedFilterCode] = useState<string | null>(null);

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
    setFileName(uploadFileRef.current.files[0].name);
  };

  const pushFilter = (filter: FilterObject) => {
    if (canvasRef.current === null) {
      return;
    }
    setFilters((f) =>
      update(f, {
        $push: [filter],
      })
    );
  };

  const updateFilterArg = (filterIndex: number, { key, value }: FAArg) => {
    setFilters((f) =>
      update(f, {
        [filterIndex]: {
          args: { [key]: { $set: value } },
        },
      })
    );
  };

  return (
    <main className="App">
      <div className="topBar">
        <h1 className="title">F-Filter</h1>
      </div>
      <div className="workspace">
        <div className="workspaceWrapper">
          <div className="canvasWrapper">
            <canvas
              ref={canvasRef}
              width={window.innerWidth}
              height={window.innerHeight}
            />
          </div>

          <div className="controlPanel">
            <div>
              <div className="buttonBar">
                <div className="dropdown is-hoverable">
                  <div className="dropdown-trigger">
                    <button className="svg-button">
                      <PlusSVG size="2em" />
                    </button>
                  </div>
                  <div className="dropdown-menu">
                    <div className="dropdown-content">
                      {(Object.keys(defaultFilterObjects) as Array<
                        keyof DefaultFilterObjects
                      >).map((name) => (
                        <button
                          className="not-button dropdown-item"
                          onClick={() => {
                            const newFilter = {
                              name,
                              args: { ...defaultFilterObjects[name].args },
                              hidden: false,
                            } as FilterObject;
                            pushFilter(newFilter);
                          }}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <Microphone
                  textCallback={(text) => {
                    const filterObject = textToFilter(text);
                    if (filterObject === null) {
                      return;
                    }
                    console.log(filterObject);
                    pushFilter(filterObject);
                  }}
                />
                <button
                  className="svg-button"
                  onClick={async () => {
                    const data = await filterToCode(filters);
                    const code = data.code;
                    alert(code);
                  }}
                >
                  <ShareSVG size="2em" />
                </button>
              </div>
              <div className="field has-addons">
                <div className="control is-expanded">
                  <input
                    className="input is-small"
                    type="text"
                    placeholder="Have a filter code?"
                    value={codeInput}
                    onChange={(e) => {
                      setCodeInput(e.target.value);
                    }}
                  />
                </div>
                <div className="control">
                  <button
                    className="button is-small"
                    onClick={async () => {
                      const { filterObjects } = await codeToFilter(codeInput);
                      //pushFilters(filterObjects);
                      for (let i = 0; i < filterObjects.length; i++) {
                        const filterObject = {
                          args: {},
                          hidden: false,
                          ...filterObjects[i],
                        };
                        pushFilter(filterObject);
                      }
                    }}
                  >
                    Fetch
                  </button>
                </div>
              </div>
            </div>
            <div className="filters">
              {filters.map((filter, filterIndex) => (
                <Filter
                  filterObject={filter}
                  onChangeHue={
                    filter.args.hue !== undefined
                      ? (newHue) => {
                          updateFilterArg(filterIndex, {
                            key: "hue",
                            value: newHue,
                          });
                        }
                      : undefined
                  }
                  onChangeIntensity={
                    filter.args.intensity !== undefined
                      ? (newIntensity) => {
                          updateFilterArg(filterIndex, {
                            key: "intensity",
                            value: newIntensity,
                          });
                        }
                      : undefined
                  }
                  onChangePositiveIntensity={
                    filter.args.positiveIntensity !== undefined
                      ? (newPositiveIntensity) => {
                          updateFilterArg(filterIndex, {
                            key: "positiveIntensity",
                            value: newPositiveIntensity,
                          });
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
                    setFilters((f) =>
                      update(f, { $splice: [[filterIndex, 1]] })
                    );
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="inputFileWrapper">
        <input type="file" ref={uploadFileRef} onChange={uploadImage} />
        <a
          href={canvasRef.current?.toDataURL()}
          download={"f-" + fileName}
          onClick={(e) => {
            if (canvasRef.current === null) {
              return;
            }
            e.currentTarget.href = canvasRef.current.toDataURL();
          }}
        >
          Save
        </a>
      </div>
    </main>
  );
};

export default HomePage;
