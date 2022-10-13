import { useCallback, useMemo } from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { useGetColorsQuery } from "../../api";
import { ColorType } from "../../api/@types";
import Awlcraft2000 from "../../images/Awlcraft 2000.png";
import AwlcraftSELine from "../../images/Awlcraft SE S-line.png";
import AwlgripTopcoat from "../../images/Awlgrip Topcoat.png";
import AwlgripHDT from "../../images/AwlgripHDT.png";
import { classNames } from "../../utils";
import { LeftArrow, RightArrow } from "../Arrows";
import ProductCard from "../ProductCard";
import styles from "./ColorPickerSlider.module.css";

type Props = {
  colorGroup: string;
  colorDescription: string;
  onSelectColor: (color: ColorType) => () => void;
  selectedColor: string | undefined;
};

type Product = {
  image: string;
  link: string;
};

const productImages: Record<string, Product> = {
  "Awlcraft 2000": {
    image: Awlcraft2000,
    link: "https://www.awlgrip.com/products/finishes/awlcraft-2000"
  },
  "Awlgrip HDT": {
    image: AwlgripHDT,
    link: "https://www.awlgrip.com/products/finishes/awlgrip-hdt"
  },
  "Awlgrip Topcoat": {
    image: AwlgripTopcoat,
    link: "https://www.awlgrip.com/products/finishes/awlgrip-topcoat-spray"
  },
  "Awlcraft SE S-line": {
    image: AwlcraftSELine,
    link: "https://www.awlgrip.com/products/finishes/awlcraft-se"
  },
  "Awlcraft SE": {
    image: AwlcraftSELine,
    link: "https://www.awlgrip.com/products/finishes/awlcraft-se"
  }
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

  // useEffect(() => {
  //   setPage(0);
  // }, [colorGroup]);

  const colorsLength = useMemo(() => colors?.length, [colors]);

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
      console.log({ currentSlide, length: colorsLength });
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
      <Slider
        {...settings}
        onLazyLoad={onLazyLoad}
        afterChange={onChange}
        className="w-full mb-16 h-64"
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
      <div
        className={classNames(
          "mb-10 -mx-14 flex justify-center items-center gap-6 font-medium py-4",
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
          const product = productImages[productName] || {};
          return (
            <ProductCard
              image={product.image}
              key={productName}
              title={productName}
              description={productName}
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
          style={{ width: "400px" }}
          className={styles.outlineButton}
          href="https://www.awlgrip.com/contact"
        >
          DOWNLOAD SELECTION PDF
        </a>
        <a
          style={{ width: "400px" }}
          className={styles.button}
          href="https://www.awlgrip.com/contact"
        >
          CONTACT
        </a>
      </div>
    </div>
  );
};

export default ColorPickerSlider;
