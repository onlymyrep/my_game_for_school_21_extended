const emojis = [
    "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🐤", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞", "🐜", "🦟", "🦗", "🕷", "🦂", "🐢", "🐍", "🦎", "🦖", "🦕", "🐙", "🦑", "🦐", "🦞", "🦀", "🐡", "🐠", "🐟", "🐬", "🐳", "🐋", "🦈", "🐊", "🐅", "🐆", "🦓", "🦍", "🦧", "🐘", "🦛", "🦏", "🐪", "🐫", "🦒", "🦘", "🐃", "🐂", "🐄", "🐎", "🐖", "🐏", "🐑", "🦙", "🐐", "🦌", "🐕", "🐩", "🦮", "🐕‍🦺", "🐈", "🐓", "🦃", "🦚", "🦜", "🦢", "🦩", "🕊", "🐇", "🦝", "🦨", "🦡", "🦦", "🦥", "🐁", "🐀", "🐿", "🦔"
];

let level = 1, boardSize = 3, selectedCell = null;
let levelTime = 20, totalTime = 0, maxLevel = 7;
let timerInterval, totalTimeInterval;
let musicStarted = false;

const elements = {
    level: document.getElementById('level'),
    board: document.getElementById('board'),
    message: document.getElementById('message'),
    levelTime: document.getElementById('levelTime'),
    totalTimeValue: document.getElementById('totalTimeValue'),
    music: document.getElementById('music'),
    hintText: document.getElementById('hintText')
};

const rules = [
    "Собери строку",
    "Собери столбец",
    "Собери диагональ",
    "Собери квадрат",
    "Собери крест",
    "Собери букву S",
    "Собери букву C"
];

const hints = [
    "ряд",       // Уровень 1
    "столбик",   // Уровень 2
    "диагональ", // Уровень 3
    "квадрат",   // Уровень 4
    "крест",     // Уровень 5
    "буква s",   // Уровень 6
    "буква c"    // Уровень 7
];

function caesarCipher(word, shift) {
    const rusAlphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
    return word
        .toLowerCase()
        .split('')
        .map(char => {
            const index = rusAlphabet.indexOf(char);
            if (index !== -1) {
                const newIndex = (index + shift) % rusAlphabet.length;
                return rusAlphabet[newIndex];
            } else {
                return char; // Оставляем пробелы и другие символы без изменений
            }
        })
        .join('');
}

function updateHint() {
    const encryptedHint = caesarCipher(hints[level - 1], level);
    elements.hintText.textContent = encryptedHint;
}

function updateRule() {
    elements.message.textContent = rules[level - 1];
}

function createBoard() {
    elements.board.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    elements.board.innerHTML = '';

    const emojiSet = Array(boardSize).fill()
        .flatMap(() => {
            const emoji = emojis[Math.random() * emojis.length | 0];
            return Array(boardSize).fill(emoji);
        })
        .sort(() => Math.random() - 0.5);

    for (let i = 0; i < boardSize ** 2; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = emojiSet[i];
        cell.onclick = () => handleClick(i);
        elements.board.appendChild(cell);
    }
}

function handleClick(index) {
    if (!timerInterval) return;

    const cells = elements.board.children;
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;

    if (!selectedCell) {
        selectedCell = { row, col, index };
        cells[index].classList.add('selected');
        return;
    }

    const first = cells[selectedCell.index];
    const second = cells[index];

    [first.textContent, second.textContent] = [second.textContent, first.textContent];

    first.classList.remove('selected');
    selectedCell = null;

    if (checkWin()) handleWin();
}

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
            // Уровень 3: Все эмодзи на диагонали должны быть одинаковыми
            const firstDiagonal = cells[0].textContent;
            const secondDiagonal = cells[boardSize - 1].textContent;
            for (let i = 0; i < boardSize; i++) {
                if (cells[i * boardSize + i].textContent !== firstDiagonal) return false; // Главная диагональ
                if (cells[i * boardSize + (boardSize - 1 - i)].textContent !== secondDiagonal) return false; // Побочная диагональ
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

function handleWin() {
    clearInterval(timerInterval);
    if (level === maxLevel) {
        elements.message.textContent = `Победа! Вы готовы к поступлению в school_21. Время: ${totalTime}с`;
        clearInterval(totalTimeInterval);
        return;
    }

    // Выводим сообщение о шаге к school_21
    elements.message.textContent = "Вы на шаг ближе к school_21";

    // Задержка перед переходом на следующий уровень
    setTimeout(() => {
        level++;
        boardSize++;
        levelTime += 10;
        elements.level.textContent = level;
        document.body.className = `theme-${level}`;
        elements.message.textContent = ""; // Очищаем сообщение
        startGame();
    }, 2000); // Задержка 2 секунды
}

function startTimer() {
    let time = levelTime;
    elements.levelTime.textContent = time;

    timerInterval = setInterval(() => {
        if (--time <= 0) {
            clearInterval(timerInterval);
            if (level === 1) {
                elements.message.textContent = 'Тапните для перезапуска';
                document.addEventListener('click', restartGame, { once: true });
                return;
            }
            level--;
            boardSize--;
            levelTime -= 10;
            elements.level.textContent = level;
            document.body.className = `theme-${level}`;
            startGame();
        }
        elements.levelTime.textContent = time;
    }, 1000);
}

function startGame() {
    clearInterval(timerInterval);
    clearInterval(totalTimeInterval);
    createBoard();
    startTimer();
    updateHint(); // Обновляем подсказку
    updateRule(); // Обновляем правило
    totalTimeInterval = setInterval(() => {
        totalTime++;
        elements.totalTimeValue.textContent = totalTime;
    }, 1000);
}

function restartGame() {
    level = 1;
    boardSize = 3;
    levelTime = 20;
    totalTime = 0;
    elements.level.textContent = level;
    elements.totalTimeValue.textContent = totalTime;
    document.body.className = `theme-${level}`;
    startGame();
}

// Инициализация игры после полной загрузки страницы
window.addEventListener('load', () => {
    // Загружаем аудио только после загрузки страницы
    elements.music.src = 'bg.mp3'; // Назначаем источник
    elements.music.load(); // Загружаем асинхронно

    // Воспроизводим после первого клика пользователя
    document.addEventListener('click', () => {
        if (!musicStarted) {
            elements.music.play().then(() => {
                musicStarted = true;
                console.log("Музыка начала воспроизводиться.");
            }).catch((error) => {
                console.error("Ошибка воспроизведения аудио:", error);
            });
        }
    }, { once: true });

    // Запускаем игру
    startGame();
});
