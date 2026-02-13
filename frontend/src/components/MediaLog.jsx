
import React, { useState } from 'react';
import { Mic, Camera, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeImageWithGemini, estimateSugarContent } from '../services/geminiService';

const MediaLog = ({ onLog }) => {
    const [isListening, setIsListening] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const startVoiceLog = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Voice recognition not supported in this browser.');
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        setIsListening(true);
        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setIsListening(false);
            processLog(transcript, 'Voice');
        };

        recognition.onerror = (event) => {
            setIsListening(false);
            console.error(event.error);
        };
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            analyzeImage(file);
        }
    };

    const analyzeImage = async (file) => {
        setProcessing(true);
        try {
            const result = await analyzeImageWithGemini(file);
            if (result) {
                onLog({ ...result, method: 'Image' });
                setFeedback(`Identified: ${result.foodName} (${result.sugarGrams}g Sugar)`);
                setTimeout(() => setFeedback(null), 3000);
            } else {
                setFeedback("Could not identify food. Please try again.");
                setTimeout(() => setFeedback(null), 3000);
            }
        } catch (e) {
            setFeedback("Analysis failed.");
            setTimeout(() => setFeedback(null), 3000);
        }
        setProcessing(false);
    };

    const processLog = async (text, method) => {
        setProcessing(true);
        try {
            const result = await estimateSugarContent(text);
            if (result) {
                onLog({ ...result, method: method });
                setFeedback(`Logged: ${result.foodName} (${result.sugarGrams}g)`);
                setTimeout(() => setFeedback(null), 3000);
            } else {
                setFeedback("Could not understand log. Try 'I ate a cookie'.");
                setTimeout(() => setFeedback(null), 3000);
            }
        } catch (e) {
            setFeedback("Processing failed.");
            setTimeout(() => setFeedback(null), 3000);
        }
        setProcessing(false);
    };

    return (
        <div className="flex gap-4 items-center justify-center p-4">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={startVoiceLog}
                className={`p-4 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-white/5'} border border-white/10 hover:bg-white/10 transition-colors`}
            >
                <Mic className={`w-6 h-6 ${isListening ? 'text-white' : 'text-emerald-400'}`} />
            </motion.button>

            <div className="relative">
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="image-log"
                    onChange={handleImageUpload}
                />
                <label htmlFor="image-log">
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                        <Camera className="w-6 h-6 text-blue-400" />
                    </motion.div>
                </label>
            </div>

            <AnimatePresence>
                {processing && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute bottom-20 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2"
                    >
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span className="text-xs font-bold text-white">Analyzing...</span>
                    </motion.div>
                )}
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute bottom-20 bg-emerald-500/20 backdrop-blur-md px-4 py-2 rounded-xl border border-emerald-500/30 flex items-center gap-2"
                    >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-400">{feedback}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MediaLog;
