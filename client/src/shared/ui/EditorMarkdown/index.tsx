import CodeMirrorEditor, { EditorProps } from '../Editor';
import { markdownLanguage } from '@codemirror/lang-markdown';

export function EditorMarkdown(props: EditorProps) {
  return (
    <CodeMirrorEditor
      {...props}
      placeholder="Используйте Markdown"
      extensions={[markdownLanguage]}
    ></CodeMirrorEditor>
  );
}
