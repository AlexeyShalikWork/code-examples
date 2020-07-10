import React from 'react';
import { observer } from 'mobx-react';
import logo from '@/resources/icons/Logo.svg';
import { SApplication } from '@/stores/Application';
import './SplashScreen.scss';

const splashScreenNonstandardCases: any = {
  'remote-access-connection': 'remote access connection...',
};

export enum SplashScreenNonstandardCases {
  RemoteAccessConnection = 'remote-access-connection',
}

interface ISplashScreenState {
  loadCase: string;
}

@observer
export class SplashScreen extends React.PureComponent<any, ISplashScreenState> {
  constructor(props: any) {
    super(props);

    this.state = {
      loadCase: SApplication.getParsedField('load-case') || '',
    };
  }

  componentDidMount() {
    if (this.state.loadCase === SplashScreenNonstandardCases.RemoteAccessConnection) {
      // ...
    }
  }

  render() {
    const text = splashScreenNonstandardCases[this.state.loadCase] || 'please wait...';
    return (
      <div className="SplashScreen fadeIn">
        <div className="SplashScreen_logo-wrap">
          <img src={logo} alt="Action1"/>
        </div>
        <div className="SplashScreen_spinner-wrap">
          <div className="kt-spinner kt-spinner--lg kt-spinner--info"/>
        </div>
        <div className="SplashScreen_text">
          {text}
        </div>
      </div>
    );
  }
}
