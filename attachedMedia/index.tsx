import React, { useEffect, useState } from 'react';
import { convertAttachment } from './helpers';
import { ATTACHMENT_TYPE } from './constants';
import { Wrapper } from './view';
import Image from './image';
import Video from './video';
import FileComponent from './file';

type onRemoveType = (id: number) => void;

type Props = {
    attachments: File[];
    onRemoveAttachment: onRemoveType;
};

// render attachment by type
const renderAttachment = (attachment: any, onRemoveAttachment: onRemoveType) => {
    if (!attachment) return null;

    const { type } = attachment;

    // set the remove attachment method
    const onRemove = () => onRemoveAttachment(attachment.id);

    switch (type) {
        case ATTACHMENT_TYPE.image:
            return <Image key={attachment.id} image={attachment} onRemove={onRemove} />;
        case ATTACHMENT_TYPE.video:
            return <Video key={attachment.id} video={attachment} onRemove={onRemove} />;
        case ATTACHMENT_TYPE.file:
            return <FileComponent key={attachment.id} file={attachment} onRemove={onRemove} />;
        default:
            return <div key={attachment.id} />;
    }
};

const AttachedMedia: React.FC<Props> = props => {
    const { attachments, onRemoveAttachment } = props;
    // the variable for converted attachments
    const [convertedAttachments, setConvertedAttachments] = useState<any[]>([]);

    useEffect(() => {
        // convert attachments
        Promise.all(attachments.map(attachment => convertAttachment(attachment))).then(convertedAttachments => {
            // set attachments to state
            setConvertedAttachments(convertedAttachments);
        });
    }, [attachments]);

    return (
        <Wrapper>
            {convertedAttachments &&
                convertedAttachments.map(attachment => renderAttachment(attachment, onRemoveAttachment))}
        </Wrapper>
    );
};

export default AttachedMedia;
