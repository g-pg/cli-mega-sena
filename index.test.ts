import { expect } from "jsr:@std/expect";
import { checkBet, parseFlags } from "./index.ts";
import { Prize } from "./types.ts";

Deno.test("Should return null when the bet is shorter than 6 numbers", () => {
	const result = checkBet([1, 2, 3, 4, 5], new Set([7, 8, 9, 10, 11, 12]));
	expect(result).toBe(null);
});

Deno.test("Should return false when less than 4 matches are found", () => {
	const result = checkBet([1, 2, 3, 4, 5, 6], new Set([7, 8, 9, 10, 11, 12]));
	expect(result).toBe(null);
});
Deno.test("Should return QUADRA when only 4 matches are found", () => {
	const result = checkBet([1, 2, 3, 4, 5, 6], new Set([1, 2, 3, 4, 59, 60]));
	expect(result).toBe(Prize.QUADRA);
});
Deno.test("Should return QUINA when only 5 matches are found", () => {
	const result = checkBet([1, 2, 3, 4, 5, 6], new Set([1, 2, 3, 4, 5, 60]));
	expect(result).toBe(Prize.QUINA);
});
Deno.test("Should return SENA when 6 matches are found", () => {
	const result = checkBet([1, 2, 3, 4, 5, 6], new Set([1, 2, 3, 4, 5, 6]));
	expect(result).toBe(Prize.SENA);
});

Deno.test("Should return null when the first arg starts with a number", () => {
	const args = ["1,2,3,4,5,6"];
	const flags = parseFlags(args);
	expect(flags).toBeNull();
});

Deno.test("Should correctly parse boolean flags", () => {
	const args = ["--verbose"];
	const flags = parseFlags(args);
	expect(flags).toEqual({ verbose: true });
});

Deno.test("Should correctly parse value flags", () => {
	const args = ["-b", "1,2,3,4,5,6"];
	const flags = parseFlags(args);
	expect(flags).toEqual({ bet: "1,2,3,4,5,6" });
});

Deno.test("Should parse more than one flag", () => {
	const args = ["-d", "1,2,3,4,5,6", "-f", "./bets_test.txt"];
	const flags = parseFlags(args);
	expect(flags).toEqual({ draw: "1,2,3,4,5,6", file: "./bets_test.txt" });
});
