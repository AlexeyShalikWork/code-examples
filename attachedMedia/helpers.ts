import { getMegabytesWithTranslations } from 'lib/helpers/numbers';
import { getMinutesSecondsTime } from 'lib/helpers/date';
import { ATTACHMENT_TYPE } from './constants';

// Factory Method
// check the type and call the desired handler, which produces prepared data for display
export const convertAttachment = (attachment: File): Promise<any> => {
    if (!attachment) return Promise.resolve(null);

    const { type } = attachment;

    switch (true) {
        case /image/.test(type):
            return convertAttachmentToImage(attachment);
        case /text/.test(type):
            return convertAttachmentToFile(attachment);
        case /video/.test(type):
            return convertAttachmentToVideo(attachment);
        case /application/.test(type):
            return convertAttachmentToFile(attachment);
        default:
            return convertAttachmentToFile(attachment);
    }
};

const convertAttachmentToImage = (attachment: File) => {
    return new Promise(resolve => {
        const fr = new FileReader();
        fr.onload = () => {
            resolve({
                id: attachment.id,
                type: ATTACHMENT_TYPE.image,
                result: fr.result,
            });
        };
        fr.readAsDataURL(attachment);
    });
};

const convertAttachmentToFile = (attachment: File) => {
    return Promise.resolve({
        id: attachment.id,
        type: ATTACHMENT_TYPE.file,
        name: attachment.name,
        size: getMegabytesWithTranslations(attachment.size),
    });
};

const convertAttachmentToVideo = (attachment: File) => {
    return new Promise(resolve => {
        const result = URL.createObjectURL(attachment);
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            URL.revokeObjectURL(result);
            const duration = getMinutesSecondsTime(video.duration);
            resolve({
                id: attachment.id,
                type: ATTACHMENT_TYPE.video,
                result,
                duration,
            });
        };
        video.src = result;
    });
};
