import React from 'react';
import './text.scss';
import Loader from '../Loader/Loader';
import RichTextEditor from 'react-rte';
import { findFileType } from '../../Utility/functions';
import firebase from '../../firebase';
import axios from 'axios';
import { backendUrl } from '../../backendUrl';

const TextViewer = ({ content, path, fullScreen }) => {
  const [editorState, setEditorState] = React.useState(() => RichTextEditor.createEmptyValue());
  const [storageRef] = React.useState(firebase.storage().ref());

  React.useEffect(() => {
    fetch(content)
      .then((res) => res.text())
      .then((text) => {
        setEditorState(RichTextEditor.createValueFromString(text, 'html'));
      });
  }, []);

  const handleSave = () => {
    const rawData = editorState.toString('html');
    console.log(rawData);
    const newFile = new Blob([rawData], { type: 'text/plain;charset=utf-8' });
    const fileType = findFileType('text/plain');
    const metadata = { contentType: fileType };
    storageRef
      .child(Date.now().toString() + '_text_file.txt')
      .put(newFile, metadata)
      .then((snap) => {
        snap.ref.getDownloadURL().then(async (url) => {
          try {
            console.log(path, url);
            const res = await axios.post(`${backendUrl}/api/files/updateFile`, { path, fileContent: url });
            console.log(res.data);
          } catch (err) {
            console.log(err);
          }
        });
      });
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
