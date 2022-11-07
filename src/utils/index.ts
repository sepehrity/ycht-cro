import { ColorType } from "../api/@types";

export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export const formatBoatName = (boat: string) => {
  return boat.replace("1", "");
};

export const removeDuplicates = (arr: string[]) => {
  return Array.from(new Set(arr));
};

export const extractProductLines = (
  colors: ColorType[],
  selectedColor?: string
) => {
  const productNames = colors
    ?.reduce<string[][]>((acc, color) => {
      if (selectedColor) {
        if (selectedColor === color.AkzoCode) {
          acc.push(color.ProductLines);
          return acc;
        }
      } else {
        acc.push(color.ProductLines);
        return acc;
      }
      return acc;
    }, [])
    .flat();
  return removeDuplicates(productNames);
};
