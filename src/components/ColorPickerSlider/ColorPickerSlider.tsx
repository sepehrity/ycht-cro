import { useCallback, useMemo, useState } from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { useGetColorsQuery } from "../../api";
import { ColorType } from "../../api/@types";
import { COLOR_GROUPS, Product_Images } from "../../config";
import {
  AntiFouling_Colors,
  AntiFouling_ProductImages,
  AntiFouling_ProductNames
} from "../../config/antifouling";
import { Options } from "../../interfaces";
import { classNames, extractProductLines } from "../../utils";
import ExportPage from "../ExportPage";
import ProductCard from "../ProductCard";
import styles from "./ColorPickerSlider.module.css";

type Props = {
  colorGroup: string;
  hasAntifouling: boolean;
  onChangeColorGroup: (colorGroup: string) => () => void;
  onSelectColor: (color: ColorType) => () => void;
  selectedColor: ColorType | undefined;
  isReadyToExport: boolean;
  options: Options;
  renderedImage: string | undefined;
  layerNames: Record<string, string>;
};

const ColorPickerSlider = ({
  colorGroup,
  hasAntifouling,
  onChangeColorGroup,
  onSelectColor,
  selectedColor,
  isReadyToExport,
  layerNames,
  renderedImage,
  options
}: Props) => {
  const [colorDescription, setColorDescription] = useState<string>("");

  const handleChangeColorDescription = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setColorDescription(event.target.value);
    },
    []
  );

  const {
    data: colors = [],
    isLoading,
    isFetching
  } = useGetColorsQuery(
    {
      colorGroup,
      colorDescription,
      continuationToken: 0
    },
    { skip: hasAntifouling }
  );

  const colorsLength = useMemo(
    () => (hasAntifouling ? 8 : colors?.length),
    [colors, hasAntifouling]
  );

  const settings = useMemo<Settings>(
    () => ({
      dots: true,
      speed: 500,
      infinite: false,
      adaptiveHeight: true,
      // responsive: [
      //   {
      //     breakpoint: 768,
      //     settings: {
      //       slidesToShow: Math.min(colorsLength || 2, 6),
      //       slidesToScroll: Math.min(colorsLength || 2, 6)
      //     }
      //   }
      // ],
      lazyLoad: "anticipated",
      slidesToShow: Math.min(colorsLength || 2, 12),
      slidesToScroll: Math.min(colorsLength || 2, 12)
    }),
    [colorsLength]
  );

  const productNames = useMemo(
    () => extractProductLines(colors, selectedColor?.AkzoCode),
    [colors, selectedColor?.AkzoCode]
  );

  // const onLazyLoad = useCallback((slidesToLoad: number[]) => {}, []);

  // const onChange = useCallback(
  //   (currentSlide: number) => {
  //     if (currentSlide === colorsLength - (settings?.slidesToShow || 0)) {
  //     }
  //   },
  //   [colorsLength, settings?.slidesToShow]
  // );

  const noColorsFound = useMemo(
    () => !isLoading && typeof colorsLength === "undefined",
    [colorsLength, isLoading]
  );

  return (
    <>
      <div
        className={classNames(
          "flex justify-between",
          hasAntifouling ? "opacity-50 pointer-events-none" : "opacity-100"
        )}
      >
        <div className="flex items-left flex-col justify-center flex-1">
          <div className="text-gray-600 font-medium">
            Color Description: {selectedColor?.Descriptions}
          </div>
          <div className="text-gray-600 font-medium">
            Sales Code: {selectedColor?.AkzoCode}
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
            disabled={hasAntifouling}
            value={colorDescription}
            type="text"
            onChange={handleChangeColorDescription}
            placeholder="Search Color by description or sales code"
          />
          {noColorsFound && (
            <span className="text-red-400 text-sm absolute left-0 -bottom-6">
              Requested option is not available. Please select another color
            </span>
          )}
        </div>
      </div>
      <div
        className={classNames(
          "mt-10 mb-8 h-20 w-full flex justify-center gap-5 transition",
          hasAntifouling ? "opacity-50 pointer-events-none" : "opacity-100"
        )}
      >
        {Object.keys(COLOR_GROUPS).map((colorName) => {
          const isActive = colorName === colorGroup;
          return (
            <div
              key={colorName}
              style={{ backgroundColor: COLOR_GROUPS[colorName] }}
              onClick={onChangeColorGroup(colorName)}
              className={classNames(
                styles.colorBox,
                "rounded w-20 h-20 rounded-br-2xl cursor-pointer border",
                isActive ? "outline outline-gray-400 outline-offset-4" : ""
              )}
            />
          );
        })}
      </div>
      <div
        className={classNames(
          "mb-6 transition",
          isFetching ? "opacity-60" : "opacity-100"
        )}
      >
        <Slider {...settings} className="w-full mb-12 h-52 transition">
          {!isLoading &&
            (hasAntifouling ? AntiFouling_Colors : colors)?.map((color) => {
              const colorTitle = `Color: ${color?.Descriptions?.[0]}\nSales Code: ${color.AkzoCode}`;
              return (
                <div
                  key={color.id}
                  onClick={onSelectColor(color as ColorType)}
                  style={{ backgroundColor: "#c8cee0" }}
                  className="w-50 px-2 rounded-lg cursor-pointer py-2"
                >
                  <img
                    title={colorTitle}
                    className={classNames(
                      "rounded w-28 h-48",
                      selectedColor?.id === color.id
                        ? "outline outline-gray-400 outline-offset-4"
                        : ""
                    )}
                    src={color.CoDImageURL}
                    alt={color.AkzoCode}
                  />
                </div>
              );
            })}
        </Slider>
        <p className="text-xs text-gray-500 pb-8 text-justify">
          <b>Attention:</b> We have made every effort to make the colors on
          screen as accurate as possible. Unfortunately, we cannot guarantee an
          exact color match of the on screen color to the colors of the actual
          products and the color appearing on screen should not be relied on as
          being such. Colors on screen may vary depending on your screen
          settings and resolution. The Awlgrip Color Card will provide a much
          better match but has a limited number of colors available which also
          might vary slightly from manufacturing standards.
        </p>
        <div
          className={classNames(
            "mb-10 -mx-16 flex justify-center items-center gap-6 font-medium py-4",
            styles.productTitleBackground
          )}
        >
          <p className={styles.blueText}>
            What color is right for you? Need some advice?
          </p>
          <a
            className={classNames(styles.button, "w-40")}
            href="https://www.awlgrip.com/contact"
          >
            CUSTOM COLORS
          </a>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {productNames?.map((productName) => {
            const product = Product_Images[productName] || {};
            return (
              <ProductCard
                image={product.image}
                key={productName}
                title={productName}
                description={product.description}
                link={product.link}
              />
            );
          })}
        </div>
        {hasAntifouling && (
          <>
            <p className="text-lg text-center my-6">
              Choose your preferred anti-fouling brand below for more
              information on the products available in your region.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {AntiFouling_ProductNames.map((productName) => {
                const product = AntiFouling_ProductImages[productName] || {};
                return (
                  <ProductCard
                    image={product.image}
                    customStyle={product?.customStyle}
                    key={productName}
                    title={productName}
                    description={product.description}
                    link={product.link}
                  />
                );
              })}
            </div>
          </>
        )}
        <div
          className={classNames(
            "mt-4 -mx-14 flex justify-center flex-col items-center gap-4 font-medium py-4"
          )}
        >
          <a
            style={{ width: "350px" }}
            className={styles.outlineButton}
            href="/export"
          >
            DOWNLOAD PDF
          </a>
          <a
            style={{ width: "350px" }}
            className={styles.button}
            href="https://www.awlgrip.com/contact"
          >
            CONTACT
          </a>
        </div>
      </div>
      {isReadyToExport && (
        <ExportPage
          options={options}
          productNames={productNames}
          renderedImage={renderedImage as string}
          layerNames={layerNames}
          hasAntifouling={hasAntifouling}
        />
      )}
    </>
  );
};

export default ColorPickerSlider;
