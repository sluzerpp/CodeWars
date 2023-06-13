import CodeMirrorEditor, { EditorProps } from '../Editor';
import { typescriptLanguage } from '@codemirror/lang-javascript';

export function EditorTypescript(props: EditorProps) {
  return <CodeMirrorEditor {...props} extensions={[typescriptLanguage]}></CodeMirrorEditor>;
}
