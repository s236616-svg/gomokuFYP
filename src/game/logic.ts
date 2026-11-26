// src/game/logic.ts

export type Player = 1 | 2; // 1 = 黑, 2 = 白
export type Cell = 0 | Player;
export type Board = Cell[][];
export type Difficulty = "Easy" | "Medium" | "Hard";
export type GameMode = "gomoku" | "renju";
export type ThreatLevel = "four" | "three" | null;

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
    const result = analyzeDirection(board, row, col, player, dx, dy, true);
    fourCount += result.fours; // X.XXX.X 一條線已經係兩個四
    if (result.pattern === "open-three") openThreeCount++;
  }
  if (fourCount >= 2) return { type: "double-four" };
  if (openThreeCount >= 2) return { type: "double-three" };
  return { type: "none" };
}

type Pattern = "five" | "overline" | "open-four" | "four" | "open-three" | "three" | "two" | "none";
type DirectionInfo = { pattern: Pattern; fours: number; straight: boolean; weak: number };

const RADIUS = 5;      // 每邊睇 5 格，成條 line 共 11 格
const CENTER = RADIUS; // 落子位置喺 line 入面嘅 index
const WEAK_SCORES = [0, 1, 4, 12, 30, 0]; // 未成形窗口嘅細分

// 分析 (row,col) 喺某個方向嘅棋形。(row,col) 當咗係 player 嘅棋（唔使真係落咗）
// exact = true：連珠黑棋，只有啱啱五粒先算五連
function analyzeDirection(board: Board, row: number, col: number, player: Player, dx: number, dy: number, exact = false): DirectionInfo {
  const opponent: Player = player === 1 ? 2 : 1;
  const line: Cell[] = [];
  for (let i = -RADIUS; i <= RADIUS; i++) {
    const r = row + dx * i, c = col + dy * i;
    line.push(i === 0 ? player : (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) ? opponent : board[r][c]);
  }

  // 已經五連（或者長連）
  const [left, right] = runBounds(line, player, CENTER);
  const length = right - left + 1;
  if (length >= 5) return { pattern: exact && length > 5 ? "overline" : "five", fours: 0, straight: false, weak: 0 };

  // 睇所有包住中心嘅 5 格窗口：冇對手棋嘅窗口先有機會連五
  let maxStones = 0, threes = 0, twos = 0, weak = 0;
  for (let start = CENTER - 4; start <= CENTER; start++) {
    let stones = 0, blocked = false;
    for (let k = start; k < start + 5; k++) {
      if (line[k] === opponent) { blocked = true; break; }
      if (line[k] === player) stones++;
    }
    if (blocked) continue;
    weak += WEAK_SCORES[stones];
    maxStones = Math.max(maxStones, stones);
    if (stones === 3) threes++;
    else if (stones === 2) twos++;
  }

  // 四：有空位再落一粒就連五
  if (maxStones >= 4) {
    const points = fivePoints(line, player, exact);
    if (points.length) {
      const pairs = points.filter((p) => points.includes(p + 5)).length;
      return {
        pattern: pairs || points.length >= 2 ? "open-four" : "four",
        fours: Math.max(1, points.length - pairs), // .XXXX. = 1 個四；X.XXX.X = 2 個四
        straight: pairs > 0,
        weak,
      };
    }
  }

  // 活三：再落一粒可以變成活四（.XXXX.），包括跳三 .X.XX.
  if (maxStones >= 3) {
    for (let i = 1; i < line.length - 1; i++) {
      if (line[i] !== 0) continue;
      line[i] = player;
      const openFour = isOpenFour(fivePoints(line, player, exact));
      line[i] = 0;
      if (openFour) return { pattern: "open-three", fours: 0, straight: false, weak };
    }
    if (threes) return { pattern: "three", fours: 0, straight: false, weak };
  }
  return { pattern: twos ? "two" : "none", fours: 0, straight: false, weak };
}

// 由 index 向兩邊數連續同色棋，回傳 [頭, 尾]
function runBounds(line: Cell[], player: Player, index: number): [number, number] {
  let left = index, right = index;
  while (left > 0 && line[left - 1] === player) left--;
  while (right < line.length - 1 && line[right + 1] === player) right++;
  return [left, right];
}

