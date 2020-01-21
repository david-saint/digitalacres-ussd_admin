import React, { useState, useEffect, useContext } from 'react';
import { inject, observer } from 'mobx-react';
import { CommandButton } from 'office-ui-fabric-react';

import useQuery from '../../hooks/useQuery';
import DialogContext from '../../views/Editor/contexts/DialogContext';

import './index.css';

const DEFAULT_TITLE = 'No structure selected';

const EditorHeader = inject('ussdChannelStore', 'ussdStructureStore')(observer((props) => {
  const { ussdChannelStore, ussdStructureStore } = props;
  const [disabled, setDisabled] = useState(true);
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [activatable, setActivatable] = useState(false);
  const [dialog, setDialog] = useContext(DialogContext);

  const query = useQuery();

  useEffect(() => {
    if (!ussdStructureStore.structure && query.get('structure')) {
      ussdStructureStore.getStructure(
        parseInt(query.get('structure'), 10),
      );
    }
  }, []);

  useEffect(() => {
    const { structure } = ussdStructureStore;
    const { activeChannel } = ussdChannelStore;
    if (structure !== null) {
      setDisabled(false);
      setTitle(structure.label || activeChannel.label);
      setActivatable(!structure.is_active);
    } else {
      setDisabled(true);
      setTitle(DEFAULT_TITLE);
      setActivatable(false);
    }
  }, [ussdStructureStore.structure]);

  const menuProps = {
    items: [
      {
        key: 'editStructure',
        text: 'Rename Label',
        iconProps: { iconName: 'Edit' },
        onClick: () => {
          setDialog({
            ...dialog,
            visible: true,
            title: 'Edit Structure Label',
            id: ussdStructureStore.structure.id,
          });
        },
      },
      {
        key: 'deleteStructure',
        text: 'Delete Structure',
        iconProps: { iconName: 'Delete' },
        onClick: () => {
          ussdStructureStore.deleteStructure();
        },
      },
      {
        key: 'activateStructure',
        text: 'Activate Structure',
        disabled: !activatable,
        iconProps: { iconName: 'ReceiptCheck' },
        onClick: () => {
          ussdStructureStore.activateStructure();
        },
      },
    ],
  };

  return (
    <header>
      <CommandButton
        text={title}
        disabled={disabled}
        menuProps={menuProps}
        className="header-label"
        iconProps={{ iconName: 'NumberSymbol' }}
      />
    </header>
  );
}));

export default EditorHeader;
