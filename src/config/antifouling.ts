import internationalInterlux from "../images/AkzoNobel_International_Anti-fouling.png";
import SeaHawk from "../images/AkzoNobel_SeaHawk_Anti-fouling.jpg";
import { ProductImage } from "../interfaces";

export const AntiFouling_ProductImages: Record<string, ProductImage> = {
  "Fouling Control": {
    image: internationalInterlux,
    link: "https://www.international-yachtpaint.com",
    description: "International",
    customStyle: { width: "450px", paddingTop: "105px", height: "auto" }
  },
  "Sea Hawk": {
    image: SeaHawk,
    link: "https://www.seahawkpaints.com",
    description: "SeaHawk"
  }
};

export const AntiFouling_ProductNames = ["Sea Hawk", "Fouling Control"];

export const AntiFouling_Colors = [
  {
    id: "RAL5013",
    AkzoCode: "RAL5013",
    ProductLines: ["Fouling Control"],
    Descriptions: "Dark Blue",
    CoDImageURL:
      "https://colorondisplayapiprd.azureedge.net/api/imagebymarketcolor?marketcolorid=89742667-2eb5-e311-b816-005056945ff1&imagesize=Small"
  },
  {
    id: "RAL5019",
    AkzoCode: "RAL5019",
    ProductLines: ["Sea Hawk"],
    Descriptions: "Blue",
    CoDImageURL:
      "https://colorondisplayapiprd.azureedge.net/api/imagebymarketcolor?marketcolorid=8e742667-2eb5-e311-b816-005056945ff1&imagesize=Small"
  },
  {
    id: "RAL3011",
    AkzoCode: "RAL3011",
    Description: "Red",
    CoDImageURL:
      "https://colorondisplayapiprd.azureedge.net/api/imagebymarketcolor?marketcolorid=c1932761-2eb5-e311-b816-005056945ff1&imagesize=Small"
  },
  {
    id: "RAL7036",
    AkzoCode: "RAL7036",
    ProductLines: [],
    Descriptions: "Grey White",
    CoDImageURL:
      "https://colorondisplayapiprd.azureedge.net/api/imagebymarketcolor?marketcolorid=6e5c306d-2eb5-e311-b816-005056945ff1&imagesize=Small"
  },
  {
    id: "RAL8022",
    AkzoCode: "RAL8022",
    ProductLines: [],
    Descriptions: "Black",
    CoDImageURL:
      "https://colorondisplayapiprd.azureedge.net/api/imagebymarketcolor?marketcolorid=835c306d-2eb5-e311-b816-005056945ff1&imagesize=Small"
  },
  {
    id: "RAL6000",
    AkzoCode: "RAL6000",
    ProductLines: [],
    Descriptions: "Green",
    CoDImageURL:
      "https://colorondisplayapiprd.azureedge.net/api/imagebymarketcolor?marketcolorid=92742667-2eb5-e311-b816-005056945ff1&imagesize=Small"
  },
  {
    id: "RAL7015",
    AkzoCode: "RAL7015",
    ProductLines: [],
    Descriptions: "Shark White",
    CoDImageURL:
      "https://colorondisplayapiprd.azureedge.net/api/imagebymarketcolor?marketcolorid=bd742667-2eb5-e311-b816-005056945ff1&imagesize=Small"
  },
  {
    id: "RAL9003",
    AkzoCode: "RAL9003",
    ProductLines: [],
    Descriptions: "White",
    CoDImageURL:
      "https://colorondisplayapiprd.azureedge.net/api/imagebymarketcolor?marketcolorid=8a5c306d-2eb5-e311-b816-005056945ff1&imagesize=Small"
  }
];
