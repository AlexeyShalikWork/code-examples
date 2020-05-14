import styled from 'styled-components/macro';
import { Icon } from 'react-ui-kit';
import { Cross } from '../components/crossButton/view';

export const Container = styled.div`
    position: relative;
    margin: 4px;
    height: 80px;
    width: 80px;
    background: ${props => props.theme.root.colors.background.second};
    border-radius: 16px;

    ${Cross} {
        display: none;
    }

    &:hover {
        ${Cross} {
            display: block;
        }
    }
`;

export const Media = styled.video`
    height: 80px;
    width: 80px;
    border-radius: 16px;
`;

export const Duration = styled.div`
    position: absolute;
    left: 4px;
    bottom: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 6px;
    height: 16px;
    background: ${props => props.theme.root.colors.misc.black};
    border-radius: 12px;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.14px;
`;

export const Play = styled(Icon)`
    display: flex;
    margin-right: 4px;
`;
