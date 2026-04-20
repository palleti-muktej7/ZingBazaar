import { useState } from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackKeywords?: string;
};

/**
 * Image with automatic fallback to a keyword-based picture if the source fails.
 * Prevents broken-image icons across the app.
 */
export function SafeImage({ src, alt, fallbackKeywords = "abstract", className, ...rest }: Props) {
  const [tries, setTries] = useState(0);
  // 0 = original src; 1 = loremflickr keyword fallback; 2+ = guaranteed-unique picsum
  const seedKey = `${fallbackKeywords}-${alt ?? ""}`;
  const finalSrc =
    tries === 0
      ? src
      : tries === 1
        ? `https://loremflickr.com/800/800/${encodeURIComponent(fallbackKeywords)}?lock=fb-${encodeURIComponent(seedKey)}`
        : `https://picsum.photos/seed/${encodeURIComponent(seedKey + "-" + tries)}/800/800`;
  return (
    <img
      {...rest}
      src={finalSrc}
      alt={alt}
      className={className}
      onError={() => setTries((t) => (t < 3 ? t + 1 : t))}
    />
  );
}
