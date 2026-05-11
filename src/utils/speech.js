export const playAudio = (text, speed = 'normal', lang = 'en-US') => {
  if (!window.speechSynthesis) {
    console.warn('Trình duyệt không hỗ trợ Web Speech API');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  
  // Set speed
  if (speed === 'slow') utterance.rate = 0.5;
  else if (speed === 'fast') utterance.rate = 1.5;
  else utterance.rate = 0.9; // Normal

  utterance.pitch = 1;

  // Try to find a good English voice
  const voices = window.speechSynthesis.getVoices();
  const englishVoices = voices.filter(voice => voice.lang.includes('en'));
  
  if (englishVoices.length > 0) {
    // Prefer Google US English or any native US English
    const preferredVoice = englishVoices.find(v => v.name.includes('Google') && v.lang === 'en-US') 
                        || englishVoices.find(v => v.lang === 'en-US') 
                        || englishVoices[0];
    utterance.voice = preferredVoice;
  }

  window.speechSynthesis.speak(utterance);
};
