import { useEffect, useMemo, useState } from "react"

import {
  createBoard,
  cloneBoard,
  checkWin,
  checkDraw,
  checkForbidden,
  findBestMove,
  indexToCoord,
  coordToLabel,
  type Board,
  type Player,
  type Difficulty,
  BOARD_SIZE,
} from "./game/logic";

type Lang = "zh" | "en"
type Theme = "light" | "dark"
type Page = "login" | "home" | "lessons" | "lesson" | "challenge" | "game" | "leaderboard" | "profile" | "settings"
type Modal = "signup" | "forgot" | "logout" | "setup" | "hint" | "undo" | "restart" | "leave" | "correct" | "incorrect" | "challengeFail" | "complete" | "record" | "gameOverWin" | "gameOverLose" | "gameOverDraw" | "forbidden" | null

const copy = {
  zh: {
    brand: "棋趣",
    shortBrand: "廣東話智慧五子棋",
    home: "主頁",
    teaching: "教學",
    play: "一般遊玩",
    renju: "連珠模式",
    leaderboard: "排行榜",
    records: "個人紀錄",
    settings: "設定",
    logout: "登出",
    welcome: "歡迎來到棋趣",
    loginIntro: "用廣東話輕鬆學識五子棋，由第一步開始，慢慢成為棋盤高手。",
    guest: "訪客登入",
    emailLogin: "電郵登入",
    google: "使用 Google 登入",
    facebook: "使用 Facebook 登入",
    email: "電郵地址",
    password: "密碼",
    signIn: "登入",
    forgot: "忘記密碼？",
    noAccount: "未有帳戶？",
    signup: "立即註冊",
    or: "或",
    heroEyebrow: "邊學 · 邊玩 · 邊進步",
    heroTitle: "落好每一步，\n學棋冇煩惱。",
    heroBody:
      "跟住熊貓阿棋廣東話講解，由基本規則到實戰陷阱，跟住自己嘅步伐掌握攻防策略。",
    startLearning: "開始學習",
    quickGame: "快速對弈",
    continue: "繼續",
    teachingTitle: "教學模式",
    teachingDesc: "循序漸進學習規則、攻防策略和實戰技巧。",
    freeTitle: "一般遊玩",
    freeDesc: "自由規則五子棋，挑戰 AI 或與朋友同場對弈。",
    renjuTitle: "Pro／連珠模式",
    renjuDesc: "進階規則挑戰，黑棋須避開三三、四四及長連。",
    chooseMode: "今天想玩邊個模式？",
    chooseModeSub: "選擇適合你嘅模式，Let's go!",
    progress: "學習進度",
    lessonsDone: "已完成 3 / 8 課",
    streak: "連續學習 4 日",
    createPrompt: "建立免費帳戶，永久保存學習進度同棋局紀錄。",
    createAccount: "建立帳戶",
    greeting: "早晨，棋友！",
    guestUser: "訪客棋友",
    guestTag: "訪客",
    lessonPath: "學習路線",
    lessonPathSub: "每課大約 3–5 分鐘，冇計時，跟住自己節奏學習。",
    cantoneseNarration: "廣東話語音教學",
    narrationOn: "語音講解已開啟",
    backHome: "返回主頁",
    completed: "完成咗",
    inProgress: "進行中",
    notStarted: "未開始",
    lesson: "第 4 課",
    openThree: "活三",
    openThreeText:
      "活三係一行連續三粒棋，兩邊都仲可以落子。對手通常要即刻防守。",
    instruction: "請喺發光位置落下黑棋，完成一個活三。",
    step: "步驟 2 / 3",
    previous: "上一課",
    next: "下一步",
    replay: "重播語音",
    backLessons: "返回教學目錄",
    hint: "提示",
    undo: "悔棋",
    exit: "離開教學",
    challenge: "棋局挑戰",
    challengeObjective: "請揾出可以阻止對手勝出嘅落子",
    challengeHint: "廣東話提示",
    moves: "步棋",
    turn: "輪到你",
    black: "黑棋",
    white: "白棋",
    you: "你",
    ai: "阿棋 AI",
    gameStatus: "對局進行中",
    gameInfo: "對局資料",
    mode: "模式",
    opponent: "對手",
    difficulty: "難度",
    timer: "每步時間",
    unlimited: "冇限時",
    moveHistory: "棋步紀錄",
    restart: "重新開始",
    forbiddenNote: "黑棋須遵守禁手規則",
    setupTitle: "設定新對局",
    setupRenjuTitle: "設定連珠對局",
    aiOpponent: "AI 對手",
    local: "本地雙人",
    firstMove: "先手",
    random: "隨機決定",
    playerFirst: "玩家先手",
    aiFirst: "AI 先手",
    seconds30: "30 秒",
    seconds60: "60 秒",
    hintsOn: "對局提示",
    startGame: "開始遊戲",
    startRenju: "開始連珠對局",
    cancel: "取消",
    rules: "連珠規則須知",
    rulesText:
      "黑棋唔可以下三三、四四及長連；白棋冇禁手。按本項目規則，五連優先於禁手判定。",
    localNote: "本地雙人對局不設計時及 AI 功能。",
    rankingTitle: "棋手排行榜",
    rankingSub: "與全港棋友切磋，睇吓今個星期邊個棋力最強。",
    overall: "總排行",
    weekly: "本週",
    friends: "好友",
    rank: "排名",
    player: "棋手",
    wins: "勝場",
    winRate: "勝率",
    winStreak: "連勝",
    yourRank: "你個排名",
    profileTitle: "個人紀錄",
    profileSub: "check下你嘅學習成果同近期棋局。",
    losses: "負",
    draws: "和",
    lessonsCompleted: "完成課堂",
    recentGames: "最近棋局",
    result: "結果",
    won: "勝出",
    lost: "落敗",
    draw: "和棋",
    forbiddenTitle: "禁手犯規！",
    forbiddenBody: "黑棋唔可以下三三、四四或長連。呢一步已經幫你取消，請再揀另一個位置。",
    accountSettings: "帳戶及聲音設定",
    settingsTitle: "偏好設定",
    settingsSub: "個人化你嘅學習及對弈體驗。",
    language: "介面語言",
    appearance: "外觀模式",
    light: "淺色模式",
    dark: "深色模式",
    boardStyle: "棋盤風格",
    wood: "原木",
    classic: "經典",
    minimal: "簡約",
    neon: "霓虹",
    sound: "音效",
    tts: "廣東話語音教學",
    ttsNote: "無論介面語言如何，廣東話教學語音均會保留。",
    save: "儲存設定",
    saved: "設定已儲存",
    name: "名稱",
    confirmPassword: "確認密碼",
    create: "建立帳戶",
    signupTitle: "加入棋趣",
    signupSub: "建立帳戶，save低你嘅學習進度。",
    forgotTitle: "重設密碼",
    sendLink: "發送重設連結",
    resetSent: "重設連結已發送，請check你email。",
    required: "請填寫所有欄位。",
    invalidEmail: "請輸入有效的電郵地址。",
    passwordMismatch: "兩次輸入的密碼不相同。",
    accountCreated: "帳戶已建立！歡迎加入棋趣。",
    logoutTitle: "確定要登出？",
    logoutBody: "登出後，你仍可隨時再次回來。",
    hintTitle: "阿棋小貼士",
    hintBody: "落喺 H8 可以形成活三，迫使對手防守。",
    gotIt: "知道了",
    undoTitle: "確定悔棋？",
    undoBody: "AI 對局會同時撤回你同 AI 的最後一步。",
    restartTitle: "重新開始對局？",
    restartBody: "目前嘅對局進度將會消失。",
    leaveTitle: "要離開對局嗎？",
    leaveBody: "離開後，目前嘅對局將會結束。",
    keepPlaying: "繼續對弈",
    leaveGame: "離開對局",
    correctTitle: "好棋！你啱咗啦！",
    correctBody: "你成功完成活三，對手下一步必須防守。",
    incorrectTitle: "差一點，再想想！",
    incorrectBody: "呢個位置未能連成活三。要留意棋子嘅頭尾都要保持開放。",
    challengeFailTitle: "已為你拆解棋局",
    challengeFailBody:
      "白棋嘅威脅喺 E8，黑棋必須立即封住呢個位置。你可以去一般遊玩熟習攻防策略先，再嚟挑戰。",
    tryAgain: "再試一次",
    showAnswer: "睇答案",
    finishTitle: "教學完成！",
    finishBody: "恭喜你完成兩個棋局挑戰，已掌握五子棋的基本攻防。",
    freePlay: "開始自由對弈",
    recordTitle: "對局摘要",
    duration: "用時 08:42",
    load: "載入更多",
    gameOverWinTitle: "恭喜你贏咗！",
    gameOverWinBody: "你成功打敗阿棋！要唔要再嚟一局？",
    gameOverLoseTitle: "阿棋贏咗呢局",
    gameOverLoseBody: "唔好灰心，再試一次一定會更好！",
    gameOverDrawTitle: "和局！",
    gameOverDrawBody: "勢均力敵，要唔要再嚟一局？",
    playAgain: "再玩一局",
    backToMain: "返回主頁",
  },
  en: {
    brand: "Gomoku Joy",
    shortBrand: "Cantonese Intelligent Gomoku",
    home: "Home",
    teaching: "Teaching",
    play: "Free Play",
    renju: "Renju",
    leaderboard: "Leaderboard",
    records: "Game Records",
    settings: "Settings",
    logout: "Log Out",
    welcome: "Welcome to Gomoku Joy",
    loginIntro:
      "Learn Gomoku naturally with Cantonese guidance, from your first move to confident play.",
    guest: "Continue as Guest",
    emailLogin: "Sign in with Email",
    google: "Sign in with Google",
    facebook: "Sign in with Facebook",
    email: "Email address",
    password: "Password",
    signIn: "Sign In",
    forgot: "Forgot password?",
    noAccount: "New here?",
    signup: "Create an account",
    or: "or",
    heroEyebrow: "LEARN · PLAY · IMPROVE",
    heroTitle: "Make every move\ncount.",
    heroBody:
      "Learn with Ah Kei the panda’s Cantonese guidance, from basic rules to tactical traps, at your own pace.",
    startLearning: "Start Learning",
    quickGame: "Quick Game",
    continue: "Continue",
    teachingTitle: "Teaching Mode",
    teachingDesc: "Learn rules, attack, defence and tactics step by step.",
    freeTitle: "Free Play",
    freeDesc: "Play free-rule Gomoku against AI or a friend beside you.",
    renjuTitle: "Pro / Renju Mode",
    renjuDesc: "Take on advanced rules where Black must avoid forbidden moves.",
    chooseMode: "How would you like to play?",
    chooseModeSub: "Choose a mode that suits you and begin anytime.",
    progress: "Learning progress",
    lessonsDone: "3 of 8 lessons completed",
    streak: "4-day learning streak",
    createPrompt:
      "Create a free account to keep your learning progress and game records.",
    createAccount: "Create Account",
    greeting: "Good morning, player!",
    guestUser: "Guest Player",
    guestTag: "Guest",
    lessonPath: "Your learning path",
    lessonPathSub:
      "Each lesson takes 3–5 minutes. There is no timer, so learn at your own pace.",
    cantoneseNarration: "Cantonese narration",
    narrationOn: "Voice guidance is on",
    backHome: "Back to Home",
    completed: "Completed",
    inProgress: "In progress",
    notStarted: "Not started",
    lesson: "Lesson 4",
    openThree: "Open Three",
    openThreeText:
      "An open three is a row of three stones with both ends free. Your opponent will usually need to defend at once.",
    instruction:
      "Place a black stone on the glowing point to complete an open three.",
    step: "Step 2 of 3",
    previous: "Previous Lesson",
    next: "Next",
    replay: "Replay Audio",
    backLessons: "Back to Lessons",
    hint: "Hint",
    undo: "Undo",
    exit: "Exit Lesson",
    challenge: "Board Challenge",
    challengeObjective:
      "Find the move that prevents your opponent from winning",
    challengeHint: "Cantonese Hint",
    moves: "moves",
    turn: "Your turn",
    black: "Black",
    white: "White",
    you: "You",
    ai: "Ah Kei AI",
    gameStatus: "Game in progress",
    gameInfo: "Game details",
    mode: "Mode",
    opponent: "Opponent",
    difficulty: "Difficulty",
    timer: "Move timer",
    unlimited: "Unlimited",
    moveHistory: "Move history",
    restart: "Restart",
    forbiddenNote: "Black must follow forbidden-move rules",
    setupTitle: "Set Up New Game",
    setupRenjuTitle: "Set Up Renju Game",
    aiOpponent: "AI Opponent",
    local: "Local 2-Player",
    firstMove: "First move",
    random: "Random",
    playerFirst: "Player First",
    aiFirst: "AI First",
    seconds30: "30 seconds",
    seconds60: "60 seconds",
    hintsOn: "Hints",
    startGame: "Start Game",
    startRenju: "Start Renju Game",
    cancel: "Cancel",
    rules: "Renju rules",
    rulesText:
      "Black cannot play double-three, double-four or overline. White has no forbidden moves. Under the project rules, five-in-a-row takes priority.",
    localNote: "Local 2-player games have no timer or AI features.",
    rankingTitle: "Player Leaderboard",
    rankingSub:
      "Play with the Hong Kong community and see who is strongest this week.",
    overall: "Overall",
    weekly: "Weekly",
    friends: "Friends",
    rank: "Rank",
    player: "Player",
    wins: "Wins",
    winRate: "Win rate",
    winStreak: "Streak",
    yourRank: "Your rank",
    profileTitle: "Game Records",
    profileSub: "Review your learning achievements and recent games.",
    losses: "Losses",
    draws: "Draws",
    forbiddenTitle: "Forbidden Move!",
    forbiddenBody: "Black cannot play double-three, double-four, or overline. This move has been cancelled. Please choose another position.",
    lessonsCompleted: "Lessons done",
    recentGames: "Recent games",
    result: "Result",
    won: "Won",
    lost: "Lost",
    draw: "Draw",
    accountSettings: "Account & sound settings",
    settingsTitle: "Preferences",
    settingsSub: "Personalise your learning and playing experience.",
    language: "Interface language",
    appearance: "Appearance",
    light: "Light Mode",
    dark: "Dark Mode",
    boardStyle: "Board style",
    wood: "Wood",
    classic: "Classic",
    minimal: "Minimalist",
    neon: "Neon",
    sound: "Sound effects",
    tts: "Cantonese teaching narration",
    ttsNote:
      "Cantonese narration remains available in either interface language.",
    save: "Save Settings",
    saved: "Settings saved",
    name: "Name",
    confirmPassword: "Confirm password",
    create: "Create Account",
    signupTitle: "Join Gomoku Joy",
    signupSub: "Create an account to save your learning progress.",
    forgotTitle: "Reset Password",
    sendLink: "Send Reset Link",
    resetSent: "Reset link sent. Please check your email.",
    required: "Please complete all fields.",
    invalidEmail: "Enter a valid email address.",
    passwordMismatch: "The passwords do not match.",
    accountCreated: "Account created. Welcome to Gomoku Joy!",
    logoutTitle: "Log out now?",
    logoutBody: "You can always come back and continue later.",
    hintTitle: "Ah Kei’s Hint",
    hintBody:
      "Play at H8 to form an open three and force your opponent to defend.",
    gotIt: "Got It",
    undoTitle: "Undo the last move?",
    undoBody:
      "In an AI game, your last move and the AI’s last move will both be undone.",
    restartTitle: "Restart this game?",
    restartBody: "Your current game progress will be lost.",
    leaveTitle: "Leave this game?",
    leaveBody: "The current game will end when you leave.",
    keepPlaying: "Continue Playing",
    leaveGame: "Leave Game",
    correctTitle: "Great move!",
    correctBody:
      "You completed an open three. Your opponent now has to defend.",
    incorrectTitle: "Nearly there—try again!",
    incorrectBody:
      "That point does not create an open three. Remember to keep both ends open.",
    challengeFailTitle: "Let’s break down the position",
    challengeFailBody:
      "White’s threat is at E8, so Black must block it immediately. Practise attack and defence in Free Play, then return for another try.",
    tryAgain: "Try Again",
    showAnswer: "Show Answer",
    finishTitle: "Tutorial Complete!",
    finishBody:
      "You passed both board challenges and mastered the foundations of Gomoku attack and defence.",
    freePlay: "Start Free Play",
    recordTitle: "Game Summary",
    duration: "Duration 08:42",
    load: "Load more",
    gameOverWinTitle: "You Win!",
    gameOverWinBody: "You defeated Ah Kei! Want to play again?",
    gameOverLoseTitle: "Ah Kei Wins",
    gameOverLoseBody: "Don't give up, try again!",
    gameOverDrawTitle: "It's a Draw!",
    gameOverDrawBody: "A close match. Want to play again?",
    playAgain: "Play Again",
    backToMain: "Back to Main",
  },
} as const

