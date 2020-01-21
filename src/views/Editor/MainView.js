import React, { Component } from 'react';
import T from 'prop-types';
import Tree from 'react-d3-tree';
import { inject, observer } from 'mobx-react';

import NodeContext from './contexts/NodeContext';

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

  onNodeClick = (node) => {
    const { ussdStructureStore } = this.props;
    ussdStructureStore.ussdCore.makeNodeActive(node.path);
  }

  render() {
    const { translate } = this.state;
    const { ussdStructureStore } = this.props;

    return (
      <div className="main-view" ref={(tc) => { this.treeContainer = tc; }}>
        {
          ussdStructureStore.structure && !ussdStructureStore.isLoading
            ? (
              <NodeContext.Consumer>
                {([tree]) => (
                  <Tree
                    zoom={0.8}
                    data={ussdStructureStore.ussdCore.core}
                    translate={translate}
                    orientation="vertical"
                    onClick={this.onNodeClick}
                    collapsible={tree.collapsible}
                    separation={{
                      siblings: 2,
                      nonSiblings: 2,
                    }}
                    nodeSvgShape={{
                      shape: 'circle',
                      shapeProps: { r: 25 },
                    }}
                  />
                )}
              </NodeContext.Consumer>
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
