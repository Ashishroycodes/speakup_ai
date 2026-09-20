/**
 * SpeakUp AI Coach - Real-Time Voice & Neural Speech Service
 *
 * Provides:
 * 1. WebRTC Realtime API Client (Full-Duplex live audio streaming via OpenAI Realtime API)
 * 2. High-Definition Real Human Voice Audio Engine (via /api/tts with OpenAI tts-1 or ElevenLabs)
 * 3. Enhanced Neural Browser Voice Fallback (with smart voice selection & cadence tuning)
 * 4. Web Audio Waveform & Level Analysis for dynamic audio visualizers
 */

export const REAL_VOICES = [
  {
    id: 'nova',
    name: 'Nova',
    gender: 'female',
    style: 'Warm & Encouraging',
    description: 'Friendly, energetic, and natural. Best for conversational fluency practice.',
    recommended: true
  },
  {
    id: 'alloy',
    name: 'Alloy',
    gender: 'neutral',
    style: 'Clear & Balanced',
    description: 'Neutral, articulate, and clear standard English.'
  },
  {
    id: 'shimmer',
    name: 'Shimmer',
    gender: 'female',
    style: 'Bright & Expressive',
    description: 'Expressive intonation, great for pronunciation and tone practice.'
  },
  {
    id: 'echo',
    name: 'Echo',
    gender: 'male',
    style: 'Warm & Calm',
    description: 'Patient, reassuring, and articulate male voice.'
  },
  {
    id: 'onyx',
    name: 'Onyx',
    gender: 'male',
    style: 'Deep & Professional',
    description: 'Authoritative, resonant tone ideal for job interview practice.'
  },
  {
    id: 'fable',
    name: 'Fable',
    gender: 'neutral',
    style: 'Articulate British',
    description: 'Expressive British warmth with clear phrasing.'
  }
];

// Signature voice mapping per UI theme mode
export const THEME_VOICES = {
  dark: {
    voice: 'onyx',
    name: 'Onyx',
    gender: 'male',
    style: 'Deep & Professional',
    description: 'Deep, resonant, and focused tone tailored for Midnight Dark'
  },
  light: {
    voice: 'alloy',
    name: 'Alloy',
    gender: 'neutral',
    style: 'Clear & Crisp',
    description: 'Crisp, articulate, and clean tone tailored for Daylight Clean'
  },
  sepia: {
    voice: 'echo',
    name: 'Echo',
    gender: 'male',
    style: 'Warm & Calm',
    description: 'Warm, patient, and reflective tone tailored for Warm Focus'
  },
  ocean: {
    voice: 'shimmer',
    name: 'Shimmer',
    gender: 'female',
    style: 'Vibrant & Expressive',
    description: 'Vibrant, refreshing, and expressive tone tailored for Ocean Marine'
  }
};

export function getVoiceForTheme(themeId) {
  const mapping = THEME_VOICES[themeId];
  return mapping ? mapping.voice : 'onyx';
}

// Active audio & playback tracking for instant interruption and echo elimination
let currentPlaybackId = 0;
let activeFetchController = null;
let activeAudioElement = null;
let activeAudioBlobUrl = null;
let activeVoiceTimeout = null;
let activeHeartbeat = null;

/**
 * Stops any currently playing speech immediately.
 */
export function stopCurrentVoiceAudio() {
  // Invalidate any active or in-flight playback sessions
  currentPlaybackId++;

  // Abort any in-flight /api/tts HTTP request
  if (activeFetchController) {
    try {
      activeFetchController.abort();
    } catch {}
    activeFetchController = null;
  }

  // Clear pending voice fallback timeouts & heartbeats
  if (activeVoiceTimeout) {
    clearTimeout(activeVoiceTimeout);
    activeVoiceTimeout = null;
  }
  if (activeHeartbeat) {
    clearInterval(activeHeartbeat);
    activeHeartbeat = null;
  }

  if (activeAudioElement) {
    try {
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
      activeAudioElement.src = '';
      activeAudioElement = null;
    } catch {
      // Safe cleanup
    }
  }

  if (activeAudioBlobUrl) {
    try {
      URL.revokeObjectURL(activeAudioBlobUrl);
      activeAudioBlobUrl = null;
    } catch {
      // Safe cleanup
    }
  }

  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.onvoiceschanged = null;
      // In Chrome/WebKit, calling resume before cancel ensures any paused/queued speech is flushed
      window.speechSynthesis.resume();
      window.speechSynthesis.cancel();
    } catch {
      // Safe cleanup
    }
  }
}

