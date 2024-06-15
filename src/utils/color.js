export const getRGB = element => {
  return window
    .getComputedStyle(element)
    .getPropertyValue('color')
    .match(/\d+/g)
    .map(n => Number(n));
};

// https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-procedure
const luminance = (r8Bit, g8Bit, b8Bit) => {
  const [r, g, b] = [r8Bit, g8Bit, b8Bit]
    .map(value => value / 255)
    .map(value =>
      value < 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4)
    );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// https://en.wikipedia.org/wiki/HSL_and_HSV#From_RGB
const rgb2hsl = (r, g, b) => {
  const value = Math.max(r, g, b),
    chroma = value - Math.min(r, g, b),
    h =
      chroma &&
      (value === r
        ? (g - b) / chroma
        : value === g
        ? 2 + (b - r) / chroma
        : 4 + (r - g) / chroma);
  return [
    60 * (h < 0 ? h + 6 : h),
    chroma ? chroma / (1 - Math.abs(2 * value - chroma - 1)) : 0,
    value - chroma / 2
  ];
};

// https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB_alternative
const hsl2rgb = (h, s, l) =>
  [0, 8, 4]
    .map(n => (n + h / 30) % 12)
    .map(
      k => l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1))
    );

export const getLuminance = element => luminance(...getRGB(element));
export const colorContrast = (luminance1, luminance2) => {
  const brightest = Math.max(luminance1, luminance2),
    darkest = Math.min(luminance1, luminance2);
  return (brightest + 0.05) / (darkest + 0.05);
};

export const getLightness = rgb => rgb2hsl(...rgb.map(value => value / 255))[2];

export const brightenColor = element => {
  const [h, s, l] = rgb2hsl(...getRGB(element).map(value => value / 255)),
    [r, g, b] = hsl2rgb(h, s, l / 2 + 0.5);
  element.style.color = `rgb(${r * 255},${g * 255},${b * 255})`;
};
export const darkenColor = element => {
  const [h, s, l] = rgb2hsl(...getRGB(element).map(value => value / 255)),
    [r, g, b] = hsl2rgb(h, s, l / 2);
  element.style.color = `rgb(${r * 255},${g * 255},${b * 255})`;
};

export const adjustColor = (element, backgroundColor) => {
  const elementLuminance = getLuminance(element),
    backgroundLuminance = luminance(...backgroundColor);
  if (colorContrast(elementLuminance, backgroundLuminance) < 4.5) {
    if (getLightness(backgroundColor) < 0.5) {
      brightenColor(element);
    } else {
      darkenColor(element);
    }
    adjustColor(element, backgroundColor);
  }
};
