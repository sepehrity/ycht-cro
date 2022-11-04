import { MAP_SCRIPT_NAME, Product_Images } from "../../config";
import {
  AntiFouling_ProductImages,
  AntiFouling_ProductNames
} from "../../config/antifouling";
import { Options } from "../../interfaces";
import { classNames } from "../../utils";

type Props = {
  options: Options;
  productNames: string[];
  renderedImage: string;
  layerNames: Record<string, string>;
  hasAntifouling: boolean;
};

const ExportPage = ({
  options,
  productNames,
  renderedImage,
  layerNames,
  hasAntifouling
}: Props) => {
  const currentBoat = Object.keys(options)[0];
  const layers = options[currentBoat];

  return (
    <div>
      <img
        src={renderedImage}
        alt="boat"
        className={classNames(
          "w-full mb-10 bg-gray-400 object-contain transition"
        )}
      />
      <div className="text-3xl text-gray-700 font-semibold mb-8">
        Selected Color(s)
      </div>
      <div className="grid grid-cols-2 gap-6">
        {Object.keys(layers).map((layer) => {
          const color = layers[layer].Codes;
          return (
            <div className="flex flex-col gap-2" key={layer}>
              <span className="font-semibold text-lg">
                {MAP_SCRIPT_NAME[layerNames[layer]]}
              </span>
              <div className="flex gap-6">
                <img
                  title={color.AkzoCode}
                  className={classNames("rounded w-24 h-24")}
                  src={color.CoDImageURL}
                  alt={color.AkzoCode}
                />
                <div className="flex flex-col justify-center text-gray-800 gap-1">
                  <span>{color?.Descriptions?.[0] || ""}</span>
                  <span>{color.AkzoCode}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <hr className="my-8 w-full h-px bg-gray-200 border-0 dark:bg-gray-400"></hr>
      <div className="text-3xl text-gray-700 font-semibold mb-12">
        All Products
      </div>
      <div className="grid grid-cols-1 gap-12 mb-16">
        {productNames?.map((productName) => {
          const product = Product_Images[productName] || {};
          return (
            <a
              key={productName}
              className="flex gap-6 hover:bg-gray-100 transition-colors rounded p-3"
              target="_blank"
              rel="noreferrer"
              href={product.link}
            >
              {" "}
              <img
                title={productName}
                className={classNames("w-24 h-24")}
                src={product.image}
                alt={productName}
              />
              <div className="flex flex-col ga3">
                <span className="text-2xl font-medium">{productName}</span>
                <span className="text-gray-700">{product.description}</span>
              </div>
            </a>
          );
        })}
      </div>
      {hasAntifouling && (
        <>
          <div className="text-3xl text-gray-700 font-semibold mb-12">
            Antifouling Products
          </div>
          <div className="grid grid-cols-1 gap-12 mb-16">
            {AntiFouling_ProductNames?.map((productName) => {
              const product = AntiFouling_ProductImages[productName] || {};
              return (
                <a
                  key={productName}
                  className="flex gap-6 hover:bg-gray-100 transition-colors rounded p-3"
                  target="_blank"
                  rel="noreferrer"
                  href={product.link}
                >
                  <img
                    title={productName}
                    className={classNames("w-24 h-24 object-scale-down")}
                    src={product.image}
                    alt={productName}
                  />
                  <div className="flex flex-col gap-2">
                    <span className="text-2xl font-medium">{productName}</span>
                    <span className="text-gray-700">{product.description}</span>
                  </div>
                </a>
              );
            })}
          </div>
        </>
      )}
      <p className="text-xs text-gray-500 pb-8 text-justify">
        <b>Attention:</b> We have made every effort to make the colors on screen
        as accurate as possible. Unfortunately, we cannot guarantee an exact
        color match of the on screen color to the colors of the actual products
        and the color appearing on screen should not be relied on as being such.
        Colors on screen may vary depending on your screen settings and
        resolution. The Awlgrip Color Card will provide a much better match but
        has a limited number of colors available which also might vary slightly
        from manufacturing standards.
      </p>
    </div>
  );
};

export default ExportPage;
