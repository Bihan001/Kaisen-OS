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
import { AuthContext } from '../../Contexts/AuthContext';
import { ScreenContext } from '../../Contexts/ScreenContext/index';
import { ClassFile, ClassFolder } from '../../Classes/Classes';
import { ThemeContext } from '../../Contexts/ThemeContext/ThemeContext';

const TextViewer = ({ content, editableBy, path, fullScreen }) => {
  const { dirPaths, UpdatedirPaths } = useContext(DirectoryContext);
  const { user } = useContext(AuthContext);
  const { screenState } = useContext(ScreenContext);
  const { theme } = useContext(ThemeContext);

  const [editorState, setEditorState] = React.useState(() => RichTextEditor.createEmptyValue());
  const [storageRef] = React.useState(firebase.storage().ref());

  React.useEffect(() => {
    fetch(content)
      .then((res) => res.text())
      .then((text) => {
        setEditorState(RichTextEditor.createValueFromString(text, 'html'));
      });
  }, []);

  React.useEffect(() => {
    let res = document.querySelectorAll('.IconButton__root___3tqZW.Button__root___1gz0c');
    let boldRes = document.querySelectorAll('.IconButton__isActive___2Ey8p');
    res.forEach((btn) => {
      btn.style.border = 'none';
      btn.style.background = theme + '33';
      btn.style.paddingLeft = '5px';
      btn.style.paddingRight = '5px';
    });
    boldRes.forEach((btn) => {
      btn.style.background = theme + '66';
    });
    let dropdownRes = document.querySelectorAll('.Dropdown__value___34Py9');
    dropdownRes.forEach((select) => {
      select.style.border = 'none';
      select.style.background = theme + '33';
      select.style.outline = 'none';
    });
    document.querySelectorAll('.Dropdown__root___3ALmx select').forEach((select) => {
      select.style.outline = 'none';
    });
    let dropdownResOptions = document.querySelectorAll('.Dropdown__root___3ALmx select option');
    dropdownResOptions.forEach((option) => {
      option.style.fontSize = '1.5rem';
    });
  });

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
    <div className="text">
      {/* <Loader /> */}
      <RichTextEditor
        autoFocus
        placeholder="Start typing here..."
        customControls={[saveButton]}
        value={editorState}
        onChange={setEditorState}
        rootStyle={{ width: '100%' }}
        editorStyle={{ height: screenState.mobileView ? '70%' : '90%' }}
      />
    </div>
  );
};
export default TextViewer;
