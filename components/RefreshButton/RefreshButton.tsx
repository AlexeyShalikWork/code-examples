import React, { Component } from 'react';
import '@/resources/styles/components/partials/refreshButton/RefreshButton.scss';

export interface IRefreshButtonProps {
    title: string;
    freezedTitle?: string;
    handleRefresh?(): Promise<any>;
}

interface IRefreshButtonState {
    refreshDisabled: boolean;
}

export class RefreshButton extends Component<IRefreshButtonProps, IRefreshButtonState> {
    readonly state: IRefreshButtonState = {
        refreshDisabled: false
    };

    manualClick = () => {
        const {handleRefresh} = this.props;
        const {refreshDisabled} = this.state;

        if (!refreshDisabled) {
            this.setState({
                refreshDisabled: true
            }, () => {
                if (handleRefresh) {
                    handleRefresh().then((_) => {
                        this.setState({
                            refreshDisabled: false
                        });
                    });
                }
            });
        }
    }

    render() {
        const {title, freezedTitle} = this.props;
        const {refreshDisabled} = this.state;

        return(
            <button
                className={
                    `btn btn-primary align-items-xl-stretch custom-refresh refresh__btn ${refreshDisabled ? 'disabled' : ''}`
                }
                style={{cursor: refreshDisabled ? 'initial' : 'pointer'}}
                onClick={this.manualClick}
            >
                <i className="flaticon-refresh"/>
                <span>{!refreshDisabled ? title : (freezedTitle ? freezedTitle : title)}</span>
            </button>
        );
    }
}
