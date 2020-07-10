import styled from 'styled-components/macro';
import { mobile, tablet } from 'react-ui-kit/core/mixins/media';

export const Wrapper = styled.div`
    display: flex;
    flex-wrap: nowrap;
    height: 104px;
    width: 100vw;
    margin: 8px 12px;
    overflow-x: auto;
    overflow-y: hidden;
    
    ::-webkit-scrollbar { 
        display: none; 
    }
    
    ${tablet`
        width: calc(100vw - 280px);
    `}

    ${mobile`
        width: calc(100vw - 24px);
    `}
`;
