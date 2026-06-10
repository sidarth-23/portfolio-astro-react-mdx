export function getBlurBackdropForegroundClass(imageClass: string): string {
  return imageClass
    ? `relative z-10 h-full w-full object-contain ${imageClass}`
    : "relative z-10 h-full w-full object-contain"
}
