const { program } = require("commander");
const { BLM } = require("./lib/blm");

/**
 * Initialize command line options
 */
function initialise() {
    program.version("0.0.1");
    program
        .option("-i, --interactive", "Replace interactively", false)
        .option("-j, --json", "Dump changes as json", false)
        .option("-p, --path <path>", "Path (File/Dir) to transform", "./")
        .option("-w, --wordsFile <file>", "Words File", "./lib/words.json")
        .option("-r, --replaceAll", "Replace all instances", false)
        .option("-v, --verbose", "Verbosity of JSON output", false)
        .option("-s, --summary", "Summary", true)
        .parse(process.argv);

    process.on("SIGINT", function() {
        console.log("Terminating...");
        process.exit();
    });
}

/**
 * Print Summary of inappropriate words in file/directory
 */
async function printSummary() {
    await BLM.use(program.wordsFile).with(program.path).printSummary();
}

/**
 * Dump JSON of inappropriate words in file/directory along with line/lineno.
 */
async function dumpJSON() {
    await BLM.use(program.wordsFile)
        .with(program.path)
        .dumpJSON(program.verbose);
}

/**
 * Replace inappropriate words with words present in dictionary.
 */
async function replaceAllWords() {
    await BLM.use(program.wordsFile).withDirectory(program.path).replace();
}

/**
 * Replace inappropriate words interactively
 */
async function replaceAllWordsInteractive() {
    await BLM.use(program.wordsFile).with(program.path).replaceInteractive();
}

/**
 * Main driver function
 */
async function main() {
    initialise();
    if (program.json) {
        return dumpJSON();
    }

    if (program.replaceAll === true) {
        if (program.interactive === true) {
            return replaceAllWordsInteractive();
        } else {
            return replaceAllWords();
        }
    }

    return printSummary();
}

main();
