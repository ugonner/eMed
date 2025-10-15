import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";
import * as vosk from "vosk-browser";
import { usePlainRTCContextStore } from "../contexts/plainwebrtc";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { IProducerUser } from "../interfaces/socket-user";
import { IDataChannelCaption, IPlainRTCDataMessage } from "../dtos/data-channel";
import { PlainRTCDataMessageType } from "../enums/data-channel";

export const modelPath = `/models/vosk-model-small-en-us-0.15.tgz`;

export interface ICaptioningProps {
  mediaStream: MediaStream;
}

export const Captioning = ({mediaStream}: ICaptioningProps) => {

  const {socketRef, roomUsers} = usePlainRTCContextStore();

  
  const audioSampleRate = 16000;
  const recognizerRef = useRef<vosk.KaldiRecognizer>();
  const audioWorkletRef = useRef<AudioWorkletNode | null>();
const audioContextRef = useRef<AudioContext | null>();
  const captionsRef = useRef<string[]>([]);
  const [isCaptioning, setIsCaptioning] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const [partialCaptions, setPartialCaptioins] = useState<string[]>([]);

  const streamRef = useRef<MediaStream | null>();
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>();
  const mediaSourceRef = useRef<MediaStreamAudioSourceNode | null>();
  const { setLoading } = useAsyncHelpersContext();

  const dataChannels = roomUsers.map((usr) => usr.dataChannel);

  const startCaptioning = async () => {
    try {
      setIsProcessingAction(true);
      const stream = new MediaStream();
      //add user's own audio
      if (mediaStream) {
        const track = mediaStream.getAudioTracks()[0];
        stream.addTrack(track);
      }

      if (stream.getTracks().length === 0) {
        console.log("no tracks added for captioning");
        return;
      }

      if (!audioContextRef.current || !audioWorkletRef.current) {
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)({ sampleRate: audioSampleRate });
        audioContextRef.current = audioContext;
        await audioContextRef.current.audioWorklet.addModule(
          "/worklet/PCMBatch-processor.js"
        );
        const audioWorkletNode = new AudioWorkletNode(
          audioContextRef.current,
          "pcm-batch-processor"
        );
        // audioWorkletNode.port.postMessage({
        //   sampleRate: audioContextRef.current?.sampleRate,
        // });
        audioWorkletRef.current = audioWorkletNode;
      }

      const source = audioContextRef.current.createMediaStreamSource(stream);
      audioWorkletRef.current.port.onmessage = (evt) => {
        try {
          const floatArr = evt.data;
          const audioBufferData = audioContextRef.current?.createBuffer(
            1,
            floatArr.length,
            audioSampleRate
          );
          audioBufferData?.getChannelData(0).set(floatArr);
          recognizerRef.current?.acceptWaveform(audioBufferData as AudioBuffer);
        } catch (error) {
          console.log("Error in on message", (error as Error).message);
        }
      };
      source.connect(audioWorkletRef.current);
      audioWorkletRef.current.connect(audioContextRef.current.destination);
      setIsProcessingAction(false);
    } catch (error) {
      setIsProcessingAction(false);
      console.log("Error in transcripting", (error as Error).message);
    }
  };

  const startCaptioningLegacy = async (producers: IProducerUser[]) => {
    try {
      const stream = new MediaStream();
      //add user's own audio
      if (mediaStream) {
        const track = mediaStream.getAudioTracks()[0];
        if (track?.enabled) stream.addTrack(track);
      }

      if (stream.getTracks().length === 0) {
        console.log("no tracks");
        return;
      }

      if (!audioContextRef.current) {
        const audioContext = new (AudioContext ||
          (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;
      }

      const source = audioContextRef.current?.createMediaStreamSource(stream);
      const processor = audioContextRef.current.createScriptProcessor(
        4096,
        1,
        1
      );
      processor.onaudioprocess = (evt) => {
        recognizerRef.current?.acceptWaveform(evt.inputBuffer);
      };
      source.connect(processor);
      processor.connect(audioContextRef.current.destination);
      mediaSourceRef.current = source;
      scriptProcessorRef.current = processor;
    } catch (error) {
      console.log("Error using script procesor");
    }
  };

  const stopCaptioning = async () => {
    try {
      setIsProcessingAction(true);
      await closeOut();
      captionsRef.current = [];
      setIsCaptioning(false);
    } catch (error) {
      setIsProcessingAction(false);
      console.log("Error stopping captioning", (error as Error).message);
    }
  };

  const closeOut = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioWorkletRef.current) {
        audioWorkletRef.current.port.close();
        audioWorkletRef.current.disconnect();
      }

      if (mediaSourceRef.current) {
        mediaSourceRef.current.disconnect();
      }
      if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
      }

      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        await audioContextRef.current.close();
      }

      streamRef.current = null;
      audioWorkletRef.current = null;

      mediaSourceRef.current = null;
      scriptProcessorRef.current = null;

      audioContextRef.current = null;
    } catch (error) {
      console.log(
        "Error closing out audio processing resources",
        (error as Error).message
      );
    }
  };

  useEffect(() => {
    const loadRecognixer = async () => {
      try {
        //const modelPath = `/models/vosk-model-small-en-us-0.15.tar.gz`;
        const sampleRate = audioSampleRate;

        setLoading({ isLoading: true, loadingMessage: "" });

        const modell = await vosk.createModel(modelPath);
        modell.setLogLevel(1);
        const rec = new modell.KaldiRecognizer(sampleRate);

        rec.on("result", (message) => {
          console.log("MESSAGETEST FINAL", message)
          const resultText =
            message.event === "result" ? message.result.text : "";
          if (resultText && resultText.trim() !== "") {
            const dataMessage: IPlainRTCDataMessage<IDataChannelCaption> = {
              peerSocketId: socketRef.current?.id,
              messageType: PlainRTCDataMessageType.CAPTION,
              message: {
                senderSocketId: socketRef.current?.id as string,
                text: resultText,
                timestamp: Date.now(),
              }
            };
            dataChannels.forEach((dataChannel) => {
              dataChannel?.send(JSON.stringify(dataMessage))
            })
            setPartialCaptioins([]);
          }
        });
        rec.on("partialresult", (message) => {
          const resultText =
            message.event === "partialresult" ? message.result.partial : "";

          console.log(`Partial result: ${resultText}`);
         
        });

        recognizerRef.current = rec;
        setLoading({ isLoading: true, loadingMessage: "" });
      } catch (error) {
        setLoading({ isLoading: false, loadingMessage: "" });

        console.log("Error at useEffect", (error as Error).message);
      }
    };
    loadRecognixer();
  }, []);

  useEffect(() => {
    if(mediaStream) startCaptioning();
  }, [mediaStream])


  return (
   <></>
  );
};
