
export const generateInsight = (profile, history) => {
    const now = new Date();
    const isNight = now.getHours() >= 18;
    const todayEntries = history.filter(e => new Date(e.timestamp).toDateString() === now.toDateString());
    const totalGrams = todayEntries.reduce((acc, curr) => acc + curr.sugarGrams, 0);

    // --- Corrective Action Logic ---
    let recommendation = null;
    const percentage = (totalGrams / profile.dailyLimit) * 100;

    const getRandomMessage = (type) => {
        const messages = {
            walk: [
                "Move now to burn excess glucose.",
                "Walking helps muscles absorb sugar.",
                " a 10-minute stroll lowers the spike.",
                "Active muscles = Better insulin sensitivity."
            ],
            water: [
                "Water aids metabolic recovery.",
                "Hydration helps flush out toxins.",
                "Drink up to reduce sugar cravings.",
                "Water boosts your metabolism."
            ],
            protein: [
                "Protein stabilizes blood sugar levels.",
                "Swap carbs for protein to crash less.",
                "Protein keeps you fuller for longer.",
                "Balance the spike with some protein."
            ]
        };
        const list = messages[type] || ["Take action now."];
        return list[Math.floor(Math.random() * list.length)];
    };

    // --- Context Awareness & Recency Check ---
    const recentLogs = history.filter(e => {
        const timeDiff = (now - new Date(e.timestamp)) / 1000 / 60; // minutes
        return timeDiff < 60; // Look at last hour
    });

    const hasRecentWalk = recentLogs.some(e => e.foodName.toLowerCase().includes('walk') || e.category === 'exercise');
    const hasRecentWater = recentLogs.some(e => e.foodName.toLowerCase().includes('water') || e.category === 'hydration');
    const hasRecentProtein = recentLogs.some(e => e.foodName.toLowerCase().includes('protein') || e.category === 'nutrition');

    // 1. Critical Spike (>100%) -> Immediate Movement
    if (percentage > 100 && !hasRecentWalk) {
        recommendation = {
            action: "10-minute walk",
            type: "activity",
            icon: "Walk",
            reason: `Critical spike! ${getRandomMessage('walk')}`
        };
    }
    // 2. High Sugar + Low Activity -> Walk
    else if (percentage > 80 && profile.activity.steps < 5000 && !hasRecentWalk) {
        recommendation = {
            action: "10-minute walk",
            type: "activity",
            icon: "Walk",
            reason: `Low activity detected. ${getRandomMessage('walk')}`
        };
    }
    // 3. High Sugar + Poor Sleep -> Water
    else if (percentage > 50 && profile.activity.sleepHours < 6 && !hasRecentWater) {
        recommendation = {
            action: "Drink water",
            type: "hydration",
            icon: "Droplet",
            reason: `Poor sleep detected. ${getRandomMessage('water')}`
        };
    }
    // 4. Moderate Sugar + Older Age -> Protein
    else if (percentage > 60 && profile.age > 45 && !hasRecentProtein) {
        recommendation = {
            action: "Protein snack swap",
            type: "nutrition",
            icon: "Cookie",
            reason: `Age factor detected. ${getRandomMessage('protein')}`
        };
    }

    // Default Fallback: If high sugar but 'Walk' already done, suggest Water
    if (!recommendation && percentage > 80) {
        if (!hasRecentWalk) {
            recommendation = {
                action: "10-minute walk",
                type: "activity",
                icon: "Walk",
                reason: "High sugar intake detected. A short walk is the best remedy."
            };
        } else if (!hasRecentWater) {
            recommendation = {
                action: "Drink water",
                type: "hydration",
                icon: "Droplet",
                reason: "Keep flushing out the excess sugar."
            };
        }
    }

    let insightText = "Sugar levels optimized. Metabolism in 'Burn Mode'.";
    let insightWhy = "Keeping sugar low prioritizes burning fat for energy.";

    if (isNight && profile.activity.sleepHours < 7 && totalGrams > 5) {
        insightText = "Late sugar + poor sleep = cortisol spike.";
        insightWhy = "High cortisol at night disrupts deep sleep and recovery.";
    } else if (profile.bmi > 25 && totalGrams > profile.dailyLimit * 0.5) {
        insightText = "Neutralize the spike! Move now.";
        insightWhy = "Walking helps muscles absorb glucose without extra insulin.";
    } else if (profile.activity.steps < 3000) {
        insightText = "Sedentary alert: Body in 'Storage Mode'.";
        insightWhy = "Low activity reduces insulin sensitivity.";
    }

    return {
        text: insightText,
        why: insightWhy,
        recommendation
    };
};
