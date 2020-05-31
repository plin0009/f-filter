import React, { useRef, useEffect } from "react";
import grammar from "../grammar";

interface MicrophoneProps {
  textCallback: (text: string) => void;
}

const Microphone = ({ textCallback }: MicrophoneProps) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    let Recognition,
      GrammarList = null;
    try {
      // @ts-ignore
      Recognition = window.SpeechRecognition || webkitSpeechRecognition || null;
    } catch (e) {
      return;
    }
    try {
      // @ts-ignore
      GrammarList = window.SpeechGrammarList || webkitSpeechGrammarList || null;
    } catch (e) {
      return;
    }

    recognitionRef.current = new Recognition();

    const grammarList = new GrammarList();

    grammarList.addFromString(grammar, 1);

    recognitionRef.current.grammars = grammarList;
    recognitionRef.current.continuous = false;
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onresult = (e) => {
      const color = e.results[0][0].transcript;
      textCallback(color);
    };
    recognitionRef.current.onspeechend = () => {
      recognitionRef.current && recognitionRef.current.stop();
    };
  }, [textCallback]);

  const startListening = () => {
    recognitionRef.current && recognitionRef.current.start();
  };

  return (
    <button className="button is-medium is-rounded" onClick={startListening}>
      Mic
    </button>
  );
};

export default Microphone;
