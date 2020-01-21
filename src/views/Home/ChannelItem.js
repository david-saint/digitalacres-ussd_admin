import React from 'react';
import PropTypes from 'prop-types';
import { DefaultButton, IconButton, Stack } from 'office-ui-fabric-react';

const editIcon = { iconName: 'Edit' };
const deleteIcon = { iconName: 'Delete' };

const ChannelItem = ({
  channel,
  onEditItem,
  onSelectItem,
  onDeleteItem,
}) => (
  <div className="channel-item">
    <h4>{channel.label}</h4>
    <p>
      endpoint:&nbsp;
      {channel.endpoint}
    </p>
    <div className="actions">
      <Stack tokens={{ childrenGap: 10 }} horizontal>
        <DefaultButton text="Select" onClick={onSelectItem} />
        <IconButton
          title="Edit"
          iconProps={editIcon}
          onClick={onEditItem}
          styles={{
            icon: { color: '#eeeeee' },
            root: {
              backgroundColor: 'transparent',
            },
          }}
        />
        <IconButton
          title="Delete"
          iconProps={deleteIcon}
          onClick={onDeleteItem}
          styles={{
            icon: { color: '#eeeeee' },
            root: {
              backgroundColor: 'transparent',
            },
          }}
        />
      </Stack>
    </div>
  </div>
);

ChannelItem.propTypes = {
  channel: PropTypes.shape({
    label: PropTypes.string.isRequired,
    endpoint: PropTypes.string,
  }).isRequired,
  onEditItem: PropTypes.func.isRequired,
  onSelectItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
};

export default ChannelItem;
