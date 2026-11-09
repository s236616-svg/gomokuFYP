export function speak(text: string) {
  if (!("speechSynthesis" in window)) return
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = "zh-HK"
  utterance.rate = 0.95
  
  const voices = window.speechSynthesis.getVoices()
  // 優先搵廣東話女聲 (HiuMaan 或 HK)，再搵普通話
  const hkVoice = voices.find(v => v.name.includes("HiuMaan") || v.name.includes("HK") || v.lang === "zh-HK")
  const zhVoice = voices.find(v => v.lang.includes("zh"))
  
  if (hkVoice) {
    utterance.voice = hkVoice
  } else if (zhVoice) {
    utterance.voice = zhVoice
  }

  window.speechSynthesis.speak(utterance)
}