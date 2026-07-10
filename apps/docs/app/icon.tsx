import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#6d28d9",
        color: "white",
        display: "flex",
        fontFamily: "Arial, sans-serif",
        fontSize: 42,
        fontWeight: 700,
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      N
    </div>,
    size,
  );
}
