// export const flags = {
// 	verbose: {
// 		flag: "--verbose",
// 		description: "Verbose mode",
// 		alias: "-v",
// 		type: "boolean",
// 	},
// 	help: {
// 		flag: "--help",
// 		description: "Show help",
// 		alias: "-h",
// 		type: "boolean",
// 	},
// 	file: {
// 		flag: "--file",
// 		description: "Path to bets file",
// 		alias: "-f",
// 		type: "value",
// 	},
// 	draw: {
// 		flag: "--draw",
// 		description: "Draw numbers",
// 		alias: "-d",
// 		type: "value",
// 	},
// 	bet: {
// 		flag: "--bet",
// 		description: "Bet numbers",
// 		alias: "-b",
// 		type: "value",
// 	},
// };

export const flags = [
	{ flag: "verbose", description: "Verbose mode", alias: "v", type: "boolean" },

	{ flag: "help", description: "Show help", alias: "h", type: "boolean" },

	{ flag: "file", description: "Path to bets file", alias: "f", type: "value" },

	{ flag: "draw", description: "Draw numbers", alias: "d", type: "value" },

	{ flag: "bet", description: "Bet numbers", alias: "b", type: "value" },
] as const;
