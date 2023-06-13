import CodeMirrorEditor, { EditorProps } from '../Editor';
import { javascriptLanguage } from '@codemirror/lang-javascript';

export function EditorJavascript(props: EditorProps) {
  return <CodeMirrorEditor {...props} extensions={[javascriptLanguage]}></CodeMirrorEditor>;
}
