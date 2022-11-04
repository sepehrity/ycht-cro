import { ColorType } from "../api/@types";

export type ProductImage = {
  image: string;
  link: string;
  description: string;
  customStyle?: React.CSSProperties;
};

type LayerColorType = {
  Codes: ColorType;
  colorGroup: string;
};

export type Options = Record<string, Record<string, LayerColorType>>;
