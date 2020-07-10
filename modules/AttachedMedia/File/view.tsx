import styled from 'styled-components/macro';
import Typography from 'react-synesis-ui-kit/core/Typography';
import { Cross } from '../components/CrossButton/view';

export const Container = styled.div`
    position: relative;
    display: flex;
    margin: 4px;
    height: 48px;
    width: 240px;
    background: ${props => props.theme.root.colors.background.second};
    border-radius: 16px;
    padding: 4px;

    ${Cross} {
        display: none;
    }

    &:hover {
        ${Cross} {
            display: block;
        }
    }
`;

export const FileIcon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
    width: 48px;
    background-color: ${props => props.theme.root.colors.misc.basic15};
    border-radius: 12px;
    margin-right: 8px;
`;

export const FileInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export const FileName = styled(Typography)`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const FileSize = styled(Typography)`
    font-size: 13px;
    color: ${props => props.theme.root.colors.misc.basic40};
`;