const iconPaths: Record<string, React.ReactNode> = {
  home: (
    <>
      <path d="M3 10.8 12 3l9 7.8" />
      <path d="M5.5 9.5V21h13V9.5M9 21v-7h6v7" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v17H7.5A3.5 3.5 0 0 0 4 22.5z" />
      <path d="M4 5.5v17M8 6h8M8 10h7" />
    </>
  ),
  play: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m10 8 6 4-6 4z" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 4h8v5a4 4 0 0 1-8 0zM10 13v4M14 13v4M7 21h10M9 17h6" />
      <path d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
    </>
  ),
  moon: <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  arrow: (
    <>
      <path d="m9 18 6-6-6-6" />
    </>
  ),
  back: (
    <>
      <path d="m15 18-6-6 6-6" />
    </>
  ),
  sound: (
    <>
      <path d="M5 10v4h3l4 4V6L8 10zM16 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 18h6M10 22h4M8.5 14.5A6 6 0 1 1 15.5 14.5L14 17h-4z" />
    </>
  ),
  undo: (
    <>
      <path d="m9 7-5 5 5 5" />
      <path d="M4 12h9a6 6 0 0 1 6 6" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 7v5h-5M4 17v-5h5" />
      <path d="M6.1 8a7 7 0 0 1 11.5-2.6L20 8M4 16l2.4 2.6A7 7 0 0 0 17.9 16" />
    </>
  ),
  flag: (
    <>
      <path d="M5 22V3M5 4h12l-2 4 2 4H5" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  lock: (
    <>
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  close: (
    <>
      <path d="m6 6 12 12M18 6 6 18" />
    </>
  ),
  menu: <path d="M5 7h14M5 12h14M5 17h14" />,
  logout: (
    <>
      <path d="M10 5H5v14h5M14 8l4 4-4 4M9 12h9" />
    </>
  ),
}

type IconProps = { name: string; size?: number }

function Icon({ name, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name]}
    </svg>
  )
}

