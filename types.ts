import { flags } from "./flags.ts";

export enum Prize {
	QUADRA = "QUADRA",
	QUINA = "QUINA",
	SENA = "SENA",
}
export type Bet = number[];

export type ActiveFlags = Record<Partial<(typeof flags)[number]["flag"]>, boolean | string>;
