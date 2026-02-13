
// MOCK implementation - No API Key needed

/**
 * Simulates analyzing an image with Gemini.
 * Returns a mock response after a short delay.
 */
export const analyzeImageWithGemini = async (file) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Mock Analysis: Returning simulated result for", file.name);
            resolve({
                foodName: "Detected Food Item",
                sugarGrams: 15,
                calories: 250,
                grade: "C",
                metric: "valid",
                // Extra fields for debugging if needed
                isMock: true
            });
        }, 1500); // Simulate network delay
    });
};

/**
 * Simulates estimating sugar content based on text input.
 * Returns a reasonable guess or default value.
 */
export const estimateSugarContent = async (input) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Mock Estimation: Returning simulated result for", input);

            // Simple logic to make the mock feel slightly responsive
            const lowerInput = input.toLowerCase();
            let sugar = 10;
            let cals = 150;
            let cat = 'snack';

            if (lowerInput.includes('coke') || lowerInput.includes('soda')) {
                sugar = 39;
                cals = 140;
                cat = 'drink';
            } else if (lowerInput.includes('apple') || lowerInput.includes('fruit')) {
                sugar = 19;
                cals = 95;
                cat = 'fruit';
            } else if (lowerInput.includes('burger') || lowerInput.includes('meal')) {
                sugar = 5;
                cals = 500;
                cat = 'meal';
            }

            resolve({
                foodName: input,
                sugarGrams: sugar,
                calories: cals,
                category: cat,
                valid: true,
                isMock: true
            });
        }, 1000); // Simulate network delay
    });
};
