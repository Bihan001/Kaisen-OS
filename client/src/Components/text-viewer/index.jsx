import React, { useContext } from 'react';
import { clone } from 'ramda';
import './text.scss';
import Loader from '../Loader/Loader';
import RichTextEditor from 'react-rte';
import { findFileType } from '../../Utility/functions';
import firebase from '../../firebase';
import axios from 'axios';
import { backendUrl } from '../../backendUrl';

import { DirectoryContext } from '../../Contexts/DirectoryContext/DirectoryContext';
import { ScreenContext } from '../../Contexts/ScreenContext';
import { getLayout } from '../../Utility/functions';
import { AuthContext } from '../../Contexts/AuthContext';
import { ClassFile, ClassFolder } from '../../Classes/Classes';

const TextViewer = ({ content, editableBy, path, fullScreen }) => {
  const { screenState } = useContext(ScreenContext);

  const { dirPaths, UpdatedirPaths } = useContext(DirectoryContext);
  const { user } = useContext(AuthContext);

  const [editorState, setEditorState] = React.useState(() => RichTextEditor.createEmptyValue());
  const [storageRef] = React.useState(firebase.storage().ref());

  React.useEffect(() => {
    fetch(content)
      .then((res) => res.text())
      .then((text) => {
        setEditorState(RichTextEditor.createValueFromString(text, 'html'));
      });
  }, []);

  const handleUpdateAuthorized = () => {
    if (user.isAdmin) return true;
    return user.id === editableBy.id;
  };

  const handleSave = async () => {
    if (!handleUpdateAuthorized()) return console.log('Not Authorized to update!');

    // delete old file
    const oldFileRef = firebase.storage().refFromURL(content);
    await oldFileRef.delete();

    //add new file
    const rawData = editorState.toString('html');
    console.log(rawData);
    const newFile = new Blob([rawData], { type: 'text/plain;charset=utf-8' });
    const fileType = findFileType('text/plain');
    const metadata = { contentType: fileType };
    storageRef
      .child(Date.now().toString() + path.split('#')[path.split('#').length - 1].toString())
      .put(newFile, metadata)
      .then((snap) => {
        snap.ref.getDownloadURL().then(async (url) => {
          try {
            console.log(path, url);
            const res = await axios.post(`${backendUrl}/api/files/updateFile`, { path, fileContent: url });
            var obj = clone(dirPaths);
            var pastFile = obj[res.data.data.path];
            pastFile.content = res.data.data.content;
            UpdatedirPaths(obj);
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
    <div className="text" style={getLayout(fullScreen, screenState)}>
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
