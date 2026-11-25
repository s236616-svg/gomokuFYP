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

  // 👇 強制檢查：只要有中文字，就一定係中文
  const hasChinese = /[\u4e00-\u9fa5]/.test(text)
  const isEnglish = !hasChinese && /[a-zA-Z]/.test(text)

  if (isEnglish) {
    utterance.lang = "en-GB"
    const ukVoice = voices.find(v => v.lang.includes("en-GB") || v.name.includes("UK") || v.name.includes("Daniel"))
    if (ukVoice) utterance.voice = ukVoice
  } else {
    utterance.lang = "zh-HK"
    const hkVoice = voices.find(v => v.name.includes("HiuMaan") || v.name.includes("HK") || v.lang === "zh-HK")
    if (hkVoice) {
      utterance.voice = hkVoice
    } else {
      // 如果搵唔到廣東話，強制用任何中文聲頂住先，避免變咗英文聲
      const zhVoice = voices.find(v => v.lang.includes("zh"))
      if (zhVoice) utterance.voice = zhVoice
    }
  }

  utterance.rate = 0.95
  window.speechSynthesis.speak(utterance)
}