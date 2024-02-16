const range = (n: number) => [...Array(n)].map((_, i) => i);

const sum = (array: number[]) => array.reduce((s, v) => s + v, 0);

const board = range(9).map(() => range(9).map(() => range(9).map(() => 1 / 9)));

const boardToProbabilityString = () =>
    range(9)
        .map(i =>
            range(3)
                .map(a =>
                    range(9)
                        .map(j =>
                            range(3)
                                .map(b => (board[i][j][3 * a + b] * 100).toFixed(0))
                                .join("\t")
                        )
                        .join("\t\t")
                )
                .join("\n")
        )
        .join("\n\n");

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

const normalizeCell = (i: number, j: number) => {
    const s = sum(board[i][j]);
    range(9).forEach(n => {
        board[i][j][n] /= s;
    });
};

const normalizeRow = (i: number, n: number) => {
    const s = sum(board[i].map(cell => cell[n]));
    range(9).forEach(j => {
        board[i][j][n] /= s;
    });
};

const normalizeCol = (j: number, n: number) => {
    const s = sum(board.map(row => row[j][n]));
    range(9).forEach(i => {
        board[i][j][n] /= s;
    });
};

const normalizeSquare = (ii: number, jj: number, n: number) => {
    const s = sum(
        range(3)
            .map(a => range(3).map(b => board[3 * ii + a][3 * jj + b][n]))
            .flat()
    );
    range(3).forEach(a => {
        range(3).forEach(b => {
            board[3 * ii + a][3 * jj + b][n] /= s;
        });
    });
};

const normalize = () => {
    range(9).forEach(a => {
        range(9).forEach(n => {
            normalizeRow(a, n);
            normalizeCol(a, n);
        });
    });
    range(3).forEach(a => {
        range(3).forEach(b => {
            range(9).forEach(n => {
                normalizeSquare(a, b, n);
            });
        });
    });
    range(9).forEach(a => {
        range(9).forEach(b => {
            normalizeCell(a, b);
        });
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

const isValidRow = (array: number[]) => {
    const numbers = new Set();
    array.forEach(n => {
        numbers.add(n);
    });
    return range(9).every(n => numbers.has(n));
};

const isValidSolution = (array: number[][]) =>
    array.every(isValidRow) &&
    range(9).every(i => isValidRow(array[i])) &&
    range(3).every(i =>
        range(3).every(j =>
            isValidRow([
                array[3 * i][3 * j],
                array[3 * i][3 * j + 1],
                array[3 * i][3 * j + 2],
                array[3 * i + 1][3 * j],
                array[3 * i + 1][3 * j + 1],
                array[3 * i + 1][3 * j + 2],
                array[3 * i + 2][3 * j],
                array[3 * i + 2][3 * j + 1],
                array[3 * i + 2][3 * j + 2]
            ])
        )
    );

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
    normalize();
}

console.log(boardToSolutionString());
