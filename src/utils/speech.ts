let isSoundOn = true

export function setSpeechEnabled(enabled: boolean) {
  isSoundOn = enabled
  if (!enabled && "speechSynthesis" in window) {
    window.speechSynthesis.cancel()
  }
}

export function speak(text: string, force: boolean = false) {
  if (!isSoundOn && !force) return

  if (!("speechSynthesis" in window)) return
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  
  const voices = window.speechSynthesis.getVoices()
  
  // 👇 判斷係咪英文（簡單判斷：如果字串包含英文字母，就當係英文）
  const isEnglish = /[a-zA-Z]/.test(text)

  if (isEnglish) {
    utterance.lang = "en-GB" // 設定為英國英文
    // 優先搵英國口音嘅聲（例如 Google UK English Female 或 Daniel）
    const ukVoice = voices.find(v => v.lang.includes("en-GB") || v.name.includes("UK"))
    if (ukVoice) utterance.voice = ukVoice
  } else {
    utterance.lang = "zh-HK" // 廣東話
    const hkVoice = voices.find(v => v.name.includes("HiuMaan") || v.name.includes("HK") || v.lang === "zh-HK")
    if (hkVoice) utterance.voice = hkVoice
  }

  utterance.rate = 0.95
  window.speechSynthesis.speak(utterance)
}