import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';
import {
  Stack,
  Dialog,
  TextField,
  DialogType,
  DialogFooter,
  PrimaryButton,
  DefaultButton,
  ContextualMenu,
} from 'office-ui-fabric-react';

const dragOptions = {
  moveMenuItemText: 'Move',
  closeMenuItemText: 'Close',
  menu: ContextualMenu,
};

const StructureDialog = inject('ussdStructureStore')(observer((props) => {
  const {
    id,
    title,
    hidden,
    hideDialog,
    isDraggable,
    ussdStructureStore,
  } = props;


  const [label, setLabel] = useState('');

  const saveOrCreate = () => {
    if (id === null) {
      return ussdStructureStore
        .createStructure({ label })
        .then(() => hideDialog());
    }
    return ussdStructureStore
      .updateStructure({ label }, id)
      .then(() => hideDialog());
  };

  return (
    <Dialog
      hidden={hidden}
      onDismiss={hideDialog}
      dialogContentProps={{
        title,
        type: DialogType.normal,
      }}
      modalProps={{
        isBlocking: true,
        styles: { main: { maxWidth: 550 } },
        dragOptions: isDraggable ? dragOptions : undefined,
      }}
    >
      <Stack tokens={{ childrenGap: 10 }}>
        <TextField
          value={label}
          label="Channel Label"
          iconProps={{ iconName: 'Edit' }}
          onChange={(e) => setLabel(e.target.value)}
        />
      </Stack>
      <DialogFooter>
        <PrimaryButton
          onClick={saveOrCreate}
          text={id ? 'Save' : 'Create'}
          disabled={ussdStructureStore.isLoading}
        />
        <DefaultButton onClick={hideDialog} text="Cancel" />
      </DialogFooter>
    </Dialog>
  );
}));

export default StructureDialog;
