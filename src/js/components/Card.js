import React from 'react';
import Event from 'components/Event';

export default class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = { type: props.type };
    this.handleDismiss = this.handleDismiss.bind(this);
  }

  handleDismiss() {
    this.setState({
      type: '',
    });
  }

  render() {
    let renderedContent = '';

    const { item } = this.props;
    const { type } = this.state;

    switch (type) {
      case 'event':
        renderedContent = <Event key={item.id} {...item} />;
        break;
      default:
        return null;
    }

    return (
      <div className="card">
        <span className="dismiss" onClick={this.handleDismiss}>x</span>
        {renderedContent}
      </div>
    );
  }
}