// 邊啲空位落子之後，會經過中心連成五
function fivePoints(line: Cell[], player: Player, exact: boolean): number[] {
  const points: number[] = [];
  for (let i = 1; i < line.length - 1; i++) {
    if (line[i] !== 0) continue;
    line[i] = player;
    const [left, right] = runBounds(line, player, i);
    line[i] = 0;
    const length = right - left + 1;
    if (left <= CENTER && right >= CENTER && (exact ? length === 5 : length >= 5)) points.push(i);
  }
  return points;
}

// 活四：有兩個相隔 5 格嘅連五點（.XXXX.）
function isOpenFour(points: number[]): boolean {
  return points.some((p) => points.includes(p + 5));
}

// ---------- 評估函數 ----------
// 5 格窗口入面得一方嘅棋 → 按粒數計分（index = 粒數）
const SCORES = [0, 1, 10, 80, 600, 100000];

// 所有長度 ≥ 5 嘅線（橫、直、兩條斜）
const LINES: [number, number][][] = (() => {
  const lines: [number, number][][] = [];
  const walk = (r: number, c: number, dr: number, dc: number) => {
    const line: [number, number][] = [];
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) { line.push([r, c]); r += dr; c += dc; }
    if (line.length >= 5) lines.push(line);
  };
  for (let i = 0; i < BOARD_SIZE; i++) { walk(i, 0, 0, 1); walk(0, i, 1, 0); }
  for (let c = 0; c < BOARD_SIZE; c++) { walk(0, c, 1, 1); walk(0, c, 1, -1); }
  for (let r = 1; r < BOARD_SIZE; r++) { walk(r, 0, 1, 1); walk(r, BOARD_SIZE - 1, 1, -1); }
  return lines;
})();

type Totals = { black: number; white: number; black4: number; white4: number };

// 喺一條線上面逐個 5 格窗口計分；有齊黑白兩色嘅窗口冇得連五，唔計
function scoreLine(board: Board, line: [number, number][], totals: Totals) {
  for (let s = 0; s + 5 <= line.length; s++) {
    let black = 0, white = 0;
    for (let k = s; k < s + 5; k++) {
      const [r, c] = line[k];
      if (board[r][c] === 1) black++;
      else if (board[r][c] === 2) white++;
    }
    if (black && !white) { totals.black += SCORES[black]; if (black === 4) totals.black4++; }
    else if (white && !black) { totals.white += SCORES[white]; if (white === 4) totals.white4++; }
  }
}

function scanBoard(board: Board): Totals {
  const totals: Totals = { black: 0, white: 0, black4: 0, white4: 0 };
  for (const line of LINES) scoreLine(board, line, totals);
  return totals;
}

export function evaluateBoard(board: Board, player: Player): number {
  const s = scanBoard(board);
  return player === 1 ? s.black - s.white : s.white - s.black;
}

// 輪到 player 落子時嘅分數（搜尋到盡頭先用）
function evaluate(board: Board, player: Player): number {
  const s = scanBoard(board);
  const my = player === 1 ? s.black : s.white, opp = player === 1 ? s.white : s.black;
  const my4 = player === 1 ? s.black4 : s.white4, opp4 = player === 1 ? s.white4 : s.black4;
  if (my4) return WIN / 2;        // 輪到自己，有四就即刻連五
  if (opp4 >= 2) return -WIN / 2; // 對手有兩個連五點，擋唔晒
  return my - opp * 0.8;          // 自己先手，有少少優勢
}

// 喺 (row,col) 落子有幾好？連珠黑棋禁手位回傳 -1
const SCORE_FIVE = 1e7;
const SCORE_WIN4 = 1e6; // 活四、四四、四三
const SCORE_D3 = 1e5;   // 雙活三

function scoreMove(board: Board, row: number, col: number, player: Player, renju: boolean): number {
  const exact = renju && player === 1;
  let fours = 0, openThrees = 0, threes = 0, twos = 0, weak = 0;
  let straight = false, overline = false;
  for (const [dx, dy] of DIRECTIONS) {
    const d = analyzeDirection(board, row, col, player, dx, dy, exact);
    switch (d.pattern) {
      case "five": return SCORE_FIVE;
      case "overline": overline = true; break;
      case "open-four":
      case "four": fours += d.fours; if (d.straight) straight = true; break;
      case "open-three": openThrees++; break;
      case "three": threes++; break;
      case "two": twos++; break;
    }
    weak += d.weak;
  }
  if (exact && (overline || fours >= 2 || openThrees >= 2)) return -1;
  if (straight || fours >= 2 || (fours && openThrees)) return SCORE_WIN4;
  if (openThrees >= 2) return SCORE_D3;
  return fours * 6000 + openThrees * 5000 + threes * 400 + twos * 60 + weak;
}

