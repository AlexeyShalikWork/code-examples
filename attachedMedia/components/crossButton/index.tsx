import React from 'react';
import { useTheme, Icon } from 'react-ui-kit';
import { Cross } from './view';

type Props = {
    onClick: () => void;
};

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
