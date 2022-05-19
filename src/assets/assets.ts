import { Storage } from "@capacitor/storage";
import { RGBColor } from "react-color";

export interface SettingsRootState {
  readReceipts: boolean;
  typingIndicators: boolean;
}

export interface AppearanceForm {
  name: string;
  color: RGBColor;
}

export const settingsInitialState = {
  readReceipts: true,
  typingIndicators: true,
};

export async function checkDarkMode() {
  const { value } = await Storage.get({ key: "darkmode" });
  if (value === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    document.body.classList.toggle("dark", prefersDark.matches);
  } else {
    document.body.classList.toggle("dark", value === "dark" ? true : false);
  }
}

export function capFirst(str: string) {
  if (!str) return str;
  return str[0].toUpperCase() + str.substr(1).toLowerCase();
}

export function contrastingColor(colorrgba: RGBColor) {
  let color =
    colorrgba.r.toString(16).length === 1
      ? `0${colorrgba.r.toString(16)}`
      : colorrgba.r.toString(16);
  color +=
    colorrgba.g.toString(16).length === 1
      ? `0${colorrgba.g.toString(16)}`
      : colorrgba.g.toString(16);
  color +=
    colorrgba.b.toString(16).length === 1
      ? `0${colorrgba.b.toString(16)}`
      : colorrgba.b.toString(16);
  return `#${luma(color) >= 165 ? "000" : "fff"}`;
}
function luma(color: string) {
  // color can be a hx string or an array of RGB values 0-255
  const rgb = typeof color === "string" ? hexToRGBArray(color) : color;
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]; // SMPTE C, Rec. 709 weightings
}
function hexToRGBArray(color: string) {
  if (color.length === 3)
    color =
      color.charAt(0) +
      color.charAt(0) +
      color.charAt(1) +
      color.charAt(1) +
      color.charAt(2) +
      color.charAt(2);
  else if (color.length !== 6) throw new Error("Invalid hex color: " + color);
  const rgb = [];
  for (let i = 0; i <= 2; i++) rgb[i] = parseInt(color.substr(i * 2, 2), 16);
  return rgb;
}

export function convertrgba(color: RGBColor) {
  return `rgba(${color.r},${color.g},${color.b},${color.a})`;
}

export const appearanceSettingsInitialState = [
  { name: "background", color: { a: 1, b: 0, g: 0, r: 0 } },
  { name: "your chat bubble", color: { a: 1, b: 255, g: 82, r: 0 } },
  { name: "other chat bubble", color: { a: 1, b: 150, g: 150, r: 150 } },
];

export const languageList = [
  { lang: "en", langinlang: "English", langinenglish: "English", emoji: "🇺🇸" },
  { lang: "ja", langinlang: "日本語", langinenglish: "Japanese", emoji: "🇯🇵" },
  { lang: "fr", langinlang: "Français", langinenglish: "French", emoji: "🇫🇷" },
  { lang: "es", langinlang: "Español", langinenglish: "Spanish", emoji: "🇪🇸" },
];
