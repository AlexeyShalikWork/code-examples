import React from 'react';
import { shallow, mount } from 'enzyme';
import { RefreshButton, IRefreshButtonProps } from '@/components/partials/buttons/RefreshButton';

const RefreshButtonHook = (props: IRefreshButtonProps | {}) => <RefreshButton title="Button test" {...props} />;

describe('Partials/RefreshButton.tsx Tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // just a snapshot
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

  // check only html was render
  test('Base html check', () => {
    const refreshButton = shallow(<RefreshButtonHook />).dive();

    expect(refreshButton.find('button').at(0).exists()).toEqual(true);
    expect(
      ['btn', 'btn-primary', 'custom-refresh'].every((className) => refreshButton.hasClass(className))
    ).toEqual(true);
    expect(refreshButton.find('i.flaticon-refresh').exists()).toEqual(true);
  });

  // check only html was passed
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

  // check that disabled button is working
  test('Button disabling check', async () => {
    const refreshButton = shallow(<RefreshButtonHook />).dive();

    expect(refreshButton.hasClass('disabled')).toEqual(false);

    refreshButton.setState({refreshDisabled: true});
    expect(refreshButton.hasClass('disabled')).toEqual(true);

    refreshButton.setState({refreshDisabled: false});
    expect(refreshButton.hasClass('disabled')).toEqual(false);

    refreshButton.simulate('click');
    expect(refreshButton.hasClass('disabled')).toEqual(true);
  });

  // check click by button
  test('Check manual click', () => {
    const refreshButtonRef = React.createRef<RefreshButton>();
    const refreshButton = mount(<RefreshButton ref={refreshButtonRef} title="Ref test" />);
    const currentRefreshButtonRef = refreshButtonRef.current;

    // spyOn - Creates a mock function similar to jest.fn but also tracks calls to object[methodName]. Returns a Jest mock function.
    jest.spyOn(refreshButton.instance(), 'manualClick');
    jest.spyOn(currentRefreshButtonRef, 'manualClick');

    currentRefreshButtonRef?.manualClick(); // click called
    expect(refreshButton.state('refreshDisabled')).toBe(true);
    expect(refreshButton.render().hasClass('disabled')).toEqual(true);

    expect(currentRefreshButtonRef?.manualClick).toHaveBeenCalledTimes(1);
    expect(refreshButton.instance().manualClick).toHaveBeenCalledTimes(1);
  });
});
