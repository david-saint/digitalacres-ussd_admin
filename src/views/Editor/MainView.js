import React, { Component } from 'react';
import T from 'prop-types';
import Tree from 'react-d3-tree';
import { inject, observer } from 'mobx-react';

import sampleData from './sampleData';

@inject('ussdStructureStore')
@observer
class MainView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const dimensions = this.treeContainer.getBoundingClientRect();
    this.setState({
      translate: {
        x: dimensions.width / 2,
        y: dimensions.height / 4,
      },
    });
  }

  render() {
    const { translate } = this.state;
    const { ussdStructureStore } = this.props;

    return (
      <div className="main-view" ref={(tc) => { this.treeContainer = tc; }}>
        {
          ussdStructureStore.structure
            ? (
              <Tree
                zoom={0.7}
                data={sampleData}
                translate={translate}
                orientation="vertical"
                separation={{
                  siblings: 2,
                  nonSiblings: 2,
                }}
                nodeSvgShape={{
                  shape: 'circle',
                  shapeProps: { r: 25 },
                }}
              />
            )
            : (<h4 style={{ color: '#333333' }}>...</h4>)
        }
      </div>
    );
  }
}

MainView.propTypes = {
  ussdStructureStore: T.object.isRequired, // eslint-disable-line
};

export default MainView;
