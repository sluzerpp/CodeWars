import CodeMirrorEditor, { EditorProps } from '../Editor';
import { javaLanguage } from '@codemirror/lang-java';

export function EditorJava(props: EditorProps) {
  return <CodeMirrorEditor {...props} extensions={[javaLanguage]}></CodeMirrorEditor>;
}