// ---------- Candidate Moves ----------
export function getCandidateMoves(board: Board, radius = 2): [number, number][] {
  const candidates: [number, number][] = [];
  const seen = new Set<number>();
  let hasStone = false;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === 0) continue;
      hasStone = true;
      for (let dr = -radius; dr <= radius; dr++) {
        for (let dc = -radius; dc <= radius; dc++) {
          const nr = r + dr, nc = c + dc;
          if (isValidMove(board, nr, nc) && !seen.has(nr * BOARD_SIZE + nc)) {
            seen.add(nr * BOARD_SIZE + nc);
            candidates.push([nr, nc]);
          }
        }
      }
    }
  }
  if (!hasStone) return [[Math.floor(BOARD_SIZE / 2), Math.floor(BOARD_SIZE / 2)]];
  return candidates;
}

function firstEmpty(board: Board): [number, number] | null {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === 0) return [r, c];
    }
  }
  return null;
}

// ---------- Rule-based 擋棋 ----------
// 唔使真係落子；連珠黑棋要啱啱五粒先算贏
function wouldWin(board: Board, row: number, col: number, player: Player, renju = false): boolean {
  const exact = renju && player === 1;
  for (const [dx, dy] of DIRECTIONS) {
    const length = getLineLength(board, row, col, player, dx, dy);
    if (exact ? length === 5 : length >= 5) return true;
  }
  return false;
}

function findWinningMove(board: Board, player: Player, renju = false): [number, number] | null {
  const moves = getCandidateMoves(board, 1);
  for (const [r, c] of moves) {
    if (wouldWin(board, r, c, player, renju)) return [r, c];
  }
  return null;
}

function findBlockingMove(board: Board, opponent: Player, renju = false): [number, number] | null {
  return findWinningMove(board, opponent, renju);
}

type MoveList = { moves: [number, number][]; win?: [number, number]; lost?: boolean };

// 揀出值得搜尋嘅位，由好到差排好
function getOrderedMoves(board: Board, player: Player, renju: boolean, width: number): MoveList {
  const opponent: Player = player === 1 ? 2 : 1;
  const scored: { move: [number, number]; attack: number; defend: number }[] = [];
  for (const [r, c] of getCandidateMoves(board)) {
    const attack = scoreMove(board, r, c, player, renju);
    // 1. 自己可以連五 → 即刻贏
    if (attack >= SCORE_FIVE) return { moves: [[r, c]], win: [r, c] };
    scored.push({ move: [r, c], attack, defend: scoreMove(board, r, c, opponent, renju) });
  }

  // 2. 對手下一步可以連五 → 一定要擋（黑棋唔可以擋喺禁手位）
  const blocks = scored.filter((m) => m.defend >= SCORE_FIVE);
  if (blocks.length) {
    const playable = blocks.filter((m) => m.attack >= 0);
    return { moves: playable.map((m) => m.move), lost: playable.length === 0 };
  }

  let pool = scored.filter((m) => m.attack >= 0); // 剔走禁手位

  // 3. 自己有必勝形（活四、四四、四三）
  const winning = pool.find((m) => m.attack >= SCORE_WIN4);
  if (winning) return { moves: [winning.move] };

  // 4. 對手有活三（下一步可以變活四）→ 只考慮擋佢，或者自己沖四
  if (pool.some((m) => m.defend >= SCORE_WIN4)) pool = pool.filter((m) => m.defend >= 5000 || m.attack >= 6000);

  // 5. 攻 + 守分數排序，取頭 width 個
  pool.sort((a, b) => b.attack + b.defend - (a.attack + a.defend));
  return { moves: pool.slice(0, width).map((m) => m.move) };
}

