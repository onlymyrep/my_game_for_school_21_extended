const hints = [
    "ряд",       // Уровень 1
    "столбик",   // Уровень 2
    "одинаковые", // Уровень 3
    "квадрат",   // Уровень 4
    "крест",     // Уровень 5
    "буква s",   // Уровень 6
    "буква c"    // Уровень 7
];

function checkWin() {
    const cells = elements.board.children;

    switch (level) {
        case 1:
            // Уровень 1: Все эмодзи в строке должны быть одинаковыми
            for (let i = 0; i < boardSize; i++) {
                const rowStart = i * boardSize;
                const first = cells[rowStart].textContent;
                for (let j = 1; j < boardSize; j++) {
                    if (cells[rowStart + j].textContent !== first) return false;
                }
            }
            return true;

        case 2:
            // Уровень 2: Все эмодзи в столбце должны быть одинаковыми
            for (let j = 0; j < boardSize; j++) {
                const first = cells[j].textContent;
                for (let i = 1; i < boardSize; i++) {
                    if (cells[i * boardSize + j].textContent !== first) return false;
                }
            }
            return true;

        case 3:
            // Уровень 3: Все эмодзи должны быть одинаковыми
            const firstEmoji = cells[0].textContent;
            for (let i = 1; i < cells.length; i++) {
                if (cells[i].textContent !== firstEmoji) return false;
            }
            return true;

        case 4:
            // Уровень 4: Квадрат 2x2
            for (let i = 0; i < boardSize - 1; i++) {
                for (let j = 0; j < boardSize - 1; j++) {
                    const index = i * boardSize + j;
                    const first = cells[index].textContent;
                    if (
                        cells[index + 1].textContent !== first ||
                        cells[index + boardSize].textContent !== first ||
                        cells[index + boardSize + 1].textContent !== first
                    ) {
                        return false;
                    }
                }
            }
            return true;

        case 5:
            // Уровень 5: Крест
            const center = Math.floor(boardSize / 2);
            const centerCell = cells[center * boardSize + center].textContent;
            for (let i = 0; i < boardSize; i++) {
                if (cells[center * boardSize + i].textContent !== centerCell) return false; // Горизонтальная линия
                if (cells[i * boardSize + center].textContent !== centerCell) return false; // Вертикальная линия
            }
            return true;

        case 6:
            // Уровень 6: Буква S
            const sPattern = [
                [0, 0], [0, 1], [0, 2],
                [1, 0], [1, 2],
                [2, 0], [2, 1], [2, 2]
            ];
            const firstS = cells[sPattern[0][0] * boardSize + sPattern[0][1]].textContent;
            for (const [row, col] of sPattern) {
                if (cells[row * boardSize + col].textContent !== firstS) return false;
            }
            return true;

        case 7:
            // Уровень 7: Буква C
            const cPattern = [
                [0, 0], [0, 1], [0, 2],
                [1, 0],
                [2, 0], [2, 1], [2, 2]
            ];
            const firstC = cells[cPattern[0][0] * boardSize + cPattern[0][1]].textContent;
            for (const [row, col] of cPattern) {
                if (cells[row * boardSize + col].textContent !== firstC) return false;
            }
            return true;

        default:
            return false;
    }
}
