import React, { useState, useEffect, useContext } from 'react';
import uuid from 'uuid/v4';
import { inject, observer } from 'mobx-react';
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { mergeStyles, mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import {
  Selection,
  DetailsList,
  SelectionMode,
  DetailsListLayoutMode,
} from 'office-ui-fabric-react/lib/DetailsList';

import DialogContext from './contexts/DialogContext';
// TODO: import Loader from '../../components/Loader/index';

const classNames = mergeStyleSets({
  fileIconHeaderIcon: {
    padding: 0,
    fontSize: '16px',
  },
  fileIconCell: {
    textAlign: 'center',
    selectors: {
      '&:before': {
        content: '.',
        display: 'inline-block',
        verticalAlign: 'middle',
        height: '100%',
        width: '0px',
        visibility: 'hidden',
      },
    },
  },
  fileIconImg: {
    verticalAlign: 'middle',
    maxHeight: '16px',
    maxWidth: '16px',
  },
  controlWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  smallText: {
    fontSize: '12px',
  },
});

const iconClass = mergeStyles({
  fontSize: 14,
  height: 14,
  width: 14,
});

const StructureSidebar = inject('ussdChannelStore', 'ussdStructureStore')(observer((props) => {
  const { ussdChannelStore, ussdStructureStore } = props;
  const [items, setItems] = useState([]);
  const [dialog, setDialog] = useContext(DialogContext);
  const [key, setKey] = useState(uuid());

  useEffect(() => {
    ussdChannelStore.loadStructures()
      .then(() => setItems(ussdChannelStore.structures));
  }, []);

  useEffect(() => {
    setItems(ussdChannelStore.structures);
    setKey(uuid());
  }, [ussdChannelStore.structures]);

  const columns = [
    {
      key: 'column1',
      name: '',
      className: classNames.fileIconCell,
      iconClassName: classNames.fileIconHeaderIcon,
      ariaLabel: 'Column operations for File type, Press to sort on File type',
      fieldName: 'name',
      minWidth: 16,
      maxWidth: 16,
      onRender: () => (<FontIcon iconName="Code" className={iconClass} />),
    },
    {
      key: 'column2',
      name: 'Structure Label',
      fieldName: 'name',
      minWidth: 120,
      maxWidth: 120,
      isRowHeader: true,
      isResizable: true,
      data: 'string',
      isPadded: false,
      onRender: (item) => (
        <span className="structure-label">
          {item.label || ussdChannelStore.activeChannel.label}
        </span>
      ),
    },
    {
      key: 'column3',
      name: 'Status',
      fieldName: 'dateModifiedValue',
      className: classNames.fileIconCell,
      iconClassName: classNames.fileIconHeaderIcon,
      isIconOnly: true,
      iconName: 'WebAppBuilderModule',
      minWidth: 34,
      maxWidth: 34,
      data: 'string',
      onRender: (item) => (
        <span className={`status-cell ${item.is_active ? 'active' : 'inactive'}`}>
          {item.status}
        </span>
      ),
      isPadded: false,
    },
  ];

  const createStructure = () => {
    setDialog({
      ...dialog,
      id: null,
      visible: true,
      title: 'Create a Structure',
    });
  };

  const _getKey = (item) => item.id;

  const selection = new Selection({
    onSelectionChanged: () => {
      const s = selection.getSelection()[0];
      if (s) ussdStructureStore.getStructure(s.id);
    },
  });

  return (
    <div className="structure-sidebar">
      {/* TODO: ussdChannelStore.structuresLoading && <Loader color="#333333" /> */}
      <DetailsList
        setKey={key}
        getKey={_getKey}
        items={items}
        isHeaderVisible
        columns={columns}
        selection={selection}
        selectionPreservedOnEmptyClick
        selectionMode={SelectionMode.single}
        layoutMode={DetailsListLayoutMode.justified}
      />
      <div className="structure-actions">
        <IconButton
          onClick={createStructure}
          title="Create a new structure"
          iconProps={{ iconName: 'Add' }}
          styles={{ icon: { fontSize: '12px' } }}
        />
      </div>
    </div>
  );
}));

export default StructureSidebar;
