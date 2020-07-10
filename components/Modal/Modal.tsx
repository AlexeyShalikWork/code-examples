import React from 'react';
import { observer } from 'mobx-react';
import { SApplication } from '@/stores/Application';

export interface IModalProps {
  title?: string;
  onConfirm?(e?: any): void;
  onPassiveConfirm?(e?: any): void;
  confirmText?: string;
  onCancel?(): void;
  cancelText?: string;
  hideHeader?: boolean;
  dontCloseOnBackdropClick?: boolean;
  hideTimesButton?: boolean;
  buttonOnConfirmIsActive?: boolean;
  shown: boolean;
  maxWidth?: string;
  hideFooter?: boolean;
}

@observer
export class Modal extends React.PureComponent<IModalProps> {
  defaultMaxWidth = 500;

  checkFullScreenStyle = () => {
    let isFullScreenStyle = false;

    /*
    In order to prevent the modal window from adhering to the edges of the browser,
    we will carry out subsequent comparisons with a minimum permissible width of 100 pixels more
    */

    if (this.props.maxWidth && SApplication.innerWidth <= parseInt(this.props.maxWidth) + 100) {
      isFullScreenStyle = true;
    } else if (SApplication.innerWidth <= this.defaultMaxWidth + 100) {
      isFullScreenStyle = true;
    }
    if (SApplication.isMobileDevice()) {
      isFullScreenStyle = true;
    }

    return isFullScreenStyle;
  }

  onCancel = () => !this.props.dontCloseOnBackdropClick && this.props.onCancel ? this.props.onCancel() : null;

  render() {
    const buttonOnConfirmIsActive = this.props.buttonOnConfirmIsActive ?? true;
    const isFullScreenStyle = this.checkFullScreenStyle();
    return this.props.shown && (
      <div className="modal custom-modal fadeInSlideDown">
        <div className="modal-overlay" onClick={this.onCancel}/>

        <div
          className={`modal-dialog modal-dialog-centered modal-lg m-0 ${isFullScreenStyle && 'modal-dialog--full-screen'}`}
          style={this.props.maxWidth ? {maxWidth: this.props.maxWidth} : {maxWidth: this.defaultMaxWidth}}
        >
          <div
            className={`modal-content ${isFullScreenStyle && 'border-radius-0'}`}
            style={{
              border: 0,
              minHeight: isFullScreenStyle ? SApplication.innerHeight : '0px',
            }}
          >

            {!this.props.hideHeader && (
              <div className="modal-header">
                <h4 className="modal-title">{this.props.title}</h4>
                {this.props.onCancel && !this.props.hideTimesButton && (
                  <button
                    onClick={this.props.onCancel}
                    type="button"
                    className="close"
                  />
                )}
              </div>
            )}

            <div className={`modal-body ${isFullScreenStyle && 'modal-body--full-screen'}`}>
              {this.props.children}
            </div>

            {!this.props.hideFooter && (
              <div className="modal-footer">
                {this.props.onCancel && (
                  <button type="button" className="btn btn-default" onClick={this.props.onCancel}>
                    {this.props.cancelText || 'Cancel'}
                  </button>
                )}
                {this.props.onConfirm && (
                  <button
                    type="button"
                    className={`${(buttonOnConfirmIsActive) ? (
                      'btn btn-primary'
                    ) : (
                      'btn btn-passive'
                    )}`}
                    data-dismiss="modal"
                    onClick={buttonOnConfirmIsActive ? this.props.onConfirm : this.props.onPassiveConfirm}
                  >
                    {this.props.confirmText || 'OK'}
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }
}