function Panda({ small = false }: { small?: boolean }) {
  return (
    <div className={`panda ${small ? "panda-small" : ""}`} aria-label="Ah Kei panda mascot">
      <div className="panda-ear ear-left" />
      <div className="panda-ear ear-right" />
      <div className="panda-head">
        <div className="panda-eye eye-left"><i style={{ paddingLeft: "2px" }} /></div>
        <div className="panda-eye eye-right"><i style={{ paddingLeft: "2px" }} /></div>
        <div className="panda-muzzle"><i /></div>
      </div>
      <div className="panda-body"><div className="panda-stone" /></div>
    </div>
  )
}

function Logo({ lang }: { lang: Lang }) {
  const t = copy[lang]
  return (
    <div className="logo-wrap">
      <div className="logo-mark" aria-hidden="true"><i /><b /><span /></div>
      <div className="logo-text"><strong>{t.brand}</strong><small>{t.shortBrand}</small></div>
    </div>
  )
}

function App() {
  const [lang, setLang] = useState<Lang>(() => sessionStorage.getItem("gomoku-lang") as Lang || "zh")
  const [theme, setTheme] = useState<Theme>(() => sessionStorage.getItem("gomoku-theme") as Theme || "light")
  const [page, setPage] = useState<Page>("login")
  const [modal, setModal] = useState<Modal>(null)
  const [toast, setToast] = useState("")
  const [renju, setRenju] = useState(false)
  const [lessonMoves, setLessonMoves] = useState<number[]>([111, 112])
  const [gameMoves, setGameMoves] = useState<number[]>([112, 97, 113, 98, 127, 83])
  const [showPassword, setShowPassword] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [error, setError] = useState("")
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [setupType, setSetupType] = useState<"ai" | "local">("ai")
  const [difficulty, setDifficulty] = useState("Medium")
  const [firstMove, setFirstMove] = useState("random")
  const [timer, setTimer] = useState("unlimited")
  const [boardStyle, setBoardStyle] = useState("wood")
    const [hintsEnabled, setHintsEnabled] = useState(true)
  const [gameOverResult, setGameOverResult] = useState<"win" | "lose" | "draw" | null>(null)
  const [gameKey, setGameKey] = useState(0)
  const t = copy[lang]

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    sessionStorage.setItem("gomoku-theme", theme)
    sessionStorage.setItem("gomoku-lang", lang)
  }, [theme, lang])

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(""), 2800)
    return () => window.clearTimeout(id)
  }, [toast])

  const navigate = (next: Page) => {
    setPage(next)
    setModal(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const openSetup = (isRenju: boolean) => {
    setRenju(isRenju)
    setModal("setup")
  }

  const startGame = () => {
    setGameOverResult(null)
    setGameKey((k) => k + 1) // 👈 強制 Game component 重新載入
    navigate("game")
  }

  const signIn = () => {
    if (!loginEmail || !loginPassword) { setError(t.required); return }
    if (!loginEmail.includes("@")) { setError(t.invalidEmail); return }
    setError("")
    navigate("home")
  }

  return (
    <div className="app-shell">
      {page === "login" ? (
        <LoginPage
          lang={lang} theme={theme} setLang={setLang} setTheme={setTheme}
          email={loginEmail} password={loginPassword}
          setEmail={setLoginEmail} setPassword={setLoginPassword}
          showPassword={showPassword} setShowPassword={setShowPassword}
          error={error} signIn={signIn} guest={() => navigate("home")} openModal={setModal}
        />
      ) : (
        <>
          <Header page={page} lang={lang} theme={theme} setLang={setLang} setTheme={setTheme} navigate={navigate} openModal={setModal} openSetup={openSetup} />
          <main>
            {page === "home" && <Home lang={lang} navigate={navigate} openSetup={openSetup} openModal={setModal} />}
            {page === "lessons" && <Lessons lang={lang} navigate={navigate} />}
            {page === "lesson" && <Lesson lang={lang} navigate={navigate} moves={lessonMoves} setMoves={setLessonMoves} audioPlaying={audioPlaying} setAudioPlaying={setAudioPlaying} openModal={setModal} />}
            {page === "challenge" && <Challenge lang={lang} navigate={navigate} openModal={setModal} />}
            {page === "game" && (
              <Game
                key={gameKey}
                lang={lang} 
                renju={renju} 
                difficulty={difficulty} 
                timer={timer}
                setupType={setupType}
                boardStyle={boardStyle} 
                openModal={setModal}
                hintsEnabled={hintsEnabled}
                onGameOver={(result) => {
                  setGameOverResult(result)
                  setModal(result === "win" ? "gameOverWin" : result === "lose" ? "gameOverLose" : "gameOverDraw")
                }}
              />
            )}
            {page === "leaderboard" && <Leaderboard lang={lang} navigate={navigate} />}
            {page === "profile" && <Profile lang={lang} openModal={setModal} navigate={navigate} />}
            {page === "settings" && <Settings lang={lang} theme={theme} setLang={setLang} setTheme={setTheme} boardStyle={boardStyle} setBoardStyle={setBoardStyle} navigate={navigate} saved={() => setToast(t.saved)} />}
          </main>
          <MobileNav page={page} lang={lang} navigate={navigate} openSetup={openSetup} />
        </>
      )}

      {modal && (
        <ModalLayer
          modal={modal} lang={lang} close={() => setModal(null)} navigate={navigate}
          notify={setToast} renju={renju} setupType={setupType} setSetupType={setSetupType}
          difficulty={difficulty} setDifficulty={setDifficulty} firstMove={firstMove}
          setFirstMove={setFirstMove} timer={timer} setTimer={setTimer}
          startGame={startGame} logout={() => navigate("login")}
          undo={() => { setGameMoves((m) => m.slice(0, -2)); setModal(null) }}
          hintsEnabled={hintsEnabled}
          setHintsEnabled={setHintsEnabled}
        />
      )}
      {toast && <div className="toast" role="status"><span className="toast-check"><Icon name="check" size={16} /></span>{toast}</div>}
    </div>
  )
}

function Header({ page, lang, theme, setLang, setTheme, navigate, openModal, openSetup }: {
  page: Page; lang: Lang; theme: Theme; setLang: (l: Lang) => void; setTheme: (t: Theme) => void;
  navigate: (p: Page) => void; openModal: (m: Modal) => void; openSetup: (r: boolean) => void;
}) {
  const t = copy[lang]
  const nav = [["home", t.home], ["lessons", t.teaching], ["play", t.play], ["renju", t.renju], ["leaderboard", t.leaderboard]] as const
  return (
    <header className="site-header">
      <button className="logo-button" onClick={() => navigate("home")} aria-label={t.home}><Logo lang={lang} /></button>
      <nav className="desktop-nav" aria-label="Main navigation">
        {nav.map(([id, label]) => (
          <button key={id} className={page === id || (id === "lessons" && ["lesson", "challenge"].includes(page)) ? "active" : ""}
            onClick={() => id === "play" ? openSetup(false) : id === "renju" ? openSetup(true) : navigate(id as Page)}>
            {label}
          </button>
        ))}
      </nav>
      <div className="header-actions">
        <LanguageControl lang={lang} setLang={setLang} />
        <button className="icon-button" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={theme === "light" ? t.dark : t.light}>
          <Icon name={theme === "light" ? "moon" : "sun"} />
        </button>
        <div className="account-menu">
          <button className="avatar-button" onClick={() => navigate("profile")} aria-label={t.records} aria-haspopup="menu">
            <span className="avatar"><Panda small /></span>
            <span className="avatar-copy"><b>{t.guestUser}</b><small>{t.guestTag}</small></span>
          </button>
          <div className="account-dropdown" role="menu">
            <button className="account-dropdown-item" role="menuitem" onClick={() => openModal("logout")}><Icon name="logout" size={18} />{t.logout}</button>
          </div>
        </div>
        <button className="icon-button more-button" onClick={() => navigate("settings")} aria-label={t.settings}><Icon name="menu" size={18} /></button>
      </div>
    </header>
  )
}

function LanguageControl({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="language-control">
      <Icon name="globe" size={17} />
      <select value={lang} onChange={(e) => setLang(e.target.value as Lang)} aria-label="Language">
        <option value="zh">繁體中文</option>
        <option value="en">English</option>
      </select>
    </div>
  )
}

function LoginPage(props: {
  lang: Lang; theme: Theme; setLang: (l: Lang) => void; setTheme: (t: Theme) => void;
  email: string; password: string; setEmail: (s: string) => void; setPassword: (s: string) => void;
  showPassword: boolean; setShowPassword: (v: boolean) => void; error: string;
  signIn: () => void; guest: () => void; openModal: (m: Modal) => void;
}) {
  const t = copy[props.lang]
  return (
    <div className="login-page">
      <div className="login-top">
        <Logo lang={props.lang} />
        <div className="header-actions">
          <LanguageControl lang={props.lang} setLang={props.setLang} />
          <button className="icon-button" onClick={() => props.setTheme(props.theme === "light" ? "dark" : "light")} aria-label={props.theme === "light" ? t.dark : t.light}>
            <Icon name={props.theme === "light" ? "moon" : "sun"} />
          </button>
        </div>
      </div>
      <div className="login-layout">
        <section className="login-art">
          <div className="art-grid" />
          <div className="mascot-stage">
            <div className="speech-card">
              <span>廣東話語音</span>
              <b>「捉緊呢個機會，落喺中間！」{"\u00A0\u00A0"}</b>
              <i className="audio-wave">▮ ▮▮ ▮▮▮ ▮▮ ▮</i>
            </div>
            <Panda />
          </div>
          <div className="art-copy">
            <span className="eyebrow">{t.heroEyebrow}</span>
            <h1>{t.heroTitle.split("\n").map((x) => (<span key={x}>{x}</span>))}</h1>
            <p>{t.loginIntro}</p>
          </div>
          <div className="floating-stone stone-a" />
          <div className="floating-stone stone-b light" />
          <div className="floating-stone stone-c" />
        </section>
        <section className="login-panel">
          <div className="login-card">
            <div className="mobile-logo"><Logo lang={props.lang} /></div>
            <span className="eyebrow accent">{t.welcome}</span>
            <h2>{t.emailLogin}</h2>
            <p>{t.loginIntro}</p>
            <button className="button button-guest" onClick={props.guest}>
              <span className="guest-symbol"><Icon name="user" size={18} /></span>{t.guest}<Icon name="arrow" size={18} />
            </button>
            <div className="divider"><span>{t.or}</span></div>
            <div className="social-row">
              <button className="button button-social"><b className="google-g">G</b>{t.google}</button>
              <button className="button button-social"><b className="facebook-f">f</b>{t.facebook}</button>
            </div>
            <label className="field-label">
              {t.email}
              <span className="input-wrap">
                <Icon name="user" size={18} />
                <input value={props.email} onChange={(e) => props.setEmail(e.target.value)} placeholder="player@example.com" />
              </span>
            </label>
            <label className="field-label">
              {t.password}
              <span className="input-wrap">
                <Icon name="lock" size={18} />
                <input value={props.password} onChange={(e) => props.setPassword(e.target.value)} type={props.showPassword ? "text" : "password"} placeholder="••••••••" />
                <button onClick={() => props.setShowPassword(!props.showPassword)} aria-label="Show password"><Icon name="eye" size={18} /></button>
              </span>
            </label>
            {props.error && <div className="form-error">{props.error}</div>}
            <button className="text-link forgot-link" onClick={() => props.openModal("forgot")}>{t.forgot}</button>
            <button className="button button-primary button-full" onClick={props.signIn}>{t.signIn}<Icon name="arrow" size={18} /></button>
            <p className="signup-line">{t.noAccount} <button className="text-link" onClick={() => props.openModal("signup")}>{t.signup}</button></p>
          </div>
        </section>
      </div>
    </div>
  )
}

function Home({ lang, navigate, openSetup, openModal }: { lang: Lang; navigate: (p: Page) => void; openSetup: (r: boolean) => void; openModal: (m: Modal) => void }) {
  const t = copy[lang]
  const cards = [
    { type: "learn", n: "01", title: t.teachingTitle, desc: t.teachingDesc, action: t.continue, onClick: () => navigate("lessons"), icon: "book" },
    { type: "free", n: "02", title: t.freeTitle, desc: t.freeDesc, action: t.quickGame, onClick: () => openSetup(false), icon: "play" },
    { type: "pro", n: "03", title: t.renjuTitle, desc: t.renjuDesc, action: t.startGame, onClick: () => openSetup(true), icon: "trophy" },
  ]
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">{t.heroEyebrow}</span>
          <h1>{t.heroTitle.split("\n").map((x) => (<span key={x}>{x}</span>))}</h1>
          <p>{t.heroBody}</p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={() => navigate("lessons")}><Icon name="book" />{t.startLearning}</button>
            <button className="button button-secondary" onClick={() => openSetup(false)}><Icon name="play" />{t.quickGame}</button>
          </div>
          <div className="hero-meta">
            <div><b>3/8</b><span>{t.progress}</span></div>
            <i />
            <div><b>4</b><span>{t.streak}</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="board-sample">
            {Array.from({ length: 49 }, (_, i) => (<i key={i} className={[10, 17, 24].includes(i) ? "black" : [11, 18].includes(i) ? "white" : ""} />))}
          </div>
          <div className="mascot-home"><Panda /></div>
          <div className={`tip-bubble tip-bubble-${lang}`}>
            <Icon name="sound" size={26} />
            <span className="tip-copy"><strong>{t.cantoneseNarration}</strong><b>{t.narrationOn}</b></span>
          </div>
        </div>
      </section>
      <section className="content-section">
        <div className="section-heading">
          <div><span className="eyebrow accent">{t.greeting}</span><h2>{t.chooseMode}</h2><p>{t.chooseModeSub}</p></div>
        </div>
        <div className="mode-grid">
          {cards.map((card) => (
            <article className={`mode-card ${card.type}`} key={card.type}>
              <div className="card-top"><span className="mode-icon"><Icon name={card.icon} size={27} /></span><small>{card.n}</small></div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
              {card.type === "learn" && <div className="mini-progress"><span><i style={{ width: "38%" }} /></span><b>38%</b></div>}
              {card.type === "pro" && <div className="rule-pills"><span>{lang === "zh" ? "三三" : "Double three"}</span><span>{lang === "zh" ? "四四" : "Double four"}</span><span>{lang === "zh" ? "長連" : "Overline"}</span></div>}
              <button className="card-link" onClick={card.onClick}>{card.action}<span><Icon name="arrow" size={17} /></span></button>
            </article>
          ))}
        </div>
        <div className="quick-grid">
          <button className="quick-card" onClick={() => navigate("leaderboard")}><span><Icon name="trophy" /></span><div><b>{t.leaderboard}</b><small>#24 · {t.yourRank}</small></div><Icon name="arrow" /></button>
          <button className="quick-card" onClick={() => navigate("profile")}><span><Icon name="user" /></span><div><b>{t.records}</b><small>12 {t.moves} · 67% {t.winRate}</small></div><Icon name="arrow" /></button>
          <button className="quick-card" onClick={() => navigate("settings")}><span><Icon name="settings" /></span><div><b>{t.settings}</b><small>{t.accountSettings}</small></div><Icon name="arrow" /></button>
        </div>
        <div className="account-banner">
          <div className="mini-panda"><Panda small /></div>
          <div><b>{t.createPrompt}</b><span>{t.ttsNote}</span></div>
          <button className="button button-primary" onClick={() => openModal("signup")}>{t.createAccount}</button>
        </div>
      </section>
    </div>
  )
}

