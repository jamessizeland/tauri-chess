type StyleObject = { [key: string]: string };
type PositionStyles = {
  a1?: StyleObject | undefined;
  a2?: StyleObject | undefined;
  a3?: StyleObject | undefined;
  a4?: StyleObject | undefined;
  a5?: StyleObject | undefined;
  a6?: StyleObject | undefined;
  a7?: StyleObject | undefined;
  a8?: StyleObject | undefined;
  b1?: StyleObject | undefined;
  b2?: StyleObject | undefined;
  b3?: StyleObject | undefined;
  b4?: StyleObject | undefined;
  b5?: StyleObject | undefined;
  b6?: StyleObject | undefined;
  b7?: StyleObject | undefined;
  b8?: StyleObject | undefined;
  c1?: StyleObject | undefined;
  c2?: StyleObject | undefined;
  c3?: StyleObject | undefined;
  c4?: StyleObject | undefined;
  c5?: StyleObject | undefined;
  c6?: StyleObject | undefined;
  c7?: StyleObject | undefined;
  c8?: StyleObject | undefined;
  d1?: StyleObject | undefined;
  d2?: StyleObject | undefined;
  d3?: StyleObject | undefined;
  d4?: StyleObject | undefined;
  d5?: StyleObject | undefined;
  d6?: StyleObject | undefined;
  d7?: StyleObject | undefined;
  d8?: StyleObject | undefined;
  e1?: StyleObject | undefined;
  e2?: StyleObject | undefined;
  e3?: StyleObject | undefined;
  e4?: StyleObject | undefined;
  e5?: StyleObject | undefined;
  e6?: StyleObject | undefined;
  e7?: StyleObject | undefined;
  e8?: StyleObject | undefined;
  f1?: StyleObject | undefined;
  f2?: StyleObject | undefined;
  f3?: StyleObject | undefined;
  f4?: StyleObject | undefined;
  f5?: StyleObject | undefined;
  f6?: StyleObject | undefined;
  f7?: StyleObject | undefined;
  f8?: StyleObject | undefined;
  g1?: StyleObject | undefined;
  g2?: StyleObject | undefined;
  g3?: StyleObject | undefined;
  g4?: StyleObject | undefined;
  g5?: StyleObject | undefined;
  g6?: StyleObject | undefined;
  g7?: StyleObject | undefined;
  g8?: StyleObject | undefined;
  h1?: StyleObject | undefined;
  h2?: StyleObject | undefined;
  h3?: StyleObject | undefined;
  h4?: StyleObject | undefined;
  h5?: StyleObject | undefined;
  h6?: StyleObject | undefined;
  h7?: StyleObject | undefined;
  h8?: StyleObject | undefined;
};
type BoardStateArray = string[][];
type Color = 'White' | 'Black';
type PieceType = 'Queen' | 'King' | 'Bishop' | 'Knight' | 'Rook' | 'Pawn';
type RustPiece =
  | { [key in 'Queen']: Color }
  | { [key in 'King']: Color }
  | { [key in 'Bishop']: Color }
  | { [key in 'Knight']: Color }
  | { [key in 'Rook']: Color }
  | { [key in 'Pawn']: Color };

export type { BoardStateArray, Color, PieceType, PositionStyles, RustPiece };
