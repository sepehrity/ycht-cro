import "./App.css";
import "./styles/products.css";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useImmer } from "use-immer";
import { useGetScriptsQuery, useLazyRenderImageQuery } from "./api";
import { ColorType, RenderImageRequest } from "./api/@types";
import styles from "./App.module.css";
import ColorPickerSlider from "./components/ColorPickerSlider";
import { COLOR_GROUPS, MAP_SCRIPT_NAME, SCRIPT_IMAGES } from "./config";
import useDebounce from "./hooks/useDebounce";
import { classNames } from "./utils";

type LayerColorType = {
  Codes: ColorType;
  colorGroup: string;
};

type Options = Record<string, Record<string, LayerColorType>>;

function App() {
  const { data: scripts = {} } = useGetScriptsQuery();
  const [renderImage, { isFetching, data: renderedImage }] =
    useLazyRenderImageQuery();

  const [boatType, setBoatType] = useState<string>("Superyacht 1");
  const [colorGroup, setColorGroup] = useState<string>("White");
  const [layer, setLayer] = useState<string>("");
  const [color, setColor] = useState<ColorType | undefined>();
  const [options, setOptions] = useImmer<Options>({});
  const [colorDescription, setColorDescription] = useState<string>("");
  const [hasImage, setHasImage] = useState(false);

  const debouncedColorDescription = useDebounce(colorDescription, 500);

  const handleSelectBoat = useCallback(
    (selectedBoatType: string) => () => {
      if (selectedBoatType !== boatType) {
        setHasImage(false);
        setOptions({});
        setLayer("");
        setColorGroup("White");
        setBoatType(selectedBoatType);
      }
    },
    [boatType, setOptions]
  );

  const handleSelectColorGroup = useCallback(
    (colorGroup: string) => () => {
      setColor(undefined);
      setColorGroup(colorGroup);
    },
    []
  );

  useEffect(() => {
    const firstLayer: string = Object.keys(
      scripts?.[boatType]?.Layers || {}
    )?.[0];
    setLayer(firstLayer);
  }, [boatType, scripts]);

  const onChangeColorDescription = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setColorDescription(event.target.value);
    },
    []
  );

  const handleSelectColor = useCallback(
    (color: ColorType) => () => {
      setColor(color);
      setOptions((draft) => {
        draft[boatType] = {
          ...(draft[boatType] || {}),
          [layer]: {
            Codes: color,
            colorGroup: colorGroup
          }
        };
      });
    },
    [layer, boatType, setOptions, colorGroup]
  );

  const handleSelectLayer = useCallback(
    (selectedLayer: string) => () => {
      if (layer !== selectedLayer) {
        if (Object.keys(options).length > 0) {
          const selectedOptions = options[boatType][selectedLayer];
          if (selectedOptions?.Codes && selectedOptions?.colorGroup) {
            setColorGroup(selectedOptions.colorGroup);
            setColor(selectedOptions.Codes);
          } else {
            setColorGroup("White");
            setColor(undefined);
          }
        }
        setLayer(selectedLayer);
      }
    },
    [boatType, layer, options]
  );

  const isReady = useMemo(
    () =>
      !!(
        boatType &&
        layer &&
        colorGroup &&
        color &&
        Object.keys(options).length > 0
      ),
    [color, colorGroup, layer, boatType, options]
  );

  const getImage = useCallback(async () => {
    if (isReady) {
      const payload: RenderImageRequest = {
        Recipe: boatType,
        Layers: Object.keys(options[boatType]).join(","),
        Codes: Object.keys(options[boatType])
          .map((i) => options[boatType][i].Codes.AkzoCode)
          .join(","),
        colorGroup: Object.keys(options[boatType])
          .map((i) => options[boatType][i].colorGroup)
          .join(",")
      };
      await renderImage(payload).unwrap();
      setHasImage(true);
    }
  }, [boatType, isReady, options, renderImage]);

  useEffect(() => {
    getImage();
  }, [getImage]);

  return (
    <div
      className="pt-5 px-16 mx-64 h-full mb-6 bg-white flex justify-center flex-col"
      style={{ width: "1300px" }}
    >
      <div className="text-center my-10">
        <h3 className="text-5xl mb-8">FIND YOUR COLOR</h3>
        <p className="text-base mb-8 break-words overflow-auto">
          Selecting the perfect color for your boat can be a daunting task. Let
          us make it easier and help you find the right Awlgrip color for you.
        </p>
        <p className="text-lg font-semibold">
          Click on the image that closely matches your boat
        </p>
      </div>
      <div className="gap-12 flex justify-center h-56">
        {Object.keys(scripts)
          ?.filter((boat) => !["E15 CR-8", "E15 B2"].includes(boat))
          .map((boat) => {
            const boatImage = SCRIPT_IMAGES[boat];
            const isActive = boatType === boat;
            return (
              <div
                key={boat}
                className={classNames(
                  "flex flex-col items-center transition cursor-pointer",
                  isActive ? "" : "grayscale"
                )}
              >
                <img
                  src={boatImage}
                  alt="boat"
                  onClick={handleSelectBoat(boat)}
                  className={classNames(
                    styles.scriptImage,
                    "bg-blue-500 h-44 w-64 mb-4 transition object-cover",
                    isActive ? "" : "opacity-80 hover:opacity-100"
                  )}
                />
                <span className="font-semibold text-lg">
                  {boat.replace("1", "")}
                </span>
              </div>
            );
          })}
      </div>
      <div className="flex justify-center items-center flex-col">
        <img
          src={hasImage ? renderedImage : SCRIPT_IMAGES[boatType]}
          alt="boat"
          className={classNames(
            "w-full mt-10 bg-gray-400 object-contain transition",
            isFetching ? "opacity-60" : "opacity-100"
          )}
        />
      </div>
      <h2 className="my-10 text-lg text-center font-semibold">
        Select the area you want to paint and the color group you would like to
        explore.
      </h2>
      <div className="flex justify-center gap-28 h-9 mb-10">
        {Object.keys(scripts?.[boatType]?.Layers || {})?.map((key) => {
          const layerName = scripts?.[boatType]?.Layers[key];
          const isActive = key === layer;
          return (
            <span
              className={classNames(
                "font-semibold text-lg cursor-pointer transition w-36 text-center",
                isActive
                  ? "text-gray-900 border-b-2 border-b-gray-500"
                  : "text-gray-500 border-b-2 border-b-transparent hover:text-gray-700 hover:border-b-gray-300"
              )}
              key={key}
              onClick={handleSelectLayer(key)}
            >
              {MAP_SCRIPT_NAME[layerName] || layerName}
            </span>
          );
        })}
      </div>
      <div
        className={classNames(
          "flex justify-between",
          layer === "Anti_fouling"
            ? "opacity-50 pointer-events-none"
            : "opacity-100"
        )}
      >
        <div className="flex items-left flex-col justify-center flex-1">
          <div className="text-gray-600 font-medium">
            Color Description: {color?.Descriptions}
          </div>
          <div className="text-gray-600 font-medium">
            Sales Code: {color?.AkzoCode}
          </div>
        </div>
        <div className="flex relative flex-1">
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className="w-6 h-6 absolute left-2 top-4 text-gray-400"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            className={classNames(
              "shadow appearance-none border rounded w-full py-4 pl-10 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            )}
            id="colorDescription"
            disabled={layer === "Anti_fouling"}
            value={colorDescription}
            type="text"
            onChange={onChangeColorDescription}
            placeholder="Search Color by description or sales code"
          />
        </div>
      </div>
      <div
        className={classNames(
          "mt-10 mb-8 h-20 w-full flex justify-center gap-5 transition",
          scripts?.[boatType]?.Layers[layer] === "Anti_fouling"
            ? "opacity-50 pointer-events-none"
            : "opacity-100"
        )}
      >
        {Object.keys(COLOR_GROUPS).map((colorName) => {
          const isActive = colorName === colorGroup;
          return (
            <div
              key={colorName}
              style={{ backgroundColor: COLOR_GROUPS[colorName] }}
              onClick={handleSelectColorGroup(colorName)}
              className={classNames(
                styles.colorBox,
                "rounded w-20 h-20 rounded-br-2xl cursor-pointer border",
                isActive ? "outline outline-gray-400 outline-offset-4" : ""
              )}
            />
          );
        })}
      </div>
      <ColorPickerSlider
        colorDescription={debouncedColorDescription}
        colorGroup={colorGroup}
        layer={scripts?.[boatType]?.Layers[layer]}
        onSelectColor={handleSelectColor}
        selectedColor={color?.id}
      />
    </div>
  );
}

export default App;
