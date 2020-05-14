import React from 'react';
import { shallow, mount } from 'enzyme';
import { RefreshButton, IRefreshButtonProps } from '@/components/partials/buttons/RefreshButton';

const RefreshButtonHook = (props: IRefreshButtonProps | {}) => <RefreshButton title="Button test" {...props} />;

describe('Partials/RefreshButton.tsx Tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Runs without crashing + snapshot test', () => {
    const refreshButton = shallow(<RefreshButtonHook />);

    expect(refreshButton.name()).toEqual('RefreshButton');
    expect(refreshButton.dive()).toMatchSnapshot();
  });

  test('Component structure check', () => {
    const refreshButton = shallow(<RefreshButton title="Test title" />);

    expect(refreshButton.state('refreshDisabled')).toEqual(false);
    expect(typeof refreshButton.state('refreshDisabled')).toBe('boolean');
    expect(typeof refreshButton.instance().manualClick).toBe('function');
  });

  test('Base html check', () => {
    const refreshButton = shallow(<RefreshButtonHook />).dive();

    expect(refreshButton.find('button').at(0).exists()).toEqual(true);
    expect(
      ['btn', 'btn-primary', 'custom-refresh'].every((className) => refreshButton.hasClass(className))
    ).toEqual(true);
    expect(refreshButton.find('i.flaticon-refresh').exists()).toEqual(true);
  });

  test('Props check', () => {
    const props = {
      title: 'Props check',
      freezedTitle: 'Freezed title check',
      handleRefresh: () => {
        return Promise.resolve();
      }
    };
    const refreshButton = shallow(<RefreshButtonHook {...props} />).dive();

    expect(refreshButton.instance().props.title).toEqual(props.title);
    expect(refreshButton.instance().props.freezedTitle).toEqual(props.freezedTitle);
    expect(refreshButton.instance().props.handleRefresh).toEqual(props.handleRefresh);
  });

  test('Button disabling check', async () => {
    const refreshButton = shallow(<RefreshButtonHook />).dive();

    expect(refreshButton.hasClass('disabled')).toEqual(false);

    refreshButton.setState({refreshDisabled: true});
    expect(refreshButton.hasClass('disabled')).toEqual(true);

    refreshButton.setState({refreshDisabled: false});
    expect(refreshButton.hasClass('disabled')).toEqual(false);

    refreshButton.simulate('click');
    expect(refreshButton.hasClass('disabled')).toEqual(true);

    const mockHandleRefresh = jest.fn(() => new Promise((resolve: any) => setTimeout(resolve, 500)));
    refreshButton.setProps({
      handleRefresh: mockHandleRefresh
    });
    refreshButton.setState({refreshDisabled: false});
    expect(refreshButton.hasClass('disabled')).toEqual(false);
    refreshButton.simulate('click');
    expect(refreshButton.hasClass('disabled')).toEqual(true);
    await mockHandleRefresh();
    expect(refreshButton.hasClass('disabled')).toEqual(false);
  });

  test('Check simple click', async () => {
    const refreshButton = shallow(<RefreshButtonHook />).dive();

    const mockHandleRefresh = jest.fn(() => new Promise((resolve: any) => setTimeout(resolve, 500)));
    refreshButton.simulate('click');
    expect(mockHandleRefresh).toHaveBeenCalledTimes(0);

    refreshButton.setState({refreshDisabled: false});
    expect(refreshButton.state('refreshDisabled')).toBe(false);
    refreshButton.setProps({
      handleRefresh: mockHandleRefresh
    });
    refreshButton.simulate('click');
    expect(refreshButton.state('refreshDisabled')).toBe(true);
    expect(refreshButton.hasClass('disabled')).toEqual(true);
    expect(mockHandleRefresh).toHaveBeenCalledTimes(1);
    await mockHandleRefresh();
    expect(refreshButton.state('refreshDisabled')).toBe(false);
    expect(refreshButton.hasClass('disabled')).toEqual(false);
  });

  test('Check multiple clicks', async () => {
    jest.spyOn(RefreshButton.prototype, 'setState');
    const refreshButton = shallow(<RefreshButtonHook />).dive();

    const mockHandleRefresh = jest.fn(() => new Promise((resolve: any) => setTimeout(resolve, 500)));
    for (let i = 0; i <= 10; i++) {
      refreshButton.simulate('click');
    }

    expect(RefreshButton.prototype.setState.mock.calls.length).toBe(1);
    expect(mockHandleRefresh).toHaveBeenCalledTimes(0);
    expect(refreshButton.state('refreshDisabled')).toBe(true);
    expect(refreshButton.hasClass('disabled')).toEqual(true);

    jest.clearAllMocks();
    refreshButton.setState({refreshDisabled: false});
    expect(refreshButton.state('refreshDisabled')).toBe(false);
    refreshButton.setProps({
      handleRefresh: mockHandleRefresh
    });

    for (let i = 0; i <= 10; i++) {
      refreshButton.simulate('click');
    }

    expect(mockHandleRefresh).toHaveBeenCalledTimes(1);
    expect(RefreshButton.prototype.setState.mock.calls.length).toBe(2);
    expect(refreshButton.state('refreshDisabled')).toBe(true);
    expect(refreshButton.hasClass('disabled')).toEqual(true);
    await mockHandleRefresh();
    expect(refreshButton.state('refreshDisabled')).toBe(false);
    expect(refreshButton.hasClass('disabled')).toEqual(false);
  });

  test('Check manual click', () => {
    const refreshButtonRef = React.createRef<RefreshButton>();
    const refreshButton = mount(<RefreshButton ref={refreshButtonRef} title="Ref test" />);
    const currentRefreshButtonRef = refreshButtonRef.current;

    jest.spyOn(refreshButton.instance(), 'manualClick');
    jest.spyOn(currentRefreshButtonRef, 'manualClick');

    currentRefreshButtonRef?.manualClick();
    expect(refreshButton.state('refreshDisabled')).toBe(true);
    expect(refreshButton.render().hasClass('disabled')).toEqual(true);

    expect(currentRefreshButtonRef?.manualClick).toHaveBeenCalledTimes(1);
    expect(refreshButton.instance().manualClick).toHaveBeenCalledTimes(1);
  });
});
