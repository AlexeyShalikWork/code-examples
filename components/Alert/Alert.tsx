import React from 'react';

export interface IAlertProps {
  type: string;
  text: string;
  icon?: string;
  button?: any;
}

export class Alert extends React.PureComponent<IAlertProps> {
  render() {
    return (
      <div className={`alert alert-${this.props.type}`} role="alert">
        {this.props.icon && (
          <div className="alert-icon">
            <i className={this.props.icon}/>
          </div>
        )}
        <div className="alert-text">{this.props.text} {this.props.button || ''}</div>
      </div>
    );
  }
}
