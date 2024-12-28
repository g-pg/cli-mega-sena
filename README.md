## About

Simple CLI application to check multiple bets on the Mega-Sena lottery. Written in TS with the Deno runtime.
This project is just a fun experiment to mess around with Deno (and check all BOLÃO DA FIRMA™ bets at once, of course).

## Usage

Install Deno.

Run `deno index.ts --draw <draw> [options]`.

You can directly provide the draw without any flags. In this case, the script will search for a `bets.txt` in the root folder.

You must either provide a bet with the `-b` flag or a .txt file with all the bets you wish to compare.

```
Examples:
deno index.ts -d 1,2,3,4,5,6 -b 1,2,3,4,5,6
deno index.ts -d 1,2,3,4,5,6 -f bets.txt

Options:
  -d, --draw <draw>		  Provide the draw to compare (ex: 1,2,3,4,5,6) (required)
  -b, --bet <bet>        Specify a bet directly in the command line (ex: 1,2,3,4,5,6)
  -f, --file <file>       Specify a file containing bets (default: 'bets.txt')
  -h, --help              Display this help message

Bets File Format:
  Create a 'bets.txt' file in the root folder to check multiple bets at once.
  Separate each bet per line, and each number by a comma:

  Example:
    #My bets
    1,2,3,4,5,6

    #Other bets
    50,51,52,53,54,55

  Lines that do not start with a number will be ignored, so you can provide any other text to identify the bets.
```
