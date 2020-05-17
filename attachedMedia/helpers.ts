import { getMegabytesWithTranslations } from 'lib/helpers/numbers';
import { getMinutesSecondsTime } from 'lib/helpers/date';
import { ATTACHMENT_TYPE } from './constants';

// Factory Method
// check the type and call the desired handler, which produces prepared data for display
export const convertAttachment = (attachment: File): Promise<any> => {
    if (!attachment) return Promise.resolve(null);

    const { type } = attachment;

    // check the type of attachment and call a desired handler
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

// Convert attachment (File from input[type=file]) to format for the image component
const convertAttachmentToImage = (attachment: File) => {
    return new Promise(resolve => {
        // create the file reader
        const fr = new FileReader();
        // the file uploaded callback
        fr.onload = () => {
            resolve({
                id: attachment.id,
                type: ATTACHMENT_TYPE.image,
                result: fr.result, // contain file data in the form of data: URL
            });
        };
        // read the file
        fr.readAsDataURL(attachment);
    });
};

// Convert attachment (File from input[type=file]) to format for the file component
const convertAttachmentToFile = (attachment: File) => {
    return Promise.resolve({
        id: attachment.id,
        type: ATTACHMENT_TYPE.file,
        name: attachment.name,
        size: getMegabytesWithTranslations(attachment.size), // is a size of file (MB)
    });
};

// Convert attachment (File from input[type=file]) to format for the video component
const convertAttachmentToVideo = (attachment: File) => {
    return new Promise(resolve => {
        const result = URL.createObjectURL(attachment); // the data for video html tag
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            URL.revokeObjectURL(result);
            const duration = getMinutesSecondsTime(video.duration); // duration of video
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
