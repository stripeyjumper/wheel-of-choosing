import Color from "color";

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
    const angle = ((2 * Math.PI) / count) * i;
    const color = getColor(angle, colors);
    results.push(color.hex().toString());
  }

  return results;
}

export function getContrastingTextColor(backgroundColor: string) {
  const bgColor = new Color(backgroundColor);

  const grayscale =
    0.3 * bgColor.red() + 0.59 * bgColor.green() + 0.11 * bgColor.blue();

  return grayscale > 192 ? "#333" : "#eee";
}

function getColor(angle: number, colors: Color[]) {
  const anglePerColor = (2 * Math.PI) / colors.length;
  const startIndex = Math.floor(angle / anglePerColor);
  const startColor = colors[startIndex];

  const endIndex = (startIndex + 1) % colors.length;
  const endColor = colors[endIndex];

  const weight = (angle % anglePerColor) / anglePerColor;

  return startColor.mix(endColor, weight).saturate(0.5);
}
