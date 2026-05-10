// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {
  type ResponseUtteranceData,
  type ResVoices,
  type ResGeneratedUtterance,
} from '@dada78641/sayserver';
import {type ServicesConfig} from '@yapcraft/util/config.ts';
import {server} from '@yapcraft/server/index.ts';

interface TTSDefaults {
  [id: string]: {
    service: string,
    set: string[],
    voice: string | string[],
  }
}

/**
 * TTS service.
 * 
 * This is a basic wrapper that handles API calls to SayServer.
 */
export class TTSService {
  private config: ServicesConfig['tts'];
  private defaults: TTSDefaults = {
    local: {
      // Use novelty voices (use the seed to pick one).
      service: 'DarwinSpeechSynthesizer',
      set: ['novelty'],
      voice: [],
    },
    remote: {
      // Just use Brian. He's the funniest.
      service: 'StreamlabsAmazonPolly',
      set: ['polly_male'],
      voice: 'Brian'
    }
  };
  public isAvailable: boolean = false;

  constructor() {
    this.config = server.config.services.tts;
  }

  /**
   * Returns an API URL.
   */
  public apiURL(path: string) {
    return new URL(path, this.config.sayserver.address).toString();
  }

  /**
   * Returns a list of all supported voices.
   * 
   * Currently this is not really utilized in any way,
   * except to check that the server is up and running.
   */
  public async getVoices(): Promise<ResVoices> {
    const data = await this.apiCall('/api/voices') as ResVoices;
    return data;
  }

  /**
   * Runs an API call for an utterance and returns the result.
   */
  public async getUtterance(prompt: string, seed: string, type: 'remote' | 'local'): Promise<ResponseUtteranceData> {
    console.log(`getting SayServer utterance for %o type %o`, seed, type);
    const defaults = this.defaults[type];
    const args = {
      prompt,
      seed,
      ...defaults,
    };
    const res = await this.apiCall('/api/generate', args) as ResGeneratedUtterance;
    if (!res?.output) {
      throw new Error('Could not get utterance');
    }
    return res.output;
  }

  /**
   * Runs an API call and returns the result.
   */
  private async apiCall(path: string, data?: any) {
    const url = this.apiURL(path);
    const options: RequestInit = {
      method: data ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if (data) {
      options.body = JSON.stringify(data);
    }
    const res = await fetch(url, options);
    const json = await res.json();
    return json;
  }

  /**
   * Initializes the TTS service.
   * 
   * This really just checks that SayServer is available. If it's not available,
   * this can be run again at a later time to recheck and get the TTS service working.
   */
  public async initialize() {
    try {
      const voices = await this.getVoices();
      const voiceTypes = Object.keys(voices);
      console.log(`initialized SayServer on %o supporting these types: %o`, this.config.sayserver, voiceTypes);
      this.isAvailable = true;
    }
    catch (err) {
      console.error(`SayServer does not appear to be available. will recheck later. error: %o`, String(err));
      this.isAvailable = false;
    }
  }
}
