import React from 'react';
import './text.scss';
import Loader from '../Loader/Loader';
import RichTextEditor from 'react-rte';

const TextViewer = ({ content, fullScreen }) => {
  const [editorState, setEditorState] = React.useState(() => RichTextEditor.createEmptyValue());
  const [rawData, setRawData] = React.useState('');

  React.useEffect(() => {
    fetch(content)
      .then((res) => res.text())
      .then((text) => {
        setRawData(text);
        setEditorState(RichTextEditor.createValueFromString(text, 'html'));
      });
  }, []);

  const handleSave = () => {
    console.log(editorState.toString('html'));
  };

  const saveButton = () => (
    <div className="ButtonGroup__root___3lEAn" onClick={handleSave}>
      <div className="ButtonWrap__root___1EO_R">
        <button type="button" title="Save" className="IconButton__root___3tqZW Button__root___1gz0c">
          <span className="">Save</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="text" style={fullScreen ? { width: '100vw', height: '87vh' } : {}}>
      {/* <Loader /> */}
      <RichTextEditor
        autoFocus
        placeholder="Start typing here..."
        customControls={[saveButton]}
        value={editorState}
        onChange={setEditorState}
        rootStyle={{ width: '100%' }}
        editorStyle={{ height: '90%' }}
      />
    </div>
  );
};
export default TextViewer;
