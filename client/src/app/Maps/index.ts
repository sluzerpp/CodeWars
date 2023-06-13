import { LANGUAGES } from '@/shared/enums';
import { EditorCS } from '@/shared/ui/EditorCS';
import { EditorJavascript } from '@/shared/ui/EditorJS';
import { EditorJava } from '@/shared/ui/EditorJava';
import { EditorTypescript } from '@/shared/ui/EditorTS';

export const EditorMap = new Map([
  [String(LANGUAGES.cs), EditorCS],
  [String(LANGUAGES.java), EditorJava],
  [String(LANGUAGES.js), EditorJavascript],
  [String(LANGUAGES.ts), EditorTypescript],
]);
