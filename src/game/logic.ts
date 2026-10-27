// src/game/logic.ts

export type Player = 1 | 2; // 1 = 黑, 2 = 白
export type Cell = 0 | Player;
export type Board = Cell[][];
export type Difficulty = "Easy" | "Medium" | "Hard";
export type GameMode = "gomoku" | "renju";

export const BOARD_SIZE = 15;

// ---------- 基本棋盤操作 ----------
export function createBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () => Array<Cell>(BOARD_SIZE).fill(0));
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

export function isValidMove(board: Board, row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE && board[row][col] === 0;
}

// ---------- 贏/和判斷 ----------
const DIRECTIONS: [number, number][] = [[0, 1], [1, 0], [1, 1], [1, -1]];

export function getLineLength(board: Board, row: number, col: number, player: Player, dx: number, dy: number): number {
  let count = 1;
  for (let i = 1; i < BOARD_SIZE; i++) {
    const r = row + dx * i, c = col + dy * i;
    if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || board[r][c] !== player) break;
    count++;
  }
  for (let i = 1; i < BOARD_SIZE; i++) {
    const r = row - dx * i, c = col - dy * i;
    if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || board[r][c] !== player) break;
    count++;
  }
  return count;
}

export function checkWin(board: Board, row: number, col: number, player: Player): boolean {
  for (const [dx, dy] of DIRECTIONS) {
    if (getLineLength(board, row, col, player, dx, dy) >= 5) return true;
  }
  return false;
}

export function checkDraw(board: Board): boolean {
  return board.every((row) => row.every((cell) => cell !== 0));
}

// ---------- Renju 禁手判斷 ----------
export type ForbiddenResult = { type: "none" | "win" | "overline" | "double-four" | "double-three" };

export function checkForbidden(board: Board, row: number, col: number): ForbiddenResult {
  const player: Player = 1;
  for (const [dx, dy] of DIRECTIONS) {
    if (getLineLength(board, row, col, player, dx, dy) === 5) return { type: "win" };
  }
  for (const [dx, dy] of DIRECTIONS) {
    if (getLineLength(board, row, col, player, dx, dy) >= 6) return { type: "overline" };
  }
  let fourCount = 0, openThreeCount = 0;
  for (const [dx, dy] of DIRECTIONS) {
    const pattern = analyzeDirection(board, row, col, player, dx, dy);
    if (pattern === "four") fourCount++;
    if (pattern === "open-three") openThreeCount++;
  }
  if (fourCount >= 2) return { type: "double-four" };
  if (openThreeCount >= 2) return { type: "double-three" };
  return { type: "none" };
}

function analyzeDirection(board: Board, row: number, col: number, player: Player, dx: number, dy: number): "five" | "four" | "open-three" | "none" {
  const line: Cell[] = [];
  for (let i = -4; i <= 4; i++) {
    const r = row + dx * i, c = col + dy * i;
    line.push((r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) ? 2 : board[r][c]);
  }
  for (let i = 0; i < line.length; i++) {
    if (line[i] !== 0) continue;
    const testLine = [...line]; testLine[i] = player;
    if (countConsecutive(testLine, player) === 5) return "four";
  }
  for (let i = 0; i < line.length; i++) {
    if (line[i] !== 0) continue;
    const testLine = [...line]; testLine[i] = player;
    if (isOpenFour(testLine, player, i)) return "open-three";
  }
  return "none";
}

function countConsecutive(line: Cell[], player: Player): number {
  let max = 0, current = 0;
  for (const cell of line) {
    if (cell === player) { current++; max = Math.max(max, current); } else { current = 0; }
  }
  return max;
}

function isOpenFour(line: Cell[], player: Player, placedIndex: number): boolean {
  let left = placedIndex, right = placedIndex;
  while (left > 0 && line[left - 1] === player) left--;
  while (right < line.length - 1 && line[right + 1] === player) right++;
  if (right - left + 1 !== 4) return false;
  return (left > 0 && line[left - 1] === 0) && (right < line.length - 1 && line[right + 1] === 0);
}

// ---------- 評估函數 ----------
const SCORES: Record<string, number> = { five: 1000000, "open-four": 100000, four: 10000, "open-three": 1000, three: 100, "open-two": 10, two: 1 };

