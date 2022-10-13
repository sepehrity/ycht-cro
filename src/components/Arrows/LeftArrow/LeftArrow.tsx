import { CustomArrowProps } from "react-slick";

type Props = CustomArrowProps;

const LeftArrow = ({ className, style, onClick }: Props) => {
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
};

export default LeftArrow;
