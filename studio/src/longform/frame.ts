// YouTube long-form canvas (16:9). The Reels theme (W/H in ../theme) stays 9:16.
export const LW = 1920;
export const LH = 1080;

// Title-safe area: YouTube's player chrome only shows on hover, but thumbnails
// of the frame get cropped by TVs, so anything that matters stays inside this.
export const LSAFE = {top: 90, bottom: 990, left: 110, right: 1810};
