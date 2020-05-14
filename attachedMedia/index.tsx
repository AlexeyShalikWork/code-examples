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

const renderAttachment = (attachment: any, onRemoveAttachment: onRemoveType) => {
    if (!attachment) return null;

    const { type } = attachment;

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
    const [convertedAttachments, setConvertedAttachments] = useState<any[]>([]);

    useEffect(() => {
        Promise.all(attachments.map(attachment => convertAttachment(attachment))).then(convertedAttachments => {
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
