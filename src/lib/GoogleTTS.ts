export interface TTSConfig {
  text: string;
  languageCode: string;
  name?: string; // Specific voice name
  ssmlGender?: 'MALE' | 'FEMALE' | 'NEUTRAL';
  speakingRate?: number;
}

export const GOOGLE_TTS_VOICES = [
  { name: 'en-US-Journey-D', languageCode: 'en-US', gender: 'MALE', label: 'US Male (Journey)' },
  { name: 'en-US-Journey-F', languageCode: 'en-US', gender: 'FEMALE', label: 'US Female (Journey)' },
  { name: 'en-GB-Neural2-B', languageCode: 'en-GB', gender: 'MALE', label: 'UK Male' },
  { name: 'en-GB-Neural2-A', languageCode: 'en-GB', gender: 'FEMALE', label: 'UK Female' },
  { name: 'en-AU-Neural2-B', languageCode: 'en-AU', gender: 'MALE', label: 'AU Male' },
  { name: 'en-AU-Neural2-A', languageCode: 'en-AU', gender: 'FEMALE', label: 'AU Female' },
  { name: 'en-IN-Neural2-B', languageCode: 'en-IN', gender: 'MALE', label: 'IN Male' },
  { name: 'en-IN-Neural2-A', languageCode: 'en-IN', gender: 'FEMALE', label: 'IN Female' },
];

export async function synthesizeSpeech(config: TTSConfig, apiKey: string): Promise<string> {
  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

  const payload = {
    input: {
      text: config.text,
    },
    voice: {
      languageCode: config.languageCode,
      name: config.name,
      ssmlGender: config.ssmlGender,
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: config.speakingRate || 1.0,
    },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'TTS request failed');
    }

    const data = await response.json();
    return `data:audio/mp3;base64,${data.audioContent}`;
  } catch (error) {
    console.error('Google TTS Error:', error);
    throw error;
  }
}