/**
 * Enhanced Browser Speech Synthesis fallback:
 * Searches for the highest-fidelity natural voices available on the user's OS,
 * with cadence and pitch tuned to sound human rather than robotic.
 */
export function speakEnhancedBrowserVoice(text, {
  voice = 'nova',
  language = 'en',
  onStart,
  onEnd,
  onError
} = {}) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (onError) onError(new Error('SpeechSynthesis not supported'));
    return;
  }

  // Allocate unique token for this browser utterance to prevent overlapping speech
  const thisPlaybackId = ++currentPlaybackId;

  // Clear any existing timers or callbacks
  if (activeVoiceTimeout) {
    clearTimeout(activeVoiceTimeout);
    activeVoiceTimeout = null;
  }
  if (activeHeartbeat) {
    clearInterval(activeHeartbeat);
    activeHeartbeat = null;
  }
  window.speechSynthesis.onvoiceschanged = null;

  try {
    window.speechSynthesis.resume();
    window.speechSynthesis.cancel();
  } catch {}

  const utterance = new SpeechSynthesisUtterance(text);

  // Dynamic pitch & cadence tuning per voice character
  if (voice === 'onyx') {
    utterance.pitch = 0.88; // Deep & authoritative
    utterance.rate = 0.94;
  } else if (voice === 'shimmer') {
    utterance.pitch = 1.16; // Bright & expressive
    utterance.rate = 1.02;
  } else if (voice === 'echo') {
    utterance.pitch = 0.93; // Warm, calm & patient
    utterance.rate = 0.95;
  } else if (voice === 'alloy') {
    utterance.pitch = 1.0;  // Crisp & balanced
    utterance.rate = 0.98;
  } else if (voice === 'nova') {
    utterance.pitch = 1.06; // Energetic & friendly
    utterance.rate = 1.02;
  } else if (voice === 'fable') {
    utterance.pitch = 0.98; // Articulate British
    utterance.rate = 0.96;
  } else {
    utterance.pitch = 1.0;
    utterance.rate = 0.96;
  }

  // Detect Hindi
  const hasHindi = /[\u0900-\u097F]/.test(text) || language === 'hi';
  utterance.lang = hasHindi ? 'hi-IN' : 'en-US';

  const findBestVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    if (hasHindi) {
      const hiVoice = voices.find((v) => v.lang && v.lang.startsWith('hi'));
      if (hiVoice) return hiVoice;
    }

    // Voice specific search preference
    let voiceSearchPatterns = [];
    if (voice === 'onyx') {
      voiceSearchPatterns = ['Daniel', 'David', 'Alex', 'Tom', 'Fred', 'Google UK English Male', 'Guy Online (Natural)', 'en-US'];
    } else if (voice === 'echo') {
      voiceSearchPatterns = ['Oliver', 'Daniel', 'David', 'Google UK English Male', 'en-US'];
    } else if (voice === 'shimmer') {
      voiceSearchPatterns = ['Victoria', 'Zira', 'Karen', 'Tessa', 'Samantha', 'Jenny Online (Natural)', 'en-US'];
    } else if (voice === 'alloy') {
      voiceSearchPatterns = ['Samantha', 'Google US English', 'Alloy', 'Karen', 'en-US'];
    } else if (voice === 'fable') {
      voiceSearchPatterns = ['Google UK English', 'Oliver', 'Serena', 'Arthur', 'en-GB'];
    } else {
      voiceSearchPatterns = ['Jenny Online (Natural)', 'Samantha', 'Google US English', 'Natural', 'en-US'];
    }

    for (const pattern of voiceSearchPatterns) {
      const found = voices.find((v) => v.name.toLowerCase().includes(pattern.toLowerCase()));
      if (found) return found;
    }

    // Default to any English voice
    return voices.find((v) => v.lang && v.lang.startsWith('en')) || voices[0];
  };

  const selectedSynthVoice = findBestVoice();
  if (selectedSynthVoice) {
    utterance.voice = selectedSynthVoice;
  }

  utterance.onstart = () => {
    if (thisPlaybackId !== currentPlaybackId) {
      try { window.speechSynthesis.cancel(); } catch {}
      return;
    }
    if (onStart) onStart();

    if (activeHeartbeat) clearInterval(activeHeartbeat);
    activeHeartbeat = setInterval(() => {
      if (thisPlaybackId !== currentPlaybackId || !window.speechSynthesis.speaking) {
        clearInterval(activeHeartbeat);
        activeHeartbeat = null;
      } else {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);
  };

  utterance.onend = () => {
    if (activeHeartbeat) {
      clearInterval(activeHeartbeat);
      activeHeartbeat = null;
    }
    if (thisPlaybackId === currentPlaybackId && onEnd) {
      onEnd();
    }
  };

  utterance.onerror = (e) => {
    if (activeHeartbeat) {
      clearInterval(activeHeartbeat);
      activeHeartbeat = null;
    }
    if (thisPlaybackId !== currentPlaybackId) return;

    if (e.error !== 'interrupted' && e.error !== 'canceled') {
      if (onError) onError(e);
    } else {
      if (onEnd) onEnd();
    }
  };

  let hasSpoken = false;
  const doSpeak = () => {
    if (hasSpoken || thisPlaybackId !== currentPlaybackId) return;
    hasSpoken = true;
    try {
      const v = findBestVoice();
      if (v) utterance.voice = v;
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis speak error:', err);
      if (onEnd) onEnd();
    }
  };

  // If voices are not yet loaded, wait briefly for voiceschanged with safe fallback timeout
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) {
    activeVoiceTimeout = setTimeout(() => {
      activeVoiceTimeout = null;
      try { window.speechSynthesis.onvoiceschanged = null; } catch {}
      if (thisPlaybackId === currentPlaybackId) {
        doSpeak();
      }
    }, 150);

    window.speechSynthesis.onvoiceschanged = () => {
      try { window.speechSynthesis.onvoiceschanged = null; } catch {}
      if (activeVoiceTimeout) {
        clearTimeout(activeVoiceTimeout);
        activeVoiceTimeout = null;
      }
      if (thisPlaybackId === currentPlaybackId) {
        doSpeak();
      }
    };
  } else {
    doSpeak();
  }
}