// 連續沖四必勝（VCF）：回傳第一步，搵唔到就 null
function findVcf(board: Board, player: Player, renju: boolean, depth: number, deadline: number): [number, number] | null {
  if (depth <= 0 || performance.now() > deadline) return null;
  const opponent: Player = player === 1 ? 2 : 1;

  const winMove = findWinningMove(board, player, renju);
  if (winMove) return winMove;
  if (findBlockingMove(board, opponent, renju)) return null; // 對手有四，冇得再沖

  for (const [r, c] of getCandidateMoves(board, 1)) {
    if (scoreMove(board, r, c, player, renju) < 6000) continue; // 唔係沖四
    board[r][c] = player;
    const wins: [number, number][] = [];
    for (const [dx, dy] of DIRECTIONS) {
      for (let k = -4; k <= 4; k++) {
        const nr = r + dx * k, nc = c + dy * k;
        if (k === 0 || !isValidMove(board, nr, nc)) continue;
        if (!wins.some(([x, y]) => x === nr && y === nc) && wouldWin(board, nr, nc, player, renju)) wins.push([nr, nc]);
      }
    }
    let found = wins.length >= 2;
    if (wins.length === 1) {
      const [br, bc] = wins[0];
      if (renju && opponent === 1 && scoreMove(board, br, bc, opponent, renju) < 0) found = true; // 黑棋擋位係禁手
      else if (!wouldWin(board, br, bc, opponent, renju)) {
        board[br][bc] = opponent;
        found = findVcf(board, player, renju, depth - 1, deadline) !== null;
        board[br][bc] = 0;
      }
    }
    board[r][c] = 0;
    if (found) return [r, c];
  }
  return null;
}

// ---------- Minimax + Alpha-Beta ----------
const WIN = 1e9;

type SearchContext = { renju: boolean; width: number; deadline: number; nodes: number; timeout: boolean };

