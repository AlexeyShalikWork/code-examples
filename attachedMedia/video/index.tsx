import React from 'react';
import { ATTACHMENT_TYPE } from '../constants';
import CrossButton from '../components/crossButton';
import { Container, Media, Duration, Play } from './view';

type Props = {
    video: {
        type: typeof ATTACHMENT_TYPE.video;
        result: string;
        duration: string;
    };
    onRemove: () => void;
};

// render the component with the video data
const Video: React.FC<Props> = props => {
    const { video, onRemove } = props;

    return (
        <Container>
            <CrossButton onClick={onRemove} />
            <Media src={video.result} />
            <Duration>
                <Play icon="icSPlay" colorVariant="default" />
                {` ${video.duration}`}
            </Duration>
        </Container>
    );
};

export default Video;
