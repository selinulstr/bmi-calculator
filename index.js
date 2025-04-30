import express from "express";

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

function calculateBMI(weight, height) {
   
    height = height / 100; 
    return (weight / (height * height)).toFixed(2);
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi < 24.9) return "Normal weight";
    if (bmi >= 25 && bmi < 29.9) return "Overweight";
    return "Obese";
}

function calculateBMR(gender, weight, height, age) {
   
    if (gender === "male") {
        return (10 * weight + 6.25 * height - 5 * age + 5).toFixed(2);
    } else {
        return (10 * weight + 6.25 * height - 5 * age - 161).toFixed(2);
    }
}

function calculateCalories(tdee) {
    const mildGain = (tdee + 250).toFixed(2);
const moderateGain = (tdee + 500).toFixed(2);
const aggressiveGain = (tdee + 1000).toFixed(2);

const mildLoss = (tdee - 250).toFixed(2);
const moderateLoss = (tdee - 500).toFixed(2);
const aggressiveLoss = (tdee - 1000).toFixed(2);
    return [mildGain, moderateGain, aggressiveGain, mildLoss, moderateLoss, aggressiveLoss];
}

function calculateTDEE(bmr, activityLevel) {
    const activityMultipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9
    };
    return (bmr * (activityMultipliers[activityLevel] || 1.2)).toFixed(2);
}

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/calculate", (req, res) => {
    const weight = parseFloat(req.body.weight); 
    let height = parseFloat(req.body.height); 
    const age = parseInt(req.body.age);
    const gender = req.body.gender; 
    const activityLevel = req.body.activity; 

  
    const bmi = calculateBMI(weight, height);
    const bmiCategory = getBMICategory(parseFloat(bmi));
    const bmr = calculateBMR(gender, weight, height, age);
    const tdee = calculateTDEE(parseFloat(bmr), activityLevel);
    
    const calories = calculateCalories(parseFloat(tdee));
    
    res.render("index.ejs", {
        bmi: bmi, bmiCategory: bmiCategory, bmr: bmr, maintenance: tdee, calories: calories
    });
});

app.listen(port, (req, res) => {
    console.log(`Server running on port ${port}`);
});
