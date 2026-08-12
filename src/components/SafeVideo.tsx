import { useEffect, useState, type VideoHTMLAttributes } from "react";

type SafeVideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
  fallbackSrc: string;
  fallbackAlt?: string;
};

export function SafeVideo({ fallbackSrc, fallbackAlt = "Mídia profissional", src, onError, ...props }: SafeVideoProps) {
  const [failed, setFailed] = useState(!src);

  useEffect(() => {
    setFailed(!src);
  }, [src]);

  if (failed) {
    return <img src={fallbackSrc} alt={fallbackAlt} className={props.className} />;
  }

  return (
    <video
      {...props}
      src={src}
      onError={(event) => {
        onError?.(event);
        setFailed(true);
      }}
    />
  );
}
