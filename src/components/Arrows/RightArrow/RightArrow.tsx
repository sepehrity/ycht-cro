import { CustomArrowProps } from "react-slick";
import { classNames } from "../../../utils";

type Props = CustomArrowProps;

const RightArrow = ({ className = "", style, onClick }: Props) => {
  return (
    <div
      className={classNames(className)}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    ></div>
  );
};

export default RightArrow;
