import { useState, useCallback, useMemo } from 'react';
import { Editor, createEditor, Transforms, Text } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';

import DefaultElement from '../slateComponents/defaultElement';
import CodeElement from '../slateComponents/codeElement';
import Leaf from '../slateComponents/leafElement';

const CustomEditor = {
  isBoldMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.bold === true,
      universal: true,
    });

    return !!match;
  },

  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === 'code',
    });

    return !!match;
  },

  toggleBoldMark(editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor);
    Transforms.setNodes(
      editor,
      { bold: isActive ? null : true },
      { match: (n) => Text.isText(n), split: true }
    );
  },

  toggleCodeBlock(editor) {
    const isActive = CustomEditor.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? null : 'code' },
      { match: (n) => Editor.isBlock(editor, n) }
    );
  },
};

const EditorComponent = () => {
  const [editor] = useState(() => withReact(withHistory(createEditor())));

  const initialValue = useMemo(
    () =>
      JSON.parse(localStorage.getItem('content')) || [
        {
          type: 'paragraph',
          children: [{ text: 'A line of text in a paragraph.' }],
        },
      ],
    []
  );

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <Slate
      editor={editor}
      value={initialValue}
      onChange={(value) => {
        const isAstChange = editor.operations.some(
          (op) => 'set_selection' !== op.type
        );
        if (isAstChange) {
          // Save the value to Local Storage.
          const content = JSON.stringify(value);
          localStorage.setItem('content', content);
        }
      }}
    >
      <div>
        <button
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleBoldMark(editor);
          }}
        >
          Bold
        </button>
        <button
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleCodeBlock(editor);
          }}
        >
          Code Block
        </button>
      </div>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={(event) => {
          if (event.ctrlKey || event.metaKey) {
            // eslint-disable-next-line default-case
            switch (event.key) {
              // When "`" is pressed, keep our existing code block logic.
              case '`': {
                event.preventDefault();
                CustomEditor.toggleCodeBlock(editor);
                break;
              }

              // When "B" is pressed, bold the text in the selection.
              case 'b': {
                event.preventDefault();
                CustomEditor.toggleBoldMark(editor);
                break;
              }
            }
          }
        }}
      />
    </Slate>
  );
};

export default EditorComponent;
