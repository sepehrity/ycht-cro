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

export const extractProductLines = (colors: ColorType[]) => {
  const productNames = colors?.map((color) => color.ProductLines).flat();
  return removeDuplicates(productNames);
};
