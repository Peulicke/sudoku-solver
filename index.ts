const range = (n: number) => [...Array(n)].map((_, i) => i);

const sum = (array: number[]) => array.reduce((s, v) => s + v, 0);

const board = range(9).map(() => range(9).map(() => range(9).map(() => 1 / 9)));

type Vec2 = [number, number];

type Vec3 = [number, number, number];

const rows: Vec3[][] = range(9)
    .map(n => range(9).map(i => range(9).map((j): Vec3 => [i, j, n])))
    .flat();

const cols: Vec3[][] = range(9)
    .map(n => range(9).map(j => range(9).map((i): Vec3 => [i, j, n])))
    .flat();

const squares: Vec3[][] = range(9)
    .map(n =>
        range(3)
            .map(ii =>
                range(3).map(jj =>
                    range(3)
                        .map(a => range(3).map((b): Vec3 => [3 * ii + a, 3 * jj + b, n]))
                        .flat()
                )
            )
            .flat()
    )
    .flat();

const stacks: Vec3[][] = range(9)
    .map(i => range(9).map(j => range(9).map((n): Vec3 => [i, j, n])))
    .flat();

const allPatterns = [...rows, ...cols, ...squares, ...stacks];

const allFlatPatterns: Vec2[][] = [...rows, ...cols, ...squares].map(list => list.map((v): Vec2 => [v[0], v[1]]));

const getMostProbableValue = (i: number, j: number) =>
    board[i][j].map((p, n) => [p, n]).sort((a, b) => b[0] - a[0])[0][1];

const boardToSolutionArray = () => range(9).map(i => range(9).map(j => getMostProbableValue(i, j)));

const boardToSolutionString = () =>
    boardToSolutionArray()
        .map(row => row.map(value => value + 1).join(""))
        .join("\n");

const setNumber = (i: number, j: number, n: number) => {
    range(9).forEach(a => {
        board[a][j][n] = 0;
        board[i][a][n] = 0;
        board[i][j][a] = 0;
    });
    const ii = Math.floor(i / 3);
    const jj = Math.floor(j / 3);
    range(3).forEach(a => {
        range(3).forEach(b => {
            board[3 * ii + a][3 * jj + b][n] = 0;
        });
    });
    board[i][j][n] = 1;
};

const normalize = (list: Vec3[]) => {
    const s = sum(list.map(v => board[v[0]][v[1]][v[2]]));
    list.forEach(v => {
        board[v[0]][v[1]][v[2]] /= s;
    });
};

const loadBoard = (s: string) => {
    s.trim()
        .split("\n")
        .forEach((line, i) => {
            line.split("").forEach((char, j) => {
                if (char === ".") return;
                setNumber(i, j, Number(char) - 1);
            });
        });
};

const allDifferent = (array: number[]) => {
    const numbers = new Set();
    array.forEach(n => {
        numbers.add(n);
    });
    return range(9).every(n => numbers.has(n));
};

const isValidSolution = (array: number[][]) =>
    allFlatPatterns.every(list => allDifferent(list.map(v => array[v[0]][v[1]])));

const input = `
5.8.36...
..3...8.2
...7.8.63
14.....2.
.......1.
...421635
2..5.3..1
..419.38.
..1..7...
`;

loadBoard(input);

for (let i = 0; !isValidSolution(boardToSolutionArray()); ++i) {
    console.clear();
    console.log("Iterations: " + i);
    allPatterns.forEach(normalize);
}

console.log(boardToSolutionString());
