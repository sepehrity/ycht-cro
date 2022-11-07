import { useCallback, useEffect, useMemo, useState } from "react";
import { useImmer } from "use-immer";
import { useGetScriptsQuery, useLazyRenderImageQuery } from "./api";
import { ColorType, RenderImageRequest } from "./api/@types";
import "./App.css";
import styles from "./App.module.css";
import ColorPickerSlider from "./components/ColorPickerSlider";
import { MAP_SCRIPT_NAME, SCRIPT_IMAGES } from "./config";
import { Options } from "./interfaces";
import "./styles/products.css";
import { classNames, formatBoatName } from "./utils";

function App() {
  const { data: scripts = {} } = useGetScriptsQuery();
  const [renderImage, { isFetching, data: renderedImage }] =
    useLazyRenderImageQuery();

  const [boatType, setBoatType] = useState<string>("Superyacht 1");
  const [colorGroup, setColorGroup] = useState<string>("White");
  const [layer, setLayer] = useState<string>("");
  const [color, setColor] = useState<ColorType | undefined>();
  const [options, setOptions] = useImmer<Options>({});
  const [hasImage, setHasImage] = useState(false);

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

  const hasOptions = useMemo(() => Object.keys(options).length > 0, [options]);

  const isReady = useMemo(
    () => !!(boatType && layer && colorGroup && color && hasOptions),
    [boatType, layer, colorGroup, color, hasOptions]
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

  const hasAntifouling = useMemo(
    () =>
      ["Anti_fouling", "Anti-fouling"].includes(
        scripts?.[boatType]?.Layers[layer]
      ),
    [boatType, layer, scripts]
  );

  const isReadyToExport = useMemo(
    () => !!(hasOptions && renderedImage),
    [hasOptions, renderedImage]
  );

  // if (isReadyToExport && window.location.href.includes("/export")) {
  //   return (
  //     <div
  //       className="pt-5 px-16 mx-64 h-full mb-6 bg-white flex justify-center flex-col"
  //       style={{ width: "auto" }}
  //     >
  //       <div className="text-center my-10">
  //         <h3 className="text-5xl mb-8">FIND YOUR COLOR</h3>
  //         <p className="text-base mb-8 break-words overflow-auto">
  //           Selecting the perfect color for your boat can be a daunting task.
  //           Let us make it easier and help you find the right Awlgrip color for
  //           you.
  //         </p>
  //         <p className="text-lg font-semibold">
  //           Click on the image that closely matches your boat
  //         </p>
  //       </div>
  //       <ExportPage
  //         options={options}
  //         renderedImage={renderedImage as string}
  //         layerNames={scripts?.[boatType]?.Layers}
  //         hasAntifouling={hasAntifouling}
  //       />
  //     </div>
  //   );
  // }

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
          ?.filter(
            (boat) =>
              ![
                "E15 CR-8",
                "E15 B2",
                "WarehouseWall",
                "Industrial Building"
              ].includes(boat)
          )
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
                  {formatBoatName(boat)}
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
      <div className="flex justify-center gap-28 h-9 mb-6">
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
      <ColorPickerSlider
        onChangeColorGroup={handleSelectColorGroup}
        colorGroup={colorGroup}
        hasAntifouling={hasAntifouling}
        onSelectColor={handleSelectColor}
        selectedColor={color}
        isReadyToExport={isReadyToExport}
        layerNames={scripts?.[boatType]?.Layers}
        options={options}
        renderedImage={renderedImage}
      />
    </div>
  );
}

export default App;
