import { flags } from "./flags.ts";
import { Prize, Bet, ActiveFlags } from "./types.ts";

const prizeDict: Record<number, Prize> = {
	4: Prize["QUADRA"],
	5: Prize["QUINA"],
	6: Prize["SENA"],
};

let activeFlags: ActiveFlags | null = null;
let draw: Set<number>;
let bets: Bet[];
let filePath = "./bets.txt";

async function main() {
	try {
		activeFlags = parseFlags(Deno.args);

		if (activeFlags?.help) {
			showHelp();
			Deno.exit(1);
		}

		if (activeFlags === null) {
			draw = parseDraw(Deno.args[0]);
			bets = await getBetsFromFile(filePath);
			checkAllBets(bets, draw);
			Deno.exit(1);
		}

		if (activeFlags.draw !== undefined) {
			draw = parseDraw(activeFlags.draw as string);
		}

		if (activeFlags.file) {
			filePath = activeFlags.file as string;
		}

		if (activeFlags.bet) {
			bets = [parseBet(activeFlags.bet as string)];
		}

		if (!activeFlags.bet) {
			bets = await getBetsFromFile(filePath);
		}

		checkAllBets(bets, draw);
		console.log("\nExiting process.\n");
		Deno.exit(1);
	} catch (error) {
		console.error(error);
	}
}

function parseDraw(draw: string) {
	const numbers = draw.split(",").map(parseNum);

	if (numbers.length !== 6) {
		console.error("You must provide 6 numbers for the draw");
		Deno.exit(1);
	}

	return new Set(numbers);
}

export function checkBet(bet: Bet, draw: Set<number>): Prize | null {
	if (bet.length < 6 || bet.length > 20) {
		console.error(`Bet ${bet.join(", ")} must be between 6 and 20 numbers`);
		return null;
	}

	let points = 0;

	for (const n of bet) {
		if (draw.has(n)) {
			points++;
		}
	}

	return prizeDict[points] || null;
}

export function checkAllBets(bets: Bet[], draw: Set<number>) {
	if (activeFlags?.verbose) {
		console.log(`Checking ${bets.length} bets...\n`);
	}
	let wonCount = 0;

	for (const bet of bets) {
		const result = checkBet(bet, draw);
		const output = bet.join(" ") + " - " + (result === null ? "N/A" : result);

		if (result !== null) {
			wonCount++;
		}

		if (activeFlags?.verbose || result !== null) {
			console.log(output);
		}
	}

	if (wonCount > 0) {
		console.log(`\n${wonCount} bet(s) won!`);
	} else {
		console.log("\nNo bets won.");
	}
}

async function getBetsFromFile(path: string): Promise<Bet[]> {
	try {
		const text = await Deno.readTextFile(path);
		const lines = text.split("\n");
		const bets = [];

		for (const line of lines) {
			const content = line.trim();
			if (content === "" || isNaN(Number(content[0]))) {
				continue;
			}
			const bet = parseBet(content);
			bets.push(bet);
		}

		return bets;
	} catch (_) {
		console.error(`File ${path} not found. Either provide a bet or a file path. Use --help/-h.`);
		Deno.exit(1);
	}
}

function parseBet(bet: string) {
	const parsed = bet.split(",").map(parseNum);
	return parsed;
}

function parseNum(n: string) {
	const number = Number(n);

	if (!isValidNumber(number)) {
		Deno.exit(1);
	}

	return number;
}

function isValidNumber(n: number) {
	if (isNaN(n)) {
		console.error("Provide numbers only");
		return false;
	}

	if (n < 1 || n > 60) {
		console.error("Numbers must be between 1 and 60");
		return false;
	}

	return true;
}

export function parseFlags(args: string[]): ActiveFlags | null {
	const activeFlags: ActiveFlags = {} as ActiveFlags;

	try {
		if (args.length === 0) {
			console.error("Incorrect options. Use --help/-h.");
			Deno.exit(1);
		}

		if (!isNaN(Number(args[0][0]))) {
			return null;
		}

		for (let i = 0; i < args.length; i++) {
			const arg = args[i].replaceAll("-", "");
			const flag = flags.find((f) => f.flag === arg || f.alias === arg);

			if (flag === undefined) {
				console.error(`Unknown option '${args[i]}'. Use --help/-h.`);
				Deno.exit(1);
			}

			if (flag.type === "boolean") {
				activeFlags[flag.flag] = true;
				continue;
			}

			if (flag.type === "value") {
				const value = args[i + 1];
				if (value === undefined) {
					console.error(`Must provide a value for ${arg} flag. Use --help/-h.`);
					Deno.exit(1);
				}

				activeFlags[flag.flag] = value;
			}
		}

		return activeFlags;
	} catch (err) {
		console.error(err);
		Deno.exit(1);
	}
}

function showHelp() {
	console.log(`
This script checks if one or more valid Mega-Sena bets won the provided draw.

Example: deno index.ts -d 1,2,3,4,5,6 -b 1,2,3,4,5,6

Options:
  -d, --draw <draw>		  Provide the draw to compare (ex: 1,2,3,4,5,6)
  -b, --bet <bets>        Specify a bet directly in the command line (ex: 1,2,3,4,5,6)
  -f, --file <file>       Specify a file containing bets (default: 'bets.txt')
  -h, --help              Display this help message

Bets File Format:
  Create a 'bets.txt' file in the root folder to check multiple bets at once.
  Separate each bet per line, and each number by a comma:

  Example:
    1,2,3,4,5,6
    50,51,52,53,54,55

  Lines that do not start with a number will be ignored, so you can provide any other text to identify the bets.
`);
}

main();
