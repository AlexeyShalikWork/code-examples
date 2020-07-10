import styled from 'styled-components/macro';
import { Cross } from '../components/CrossButton/view';

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

export const Media = styled.div<{ src: string }>`
    height: 80px;
    width: 80px;
    background: url(${props => props.src}) no-repeat center center;
    background-size: contain;
    border-radius: 16px;
    cursor: pointer;
`;
