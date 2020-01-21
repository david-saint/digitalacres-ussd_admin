import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import MainView from './MainView';
import NodeEditor from './NodeEditor';
import useQuery from '../../hooks/useQuery';
import StructureDialog from './StructureDialog';
import StructureSidebar from './StructureSidebar';
import DialogContext from './contexts/DialogContext';
import EditorHeader from '../../components/EditorHeader/index';

import './index.css';

/**
 * @class EditorPage
 */
const EditorPage = inject('ussdChannelStore')(observer((props) => {
  const { ussdChannelStore } = props;
  const query = useQuery();
  const channelId = parseInt(query.get('channel_id'), 10);

  const [dialog, setDialog] = useState({ id: null, visible: false, title: '' });

  if (!ussdChannelStore.activeChannel && !channelId) {
    return <Redirect to="/" />;
  }

  if (!ussdChannelStore.activeChannel && channelId) {
    const channel = ussdChannelStore.makeChannelActive(channelId);
    if (!channel) {
      return <Redirect to="/" />;
    }
  }

  return (
    <div className="EditorContainer">
      <DialogContext.Provider value={[dialog, setDialog]}>
        <EditorHeader />
        <div>
          <StructureSidebar />
          <MainView />
          <NodeEditor />
        </div>
      </DialogContext.Provider>
      <StructureDialog
        isDraggable
        id={dialog.id}
        title={dialog.title}
        hidden={!dialog.visible}
        hideDialog={() => setDialog({ ...dialog, visible: false })}
      />
    </div>
  );
}));

export default EditorPage;
