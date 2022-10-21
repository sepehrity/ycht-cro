import Awlcraft2000 from "../images/Awlcraft 2000.png";
import AwlcraftSELine from "../images/Awlcraft SE S-line.png";
import AwlgripTopcoat from "../images/Awlgrip Topcoat.png";
import AwlgripHDT from "../images/AwlgripHDT.png";
import Cruiser from "../images/Cruiser1.png";
import Sailboat from "../images/Sailboat 1.png";
import FishingBoat from "../images/Sport Fishing Boat 1.png";
import Superyacht from "../images/Superyacht 1.png";
import { ProductImage } from "../interfaces";

export const COLOR_GROUPS: Record<string, string> = {
  White: "#FFFFFF",
  Grey: "#768E99",
  Beige: "#F3F3D7",
  Brown: "#7C6731",
  Yellow: "#F1EA36",
  Orange: "#BD5F35",
  Red: "#8E2020",
  Purple: "#635F8D",
  Blue: "#3ECACA",
  Turquoise: "#367A84",
  Green: "#587E40",
  Black: "#282B2D"
};

export const SCRIPT_IMAGES: Record<string, string> = {
  "Superyacht 1": Superyacht,
  "Sport Fishing Boat 1": FishingBoat,
  "Sailboat 1": Sailboat,
  Cruiser1: Cruiser
};

export const MAP_SCRIPT_NAME: Record<string, string> = {
  "Super structure": "Superstructure",
  Hull: "Hull",
  WaterBootStripe: "Boot Stripe",
  BootStripe: "Boot Stripe",
  Anti_fouling: "Antifouling"
};

export const Product_Images: Record<string, ProductImage> = {
  "Awlcraft 2000": {
    image: Awlcraft2000,
    link: "https://www.awlgrip.com/products/finishes/awlcraft-2000",
    description:
      "Premium quality acrylic urethane finish for long-lasting gloss and color retention"
  },
  "Awlgrip HDT": {
    image: AwlgripHDT,
    link: "https://www.awlgrip.com/products/finishes/awlgrip-hdt",
    description:
      "Repairable polyurethane topcoat. Outshines other topcoats with it's glossy finish & excellent Distinction of Image (DOI)"
  },
  "Awlgrip Topcoat": {
    image: AwlgripTopcoat,
    link: "https://www.awlgrip.com/products/finishes/awlgrip-topcoat-spray",
    description:
      "High performance topcoat providing an outstanding finish with long-lasting gloss and color retention"
  },
  "Awlcraft SE S-line": {
    image: AwlcraftSELine,
    link: "https://www.awlgrip.com/products/finishes/awlcraft-se",
    description:
      "Awlcraft SE is a revolutionary basecoat, with a boundless palette of special effect colors, to be used with Awlgrip HDT or Awlcraft 2000 Clear"
  },
  "Awlcraft SE": {
    image: AwlcraftSELine,
    link: "https://www.awlgrip.com/products/finishes/awlcraft-se",
    description:
      "Awlcraft SE is a revolutionary basecoat, with a boundless palette of special effect colors, to be used with Awlgrip HDT or Awlcraft 2000 Clear"
  }
};
