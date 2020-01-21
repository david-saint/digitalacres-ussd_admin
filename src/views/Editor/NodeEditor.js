import React, { useState, useEffect, useContext } from 'react';
import { inject, observer } from 'mobx-react';
import {
  Stack,
  Toggle,
  Fabric,
  ComboBox,
  TextField,
  mergeStyles,
  ActionButton,
  PrimaryButton,
} from 'office-ui-fabric-react';

import NodeContext from './contexts/NodeContext';

const DEFAULT_NODE = {
  name: '',
  action: 'next',
  text: '',
  path: '',
  isError: false,
};

const wrapperClassName = mergeStyles({
  selectors: {
    '& > *': { marginBottom: '0px' },
    '& .ms-ComboBox': { maxWidth: '300px' },
  },
});

const INITIAL_OPTIONS = [];


const NodeEditor = inject('ussdStructureStore')(observer((props) => {
  const { ussdStructureStore } = props;
  const [node, setNode] = useState(DEFAULT_NODE);
  const [disabled, setDisabled] = useState(true);
  const [tree, setTree] = useContext(NodeContext);
  const [actions, setActions] = useState(INITIAL_OPTIONS);
  const n = ussdStructureStore.ussdCore && ussdStructureStore.ussdCore.active;

  const generateActions = () => {
    if (ussdStructureStore.actions.length) {
      return ussdStructureStore.actions.map((i) => (
        { key: i, text: i }
      ));
    }
    return [];
  };

  useEffect(() => {
    ussdStructureStore.loadActions()
      .then(() => setActions([
        ...INITIAL_OPTIONS,
        ...generateActions(),
      ]));
  }, []);

  useEffect(() => {
    if (n === null) {
      setDisabled(true);
      setNode(DEFAULT_NODE);
    }

    if (n !== null) {
      setDisabled(false);
      setNode({
        ...node,
        ...n,
        isError: n._id === 'errorNode',
      });
    }
  }, [n]);

  const update = () => {
    ussdStructureStore.ussdCore.update(node);
  };

  return (
    <Stack tokens={{ childrenGap: 8 }}>
      <Stack horizontal tokens={{ childrenGap: 35 }}>
        <Toggle
          inlineLabel
          onText="yes"
          offText="no"
          label="Collapse Node on click"
          checked={tree.collapsible}
          onChange={(_, value) => setTree({ ...tree, collapsible: value })}
        />
      </Stack>
      <TextField
        required
        value={node.name}
        label="Node Name"
        disabled={disabled}
        iconProps={{ iconName: 'Edit' }}
        onChange={(e) => setNode((prevNode) => ({ ...prevNode, name: e.target.value }))}
      />
      <Fabric className={wrapperClassName}>
        <ComboBox
          required
          allowFreeform
          autoComplete="on"
          options={actions}
          label="Node Action"
          disabled={disabled}
          selectedKey={node.action}
          onChange={(_, option) => setNode((prevNode) => ({ ...prevNode, action: option.key }))}
          defaultSelectedKey="next"
        />
      </Fabric>
      <TextField
        required
        multiline
        autoAdjustHeight
        value={node.text}
        label="Node Text"
        disabled={disabled}
        onChange={(e) => setNode((prevNode) => ({ ...prevNode, text: e.target.value }))}
      />
      <Toggle
        inlineLabel
        onText="yes"
        offText="no"
        disabled={disabled}
        checked={node.isError}
        label="Is this an Error Node?"
        onChange={(e, v) => setNode((prevNode) => ({ ...prevNode, isError: v }))}
      />
      <div className="actions">
        <PrimaryButton
          text="Save"
          onClick={update}
          disabled={disabled}
        />
      </div>
      <Stack horizontal tokens={{ childrenGap: 15 }} horizontalAlign="center">
        <ActionButton
          allowDisabledFocus
          disabled={disabled}
          iconProps={{ iconName: 'Add' }}
          onClick={() => ussdStructureStore.ussdCore.addChild()}
        >
          Add Child
        </ActionButton>
        <ActionButton
          allowDisabledFocus
          disabled={disabled}
          iconProps={{ iconName: 'Delete' }}
          onClick={() => ussdStructureStore.ussdCore.deleteNode()}
        >
          Delete Node
        </ActionButton>
      </Stack>
    </Stack>
  );
}));

export default NodeEditor;
