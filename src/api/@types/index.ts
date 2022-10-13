export type ScriptType = {
  Layers: Record<string, string>;
  Image: string;
};

export type ColorType = {
  searchscore: number;
  AkzoCode: string;
  Codes: string[];
  Descriptions: string[];
  OwnerType: string;
  ProductLines: string[];
  ProductNumbers: string[];
  id: string;
  Status: string;
  StatusReason: string;
  ColorGroups: Array<Record<string, string>>;
  CoDImageURL: string;
};

export type GetLayersRequest = {
  recipeName: string;
};
export type GetScriptsResponse = Record<string, ScriptType>;

export type GetColorsRequest = {
  colorGroup: string;
  colorDescription?: string;
  continuationToken: number;
};
export type GetColorsResponse = ColorType[];

export type RenderImageRequest = {
  Recipe: string;
  Layers: string;
  Codes: string;
  colorGroup: string;
  Instruments?: string;
};
/*

  "Superyacht 1": {
    Layers: { "3": "Bootstripe"; "4": "Superstructure"; "5": "Hull" };
    Image: "";
  };
  "Sport Fishing Boat 1": {
    Layers: {
      "2": "Super structure";
      "3": "Hull";
      "4": "WaterBootStripe";
      "5": "Anti_fouling";
    };
    Image: "";
  };
  "Sailboat 1": {
    Layers: { "4": "WaterBootStripe"; "5": "Hull"; "6": "Anti-fouling" };
    Image: "";
  };
  "E15 CR-8": { Layers: { "3": "E15-CR8-A" }; Image: "" };
  "E15 B2": { Layers: { "3": "E15 B2" }; Image: "" };
  Cruiser1: {
    Layers: { "5": "Super structure"; "6": "Hull"; "7": "Anti-fouling" };
    Image: "";
  };

*/