function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  ctx: SearchContext,
  ply: number
): number {
  const opponent: Player = aiPlayer === 1 ? 2 : 1;

  // 夠鐘就停（每 128 個節點睇一次時間）
  if ((++ctx.nodes & 127) === 0 && performance.now() > ctx.deadline) ctx.timeout = true;
  if (ctx.timeout) return 0;
  if (depth === 0) return isMaximizing ? evaluate(board, aiPlayer) : -evaluate(board, opponent);

  const { moves, win, lost } = getOrderedMoves(board, isMaximizing ? aiPlayer : opponent, ctx.renju, ctx.width);
  // 減 ply：越快贏越好、越遲輸越好
  if (win) return isMaximizing ? WIN - ply : -(WIN - ply);  // 輪到嗰方即刻連五
  if (lost) return isMaximizing ? -(WIN - ply) : WIN - ply; // 輪到嗰方擋唔到
  if (moves.length === 0) return 0;

  let best = isMaximizing ? -Infinity : Infinity;

  if (isMaximizing) {
    for (const [r, c] of moves) {
      board[r][c] = aiPlayer;
      const score = minimax(board, depth - 1, alpha, beta, false, aiPlayer, ctx, ply + 1);
      board[r][c] = 0;
      if (ctx.timeout) return 0;
      best = Math.max(best, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
  } else {
    for (const [r, c] of moves) {
      board[r][c] = opponent;
      const score = minimax(board, depth - 1, alpha, beta, true, aiPlayer, ctx, ply + 1);
      board[r][c] = 0;
      if (ctx.timeout) return 0;
      best = Math.min(best, score);
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
  }

  return best;
}

// ---------- AI 力度 ----------
// 記錄今步實際搜尋咗幾深（唔計 VCF）
export type SearchSource = "win" | "forced" | "random" | "heuristic" | "vcf" | "search" | "fallback";
export type SearchInfo = {
  source: SearchSource; // 呢步點樣揀出嚟
  depth: number;        // 完整搜尋完嘅層數（唔計 VCF）
  maxDepth: number;     // 呢個難度最多搜幾層
  nodes: number;        // minimax 節點數
  timeMs: number;       // 用咗幾多毫秒
};

// ---------- 主 AI 函數 ----------
export function findBestMove(
  board: Board,
  aiPlayer: Player,
  difficulty: Difficulty = "Medium",
  opts: { renju?: boolean; info?: SearchInfo } = {}
): [number, number] | null {
  const renju = !!opts.renju;
  const start = performance.now();
  board = cloneBoard(board); // 搜尋會暫時落子，用副本

  const depthMap: Record<Difficulty, number> = { Easy: 0, Medium: 1, Hard: 6};
  const randomnessMap: Record<Difficulty, number> = { Easy: 0.3, Medium: 0, Hard: 0 };
  const maxCandidatesMap: Record<Difficulty, number> = { Easy: 5, Medium: 14, Hard: 14 };
  const timeMap: Record<Difficulty, number> = { Easy: 200, Medium: 500, Hard: 1500 }; // 毫秒
  const vcfDepthMap: Record<Difficulty, number> = { Easy: 1, Medium: 6, Hard: 12 };

  const maxDepth = depthMap[difficulty];
  // 填返 info 畀 UI 用（冇傳 info 就乜都唔做）
  const report = (source: SearchSource, depth = 0, nodes = 0) => {
    if (opts.info) Object.assign(opts.info, { source, depth, maxDepth, nodes, timeMs: Math.round(performance.now() - start) });
  };

  // 贏、擋連五、必勝形、擋活三：全部喺 getOrderedMoves 處理
  const { moves, win } = getOrderedMoves(board, aiPlayer, renju, maxCandidatesMap[difficulty]);
  if (win) { report("win"); return win; }
  if (moves.length === 0) { report("fallback"); return firstEmpty(board); }
  if (moves.length === 1) { report("forced"); return moves[0]; }

  // Easy：一半機會喺頭 5 個好位隨機揀
  if (Math.random() < randomnessMap[difficulty]) {
    report("random");
    return moves[Math.floor(Math.random() * moves.length)];
  }
  if (difficulty === "Easy") { report("heuristic"); return moves[0]; }

  // 連續沖四必勝（唔計入 AI 力度）
  const forced = findVcf(board, aiPlayer, renju, vcfDepthMap[difficulty], start + timeMap[difficulty] * 0.3);
  if (forced) { report("vcf"); return forced; }

  // 逐層加深，夠鐘就用上一層完整搜尋嘅結果
  const ctx: SearchContext = { renju, width: 10, deadline: start + timeMap[difficulty], nodes: 0, timeout: false };
  let topMoves = moves;
  let bestMove: [number, number] = topMoves[0];
  let completedDepth = 0; // 最後一層完整搜完嘅深度

  for (let depth = 1; depth <= maxDepth; depth++) {
    let bestScore = -Infinity;
    let depthBest: [number, number] = topMoves[0];
    const scored: { move: [number, number]; score: number }[] = [];

    for (const [r, c] of topMoves) {
      board[r][c] = aiPlayer;
      const score = minimax(board, depth - 1, bestScore, Infinity, false, aiPlayer, ctx, 1);
      board[r][c] = 0;
      if (ctx.timeout) break;
      scored.push({ move: [r, c], score });
      if (score > bestScore) { bestScore = score; depthBest = [r, c]; }
    }

    if (ctx.timeout) break; // 呢層未搜完，唔計
    bestMove = depthBest;
    completedDepth = depth;
    if (bestScore >= WIN / 2) break; // 已經搵到必勝
    scored.sort((a, b) => b.score - a.score);
    topMoves = scored.map((s) => s.move);
  }

  report("search", completedDepth, ctx.nodes);
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

// 👇 只報告棋盤上「已經存在」嘅威脅
//   "four"：下一步可以連五 → blocks = 連五點
//   "three"：已經有活三   → blocks = 會變成活四嘅位
export function detectThreats(board: Board, player: Player, renju = false): { level: ThreatLevel; blocks: number[] } {
  const exact = renju && player === 1;
  const moves = getCandidateMoves(board, 1);

  const fives = moves.filter(([r, c]) => wouldWin(board, r, c, player, renju));
  if (fives.length) return { level: "four", blocks: fives.map(([r, c]) => coordToIndex(r, c)) };

  const blocks: number[] = [];
  for (const [r, c] of moves) {
    if (exact && scoreMove(board, r, c, player, renju) < 0) continue; // 黑棋落唔到禁手位
    if (DIRECTIONS.some(([dx, dy]) => analyzeDirection(board, r, c, player, dx, dy, exact).straight)) {
      blocks.push(coordToIndex(r, c));
    }
  }
  return { level: blocks.length ? "three" : null, blocks };
}

// 👇 檢查特定玩家（AI）有冇「活三」或「四」嘅威脅
export function checkThreat(board: Board, targetPlayer: Player, renju = false): boolean {
  return detectThreats(board, targetPlayer, renju).level !== null;
}

export function hasFormedThreat(board: Board, player: Player, renju = false): boolean {
  return checkThreat(board, player, renju);
}

// 👇 計算雙方形勢分數（用於局勢評估）
export function getEvaluationScores(board: Board): { black: number, white: number } {
  const s = scanBoard(board);
  return { black: s.black, white: s.white };
}

// 👇 搵出要擋嘅關鍵位置（用於威脅提示）
export function findThreatPositions(board: Board, player: Player, renju = false): number[] {
  return detectThreats(board, player, renju).blocks;
}