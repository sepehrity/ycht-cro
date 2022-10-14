import "./App.css";
import "./styles/products.css";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useGetScriptsQuery, useLazyRenderImageQuery } from "./api";
import styles from "./App.module.css";
import { classNames } from "./utils";
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
  Codes: ColorType;
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
        console.log({ options, boatType });
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
      className="pt-5 px-14 mx-64 h-full mb-6 bg-white flex justify-center flex-col"
      style={{ width: "1300px" }}
    >
      <h1 className="text-7xl text-center my-10 mb-16">FIND YOUR COLOR</h1>
      <div className="text-center mb-10">
        <h3 className="text-5xl mb-4">Choose your boat</h3>
        <span>Pick your favorite colors schedule for your boat</span>
      </div>
      <div className="gap-5 flex justify-center h-56">
        {Object.keys(scripts)
          ?.filter((boat) => !["E15 CR-8", "E15 B2"].includes(boat))
          .map((boat) => {
            const boatImage = images[boat];
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
                <span className="font-semibold">{boat}</span>
              </div>
            );
          })}
      </div>
      <div className="flex justify-center content-center">
        <img
          src={hasImage ? renderedImage : images[boatType]}
          alt="boat"
          className={classNames(
            "w-auto mt-10 bg-gray-400 object-contain transition",
            isFetching ? "opacity-60" : "opacity-100"
          )}
          style={{ height: "350px" }}
        />
      </div>
      <h2 className="my-10 text-2xl text-center">Select your area and color</h2>
      <div className="flex justify-center gap-28 h-7 mb-10">
        {Object.keys(scripts?.[boatType]?.Layers || {})?.map((key) => {
          const layerName = scripts?.[boatType]?.Layers[key];
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
      <div className="my-10 h-24 w-full flex justify-center gap-5">
        {Object.keys(COLORS).map((colorName) => {
          const isActive = colorName === colorGroup;
          return (
            <div
              key={colorName}
              style={{ backgroundColor: COLORS[colorName] }}
              onClick={handleSelectColorGroup(colorName)}
              className={classNames(
                styles.colorBox,
                "rounded w-24 h-24 rounded-br-2xl cursor-pointer border",
                isActive ? "outline outline-gray-400 outline-offset-4" : ""
              )}
            />
          );
        })}
      </div>
      <ColorPickerSlider
        colorDescription={debouncedColorDescription}
        colorGroup={colorGroup}
        onSelectColor={handleSelectColor}
        selectedColor={color?.id}
      />
      {/* {colorGroup && layer && (
        <Carousel items={colors} onClick={handleSelectColor} active={color} />
      )} */}
    </div>
  );
}

export default App;
