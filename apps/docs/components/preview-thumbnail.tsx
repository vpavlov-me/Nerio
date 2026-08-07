"use client";

import * as React from "react";

const appearanceAttributes = ["data-theme", "data-mode", "data-density"] as const;
const registeredFrames = new Set<HTMLIFrameElement>();
let appearanceObserver: MutationObserver | null = null;

function syncFrameAppearance(frame: HTMLIFrameElement) {
  const frameRoot = frame.contentDocument?.documentElement;
  if (!frameRoot) return;

  const sourceRoot = document.documentElement;
  for (const attribute of appearanceAttributes) {
    const value = sourceRoot.getAttribute(attribute);
    if (value === null) {
      frameRoot.removeAttribute(attribute);
    } else {
      frameRoot.setAttribute(attribute, value);
    }
  }
  frameRoot.setAttribute("data-preview-thumbnail", "true");
  frame.contentWindow?.scrollTo(0, 0);
}

function registerFrame(frame: HTMLIFrameElement) {
  registeredFrames.add(frame);
  syncFrameAppearance(frame);

  if (!appearanceObserver) {
    appearanceObserver = new MutationObserver(() => {
      registeredFrames.forEach(syncFrameAppearance);
    });
    appearanceObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [...appearanceAttributes],
    });
  }

  return () => {
    registeredFrames.delete(frame);
    if (registeredFrames.size === 0) {
      appearanceObserver?.disconnect();
      appearanceObserver = null;
    }
  };
}

export type PreviewThumbnailProps = {
  src: string;
  title: string;
  viewportHeight?: number;
  viewportWidth?: number;
};

export function PreviewThumbnail({
  src,
  title,
  viewportHeight = 900,
  viewportWidth = 1440,
}: PreviewThumbnailProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const frameRef = React.useRef<HTMLIFrameElement>(null);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);

  React.useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      container.style.setProperty(
        "--n-preview-thumbnail-scale",
        String(container.clientWidth / viewportWidth),
      );
    };
    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [viewportWidth]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!("IntersectionObserver" in window)) {
      setIsMounted(true);
      return;
    }

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIsMounted(true);
        intersectionObserver.disconnect();
      },
      { rootMargin: "800px 0px" },
    );
    intersectionObserver.observe(container);
    return () => intersectionObserver.disconnect();
  }, []);

  React.useEffect(() => {
    const frame = frameRef.current;
    if (!isMounted || !frame) return;
    return registerFrame(frame);
  }, [isMounted]);

  const handleLoad = React.useCallback(() => {
    const frame = frameRef.current;
    if (!frame) return;

    syncFrameAppearance(frame);
    const fontsReady = frame.contentDocument?.fonts.ready ?? Promise.resolve();
    void fontsReady.then(() => {
      if (frameRef.current === frame) setIsReady(true);
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className={`preview-thumbnail${isReady ? " is-ready" : ""}`}
      style={{ aspectRatio: `${viewportWidth} / ${viewportHeight}` }}
      aria-hidden="true"
    >
      {isMounted ? (
        <iframe
          ref={frameRef}
          className="preview-thumbnail__frame"
          src={src}
          title={`${title} live preview thumbnail`}
          tabIndex={-1}
          aria-hidden="true"
          loading="lazy"
          onLoad={handleLoad}
          style={{ blockSize: viewportHeight, inlineSize: viewportWidth }}
        />
      ) : null}
    </div>
  );
}