export function evaluateBoard(board: Board, player: Player): number {
  let score = 0;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === 0) continue;
      const owner = board[r][c] as Player;
      const sign = owner === player ? 1 : -1;
      for (const [dx, dy] of DIRECTIONS) {
        const prevR = r - dx, prevC = c - dy;
        if (prevR >= 0 && prevR < BOARD_SIZE && prevC >= 0 && prevC < BOARD_SIZE && board[prevR][prevC] === owner) continue;
        score += sign * scoreLine(board, r, c, owner, dx, dy);
      }
    }
  }
  return score;
}

function scoreLine(board: Board, row: number, col: number, player: Player, dx: number, dy: number): number {
  let length = 0, r = row, c = col;
  while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) { length++; r += dx; c += dy; }
  const beforeOpen = r - dx >= 0 && r - dx < BOARD_SIZE && c - dy >= 0 && c - dy < BOARD_SIZE && board[r - dx][c - dy] === 0;
  const afterOpen = r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === 0;
  if (length >= 5) return SCORES.five;
  if (length === 4) return (beforeOpen && afterOpen) ? SCORES["open-four"] : (beforeOpen || afterOpen) ? SCORES.four : 0;
  if (length === 3) return (beforeOpen && afterOpen) ? SCORES["open-three"] : (beforeOpen || afterOpen) ? SCORES.three : 0;
  if (length === 2) return (beforeOpen && afterOpen) ? SCORES["open-two"] : (beforeOpen || afterOpen) ? SCORES.two : 0;
  return 0;
}

// ---------- Candidate Moves ----------
export function getCandidateMoves(board: Board): [number, number][] {
  const candidates = new Set<string>();
  let hasStone = false;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === 0) continue;
      hasStone = true;
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          if (isValidMove(board, r + dr, c + dc)) candidates.add(`${r + dr},${c + dc}`);
        }
      }
    }
  }
  if (!hasStone) return [[Math.floor(BOARD_SIZE / 2), Math.floor(BOARD_SIZE / 2)]];
  return Array.from(candidates).map((key) => { const [r, c] = key.split(",").map(Number); return [r, c] as [number, number]; });
}

function getWinner(board: Board): Player | null {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const cell = board[r][c];
      if (cell === 0) continue;
      for (const [dx, dy] of DIRECTIONS) {
        const prevR = r - dx, prevC = c - dy;
        if (prevR >= 0 && prevR < BOARD_SIZE && prevC >= 0 && prevC < BOARD_SIZE && board[prevR][prevC] === cell) continue;
        if (getLineLength(board, r, c, cell as Player, dx, dy) >= 5) return cell as Player;
      }
    }
  }
  return null;
}

// ---------- Transposition Table (pre-complie/caching)----------
const transpositionTable = new Map<string, { score: number; depth: number }>();

function boardKey(board: Board): string {
  let key = "";
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      key += board[r][c];
    }
  }
  return key;
}

// ---------- Rule-based 擋棋 ----------
function wouldWin(board: Board, row: number, col: number, player: Player): boolean {
  const temp = cloneBoard(board);
  temp[row][col] = player;
  return checkWin(temp, row, col, player);
}

function findWinningMove(board: Board, player: Player): [number, number] | null {
  const moves = getCandidateMoves(board);
  for (const [r, c] of moves) {
    if (wouldWin(board, r, c, player)) return [r, c];
  }
  return null;
}

function findBlockingMove(board: Board, opponent: Player): [number, number] | null {
  return findWinningMove(board, opponent);
}

function findThreatBlockingMove(board: Board, aiPlayer: Player): [number, number] | null {
  const opponent: Player = aiPlayer === 1 ? 2 : 1;
  const moves = getCandidateMoves(board);

  // 1. 優先檢查對手嘅「四連」威脅
  for (const [r, c] of moves) {
    const temp = cloneBoard(board);
    temp[r][c] = opponent;
    for (const [dx, dy] of DIRECTIONS) {
      if (getLineLength(temp, r, c, opponent, dx, dy) >= 4) {
        return [r, c];
      }
    }
  }

  // 2. 檢查對手嘅「三連」威脅（包括 OXO 模式）
  for (const [r, c] of moves) {
    const temp = cloneBoard(board);
    temp[r][c] = opponent;
    for (const [dx, dy] of DIRECTIONS) {
      const len = getLineLength(temp, r, c, opponent, dx, dy);
      if (len === 3) {
        const prevR = r - dx, prevC = c - dy;
        const nextR = r + dx * 3, nextC = c + dy * 3;
        const leftOpen = prevR >= 0 && prevR < BOARD_SIZE && prevC >= 0 && prevC < BOARD_SIZE && temp[prevR][prevC] === 0;
        const rightOpen = nextR >= 0 && nextR < BOARD_SIZE && nextC >= 0 && nextC < BOARD_SIZE && temp[nextR][nextC] === 0;
        if (leftOpen || rightOpen) {
          return [r, c];
        }
      }
    }
  }

  return null;
}

