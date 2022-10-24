export type PieceObject = {
  name: string;
  pieceMap: number[][][];
  color: string;
};

export interface PieceStats {
  [key: string]: number;
}
