import React, { useCallback } from 'react';
import { TStore, useStore } from 'store';
import { Container, Media } from './view';
import { ATTACHMENT_TYPE } from '../constants';
import CrossButton from '../components/crossButton';

type Props = {
    image: {
        type: typeof ATTACHMENT_TYPE.image;
        result: string;
    };
    onRemove: () => void;
};

// open image for the viewing
const onOpenAttachmentPreview = (store: TStore, attachment: string): void => {
    // set the modal type with options to store (mobx)
    store.modalData.openModal('attachment-preview', {
        attachment,
        width: '100%',
        height: '100%',
        variant: 'full-width',
    });
};

// render the component with the image data
const Image: React.FC<Props> = props => {
    const { image, onRemove } = props;
    const store = useStore();

    // open image for viewing, image dependent
    const onOpenAttachmentPreviewCallback = useCallback(() =>
        onOpenAttachmentPreview(store, image.result), [image]);

    return (
        <Container>
            <CrossButton onClick={onRemove} />
            <Media src={image.result} onClick={onOpenAttachmentPreviewCallback} />
        </Container>
    );
};

export default Image;