// ---------- Minimax + Alpha-Beta ----------
function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiPlayer: Player
): number {
  const opponent: Player = aiPlayer === 1 ? 2 : 1;

  const key = `${boardKey(board)}-${depth}-${isMaximizing}`;
  const cached = transpositionTable.get(key);
  if (cached && cached.depth >= depth) {
    return cached.score;
  }

  const winner = getWinner(board);
  if (winner === aiPlayer) return 10000000;
  if (winner === opponent) return -10000000;
  if (checkDraw(board)) return 0;
  if (depth === 0) return evaluateBoard(board, aiPlayer);

  const candidateLimit = depth >= 3 ? 10 : depth >= 2 ? 8 : 6;
  let moves = getCandidateMoves(board);
  if (moves.length > candidateLimit) {
    const scored = moves.map(([r, c]) => {
      board[r][c] = isMaximizing ? aiPlayer : opponent;
      const score = evaluateBoard(board, aiPlayer);
      board[r][c] = 0;
      return { move: [r, c] as [number, number], score };
    });
    scored.sort((a, b) => isMaximizing ? b.score - a.score : a.score - b.score);
    moves = scored.slice(0, candidateLimit).map((s) => s.move);
  }

  let best = isMaximizing ? -Infinity : Infinity;

  if (isMaximizing) {
    for (const [r, c] of moves) {
      board[r][c] = aiPlayer;
      const score = minimax(board, depth - 1, alpha, beta, false, aiPlayer);
      board[r][c] = 0;
      best = Math.max(best, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
  } else {
    for (const [r, c] of moves) {
      board[r][c] = opponent;
      const score = minimax(board, depth - 1, alpha, beta, true, aiPlayer);
      board[r][c] = 0;
      best = Math.min(best, score);
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
  }

  transpositionTable.set(key, { score: best, depth });
  return best;
}

// ---------- 主 AI 函數 ----------
export function findBestMove(
  board: Board,
  aiPlayer: Player,
  difficulty: Difficulty
): [number, number] | null {
  const opponent: Player = aiPlayer === 1 ? 2 : 1;

  transpositionTable.clear();

  const moves = getCandidateMoves(board);
  if (moves.length === 0) return null;

  const winMove = findWinningMove(board, aiPlayer);
  if (winMove) return winMove;

  const blockMove = findBlockingMove(board, opponent);
  if (blockMove) return blockMove;

  const threatMove = findThreatBlockingMove(board, aiPlayer);
  if (threatMove) return threatMove;

  const depthMap: Record<Difficulty, number> = { Easy: 2, Medium: 4, Hard: 5 };
  const randomnessMap: Record<Difficulty, number> = { Easy: 0.15, Medium: 0.05, Hard: 0 };
  const maxCandidatesMap: Record<Difficulty, number> = { Easy: 10, Medium: 14, Hard: 18 };

  if (Math.random() < randomnessMap[difficulty]) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  const depth = depthMap[difficulty];
  const maxCandidates = maxCandidatesMap[difficulty];

  const scored = moves.map(([r, c]) => {
    board[r][c] = aiPlayer;
    const score = evaluateBoard(board, aiPlayer);
    board[r][c] = 0;
    return { move: [r, c] as [number, number], score };
  });
  scored.sort((a, b) => b.score - a.score);
  const topMoves = scored.slice(0, maxCandidates).map((s) => s.move);

  let bestScore = -Infinity;
  let bestMove: [number, number] = topMoves[0];

  for (const [r, c] of topMoves) {
    board[r][c] = aiPlayer;
    const score = minimax(board, depth - 1, -Infinity, Infinity, false, aiPlayer);
    board[r][c] = 0;
    if (score > bestScore) { bestScore = score; bestMove = [r, c]; }
  }

  return bestMove;
}

// ---------- 座標轉換 ----------
export function indexToCoord(index: number): [number, number] {
  return [Math.floor(index / BOARD_SIZE), index % BOARD_SIZE];
}
export function coordToIndex(row: number, col: number): number {
  return row * BOARD_SIZE + col;
}
export function coordToLabel(row: number, col: number): string {
  return `${String.fromCharCode(65 + col)}${BOARD_SIZE - row}`;
}