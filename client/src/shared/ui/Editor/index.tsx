import CodeMirror from '@uiw/react-codemirror';
import { history } from '@codemirror/commands';
import { Extension } from '@codemirror/state';
import { autocompletion, closeBrackets } from '@codemirror/autocomplete';
import { bracketMatching, syntaxHighlighting } from '@codemirror/language';
import { oneDarkHighlightStyle, oneDark } from '@codemirror/theme-one-dark';
import './index.scss';

export interface EditorProps extends React.ComponentPropsWithoutRef<typeof CodeMirror> {
  extensions?: Extension[];
  className?: string;
  value?: string;
  setValue?: CallableFunction;
}

export default function CodeMirrorEditor({
  extensions,
  className,
  value,
  setValue,
  ...props
}: EditorProps) {
  const exts = [
    bracketMatching(),
    closeBrackets(),
    history(),
    autocompletion(),
    oneDark,
    syntaxHighlighting(oneDarkHighlightStyle),
  ];

  if (extensions) {
    exts.push(...extensions);
  }

  const changeHandler = (val: string) => {
    if (setValue) {
      setValue(val);
    }
  };

  return (
    <CodeMirror
      value={value}
      theme="dark"
      className={`editor ${className ? className : ''}`}
      extensions={exts}
      onChange={changeHandler}
      {...props}
    />
  );
}
