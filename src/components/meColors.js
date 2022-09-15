let meColors = {
  black: "#252525",
  grey: "#858585",
  lightGrey: "#CECECE",
  white: "#FFFFFF",
  white1: "#F5F8FC",
  danger: "#FB7D7D",
  purple: "#4C56E3",
  primary: {
    main: "#185A9D",
    dark: "#102D4F",
    light: "#ADCEEA",
    lighter: "#EAF2F9",
    0: "#EAF2F9",
    1: "#EAF2F9",
    2: "#EAF2F9",
    3: "#EAF2F9",
    4: "#EAF2F9",
  },
  secondary: {
    main: "#43CEA2",
    dark: "#054609",
    light: "#C9E8E7",
    lighter: "#C9E8E7"
  },
  success: {
    main: "#93E291"
  },
  yellow: "#FFDE67",
  yellows: {
    1: "#FFF38A",
    2: "#FFE872",
    3: "#FFDE67",
    4: "#D4A549",
  },
  orange: "#FFAE34"
};

meColors = {
  ...meColors,
  primary: {
    ...meColors.primary,
    gradient: (color1, color2, deg) =>
      `linear-gradient(${deg || 270}deg,${
        color1 ? meColors.primary[color1] : meColors.primary.main
      },${color2 ? meColors.primary[color2] : meColors.primary[1]})`
  },
  secondary: {
    ...meColors.secondary,
    gradient: (color1, color2, deg) =>
      `linear-gradient(${deg || 270}deg,${
        color1 ? meColors.secondary[color1] : meColors.secondary.main
      },${color2 ? meColors.secondary[color2] : meColors.secondary[1]})`
  }
};

export default meColors;
