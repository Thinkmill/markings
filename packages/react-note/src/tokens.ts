// Color
// ------------------------------

export const color = {
  // Reds
  R50: "#FFEBE6",
  R75: "#FFBDAD",
  R100: "#FF8F73",
  R200: "#FF7452",
  R300: "#FF5630",
  R400: "#DE350B",
  R500: "#BF2600",

  // Yellows
  Y50: "#FFFAE6",
  Y75: "#FFF0B3",
  Y100: "#FFE380",
  Y200: "#FFC400",
  Y300: "#FFAB00",
  Y400: "#FF991F",
  Y500: "#FF8B00",

  // Greens
  G50: "#E3FCEF",
  G75: "#ABF5D1",
  G100: "#79F2C0",
  G200: "#57D9A3",
  G300: "#36B37E",
  G400: "#00875A",
  G500: "#006644",

  // Blues
  B50: "#DEEBFF",
  B75: "#B3D4FF",
  B100: "#4C9AFF",
  B200: "#2684FF",
  B300: "#0065FF",
  B400: "#0052CC",
  B500: "#0747A6",

  // Purples
  P50: "#EAE6FF",
  P75: "#C0B6F2",
  P100: "#998DD9",
  P200: "#8777D9",
  P300: "#6554C0",
  P400: "#5243AA",
  P500: "#403294",

  // Teals
  T50: "#E6FCFF",
  T75: "#B3F5FF",
  T100: "#79E2F2",
  T200: "#00C7E6",
  T300: "#00B8D9",
  T400: "#00A3BF",
  T500: "#008DA6",

  // Neutrals
  N0: "#FFFFFF",
  N10: "#FAFBFC",
  N20: "#F4F5F7",
  N30: "#EBECF0",
  N40: "#DFE1E6",
  N50: "#C1C7D0",
  N60: "#B3BAC5",
  N70: "#A5ADBA",
  N80: "#97A0AF",
  N90: "#8993A4",
  N100: "#7A869A",
  N200: "#6B778C",
  N300: "#5E6C84",
  N400: "#505F79",
  N500: "#42526E",
  N600: "#344563",
  N700: "#253858",
  N800: "#172B4D",
  N900: "#091E42"
};

// Elevation
// ------------------------------

export const elevation = {
  E100: 100,
  E200: 200,
  E300: 300,
  E400: 400,
  E500: 500
};

// Spacing
// ------------------------------

const BASE_UNIT = 4;

export const spacing = {
  none: 0,
  xsmall: BASE_UNIT,
  small: BASE_UNIT * 2,
  gutter: BASE_UNIT * 3,
  medium: BASE_UNIT * 4,
  large: BASE_UNIT * 6,
  xlarge: BASE_UNIT * 8
};

// Radii
// ------------------------------

const BASE_RADII = 4;

export const radii = {
  none: 0,
  small: BASE_RADII,
  medium: BASE_RADII * 2,
  large: BASE_RADII * 3,

  // special cases
  circle: "50%",
  pill: 9999
};
