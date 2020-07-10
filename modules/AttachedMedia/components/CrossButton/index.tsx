import React from 'react';
import { useTheme, Icon } from 'react-ui-kit';
import { Cross } from './view';

type Props = {
    onClick: () => void;
};

// shared (common) component for all of attachment types
// call the remove attachment function by click
const CrossButton: React.FC<Props> = props => {
    const { onClick } = props;
    const theme = useTheme();

    return (
        <Cross type="button" onClick={onClick}>
            <Icon icon="icCloseCircle" color={theme.root.colors.misc.black} />
        </Cross>
    );
};

export default CrossButton;
