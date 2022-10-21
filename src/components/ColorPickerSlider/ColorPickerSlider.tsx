import { useCallback, useMemo } from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { useGetColorsQuery } from "../../api";
import { ColorType } from "../../api/@types";
import { Product_Images } from "../../config";
import {
  AntiFouling_Colors,
  AntiFouling_ProductImages,
  AntiFouling_ProductNames
} from "../../config/antifouling";

import { classNames } from "../../utils";
import { LeftArrow, RightArrow } from "../Arrows";
import ProductCard from "../ProductCard";
import styles from "./ColorPickerSlider.module.css";

type Props = {
  colorGroup: string;
  colorDescription: string;
  layer: string;
  onSelectColor: (color: ColorType) => () => void;
  selectedColor: string | undefined;
};

const ColorPickerSlider = ({
  colorDescription,
  colorGroup,
  onSelectColor,
  layer,
  selectedColor
}: Props) => {
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
    { skip: layer === "Anti_fouling" }
  );

  // useEffect(() => {
  //   setPage(0);
  // }, [colorGroup]);

  const colorsLength = useMemo(
    () => (layer === "Anti_fouling" ? 8 : colors?.length),
    [colors, layer]
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
      slidesToScroll: Math.min(colorsLength || 2, 12),
      nextArrow: <RightArrow />,
      prevArrow: <LeftArrow />
    }),
    [colorsLength]
  );

  function removeDuplicates(arr: string[]) {
    return Array.from(new Set(arr));
  }

  const productNames = useMemo(() => {
    const productNames = colors?.map((color) => color.ProductLines).flat();
    return removeDuplicates(productNames);
  }, [colors]);

  const onLazyLoad = useCallback((slidesToLoad: number[]) => {
    console.log({ slidesToLoad });
  }, []);

  const onChange = useCallback(
    (currentSlide: number) => {
      if (currentSlide === colorsLength - (settings?.slidesToShow || 0)) {
      }
    },
    [colorsLength, settings?.slidesToShow]
  );

  if (!isLoading && !colorsLength) {
    return (
      <div className="mb-10">There is no color matched by this query...</div>
    );
  }

  return (
    <div
      className={classNames(
        "mb-10 transition",
        isFetching ? "opacity-60" : "opacity-100"
      )}
    >
      {layer === "Anti_fouling" ? (
        <Slider
          {...settings}
          onLazyLoad={onLazyLoad}
          afterChange={onChange}
          className="w-full mb-16 h-64 transition"
        >
          {AntiFouling_Colors?.map((color) => {
            return (
              <div
                key={color.id}
                onClick={onSelectColor(color as any)}
                style={{ backgroundColor: "#c8cee0" }}
                className="w-50 px-2 rounded-lg cursor-pointer py-2"
              >
                <img
                  className={classNames(
                    "rounded w-28 h-60",
                    selectedColor === color.id
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
      ) : (
        <Slider
          {...settings}
          onLazyLoad={onLazyLoad}
          afterChange={onChange}
          className="w-full mb-16 h-64 transition"
        >
          {!isLoading &&
            colors?.map((color) => {
              return (
                <div
                  key={color.id}
                  onClick={onSelectColor(color)}
                  style={{ backgroundColor: "#c8cee0" }}
                  className="w-50 px-2 rounded-lg cursor-pointer py-2"
                >
                  <img
                    className={classNames(
                      "rounded w-28 h-60",
                      selectedColor === color.id
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
      )}
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
      <div
        className={classNames(
          "mt-4 -mx-14 flex justify-center flex-col items-center gap-4 font-medium py-4"
        )}
      >
        <a
          style={{ width: "350px" }}
          className={styles.outlineButton}
          href="https://www.awlgrip.com/contact"
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

      {layer === "Anti_fouling" && (
        <>
          <p className="text-lg text-center my-6">
            Choose your preferred anti-fouling brand below for more information
            on the products available in your region.
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
    </div>
  );
};

export default ColorPickerSlider;
