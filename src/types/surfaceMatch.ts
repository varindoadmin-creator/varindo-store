export type SurfaceMatchProduct = {
  code: string;
  slug: string;
  /** Short size label, e.g. 4'x8'. */
  size: string | null;
};

/** One design. Its products are the sizes that design is sold in. */
export type SurfaceMatch = {
  swatch: string;
  design: string;
  imageUrl: string;
  /** Cosine similarity for visual matches; 1 for a code match. */
  score: number;
  matchType: 'code' | 'visual';
  products: SurfaceMatchProduct[];
};

export type SurfaceMatchGroup = {
  /** Crop of this item from the photo, as a data URL, when the photo held several. */
  thumbnail: string | null;
  detectedCode: string | null;
  matches: SurfaceMatch[];
};

export type SurfaceMatchResponse = {
  mode: 'single' | 'multiple';
  groups: SurfaceMatchGroup[];
};