/**
 * Plays realistic human audio for given text.
 * First tries server-side high-definition /api/tts (OpenAI tts-1 / ElevenLabs / Google Neural TTS).
 * If unavailable, smoothly falls back to the enhanced browser neural voice.
 */
export async function playRealVoiceAudio(text, {
  voice = 'nova',
  language = 'en',
  speed = 1.0,
  onStart,
  onEnd,
  onError,
  onAudioElementCreated
} = {}) {
  // 1. Immediately cancel any prior audio playback or pending request
  stopCurrentVoiceAudio();

  if (!text || !text.trim()) {
    if (onEnd) onEnd();
    return;
  }

  // 2. Generate a unique playback token for this request
  const thisPlaybackId = ++currentPlaybackId;

  // 3. Setup abort controller for network fetch
  const abortController = new AbortController();
  activeFetchController = abortController;

  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice, speed }),
      signal: abortController.signal
    });

    // If cancelled or superseded while in flight, exit immediately
    if (thisPlaybackId !== currentPlaybackId) {
      return;
    }

    const contentType = response.headers.get('content-type') || '';

    // If server returned binary audio (MP3)
    if (response.ok && contentType.includes('audio/')) {
      const audioBlob = await response.blob();
      if (thisPlaybackId !== currentPlaybackId) return;

      const audioUrl = URL.createObjectURL(audioBlob);
      activeAudioBlobUrl = audioUrl;

      const audio = new Audio(audioUrl);
      activeAudioElement = audio;

      if (onAudioElementCreated) {
        onAudioElementCreated(audio);
      }

      audio.onplay = () => {
        if (thisPlaybackId === currentPlaybackId && onStart) {
          onStart();
        }
      };

      audio.onended = () => {
        if (thisPlaybackId === currentPlaybackId) {
          stopCurrentVoiceAudio();
          if (onEnd) onEnd();
        }
      };

      audio.onerror = (err) => {
        if (thisPlaybackId !== currentPlaybackId) return;
        console.warn('Audio playback error, falling back to neural voice:', err);
        stopCurrentVoiceAudio();
        speakEnhancedBrowserVoice(text, { voice, language, onStart, onEnd, onError });
      };

      try {
        await audio.play();
        return;
      } catch (playErr) {
        if (thisPlaybackId !== currentPlaybackId) return;
        console.warn('Audio.play() gesture policy fallback:', playErr.message);
        // Fallback to browser voice if autoplay blocked
        speakEnhancedBrowserVoice(text, { voice, language, onStart, onEnd, onError });
        return;
      }
    }

    // If server returned JSON fallback (e.g. demo mode or non-OpenAI key)
    if (thisPlaybackId === currentPlaybackId) {
      speakEnhancedBrowserVoice(text, { voice, language, onStart, onEnd, onError });
    }
  } catch (err) {
    if (err.name === 'AbortError' || thisPlaybackId !== currentPlaybackId) {
      // Intentionally aborted/cancelled; avoid fallback triggers
      return;
    }
    console.warn('Failed to fetch /api/tts, using enhanced neural voice:', err.message);
    if (thisPlaybackId === currentPlaybackId) {
      speakEnhancedBrowserVoice(text, { voice, language, onStart, onEnd, onError });
    }
  }
}

