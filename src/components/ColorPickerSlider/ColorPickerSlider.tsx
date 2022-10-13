import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { LeftArrow, RightArrow } from "../Arrows";
import Slider from "react-slick";
import { useGetColorsQuery } from "../../api";
import { ColorType } from "../../api/@types";
import { classNames } from "../../utils";
import { useMemo } from "react";
import ProductCard from "../ProductCard";
import productImage from "../../images/product.png";

type Props = {
  colorGroup: string;
  colorDescription: string;
  onSelectColor: (color: ColorType) => () => void;
  selectedColor: string | undefined;
};

const ColorPickerSlider = ({
  colorDescription,
  colorGroup,
  onSelectColor,
  selectedColor
}: Props) => {
  const {
    data: colors = [],
    isLoading,
    isFetching
  } = useGetColorsQuery({
    colorGroup,
    colorDescription,
    continuationToken: 0
  });

  console.log({ colors });

  const settings = useMemo(
    () => ({
      dots: true,
      speed: 500,
      slidesToShow: Math.min(colors?.length || 2, 12),
      slidesToScroll: Math.min(colors?.length || 2, 12),
      nextArrow: <RightArrow />,
      prevArrow: <LeftArrow />
    }),
    [colors]
  );

  function removeDuplicates(arr: string[]) {
    return Array.from(new Set(arr));
  }

  const productNames = useMemo(() => {
    const productNames = colors?.map((color) => color.ProductLines).flat();
    return removeDuplicates(productNames);
  }, [colors]);

  if (!isLoading && !colors?.length) {
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
      <Slider {...settings} className="w-full mb-20">
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
                  loading="lazy"
                  src={color.CoDImageURL}
                  alt={color.AkzoCode}
                />
              </div>
            );
          })}
      </Slider>
      <div className="grid grid-cols-2 gap-2">
        {productNames?.map((product) => {
          return (
            <ProductCard
              image={productImage}
              key={product}
              title={product}
              description={product}
              link={product}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ColorPickerSlider;
