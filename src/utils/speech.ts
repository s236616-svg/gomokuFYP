let isSoundOn = true

export function setSpeechEnabled(enabled: boolean) {
  isSoundOn = enabled
  if (!enabled && "speechSynthesis" in window) {
    window.speechSynthesis.cancel()
  }
}

// 👇 加多個 force 參數
export function speak(text: string, force: boolean = false) {
  if (!isSoundOn && !force) return // 如果 force 係 true，就算 isSoundOn 係 false 都會照讀

  if (!("speechSynthesis" in window)) return
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = "zh-HK"
  utterance.rate = 0.95
  
  const voices = window.speechSynthesis.getVoices()
  const hkVoice = voices.find(v => v.name.includes("HiuMaan") || v.name.includes("HK") || v.lang === "zh-HK")
  const zhVoice = voices.find(v => v.lang.includes("zh"))
  
  if (hkVoice) {
    utterance.voice = hkVoice
  } else if (zhVoice) {
    utterance.voice = zhVoice
  }

  window.speechSynthesis.speak(utterance)
}