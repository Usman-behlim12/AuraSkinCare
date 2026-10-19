// Browser Voice Pipeline: Speech-to-Text (STT) and Text-to-Speech (TTS)
// With Indian English voice tuning and barge-in / interruption support

export class SpeechService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.selectedVoice = null;
    this.onInterimResult = null;
    this.onFinalResult = null;
    this.onError = null;
    this.onSpeechStart = null;
    this.onSpeechEnd = null;

    this.initVoices();
    this.initRecognition();
  }

  isSpeechRecognitionSupported() {
    return typeof window !== 'undefined' &&
      (!!window.SpeechRecognition || !!window.webkitSpeechRecognition);
  }

  isSpeechSynthesisSupported() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  initVoices() {
    if (!this.isSpeechSynthesisSupported()) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;

      // Prioritize Indian English voices
      const indianVoice = voices.find(v =>
        v.lang === 'en-IN' ||
        v.lang.startsWith('en-IN') ||
        v.name.toLowerCase().includes('india') ||
        v.name.toLowerCase().includes('heera') ||
        v.name.toLowerCase().includes('neerja') ||
        v.name.toLowerCase().includes('veena') ||
        v.name.toLowerCase().includes('ravi')
      );

      // Fallback to warm natural English female voices
      const femaleEnglishVoice = voices.find(v =>
        v.lang.startsWith('en') &&
        (v.name.toLowerCase().includes('female') ||
         v.name.toLowerCase().includes('samantha') ||
         v.name.toLowerCase().includes('victoria') ||
         v.name.toLowerCase().includes('zira') ||
         v.name.toLowerCase().includes('google'))
      );

      // Fallback to any English voice
      const anyEnglish = voices.find(v => v.lang.startsWith('en'));

      this.selectedVoice = indianVoice || femaleEnglishVoice || anyEnglish || voices[0];
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  initRecognition() {
    if (!this.isSpeechRecognitionSupported()) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-IN'; // Indian English

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onspeechstart = () => {
      // Barge-in: If agent is speaking, cancel speech immediately!
      if (this.isSpeechSynthesisSupported() && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      if (this.onSpeechStart) this.onSpeechStart();
    };

    this.recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          final += item[0].transcript;
        } else {
          interim += item[0].transcript;
        }
      }

      if (interim && this.onInterimResult) {
        this.onInterimResult(interim);
      }

      if (final && this.onFinalResult) {
        this.onFinalResult(final.trim());
      }
    };

    this.recognition.onerror = (event) => {
      // Don't treat 'no-speech' or 'aborted' as critical errors
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.warn('Speech recognition error:', event.error);
        if (this.onError) this.onError(event.error);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onSpeechEnd) this.onSpeechEnd();
    };
  }

  startListening() {
    if (!this.recognition) return;
    try {
      this.recognition.start();
    } catch {
      // Already running
    }
  }

  stopListening() {
    if (!this.recognition) return;
    try {
      this.recognition.stop();
    } catch {
      // Ignore
    }
  }

  speak(text, { onStart, onEnd, onError } = {}) {
    if (!this.isSpeechSynthesisSupported()) {
      if (onEnd) onEnd();
      return;
    }

    // Cancel any previous pending speech
    window.speechSynthesis.cancel();

    if (!text || !text.trim()) {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.lang = 'en-IN';
    utterance.rate = 1.0;
    utterance.pitch = 1.05; // Slightly warmer pitch for Aria

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn("SpeechSynthesis error:", e);
      if (onError) onError(e);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking() {
    if (this.isSpeechSynthesisSupported()) {
      window.speechSynthesis.cancel();
    }
  }
}

export const speechService = new SpeechService();
