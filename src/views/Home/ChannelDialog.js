import React, { useState, useEffect } from 'react';
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

const ChannelDialog = inject('ussdChannelStore')(observer((props) => {
  const {
    id,
    title,
    hidden,
    hideDialog,
    isDraggable,
    ussdChannelStore,
  } = props;

  const [label, setLabel] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [labelErrorMessage, setLabelErrorMessage] = useState('');

  const reset = () => {
    setLabel('');
    setEndpoint('');
    setLabelErrorMessage('');
  };

  const saveOrCreate = () => {
    if (label === '') return setLabelErrorMessage('Label cannot be empty');
    hideDialog();
    if (id === null) return ussdChannelStore.createChannel({ label, endpoint });
    return ussdChannelStore.saveChannel({ id, label, endpoint });
  };

  useEffect(() => {
    reset();
    if (id !== null) {
      const c = ussdChannelStore.getChannel(id);
      setLabel(c.label || '');
      setEndpoint(c.endpoint || '');
    }
  }, [id]);

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
          required
          value={label}
          label="Channel Label"
          errorMessage={labelErrorMessage}
          iconProps={{ iconName: 'NumberSymbol' }}
          onChange={(e) => setLabel(e.target.value)}
        />
        <TextField
          value={endpoint}
          label="Channel Endpoint"
          iconProps={{ iconName: 'AddLink' }}
          onChange={(e) => setEndpoint(e.target.value)}
        />
      </Stack>
      <DialogFooter>
        <PrimaryButton
          onClick={saveOrCreate}
          text={id ? 'Save' : 'Create'}
          disabled={ussdChannelStore.isLoading}
        />
        <DefaultButton onClick={hideDialog} text="Cancel" />
      </DialogFooter>
    </Dialog>
  );
}));

export default ChannelDialog;
