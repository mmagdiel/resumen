import { expect, it, describe } from "vitest";
import { getIcon } from "./icons";

describe("getIcon", () => {
  const size = 14;
  const icon = "x";
  const color = "fff";
  const className = "m-2";
  const fill = `#${color}`;
  const width = `${size}px`;
  const height = `${size}px`;
  const viewBox = "0 0 24 24";
  it("add getIcon without className and color", () => {
    const actualResult = getIcon(icon, size, "", "");
    const expectedResult = { viewBox, width, height };
    expect(actualResult).toEqual(expectedResult);
  });
  it("add getIcon with color and without className", () => {
    const actualResult = getIcon(icon, size, color, "");
    const expectedResult = { viewBox, width, height, fill };
    expect(actualResult).toEqual(expectedResult);
  });
  it("add getIcon with className and without color", () => {
    const actualResult = getIcon(icon, size, "", className);
    const expectedResult = { viewBox, width, height, className };
    expect(actualResult).toEqual(expectedResult);
  });
  it("add getIcon with className and color", () => {
    const actualResult = getIcon(icon, size, color, className);
    const expectedResult = { viewBox, width, height, fill, className };
    expect(actualResult).toEqual(expectedResult);
  });
});