const lessonData = {
  zh: ["棋盤與棋子", "基本規則", "連五獲勝", "活三", "沖四", "阻擋對手", "簡單陷阱", "棋局挑戰"],
  en: ["The Board and Stones", "Basic Rules", "Winning with Five in a Row", "Open Three", "Rush Four", "Blocking the Opponent", "Simple Traps", "Board Challenges"],
}

function Lessons({ lang, navigate }: { lang: Lang; navigate: (p: Page) => void }) {
  const t = copy[lang]
  return (
    <div>
      <PageIntro eyebrow={t.teachingTitle} title={t.lessonPath} body={t.lessonPathSub} back={t.backHome} onBack={() => navigate("home")}>
        <div className="audio-chip"><Icon name="sound" size={18} /><span><b>{t.cantoneseNarration}</b><small>{t.narrationOn}</small></span><i /></div>
      </PageIntro>
      <section className="content-section lessons-section">
        <div className="progress-panel">
          <div className="progress-ring"><b>38%</b></div>
          <div><span>{t.progress}</span><b>{t.lessonsDone}</b><small>{t.streak}</small></div>
          <div className="progress-line"><i /></div>
        </div>
        <div className="lesson-list">
          {lessonData[lang].map((name, i) => {
            const status = i < 3 ? "done" : i === 3 ? "current" : "locked"
            return (
              <button className={`lesson-row ${status}`} key={name} onClick={() => status !== "locked" && navigate(i === 7 ? "challenge" : "lesson")}>
                <span className="lesson-number">{status === "done" ? <Icon name="check" /> : i + 1}</span>
                <span className="lesson-copy"><small>{lang === "zh" ? `第 ${i + 1} 課` : `LESSON ${i + 1}`}</small><b>{name}</b></span>
                <span className={`status-pill ${status}`}>{status === "done" ? t.completed : status === "current" ? t.inProgress : t.notStarted}</span>
                <span className="row-arrow">{status === "locked" ? <Icon name="lock" size={18} /> : <Icon name="arrow" />}</span>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function PageIntro({ eyebrow, title, body, back, onBack, children }: { eyebrow: string; title: string; body: string; back: string; onBack: () => void; children?: React.ReactNode }) {
  return (
    <section className="page-intro">
      <div className="content-section">
        <button className="back-link" onClick={onBack}><Icon name="back" size={18} />{back}</button>
        <div className="intro-row">
          <div><span className="eyebrow accent">{eyebrow}</span><h1>{title}</h1><p>{body}</p></div>
          {children}
        </div>
      </div>
    </section>
  )
}

function GomokuBoard({ board, onMove, highlight, lastMove, hintMove, currentPlayer, style = "wood" }: { 
  board: Board; onMove?: (i: number) => void; highlight?: number; lastMove?: number; hintMove?: number | null; currentPlayer?: Player; style?: string; 
}) {
  return (
    <div className={`gomoku-board ${style}`} role="grid" aria-label="15 by 15 Gomoku board">
      {Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, i) => {
        const row = Math.floor(i / BOARD_SIZE)
        const col = i % BOARD_SIZE
        const cell = board[row][col]
        const stone = cell === 1 ? "black" : cell === 2 ? "white" : ""
        return (
          <button
            key={i}
            className={`intersection ${stone} ${highlight === i ? "highlight" : ""}`}
            onClick={() => !cell && onMove?.(i)}
            aria-label={`${String.fromCharCode(65 + col)}${BOARD_SIZE - row} ${stone}`}
          >
            {stone && <i>{lastMove === i ? <b /> : null}</i>}
            {!stone && hintMove === i && (
              <span className={`hint-stone ${currentPlayer === 1 ? "black" : "white"}`} />
            )}
          </button>
        )
      })}
    </div>
  )
}

function Lesson(props: { lang: Lang; navigate: (p: Page) => void; moves: number[]; setMoves: React.Dispatch<React.SetStateAction<number[]>>; audioPlaying: boolean; setAudioPlaying: (v: boolean) => void; openModal: (m: Modal) => void; }) {
  const t = copy[props.lang]
  const board = useMemo(() => {
    const b = createBoard()
    props.moves.forEach((idx, i) => { const [r, c] = indexToCoord(idx); b[r][c] = (i % 2 === 0 ? 1 : 2) as Player })
    return b
  }, [props.moves])
  const place = (i: number) => { props.setMoves((m) => [...m, i]); props.openModal(i === 113 ? "correct" : "incorrect") }
  return (
    <div>
      <div className="lesson-topbar">
        <button className="back-link" onClick={() => props.navigate("lessons")}><Icon name="back" />{t.backLessons}</button>
        <div className="step-bar"><span><i /></span><b>{t.step}</b></div>
        <button className="text-link danger" onClick={() => props.openModal("leave")}>{t.exit}</button>
      </div>
      <div className="game-layout">
        <section className="board-area">
          <div className="board-heading">
            <div><span className="eyebrow accent">{t.lesson}</span><h1>{t.openThree}</h1></div>
            <span className="no-timer"><Icon name="book" size={18} />{t.teachingTitle}</span>
          </div>
          <div className="board-shell"><GomokuBoard board={board} onMove={place} highlight={113} lastMove={props.moves[props.moves.length - 1]} /></div>
          <div className="mobile-only-actions">
            <button className="button button-secondary" onClick={() => props.setMoves((m) => m.slice(0, -1))}><Icon name="undo" />{t.undo}</button>
            <button className="button button-secondary" onClick={() => props.openModal("hint")}><Icon name="bulb" />{t.hint}</button>
          </div>
        </section>
        <aside className="lesson-panel">
          <div className="lesson-panel-top"><span className="mode-icon learn-icon"><Icon name="book" /></span><div><small>{t.lesson}</small><h2>{t.openThree}</h2></div></div>
          <div className="narration-box">
            <div className="narration-head"><span><Icon name="sound" size={17} />{t.cantoneseNarration}</span><small>00:18 / 00:32</small></div>
            <div className="waveform">{Array.from({ length: 27 }, (_, i) => (<i key={i} style={{ height: `${8 + ((i * 11) % 23)}px` }} />))}</div>
            <button className="round-play" onClick={() => props.setAudioPlaying(!props.audioPlaying)}>{props.audioPlaying ? "Ⅱ" : "▶"}</button>
          </div>
          <p className="lesson-explain">{t.openThreeText}</p>
          <div className="instruction-box"><span>{t.step}</span><b>{t.instruction}</b></div>
          <div className="panel-actions">
            <button className="button button-secondary" onClick={() => props.setMoves((m) => m.slice(0, -1))}><Icon name="undo" />{t.undo}</button>
            <button className="button button-secondary" onClick={() => props.openModal("hint")}><Icon name="bulb" />{t.hint}</button>
          </div>
          <button className="button button-ghost button-full" onClick={() => props.setAudioPlaying(!props.audioPlaying)}><Icon name="sound" />{t.replay}</button>
          <div className="lesson-bottom-nav">
            <button className="button button-ghost"><Icon name="back" />{t.previous}</button>
            <button className="button button-primary" onClick={() => props.navigate("challenge")}>{t.next}<Icon name="arrow" /></button>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Challenge({ lang, navigate, openModal }: { lang: Lang; navigate: (p: Page) => void; openModal: (m: Modal) => void }) {
  const t = copy[lang]
  const [moves, setMoves] = useState([96, 97, 98, 99, 111, 112, 126, 127])
  const board = useMemo(() => {
    const b = createBoard()
    moves.forEach((idx, i) => { const [r, c] = indexToCoord(idx); b[r][c] = (i % 2 === 0 ? 1 : 2) as Player })
    return b
  }, [moves])
  const place = (i: number) => { setMoves((m) => [...m, i]); openModal(i === 100 ? "complete" : "challengeFail") }
  return (
    <div>
      <div className="lesson-topbar">
        <button className="back-link" onClick={() => navigate("lessons")}><Icon name="back" />{t.backLessons}</button>
        <div className="challenge-count"><b>01</b><span>/ 02</span></div>
        <button className="text-link danger" onClick={() => navigate("lessons")}>{t.exit}</button>
      </div>
      <div className="game-layout">
        <section className="board-area">
          <div className="board-heading"><div><span className="eyebrow accent">{t.challenge} 1 / 2</span><h1>{t.challengeObjective}</h1></div></div>
          <div className="board-shell"><GomokuBoard board={board} onMove={place} highlight={100} lastMove={moves[moves.length - 1]} /></div>
        </section>
        <aside className="lesson-panel challenge-panel">
          <span className="mode-icon challenge-icon"><Icon name="trophy" /></span>
          <span className="eyebrow accent">{t.challenge} 1 / 2</span>
          <h2>{t.challengeObjective}</h2>
          <p>{lang === "zh" ? "白棋下一步就可以連成五子。輪到黑棋，請找出唯一可以化解威脅的位置。" : "White can make five on the next move. It is Black’s turn—find the only move that stops the threat."}</p>
          <div className="challenge-progress"><span><i /></span><small>1 / 2</small></div>
          <button className="button button-secondary button-full" onClick={() => openModal("hint")}><Icon name="sound" />{t.challengeHint}</button>
          <div className="coach-note"><span className="coach-mascot"><Panda /></span><p>{lang === "zh" ? "望清楚白棋最長嗰條線，封住最後一個空位。" : "Look for White’s longest line and cover its last open point."}</p></div>
        </aside>
      </div>
    </div>
  )
}

function Game(props: {
  lang: Lang
  renju: boolean
  difficulty: string
  timer: string
  setupType: string
  boardStyle: string
  openModal: (m: Modal) => void
  onGameOver: (result: "win" | "lose" | "draw") => void
  hintsEnabled: boolean
}) {
  const t = copy[props.lang]
  const isLocal = props.setupType === "local"
  const playerColor: Player = 1
  const aiColor: Player = 2

  const [board, setBoard] = useState<Board>(() => createBoard())
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1)
  const [moveHistory, setMoveHistory] = useState<number[]>([])
  const [status, setStatus] = useState<"playing" | "won" | "draw" | "forbidden">("playing")
  const [winner, setWinner] = useState<Player | null>(null)
  const [forbiddenMsg, setForbiddenMsg] = useState("")
  const [lastMove, setLastMove] = useState<number | null>(null)
  const [isAiThinking, setIsAiThinking] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [hintMove, setHintMove] = useState<number | null>(null)
  const [hintSuggestion, setHintSuggestion] = useState<string | null>(null)

  const isAITurn = !isLocal && currentPlayer === aiColor && status === "playing"

  // Timer 邏輯
  useEffect(() => {
    if (props.setupType !== "ai" || props.timer === "unlimited" || status !== "playing") return
    if (currentPlayer !== playerColor) return

    const limit = parseInt(props.timer)
    if (isNaN(limit)) return

    setTimeLeft(limit)

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          // 超時：跳過玩家回合，輪到 AI
          setCurrentPlayer(aiColor)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [currentPlayer, status, props.timer, props.setupType])

  // AI 落子邏輯
  useEffect(() => {
    if (!isAITurn) return
    setIsAiThinking(true)
    const timer = setTimeout(() => {
      const move = findBestMove(cloneBoard(board), aiColor, props.difficulty as Difficulty)
      if (move) {
        const [row, col] = move
        place(row * BOARD_SIZE + col)
      }
      setIsAiThinking(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [isAITurn, board])

  const place = (index: number) => {
    if (status !== "playing") return
    const [row, col] = indexToCoord(index)
    if (board[row][col] !== 0) return

    setHintMove(null)
    setHintSuggestion(null)

    const newBoard = cloneBoard(board)
    newBoard[row][col] = currentPlayer

    if (props.renju && currentPlayer === 1) {
      const result = checkForbidden(newBoard, row, col)
      if (result.type === "win") {
        setBoard(newBoard)
        setMoveHistory((m) => [...m, index])
        setLastMove(index)
        setWinner(1)
        setStatus("won")
        props.onGameOver("win")
        return
      }
      if (result.type !== "none") {
        setForbiddenMsg(result.type)
        props.openModal("forbidden")
        return // 禁手：取消落子
      }
    }

    if (checkWin(newBoard, row, col, currentPlayer)) {
      setBoard(newBoard)
      setMoveHistory((m) => [...m, index])
      setLastMove(index)
      setWinner(currentPlayer)
      setStatus("won")
      props.onGameOver(currentPlayer === playerColor ? "win" : "lose")
      return
    }

    if (checkDraw(newBoard)) {
      setBoard(newBoard)
      setMoveHistory((m) => [...m, index])
      setLastMove(index)
      setStatus("draw")
      props.onGameOver("draw")
      return
    }

    setBoard(newBoard)
    setMoveHistory((m) => [...m, index])
    setLastMove(index)
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1)

    // 重設 Timer
    if (props.setupType === "ai" && props.timer !== "unlimited") {
      setTimeLeft(parseInt(props.timer))
    }
  }

  const handleHint = () => {
    if (!props.hintsEnabled || isAITurn || status !== "playing" || props.renju) return

    const move = findBestMove(cloneBoard(board), currentPlayer, props.difficulty as Difficulty)
    if (move) {
      const [r, c] = move
      setHintMove(r * BOARD_SIZE + c)
      setHintSuggestion(coordToLabel(r, c))
    }
  }

  const handleUndo = () => {
    if (moveHistory.length === 0) return
    const stepsToUndo = 1 // 👈 改為只撤回 1 步
    const newHistory = moveHistory.slice(0, -stepsToUndo)
    const newBoard = createBoard()
    newHistory.forEach((idx, i) => {
      const [r, c] = indexToCoord(idx)
      newBoard[r][c] = (i % 2 === 0 ? 1 : 2) as Player
    })
    setBoard(newBoard)
    setMoveHistory(newHistory)
    setCurrentPlayer((newHistory.length % 2 === 0 ? 1 : 2) as Player)
    setStatus("playing")
    setWinner(null)
    setLastMove(newHistory.length > 0 ? newHistory[newHistory.length - 1] : null)
    setHintMove(null)
    setHintSuggestion(null)
    props.openModal(null)
  }

  const handleRestart = () => {
    setBoard(createBoard())
    setMoveHistory([])
    setCurrentPlayer(1)
    setStatus("playing")
    setWinner(null)
    setLastMove(null)
    setForbiddenMsg("")
    setHintMove(null)
    setHintSuggestion(null)
    setTimeLeft(props.timer !== "unlimited" ? parseInt(props.timer) : 0)
    props.openModal(null)
  }

  const turnLabel =
    status === "won"
      ? winner === playerColor
        ? props.lang === "zh" ? "你贏咗！" : "You win!"
        : `${t.ai} ${props.lang === "zh" ? "贏咗" : "wins"}`
      : status === "draw"
        ? props.lang === "zh" ? "和局" : "Draw"
        : status === "forbidden"
          ? props.lang === "zh" ? "黑棋禁手，判負" : "Black forbidden move — loss"
          : currentPlayer === playerColor ? t.turn : `${t.ai} · ${t.white}`

  return (
    <div className={`board-theme-${props.boardStyle}`}>
      <div className="game-statusbar">
        <div>
          <span className={`live-dot ${props.renju ? "renju-dot" : ""}`} />
          {t.gameStatus}
        </div>
        <span>{props.renju ? t.renjuTitle : t.freeTitle}</span>
        <button className="text-link danger" onClick={() => props.openModal("leave")}>
          <Icon name="flag" size={17} />
          {t.backHome}
        </button>
      </div>
      <div className="game-layout">
        <section className="board-area">
          <div className="board-heading game-heading">
            <div>
              <span className={`mode-badge ${props.renju ? "renju" : ""}`}>{props.renju ? t.renju : "Gomoku"}</span>
              <h1>{turnLabel}</h1>
            </div>
            
            {/* Timer 搬入去中間 */}
            {props.timer !== "unlimited" && props.setupType === "ai" && status === "playing" && (
              <div className={`board-timer ${timeLeft <= 5 ? "timer-danger" : ""}`}>
                <span>{t.timer}</span>
                <b>
                  {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
                  {String(timeLeft % 60).padStart(2, "0")}
                </b>
              </div>
            )}

            <div className="turn-legend">
              <span><i className="legend-stone black" />{t.black} · {t.you}</span>
              <span><i className="legend-stone white" />{t.white} · {t.ai}</span>
            </div>
          </div>
          {props.renju && <div className="forbidden-banner"><Icon name="flag" size={17} /><b>{t.forbiddenNote}</b><span>三三 · 四四 · 長連</span></div>}
          {status === "forbidden" && (
            <div className="forbidden-banner" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
              <Icon name="flag" size={17} />
              <b>{forbiddenMsg === "double-three" ? "三三禁手！" : forbiddenMsg === "double-four" ? "四四禁手！" : "長連禁手！"}</b>
            </div>
          )}
          <div className="board-shell">
            <GomokuBoard
              board={board}
              onMove={(i) => {
                setHintMove(null)
                setHintSuggestion(null)
                place(i)
              }}
              style={props.boardStyle}
              lastMove={lastMove ?? undefined}
              hintMove={hintMove}
              currentPlayer={currentPlayer}
            />
          </div>
          {isAiThinking && (
            <div style={{ textAlign: "center", marginTop: "10px", color: "var(--muted)", fontSize: "12px" }}>
              {props.lang === "zh" ? "阿棋思考緊..." : "Ah Kei is thinking..."}
            </div>
          )}
        </section>
        <aside className="game-panel">
          <div className="players">
            <div className={`player ${currentPlayer === playerColor && status === "playing" ? "active" : ""}`}>
              <span className="avatar text-avatar">你</span>
              <div><small>{t.black}</small><b>{t.you}</b></div>
              <i />
            </div>
            <span className="versus">VS</span>
            <div className={`player ${currentPlayer === aiColor && status === "playing" ? "active" : ""}`}>
              <span className="avatar"><Panda small /></span>
              <div><small>{t.white}</small><b>{t.ai}</b></div>
            </div>
          </div>
          
          <div className="detail-list">
            <h3>{t.gameInfo}</h3>
            <div><span>{t.mode}</span><b>{props.renju ? t.renju : t.play}</b></div>
            <div><span>{t.opponent}</span><b>{props.setupType === "local" ? t.local : t.aiOpponent}</b></div>
            <div><span>{t.difficulty}</span><b>{props.difficulty}</b></div>
            <div><span>{t.timer}</span><b>{props.timer === "unlimited" ? t.unlimited : props.timer}</b></div>
          </div>
          <div className="history">
            <div className="panel-title">
              <h3>{t.moveHistory}</h3>
              <span>{moveHistory.length} {t.moves}</span>
            </div>
            <div className="move-grid">
              {moveHistory.map((m, i) => {
                const [r, c] = indexToCoord(m)
                return (
                  <span key={`${m}-${i}`}>
                    <small>{i + 1}</small>
                    <i className={i % 2 ? "white" : "black"} />
                    {coordToLabel(r, c)}
                  </span>
                )
              })}
            </div>
          </div>
          
          <div className="game-controls">
            {/* 提示：只在一般遊玩 AI 模式先有，並且要開啟提示功能 */}
            {!props.renju && props.setupType === "ai" && (
              <button
                className="button button-secondary"
                onClick={handleHint}
                disabled={!props.hintsEnabled}
                style={{ opacity: props.hintsEnabled ? 1 : 0.5, cursor: props.hintsEnabled ? "pointer" : "not-allowed" }}
              >
                <Icon name="bulb" />
                {t.hint}
              </button>
            )}
            
            {/* 悔棋：連珠模式冇，只撤回 1 步 */}
            {!props.renju && (
              <button className="button button-secondary" onClick={handleUndo}>
                <Icon name="undo" />
                {t.undo}
              </button>
            )}
            
            <button className="button button-ghost" onClick={handleRestart}>
              <Icon name="refresh" />
              {t.restart}
            </button>
            <button className="button button-ghost danger-text" onClick={() => props.openModal("leave")}>
              <Icon name="flag" />
              {t.backHome}
            </button>
          </div>

          {/* 顯示提示文字（喺掣下面） */}
          {hintSuggestion && props.hintsEnabled && (
            <div className="hint-display">
              <Icon name="bulb" size={16} />
              <span>
                {props.lang === "zh" 
                  ? `阿棋建議落喺 ${hintSuggestion}，試吓啦！` 
                  : `Ah Kei suggests playing at ${hintSuggestion}. Give it a try!`}
              </span>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

function Leaderboard({ lang, navigate }: { lang: Lang; navigate: (p: Page) => void }) {
  const t = copy[lang]
  const rows = [
    ["1", "龍爺", "128", "84%", "12", "gold"],
    ["2", "Chess Master K", "116", "81%", "9", "silver"],
    ["3", "小棋后", "104", "79%", "8", "bronze"],
    ["4", "StoneWalker", "98", "76%", "7", ""],
    ["5", "阿朗", "91", "74%", "6", ""],
    ["24", t.guestUser, "12", "67%", "3", "you"],
  ]
  return (
    <div>
      <PageIntro eyebrow={t.leaderboard} title={t.rankingTitle} body={t.rankingSub} back={t.backHome} onBack={() => navigate("home")} />
      <section className="content-section leaderboard-section">
        <div className="tabs"><button className="active">{t.overall}</button><button>{t.weekly}</button><button>{t.friends}</button></div>
        <div className="podium">
          {[rows[1], rows[0], rows[2]].map((r, i) => (<div className={`podium-card p-${i}`} key={r[0]}><span className="rank-medal">{r[0]}</span><span className="avatar text-avatar">{r[1].slice(0, 1)}</span><b>{r[1]}</b><small>{r[2]} {t.wins}</small><i /></div>))}
        </div>
        <div className="table-card">
          <div className="table-row table-head"><span>{t.rank}</span><span>{t.player}</span><span>{t.wins}</span><span>{t.winRate}</span><span>{t.winStreak}</span></div>
          {rows.map((r) => (<div className={`table-row ${r[5]}`} key={r[0]}><span className="rank-cell">{r[0]}</span><span className="player-cell"><i className="avatar text-avatar">{r[1].slice(0, 1)}</i><b>{r[1]}</b>{r[5] === "you" && <small>{t.you}</small>}</span><span>{r[2]}</span><span>{r[3]}</span><span>× {r[4]}</span></div>))}
        </div>
        <button className="button button-secondary load-button">{t.load}</button>
      </section>
    </div>
  )
}

function Profile({ lang, openModal, navigate }: { lang: Lang; openModal: (m: Modal) => void; navigate: (p: Page) => void }) {
  const t = copy[lang]
  const stats = [[t.wins, "12"], [t.losses, "5"], [t.draws, "1"], [t.winRate, "67%"], [t.lessonsCompleted, "3/8"]]
  const games = [
    [t.play, t.ai + " · Medium", t.won, "2025.04.16", "42"],
    [t.renju, "Chess Master K", t.lost, "2025.04.14", "36"],
    [t.play, t.ai + " · Easy", t.won, "2025.04.12", "28"],
    [t.play, t.local, t.draw, "2025.04.08", "71"],
  ]
  return (
    <div>
      <PageIntro eyebrow={t.records} title={t.profileTitle} body={t.profileSub} back={t.backHome} onBack={() => navigate("home")} />
      <section className="content-section profile-section">
        <div className="profile-card">
          <span className="profile-avatar"><Panda /></span>
          <div><span className="status-pill current">{t.guestTag}</span><h2>{t.guestUser}</h2><p>{t.createPrompt}</p></div>
          <button className="button button-primary" onClick={() => openModal("signup")}>{t.createAccount}</button>
        </div>
        <div className="stats-grid">
          {stats.map(([label, val], i) => (<article key={label}><span className="stat-icon"><Icon name={i === 4 ? "book" : i === 3 ? "trophy" : "play"} /></span><b>{val}</b><small>{label}</small></article>))}
        </div>
        <div className="records-card">
          <div className="panel-title"><h2>{t.recentGames}</h2><button className="text-link" onClick={() => navigate("settings")}>{t.accountSettings}<Icon name="arrow" size={16} /></button></div>
          {games.map((g, i) => (<div className="record-row" key={i}><span className={`result-mark ${g[2] === t.won ? "win" : g[2] === t.lost ? "loss" : ""}`}>{g[2].slice(0, 1)}</span><div><b>{g[0]}</b><small>{g[1]}</small></div><span className={`result-text ${g[2] === t.won ? "win" : g[2] === t.lost ? "loss" : ""}`}>{g[2]}</span><span>{g[3]}</span><span>{g[4]} {t.moves}</span><button className="icon-button" onClick={() => openModal("record")}><Icon name="arrow" /></button></div>))}
        </div>
      </section>
    </div>
  )
}

function Settings(props: { lang: Lang; theme: Theme; setLang: (l: Lang) => void; setTheme: (t: Theme) => void; boardStyle: string; setBoardStyle: (s: string) => void; navigate: (p: Page) => void; saved: () => void; }) {
  const t = copy[props.lang]
  const [sound, setSound] = useState(true)
  const [tts, setTts] = useState(true)
  return (
    <div>
      <PageIntro eyebrow={t.settings} title={t.settingsTitle} body={t.settingsSub} back={t.backHome} onBack={() => props.navigate("home")} />
      <section className="content-section settings-section">
        <div className="settings-card">
          <SettingRow icon="globe" title={t.language} body={props.lang === "zh" ? "顯示所有導覽、按鈕及訊息的語言。" : "Language used for navigation, buttons and messages."}>
            <div className="segmented"><button className={props.lang === "zh" ? "active" : ""} onClick={() => props.setLang("zh")}>繁體中文</button><button className={props.lang === "en" ? "active" : ""} onClick={() => props.setLang("en")}>English</button></div>
          </SettingRow>
          <SettingRow icon={props.theme === "light" ? "sun" : "moon"} title={t.appearance} body={props.lang === "zh" ? "選擇最舒適的閱讀模式。" : "Choose the viewing mode most comfortable for you."}>
            <div className="theme-options"><button className={props.theme === "light" ? "active" : ""} onClick={() => props.setTheme("light")}><span className="theme-preview light-preview"><i /><i /></span><b>{t.light}</b></button><button className={props.theme === "dark" ? "active" : ""} onClick={() => props.setTheme("dark")}><span className="theme-preview dark-preview"><i /><i /></span><b>{t.dark}</b></button></div>
          </SettingRow>
          <SettingRow icon="play" title={t.boardStyle} body={props.lang === "zh" ? "棋盤風格會套用至所有對局。" : "Your board style applies to every game."}>
            <div className="board-options">{[["wood", t.wood], ["classic", t.classic], ["minimal", t.minimal], ["neon", props.lang === "zh" ? "冰火" : "Neon"]].map(([id, label]) => (<button className={props.boardStyle === id ? "active" : ""} onClick={() => props.setBoardStyle(id)} key={id}><span className={`board-preview ${id}`} />{label}<i>{props.boardStyle === id && <Icon name="check" size={13} />}</i></button>))}</div>
          </SettingRow>
          <SettingRow icon="sound" title={t.sound} body={props.lang === "zh" ? "落子、勝出及介面提示音效。" : "Move, victory and interface sound effects."}><Toggle value={sound} setValue={setSound} /></SettingRow>
          <SettingRow icon="sound" title={t.tts} body={t.ttsNote}><Toggle value={tts} setValue={setTts} /></SettingRow>
          <div className="settings-actions"><button className="button button-ghost" onClick={() => props.navigate("home")}>{t.cancel}</button><button className="button button-primary" onClick={props.saved}><Icon name="check" />{t.save}</button></div>
        </div>
      </section>
    </div>
  )
}

function SettingRow({ icon, title, body, children }: { icon: string; title: string; body: string; children: React.ReactNode }) {
  return <div className="setting-row"><span className="setting-icon"><Icon name={icon} /></span><div className="setting-copy"><b>{title}</b><p>{body}</p></div><div className="setting-control">{children}</div></div>
}

function Toggle({ value, setValue }: { value: boolean; setValue: (v: boolean) => void }) {
  return <button className={`toggle ${value ? "on" : ""}`} onClick={() => setValue(!value)} aria-pressed={value}><i /></button>
}

function MobileNav({ page, lang, navigate, openSetup }: { page: Page; lang: Lang; navigate: (p: Page) => void; openSetup: (r: boolean) => void }) {
  const t = copy[lang]
  const items = [["home", "home", t.home], ["lessons", "book", t.teaching], ["play", "play", t.play], ["leaderboard", "trophy", t.leaderboard], ["profile", "user", t.records]]
  return <nav className="mobile-nav">{items.map(([id, icon, label]) => <button key={id} className={page === id ? "active" : ""} onClick={() => id === "play" ? openSetup(false) : navigate(id as Page)}><Icon name={icon} size={20} /><span>{label}</span></button>)}</nav>
}

function ModalLayer(props: {
  modal: Exclude<Modal, null>; lang: Lang; close: () => void; navigate: (p: Page) => void; notify: (s: string) => void;
  renju: boolean; setupType: "ai" | "local"; setSetupType: (s: "ai" | "local") => void;
  difficulty: string; setDifficulty: (s: string) => void; firstMove: string; setFirstMove: (s: string) => void;
  timer: string; setTimer: (s: string) => void; startGame: () => void; logout: () => void; undo: () => void;
  hintsEnabled: boolean
  setHintsEnabled: (v: boolean) => void
}) {
  const t = copy[props.lang]
  const [sent, setSent] = useState(false)
  const [formError, setFormError] = useState("")
  const [fields, setFields] = useState({ name: "", email: "", password: "", confirm: "" })
  const titleMap: Partial<Record<Exclude<Modal, null>, string>> = {
    logout: t.logoutTitle, hint: t.hintTitle, undo: t.undoTitle, restart: t.restartTitle,
    leave: t.leaveTitle, correct: t.correctTitle, incorrect: t.incorrectTitle, challengeFail: t.challengeFailTitle, complete: t.finishTitle,
    record: t.recordTitle, gameOverWin: t.gameOverWinTitle, gameOverLose: t.gameOverLoseTitle, gameOverDraw: t.gameOverDrawTitle,
    forbidden: t.forbiddenTitle,  
  }
  const bodyMap: Partial<Record<Exclude<Modal, null>, string>> = {
    logout: t.logoutBody, hint: t.hintBody, undo: t.undoBody, restart: t.restartBody,
    leave: t.leaveBody, correct: t.correctBody, incorrect: t.incorrectBody, challengeFail: t.challengeFailBody, complete: t.finishBody,
    gameOverWin: t.gameOverWinBody, gameOverLose: t.gameOverLoseBody, gameOverDraw: t.gameOverDrawBody,
    forbidden: t.forbiddenBody,
  }

  if (props.modal === "setup") return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && props.close()}>
      <div className="modal setup-modal" role="dialog" aria-modal="true">
        <ModalHeader title={props.renju ? t.setupRenjuTitle : t.setupTitle} eyebrow={props.renju ? t.renjuTitle : t.freeTitle} close={props.close} />
        {props.renju && <div className="rules-callout"><span><Icon name="flag" /></span><div><b>{t.rules}</b><p>{t.rulesText}</p></div></div>}
        <OptionGroup label={t.opponent}><Choice active={props.setupType === "ai"} onClick={() => props.setSetupType("ai")} icon="play" title={t.aiOpponent} /><Choice active={props.setupType === "local"} onClick={() => props.setSetupType("local")} icon="user" title={t.local} /></OptionGroup>
        {props.setupType === "ai" ? <>
          <OptionGroup label={t.difficulty}><Pills values={["Easy", "Medium", "Hard"]} active={props.difficulty} setActive={props.setDifficulty} /></OptionGroup>
          <OptionGroup label={t.firstMove}><Pills values={[t.random, t.playerFirst, t.aiFirst]} ids={["random", "player", "ai"]} active={props.firstMove} setActive={props.setFirstMove} /></OptionGroup>
          <OptionGroup label={t.timer}><Pills values={[t.seconds30, t.seconds60, t.unlimited]} ids={["30", "60", "unlimited"]} active={props.timer} setActive={props.setTimer} /></OptionGroup>
              {!props.renju && (
                <div className="hint-setting">
                  <span>
                    <b>{t.hintsOn}</b>
                    <small>
                      {props.lang === "zh"
                        ? "對局期間可向阿棋求助"
                        : "Ask Ah Kei for help during the game"}
                    </small>
                  </span>
                  <Toggle value={props.hintsEnabled} setValue={props.setHintsEnabled} />
                </div>
              )}
        </> : <div className="info-note">{t.localNote}</div>}
        <div className="modal-actions"><button className="button button-ghost" onClick={props.close}>{t.cancel}</button><button className="button button-primary" onClick={props.startGame}>{props.renju ? t.startRenju : t.startGame}<Icon name="arrow" /></button></div>
      </div>
    </div>
  )

  if (props.modal === "signup" || props.modal === "forgot") {
    const signup = props.modal === "signup"
    const submit = () => {
      if (!fields.email || (signup && (!fields.name || !fields.password || !fields.confirm))) return setFormError(t.required)
      if (!fields.email.includes("@")) return setFormError(t.invalidEmail)
      if (signup && fields.password !== fields.confirm) return setFormError(t.passwordMismatch)
      setFormError(""); setSent(true); props.notify(signup ? t.accountCreated : t.resetSent)
    }
    return (
      <div className="modal-overlay">
        <div className="modal form-modal" role="dialog" aria-modal="true">
          <ModalHeader title={signup ? t.signupTitle : t.forgotTitle} eyebrow={signup ? t.createAccount : t.forgot} close={props.close} />
          {sent ? (
            <div className="success-state"><span><Icon name="check" size={30} /></span><h3>{signup ? t.accountCreated : t.resetSent}</h3><button className="button button-primary" onClick={props.close}>{t.continue}</button></div>
          ) : (
            <>
              <p className="modal-intro">{signup ? t.signupSub : (props.lang === "zh" ? "輸入你的電郵，我們會發送安全的重設連結。" : "Enter your email and we’ll send you a secure reset link.")}</p>
              {signup && <ModalField label={t.name} value={fields.name} setValue={(v) => setFields({ ...fields, name: v })} />}
              <ModalField label={t.email} value={fields.email} setValue={(v) => setFields({ ...fields, email: v })} />
              {signup && <><ModalField label={t.password} value={fields.password} setValue={(v) => setFields({ ...fields, password: v })} password /><ModalField label={t.confirmPassword} value={fields.confirm} setValue={(v) => setFields({ ...fields, confirm: v })} password /></>}
              {formError && <div className="form-error">{formError}</div>}
              <div className="modal-actions"><button className="button button-ghost" onClick={props.close}>{t.cancel}</button><button className="button button-primary" onClick={submit}>{signup ? t.create : t.sendLink}</button></div>
            </>
          )}
        </div>
      </div>
    )
  }

  const actions: Record<string, React.ReactNode> = {
    logout: (<><button className="button button-ghost" onClick={props.close}>{t.cancel}</button><button className="button button-danger" onClick={props.logout}>{t.logout}</button></>),
    hint: (<button className="button button-primary" onClick={props.close}>{t.gotIt}</button>),
    undo: (<><button className="button button-ghost" onClick={props.close}>{t.cancel}</button><button className="button button-primary" onClick={props.undo}>{t.undo}</button></>),
    restart: (<><button className="button button-ghost" onClick={props.close}>{t.cancel}</button><button className="button button-primary" onClick={() => { props.close(); props.startGame(); }}>{t.restart}</button></>),
    leave: (<><button className="button button-ghost" onClick={props.close}>{t.keepPlaying}</button><button className="button button-danger" onClick={() => props.navigate("home")}>{t.leaveGame}</button></>),
    correct: (<button className="button button-primary" onClick={props.close}>{t.continue}<Icon name="arrow" /></button>),
    incorrect: (<><button className="button button-ghost" onClick={props.close}>{t.tryAgain}</button><button className="button button-primary" onClick={props.close}>{t.showAnswer}</button></>),
    challengeFail: (<><button className="button button-ghost" onClick={props.close}>{t.tryAgain}</button><button className="button button-primary" onClick={() => props.navigate("home")}>{t.freePlay}</button></>),
    complete: (<><button className="button button-ghost" onClick={() => props.navigate("home")}>{t.backHome}</button><button className="button button-primary" onClick={() => { props.close(); props.navigate("home"); }}>{t.freePlay}</button></>),
    record: (<button className="button button-primary" onClick={props.close}>{t.gotIt}</button>),
    gameOverWin: (<><button className="button button-ghost" onClick={() => props.navigate("home")}>{t.backToMain}</button><button className="button button-primary" onClick={() => { props.close(); props.startGame(); }}>{t.playAgain}</button></>),
    gameOverLose: (<><button className="button button-ghost" onClick={() => props.navigate("home")}>{t.backToMain}</button><button className="button button-primary" onClick={() => { props.close(); props.startGame(); }}>{t.playAgain}</button></>),
    gameOverDraw: (<><button className="button button-ghost" onClick={() => props.navigate("home")}>{t.backToMain}</button><button className="button button-primary" onClick={() => { props.close(); props.startGame(); }}>{t.playAgain}</button></>),
    forbidden: (
      <button className="button button-primary" onClick={props.close}>
        {t.gotIt}
      </button>
    ),
  }

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && props.close()}>
      <div className="modal feedback-modal" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={props.close}><Icon name="close" /></button>
        <div className={`feedback-icon ${props.modal}`}>
          <Icon name={props.modal === "hint" ? "bulb" : props.modal === "incorrect" || props.modal === "challengeFail" || props.modal === "leave" || props.modal === "logout" ? "flag" : props.modal === "record" ? "play" : "check"} size={28} />
        </div>
        <h2>{titleMap[props.modal]}</h2>
        <p>{bodyMap[props.modal]}</p>
        {props.modal === "hint" && <div className="hint-coordinate"><b>H8</b><span>{t.openThree}</span></div>}
        {props.modal === "record" && <div className="record-summary"><div><span>{t.result}</span><b>{t.won}</b></div><div><span>{t.mode}</span><b>Gomoku · AI</b></div><div><span>{t.moves}</span><b>42</b></div><div><span>{t.duration}</span><b>08:42</b></div></div>}
        <div className="modal-actions centered">{actions[props.modal]}</div>
      </div>
    </div>
  )
}

function ModalHeader({ title, eyebrow, close }: { title: string; eyebrow: string; close: () => void }) {
  return <div className="modal-header"><div><span className="eyebrow accent">{eyebrow}</span><h2>{title}</h2></div><button className="modal-close static" onClick={close}><Icon name="close" /></button></div>
}

function ModalField({ label, value, setValue, password = false }: { label: string; value: string; setValue: (s: string) => void; password?: boolean }) {
  return <label className="field-label">{label}<span className="input-wrap"><Icon name={password ? "lock" : "user"} size={18} /><input value={value} onChange={(e) => setValue(e.target.value)} type={password ? "password" : "text"} /></span></label>
}

function OptionGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="option-group"><label>{label}</label><div>{children}</div></div>
}

function Choice({ active, onClick, icon, title }: { active: boolean; onClick: () => void; icon: string; title: string }) {
  return <button className={`choice ${active ? "active" : ""}`} onClick={onClick}><span><Icon name={icon} /></span><b>{title}</b><i>{active && <Icon name="check" size={13} />}</i></button>
}

function Pills({ values, ids, active, setActive }: { values: readonly string[] | string[]; ids?: string[]; active: string; setActive: (s: string) => void }) {
  return <div className="pills">{values.map((v, i) => <button key={v} className={active === (ids?.[i] || v) ? "active" : ""} onClick={() => setActive(ids?.[i] || v)}>{v}</button>)}</div>
}

export default App