/**
 * WebRTC Realtime API Client
 * Manages full-duplex live audio communication directly with OpenAI's Realtime API.
 */
export class WebRTCRealtimeClient {
  constructor(options = {}) {
    this.voice = options.voice || 'nova';
    this.language = options.language || 'auto';
    this.mode = options.mode || 'casual';
    this.difficulty = options.difficulty || 'intermediate';
    this.goal = options.goal || 'Improve Fluency';

    // Event callbacks
    this.onTranscript = options.onTranscript || (() => {});
    this.onAiSpeakingState = options.onAiSpeakingState || (() => {});
    this.onUserSpeakingState = options.onUserSpeakingState || (() => {});
    this.onError = options.onError || (() => {});
    this.onConnectionChange = options.onConnectionChange || (() => {});
    this.onRemoteAudioStream = options.onRemoteAudioStream || (() => {});

    this.peerConnection = null;
    this.dataChannel = null;
    this.localStream = null;
    this.remoteAudioEl = null;
    this.isConnected = false;
  }

  /**
   * Checks if server supports OpenAI Realtime API session generation.
   */
  static async checkSupport() {
    try {
      const res = await fetch('/api/realtime/session', { method: 'GET' });
      if (!res.ok) return { supported: false };
      const data = await res.json();
      return data;
    } catch {
      return { supported: false };
    }
  }

