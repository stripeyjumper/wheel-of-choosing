import Color from "color";

/**
 * Segments with a background color lighter than this grayscale value
 *  will use black text
 */
const DARK_TEXT_BACKGROUND_THRESHOLD = 165;

/**
 * Generates an array of colors of the specified length,
 * interpolated from a palette of base colors
 * */
export function getColors(count: number, baseColors: string[]) {
  if (baseColors.length < 2) {
    throw new Error("At least two base colors are required");
  }

  if (count <= 1) {
    return [Color(baseColors[0]).hex()];
  }

  const colors = baseColors.map((c) => new Color(c));

  const results = [];
  for (let i = 0; i < count; i += 1) {
    const position = i / count;
    const color = getInterpolatedColor(position, colors);
    results.push(color.hex().toString());
  }

  return results;
}

export function getContrastingTextColor(backgroundColor: string) {
  const bgColor = new Color(backgroundColor);

  const grayscale =
    0.3 * bgColor.red() + 0.59 * bgColor.green() + 0.11 * bgColor.blue();

  return grayscale > DARK_TEXT_BACKGROUND_THRESHOLD ? "#333" : "#eee";
}

function getInterpolatedColor(position: number, colors: Color[]) {
  const sizePerColor = 1 / colors.length;

  const startIndex = Math.floor(position / sizePerColor);
  const startColor = colors[startIndex];

  const endIndex = (startIndex + 1) % colors.length;
  const endColor = colors[endIndex];

  const weight = (position % sizePerColor) / sizePerColor;

  return startColor.mix(endColor, weight).saturate(0.5);
}
