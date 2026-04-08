
import { tamilVoiceCommands } from "./mockData";

// Add TypeScript interface definitions for SpeechRecognition
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

class VoiceRecognitionService {
  private recognition: any = null;
  private isListening: boolean = false;
  private commandCallback: ((command: string) => void) | null = null;
  private errorCallback: ((error: string) => void) | null = null;

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    try {
      // Check if browser supports SpeechRecognition
      if ('webkitSpeechRecognition' in window) {
        // @ts-ignore - TypeScript doesn't know about webkitSpeechRecognition
        this.recognition = new webkitSpeechRecognition();
      } else if ('SpeechRecognition' in window) {
        // @ts-ignore - SpeechRecognition may not be in the TypeScript types
        this.recognition = new SpeechRecognition();
      } else {
        console.error("Browser doesn't support speech recognition");
        return;
      }

      if (this.recognition) {
        // Configure recognition
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'ta-IN'; // Tamil language
        
        // Set up event handlers
        this.recognition.onresult = this.handleResult.bind(this);
        this.recognition.onerror = this.handleError.bind(this);
        this.recognition.onend = () => {
          this.isListening = false;
        };
      }
    } catch (error) {
      console.error("Error initializing speech recognition:", error);
    }
  }

  private handleResult(event: SpeechRecognitionEvent) {
    const transcript = event.results[0][0].transcript.trim().toLowerCase();
    console.log("Voice recognized:", transcript);
    
    // Check for Tamil commands
    let command = "";
    
    // Check search commands
    for (const [tamilCmd, englishAction] of Object.entries(tamilVoiceCommands.search)) {
      if (transcript.includes(tamilCmd)) {
        command = englishAction as string;
        break;
      }
    }
    
    // Check navigation commands
    if (!command) {
      for (const [tamilCmd, englishAction] of Object.entries(tamilVoiceCommands.navigation)) {
        if (transcript.includes(tamilCmd)) {
          command = englishAction as string;
          break;
        }
      }
    }
    
    // Check checkout commands
    if (!command) {
      for (const [tamilCmd, englishAction] of Object.entries(tamilVoiceCommands.checkout)) {
        if (transcript.includes(tamilCmd)) {
          command = englishAction as string;
          break;
        }
      }
    }
    
    // Check product commands for farmers
    if (!command) {
      for (const [tamilCmd, englishAction] of Object.entries(tamilVoiceCommands.products)) {
        if (transcript.includes(tamilCmd)) {
          command = englishAction as string;
          break;
        }
      }
    }
    
    // Check order commands
    if (!command) {
      for (const [tamilCmd, englishAction] of Object.entries(tamilVoiceCommands.orders)) {
        if (transcript.includes(tamilCmd)) {
          command = englishAction as string;
          break;
        }
      }
    }
    
    if (command && this.commandCallback) {
      this.commandCallback(command);
    } else if (this.commandCallback) {
      // If no predefined command matched, just pass the raw transcript
      this.commandCallback(transcript);
    }
  }

  private handleError(event: SpeechRecognitionErrorEvent) {
    console.error("Speech recognition error:", event.error);
    if (this.errorCallback) {
      this.errorCallback(event.error);
    }
    this.isListening = false;
  }

  public startListening(commandCallback: (command: string) => void, errorCallback?: (error: string) => void) {
    if (!this.recognition) {
      if (errorCallback) errorCallback("Speech recognition not supported");
      return false;
    }
    
    if (this.isListening) return true;
    
    try {
      this.commandCallback = commandCallback;
      this.errorCallback = errorCallback || null;
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      if (errorCallback) errorCallback("Failed to start speech recognition");
      return false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
        this.isListening = false;
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      }
    }
  }

  public isSupported() {
    return !!this.recognition;
  }
}

// Singleton instance
export const voiceRecognition = new VoiceRecognitionService();

export const useVoiceCommand = (callback: (command: string) => void) => {
  const startVoiceRecognition = () => {
    voiceRecognition.startListening(
      callback,
      (error) => console.error("Voice recognition error:", error)
    );
  };

  return {
    startListening: startVoiceRecognition,
    stopListening: voiceRecognition.stopListening.bind(voiceRecognition),
    isSupported: voiceRecognition.isSupported()
  };
};