  /**
   * Initializes and connects the WebRTC Realtime call.
   */
  async connect() {
    this.onConnectionChange('connecting');

    // 1. Get Ephemeral Token from server
    const sessionRes = await fetch('/api/realtime/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        voice: this.voice,
        language: this.language,
        mode: this.mode,
        difficulty: this.difficulty,
        goal: this.goal
      })
    });

    if (!sessionRes.ok) {
      throw new Error(`Realtime session failed with status ${sessionRes.status}`);
    }

    const sessionData = await sessionRes.json();
    if (!sessionData.supported || !sessionData.client_secret?.value) {
      const err = new Error(sessionData.reason || 'Realtime API not supported or configured.');
      err.code = sessionData.code || 'NOT_SUPPORTED';
      throw err;
    }

    const ephemeralToken = sessionData.client_secret.value;
    const model = sessionData.model || 'gpt-4o-realtime-preview';

    // 2. Request User Microphone
    this.localStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    // 3. Create WebRTC Peer Connection
    const pc = new RTCPeerConnection();
    this.peerConnection = pc;

    // Create remote audio receiver element
    this.remoteAudioEl = document.createElement('audio');
    this.remoteAudioEl.autoplay = true;

    pc.ontrack = (event) => {
      this.remoteAudioEl.srcObject = event.streams[0];
      this.onRemoteAudioStream(event.streams[0]);
    };

    // Add local microphone audio track
    this.localStream.getTracks().forEach((track) => pc.addTrack(track, this.localStream));

    // 4. Create DataChannel for realtime events and transcripts
    const dc = pc.createDataChannel('oai-events');
    this.dataChannel = dc;

    dc.addEventListener('open', () => {
      this.isConnected = true;
      this.onConnectionChange('connected');
    });

    dc.addEventListener('message', (e) => {
      try {
        const realtimeEvent = JSON.parse(e.data);
        this.handleRealtimeEvent(realtimeEvent);
      } catch (err) {
        console.warn('Failed to parse realtime event JSON:', err);
      }
    });

    pc.onconnectionstatechange = () => {
      this.onConnectionChange(pc.connectionState);
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        this.disconnect();
      }
    };

    // 5. Create Offer and Exchange SDP
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const sdpResponse = await fetch(`https://api.openai.com/v1/realtime?model=${model}`, {
      method: 'POST',
      body: offer.sdp,
      headers: {
        'Authorization': `Bearer ${ephemeralToken}`,
        'Content-Type': 'application/sdp'
      }
    });

    if (!sdpResponse.ok) {
      const errText = await sdpResponse.text();
      throw new Error(`SDP negotiation failed: ${sdpResponse.status} ${errText}`);
    }

    const answerSdp = await sdpResponse.text();
    await pc.setRemoteDescription({
      type: 'answer',
      sdp: answerSdp
    });

    return true;
  }

  /**
   * Dispatches incoming OpenAI Realtime DataChannel events.
   */
  handleRealtimeEvent(event) {
    switch (event.type) {
      case 'response.audio_transcript.delta':
        if (event.delta) {
          this.onTranscript({ role: 'assistant', delta: event.delta });
        }
        break;

      case 'conversation.item.input_audio_transcription.completed':
        if (event.transcript) {
          this.onTranscript({ role: 'user', fullText: event.transcript });
        }
        break;

      case 'response.audio.started':
        this.onAiSpeakingState(true);
        break;

      case 'response.audio.done':
        this.onAiSpeakingState(false);
        break;

      case 'input_audio_buffer.speech_started':
        this.onUserSpeakingState(true);
        break;

      case 'input_audio_buffer.speech_stopped':
        this.onUserSpeakingState(false);
        break;

      case 'error':
        console.warn('OpenAI Realtime error event:', event.error);
        if (this.onError) this.onError(event.error);
        break;

      default:
        break;
    }
  }

  /**
   * Interrupt the AI coach if speaking.
   */
  interrupt() {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      try {
        this.dataChannel.send(JSON.stringify({ type: 'response.cancel' }));
      } catch {
        // Safe ignore
      }
    }
    this.onAiSpeakingState(false);
  }

  /**
   * Mutes/Unmutes local microphone.
   */
  setMuted(muted) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = !muted;
      });
    }
  }

  /**
   * Disconnects and cleans up all WebRTC resources.
   */
  disconnect() {
    this.isConnected = false;
    this.onConnectionChange('disconnected');

    if (this.dataChannel) {
      try { this.dataChannel.close(); } catch {}
      this.dataChannel = null;
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach((t) => t.stop());
      this.localStream = null;
    }

    if (this.peerConnection) {
      try { this.peerConnection.close(); } catch {}
      this.peerConnection = null;
    }

    if (this.remoteAudioEl) {
      this.remoteAudioEl.srcObject = null;
      this.remoteAudioEl = null;
    }
  }
}

/**
 * Creates a Web Audio frequency analyser for dynamic waveform visualizers.
 */
export function createAudioAnalyser(streamOrElement) {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    const audioCtx = new AudioContextClass();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.8;

    let source = null;
    if (streamOrElement instanceof MediaStream) {
      source = audioCtx.createMediaStreamSource(streamOrElement);
      source.connect(analyser);
    } else if (streamOrElement instanceof HTMLAudioElement) {
      source = audioCtx.createMediaElementSource(streamOrElement);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
    }

    return {
      analyser,
      audioCtx,
      getFrequencyData: () => {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        return data;
      },
      cleanup: () => {
        try {
          if (source) source.disconnect();
          analyser.disconnect();
          if (audioCtx.state !== 'closed') audioCtx.close();
        } catch {
          // Safe cleanup
        }
      }
    };
  } catch (err) {
    console.warn('Web Audio analyser init error:', err);
    return null;
  }
}
