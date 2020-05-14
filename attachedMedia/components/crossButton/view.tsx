import styled from 'styled-components/macro';
import { IconButton, Icon } from 'react-ui-kit';

export const Cross = styled(IconButton)`
    position: absolute;
    top: 4px;
    right: 4px;
    border-radius: 50%;
    height: 20px;
    width: 20px;
    
    &:before {
        height: 20px;
        width: 20px;
    }

    ${Icon} {
        background: ${props => props.theme.root.colors.text.base};
        border-radius: 50%;
    }
`;
