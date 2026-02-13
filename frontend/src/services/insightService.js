
export const generateInsight = (profile, history) => {
    const now = new Date();
    const isNight = now.getHours() >= 18;
    const todayEntries = history.filter(e => new Date(e.timestamp).toDateString() === now.toDateString());
    const totalGrams = todayEntries.reduce((acc, curr) => acc + curr.sugarGrams, 0);

    if (isNight && profile.activity.sleepHours < 7 && totalGrams > 5) {
        return {
            text: "Sugar late at night after poor sleep will spike your cortisol.",
            why: "Cortisol is your stress hormone. High levels at night disrupt your metabolic recovery and deep sleep cycles, making you hungrier tomorrow."
        };
    }

    if (profile.bmi > 25 && totalGrams > profile.dailyLimit * 0.5) {
        return {
            text: "Neutralize the spike! Take a 10-minute walk now.",
            why: "Post-meal walking helps muscle cells absorb glucose from your bloodstream without needing extra insulin, effectively lowering the 'spike'."
        };
    }

    if (profile.activity.steps < 3000) {
        return {
            text: "Sedentary alert: Your body is in 'Storage Mode'.",
            why: "Low activity reduces insulin sensitivity. Any sugar consumed now is more likely to be stored as fat rather than used for energy."
        };
    }

    return {
        text: "Sugar levels optimized. Your metabolism is in 'Burn Mode'.",
        why: "By keeping sugar low and activity consistent, your body prioritizes burning stored fat for energy instead of riding the glucose roller coaster."
    };
};
