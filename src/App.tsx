import "./App.css";
import "./styles/products.css";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useGetScriptsQuery, useLazyRenderImageQuery } from "./api";
import styles from "./App.module.css";
import { classNames } from "./utils";
// import Carousel from "./compoFnents/Carousel";
import { useImmer } from "use-immer";
import Cruiser from "./images/Cruiser1.png";
import Sailboat from "./images/Sailboat 1.png";
import FishingBoat from "./images/Sport Fishing Boat 1.png";
import Superyacht from "./images/Superyacht 1.png";
import { ColorType, RenderImageRequest } from "./api/@types";
import ColorPickerSlider from "./components/ColorPickerSlider";
import useDebounce from "./hooks/useDebounce";

const COLORS: Record<string, string> = {
  White: "#FFFFFF",
  Grey: "#768E99",
  Beige: "#F3F3D7",
  Brown: "#7C6731",
  Yellow: "#F1EA36",
  Orange: "#BD5F35",
  Red: "#8E2020",
  Purple: "#635F8D",
  Blue: "#3ECACA",
  Turquoise: "#367A84",
  Green: "#587E40",
  Black: "#282B2D"
};

type LayerColorType = {
  Codes: string;
  colorGroup: string;
};

const images: Record<string, string> = {
  "Superyacht 1": Superyacht,
  "Sport Fishing Boat 1": FishingBoat,
  "Sailboat 1": Sailboat,
  Cruiser1: Cruiser
};

type Options = Record<string, Record<string, LayerColorType>>;

function App() {
  const { data: scripts = {} } = useGetScriptsQuery();
  const [renderImage, { isFetching, data: renderedImage }] =
    useLazyRenderImageQuery();

  const [scriptType, setScriptType] = useState<string>("Superyacht 1");
  const [colorGroup, setColorGroup] = useState<string>("");
  const [layer, setLayer] = useState<string>("");
  const [color, setColor] = useState<ColorType | undefined>();
  const [options, setOptions] = useImmer<Options>({});
  const [colorDescription, setColorDescription] = useState<string>("");
  const [hasImage, setHasImage] = useState(false);

  const debouncedColorDescription = useDebounce(colorDescription, 500);

  const handleSelectBoat = useCallback(
    (boat: string) => () => {
      setHasImage(false);
      setOptions({});
      setLayer("");
      setColorGroup("");
      setScriptType(boat);
    },
    [setOptions]
  );

  const handleSelectColorGroup = useCallback(
    (colorGroup: string) => () => {
      setColor(undefined);
      setColorGroup(colorGroup);
    },
    []
  );

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
        draft[scriptType] = {
          ...(draft[scriptType] || {}),
          [layer]: {
            Codes: color.AkzoCode,
            colorGroup: colorGroup
          }
        };
      });
    },
    [layer, scriptType, setOptions, colorGroup]
  );

  const handleSelectLayer = useCallback(
    (layer: string) => () => {
      setLayer(layer);
    },
    []
  );

  const isReady = useMemo(
    () => scriptType && layer && colorGroup && color,
    [color, colorGroup, layer, scriptType]
  );

  useEffect(() => {
    const getImage = async () => {
      if (isReady) {
        const payload: RenderImageRequest = {
          Recipe: scriptType,
          Layers: Object.keys(options[scriptType]).join(","),
          Codes: Object.keys(options[scriptType])
            .map((i) => options[scriptType][i].Codes)
            .join(","),
          colorGroup: Object.keys(options[scriptType])
            .map((i) => options[scriptType][i].colorGroup)
            .join(",")
        };
        await renderImage(payload).unwrap();
        setHasImage(true);
      }
    };
    getImage();
  }, [color, colorGroup, isReady, layer, options, renderImage, scriptType]);

  return (
    <div className="py-10 px-64 h-screen mb-6">
      <h1 className="text-7xl text-center my-10 mb-16">FIND YOUR COLOR</h1>
      <div className="text-center mb-10">
        <h3 className="text-5xl mb-4">Choose your boat</h3>
        <span>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod.
        </span>
      </div>
      <div className="gap-5 flex justify-center">
        {Object.keys(scripts)
          ?.filter((boat) => !["E15 CR-8", "E15 B2"].includes(boat))
          .map((boat) => {
            const boatImage = images[boat];
            const isActive = scriptType === boat;
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
                    "bg-blue-500 h-44 mb-4 transition object-contain",
                    isActive ? "" : "opacity-80 hover:opacity-100"
                  )}
                />
                <span className="font-semibold">{boat}</span>
              </div>
            );
          })}
      </div>
      <div className="flex justify-center content-center">
        <img
          src={hasImage ? renderedImage : images[scriptType]}
          alt="boat"
          className={classNames(
            "w-auto mt-10 bg-gray-400 object-contain transition",
            isFetching ? "opacity-60" : "opacity-100"
          )}
          style={{ height: "350px" }}
        />
      </div>
      <h2 className="my-10 text-2xl text-center">Select your area and color</h2>
      <div className="mb-10 flex justify-between px-32">
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
            className="shadow appearance-none border rounded w-full py-4 pl-10 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="colorDescription"
            value={colorDescription}
            type="text"
            onChange={onChangeColorDescription}
            placeholder="Search Color by description or sales code"
          />
        </div>
      </div>
      <div className="flex justify-center gap-28">
        {Object.keys(scripts?.[scriptType]?.Layers || {})?.map((key) => {
          const layerName = scripts?.[scriptType]?.Layers[key];
          const isActive = key === layer;
          return (
            <span
              className={classNames(
                "font-semibold text-lg cursor-pointer transition",
                isActive
                  ? "text-gray-900 rounded outline outline-gray-400 outline-offset-8"
                  : "text-gray-500"
              )}
              key={key}
              onClick={handleSelectLayer(key)}
            >
              {layerName}
            </span>
          );
        })}
      </div>
      <div className="my-10 h-28 w-full flex justify-center gap-5">
        {Object.keys(COLORS).map((colorName) => {
          const isActive = colorName === colorGroup;
          return (
            <div
              key={colorName}
              style={{ backgroundColor: COLORS[colorName] }}
              onClick={handleSelectColorGroup(colorName)}
              className={classNames(
                styles.colorBox,
                "rounded w-28 h-28 rounded-br-2xl cursor-pointer border",
                isActive ? "outline outline-gray-400 outline-offset-4" : ""
              )}
            />
          );
        })}
      </div>
      {colorGroup && layer && (
        <ColorPickerSlider
          colorDescription={debouncedColorDescription}
          colorGroup={colorGroup}
          onSelectColor={handleSelectColor}
          selectedColor={color?.id}
        />
      )}
      {/* {colorGroup && layer && (
        <Carousel items={colors} onClick={handleSelectColor} active={color} />
      )} */}
    </div>
  );
}

export default App;
