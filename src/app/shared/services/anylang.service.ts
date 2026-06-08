import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AnylangService {

  private cache = new Map<string, string>();

  // Map common language codes to Azure Translation API language codes
  private langMap: { [key: string]: string } = {
    'en': 'en',
    'en-GB': 'en',
    'en-US': 'en',
    'es': 'es',
    'es-ES': 'es',
    'ca': 'ca', // Azure supports Catalan!
    'ca-ES': 'ca',
    'fr': 'fr',
    'fr-FR': 'fr',
    'de': 'de',
    'de-DE': 'de',
    'it': 'it',
    'it-IT': 'it',
    'pt': 'pt',
    'pt-PT': 'pt-pt',
    'pt-BR': 'pt',
    'nl': 'nl',
    'pl': 'pl',
    'ru': 'ru',
    'ja': 'ja',
    'zh': 'zh-Hans',
    'zh-CN': 'zh-Hans',
    'zh-TW': 'zh-Hant',
  };

  currentLanguage$ = new BehaviorSubject<string>('en-GB');
  modelDownloadProgress$ = new BehaviorSubject<number>(0);

  constructor(
    private storage: StorageService
  ) { }

  // Method to update current language (called when user changes language in settings)
  public updateCurrentLanguage(lang: string) {
    this.currentLanguage$.next(lang);
  }

  public async init() {
    // No initialization needed for Azure Translation API
    // Model download progress is not applicable
    this.modelDownloadProgress$.next(100);
  }

  public async translate(text: string, _targetLang: string): Promise<string> {
    // Translation feature currently disabled.
    // To re-enable, implement the Azure Translation API call here.
    return text;
  }

  public async translateBulk(strings: string[], targetLang: string): Promise<string[]> {
    // Translation feature currently disabled.
    // To re-enable, implement the Azure Translation API bulk call here.
    return strings;
  }
}
