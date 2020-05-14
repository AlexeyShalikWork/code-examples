import React from 'react';
import { Icon } from 'react-ui-kit';
import { Container, FileIcon, FileInfo, FileName, FileSize } from './view';
import { ATTACHMENT_TYPE } from '../constants';
import CrossButton from '../components/crossButton';

type Props = {
    file: {
        type: typeof ATTACHMENT_TYPE.file;
        name: string;
        size: string;
    };
    onRemove: () => void;
};

const File: React.FC<Props> = props => {
    const { file, onRemove } = props;

    return (
        <Container>
            <CrossButton onClick={onRemove} />
            <FileIcon>
                <Icon icon="icDocumentStroke" colorVariant="secondary" />
            </FileIcon>
            <FileInfo>
                <FileName variant="subtitle2">{file.name}</FileName>
                <FileSize variant="subtitle4">{file.size}</FileSize>
            </FileInfo>
        </Container>
    );
};

export default File;
