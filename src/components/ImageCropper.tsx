import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import Cropper, { Area } from "react-easy-crop";

export interface ImageCropperHandle {
  getCroppedImage: () => Promise<File | null>;
}

type ImageCropperProps = {
  file: File | null;
  aspect?: number;
  cropShape?: "rect" | "round";
  objectFit?: "contain" | "horizontal-cover" | "vertical-cover";
  classes?: {
    container?: string;
  };
};

const ImageCropper = forwardRef<ImageCropperHandle, ImageCropperProps>(
  (
    {
      file,
      aspect = 1,
      cropShape = "round",
      objectFit = "contain",
      classes = {},
    },
    ref
  ) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
      null
    );
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    useEffect(() => {
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        setImageSrc(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
      }
      setImageSrc(null);
    }, [file]);

    useEffect(() => {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    }, [file]);

    const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    };

    useImperativeHandle(ref, () => ({
      async getCroppedImage() {
        if (!croppedAreaPixels || !file) return null;

        try {
          const imageBitmap = await createImageBitmap(file);
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return null;

          const { width, height, x, y } = croppedAreaPixels;
          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(imageBitmap, x, y, width, height, 0, 0, width, height);

          return new Promise<File>((resolve) => {
            canvas.toBlob((blob) => {
              if (!blob) throw new Error("Failed to create blob");
              resolve(
                new File([blob], file.name, {
                  type: "image/jpeg",
                })
              );
            }, "image/jpeg");
          });
        } catch (error) {
          console.error("Error cropping image:", error);
          return null;
        }
      },
    }));

    return (
      <div className={classes.container}>
        {imageSrc && (
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            cropShape={cropShape}
            objectFit={objectFit}
            showGrid={false}
          />
        )}
      </div>
    );
  }
);

export default ImageCropper;
