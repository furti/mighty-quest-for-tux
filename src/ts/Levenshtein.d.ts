interface FastLevenshtein {
    get(a: string, b: string): number;
}

declare var Levenshtein: FastLevenshtein;