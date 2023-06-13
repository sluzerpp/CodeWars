import CodeMirrorEditor, { EditorProps } from '../Editor';
import { csharpLanguage } from '@replit/codemirror-lang-csharp';

export function EditorCS(props: EditorProps) {
  return <CodeMirrorEditor {...props} extensions={[csharpLanguage]}></CodeMirrorEditor>;
}
