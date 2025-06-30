import { useCallback} from 'react';
import { FaStepBackward, FaStepForward } from 'react-icons/fa';
import { IVideoFrameStepperProps } from '../../Interfaces/DataPanel';
import IconActionButton from './IconActionButton';

export default function VideoFrameStepper({
  playerRef1,
  playerRef2,
  fps = 25,
}: IVideoFrameStepperProps) {
  // Avanza un fotograma en ambos videos
  const stepForward = useCallback(() => {
    const video1 = playerRef1.current?.getInternalPlayer();
    const video2 = playerRef2.current?.getInternalPlayer();

    const frameTime = 1 / fps;

    if (video1) {
      video1.pause();
      video1.currentTime = Math.min(
        video1.duration,
        video1.currentTime + frameTime,
      );
    }

    if (video2) {
      video2.pause();
      video2.currentTime = Math.min(
        video2.duration,
        video2.currentTime + frameTime,
      );
    }
  }, [fps, playerRef1, playerRef2]);

  // Retrocede un fotograma en ambos videos
  const stepBackward = useCallback(() => {
    const video1 = playerRef1.current?.getInternalPlayer();
    const video2 = playerRef2.current?.getInternalPlayer();

    const frameTime = 1 / fps;

    if (video1) {
      video1.pause();
      video1.currentTime = Math.max(0, video1.currentTime - frameTime);
    }

    if (video2) {
      video2.pause();
      video2.currentTime = Math.max(0, video2.currentTime - frameTime);
    }
  }, [fps, playerRef1, playerRef2]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex space-x-4">
        <IconActionButton
          onClick={stepBackward}
          icon={<FaStepBackward />}
          color="black"
          tooltip="Go backward one frame"
          tooltipPosition="top"
        />

        <IconActionButton
          onClick={stepForward}
          icon={<FaStepForward />}
          color="black"
          tooltip="Go forward one frame"
          tooltipPosition="top"
        />
      </div>
    </div>
  );
}
