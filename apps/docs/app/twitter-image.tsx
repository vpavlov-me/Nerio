import { createSocialImage, socialImageSize } from "../lib/social-image";

export const runtime = "edge";
export const size = socialImageSize;
export const contentType = "image/png";

export default function TwitterImage() {
  return createSocialImage();
}
