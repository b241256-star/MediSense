const { pool } = require('../config/db');

function analyzeSymptoms(message) {
  const msg = message.toLowerCase();
  const conditions = [];
  let severity = '🟢 Mild';
  const remedies = [];
  const warnings = [];

  if (msg.includes('fever') || msg.includes('bukhaar') || msg.includes('bukhar') || msg.includes('temperature') || msg.includes('tez')) {
    conditions.push('**Viral Fever** — Most common cause, usually lasts 3-5 days');
    conditions.push('**Common Flu** — Accompanied by body ache and fatigue');
    remedies.push('Drink plenty of warm water and fluids');
    remedies.push('Take rest, avoid going out');
    remedies.push('Use a wet cloth on forehead to reduce temperature');
    remedies.push('Take Paracetamol (500mg) if temperature is above 101°F');
    warnings.push('Temperature above 103°F (39.4°C)');
    warnings.push('Fever lasting more than 3 days');
    severity = '🟡 Moderate';
  }

  if (msg.includes('cold') || msg.includes('cough') || msg.includes('khansi') || msg.includes('zukam') || msg.includes('sneezing') || msg.includes('naak')) {
    conditions.push('**Common Cold** — Viral infection of upper respiratory tract');
    conditions.push('**Allergic Rhinitis** — If sneezing is frequent');
    remedies.push('Drink warm water with honey and ginger');
    remedies.push('Steam inhalation 2-3 times a day');
    remedies.push('Gargle with warm salt water');
    remedies.push('Avoid cold drinks and ice cream');
    warnings.push('Cough with blood');
    warnings.push('Difficulty breathing');
  }

  if (msg.includes('headache') || msg.includes('head') || msg.includes('sar dard') || msg.includes('sir dard') || msg.includes('migraine')) {
    conditions.push('**Tension Headache** — Most common, caused by stress or screen time');
    conditions.push('**Migraine** — If headache is one-sided with nausea');
    remedies.push('Rest in a dark, quiet room');
    remedies.push('Apply cold or warm compress on forehead');
    remedies.push('Drink enough water — dehydration causes headaches');
    remedies.push('Reduce screen time and take breaks');
    warnings.push('Sudden severe headache');
    warnings.push('Headache with stiff neck or vision changes');
  }

  if (msg.includes('stomach') || msg.includes('pet') || msg.includes('vomit') || msg.includes('nausea') || msg.includes('diarrhea') || msg.includes('loose motion') || msg.includes('ulti') || msg.includes('dast') || msg.includes('acidity')) {
    conditions.push('**Gastroenteritis** — Stomach infection caused by bacteria or virus');
    conditions.push('**Food Poisoning** — If symptoms started after eating');
    conditions.push('**Indigestion/Acidity** — If symptoms are mild');
    remedies.push('Stay hydrated — drink ORS (Oral Rehydration Solution)');
    remedies.push('Eat light food — khichdi, rice, bananas, toast');
    remedies.push('Avoid spicy, oily and heavy food');
    remedies.push('Rest and avoid physical exertion');
    warnings.push('Vomiting blood or black stools');
    warnings.push('Severe abdominal pain');
    warnings.push('Signs of dehydration — no urination, dry mouth');
    severity = '🟡 Moderate';
  }

  if (msg.includes('throat') || msg.includes('gala') || msg.includes('sore') || msg.includes('swallow') || msg.includes('tonsil')) {
    conditions.push('**Pharyngitis** — Viral or bacterial throat infection');
    conditions.push('**Tonsillitis** — If tonsils are swollen');
    remedies.push('Gargle with warm salt water 3-4 times daily');
    remedies.push('Drink warm liquids — herbal tea, warm milk with turmeric');
    remedies.push('Avoid cold drinks and speaking loudly');
    remedies.push('Use throat lozenges for relief');
    warnings.push('Unable to swallow even liquids');
    warnings.push('High fever with throat pain');
  }

  if (msg.includes('body pain') || msg.includes('badan dard') || msg.includes('muscle') || msg.includes('joint') || msg.includes('weakness') || msg.includes('fatigue') || msg.includes('thakan') || msg.includes('kamzori')) {
    conditions.push('**Viral Fever / Flu** — Body ache is a very common symptom');
    conditions.push('**Overexertion** — If you recently did heavy physical activity');
    conditions.push('**Vitamin Deficiency** — Especially Vitamin D and B12');
    remedies.push('Take complete bed rest');
    remedies.push('Apply warm compress on painful areas');
    remedies.push('Light stretching and gentle massage');
    remedies.push('Stay hydrated and eat nutritious food');
    warnings.push('Severe pain that prevents movement');
    warnings.push('Swollen joints with redness');
  }

  if (msg.includes('skin') || msg.includes('rash') || msg.includes('itching') || msg.includes('khujli') || msg.includes('allergy') || msg.includes('daane')) {
    conditions.push('**Allergic Reaction** — Contact with allergen causing skin reaction');
    conditions.push('**Eczema / Dermatitis** — Skin inflammation');
    conditions.push('**Heat Rash** — Common in hot weather');
    remedies.push('Avoid scratching the affected area');
    remedies.push('Apply calamine lotion or cold compress');
    remedies.push('Wear loose, cotton clothing');
    remedies.push('Take antihistamine (like Cetirizine) for itching');
    warnings.push('Rash spreading rapidly');
    warnings.push('Rash with fever and difficulty breathing');
  }

  if (conditions.length === 0) {
    conditions.push('**General Discomfort** — Symptoms need more evaluation');
    remedies.push('Rest and stay hydrated');
    remedies.push('Monitor your symptoms for 24-48 hours');
    remedies.push('Eat light and nutritious food');
    remedies.push('Avoid self-medication without proper diagnosis');
    warnings.push('Symptoms worsen or new symptoms appear');
    warnings.push('Symptoms persist for more than 3 days');
  }

  if (msg.includes('severe') || msg.includes('unbearable') || msg.includes('chest pain') || msg.includes('breathing') || msg.includes('saans')) {
    severity = '🔴 Serious';
  }

  const conditionsList = conditions.slice(0, 3).map(c => `- ${c}`).join('\n');
  const remediesList = remedies.slice(0, 5).map((r, i) => `${i+1}. ${r}`).join('\n');
  const warningsList = warnings.slice(0, 4).map(w => `- ${w}`).join('\n');

  return `## 🩺 Symptom Analysis

**Symptoms You Mentioned:** ${message}

## 🔍 Possible Conditions
${conditionsList}

## 🚦 Severity Level
${severity}

## 💊 Precautions & Home Remedies
${remediesList}

## 🏥 When to See a Doctor
${warningsList}

---
⚠️ *Disclaimer: I am MediSense AI, not a real doctor. This is for educational guidance only. Please consult a qualified medical professional for proper diagnosis and treatment.*`;
}

const getChatHistory = async (req, res) => {
  try {
    const [history] = await pool.query(
      'SELECT role, message, created_at FROM chat_history WHERE user_id = ? ORDER BY created_at ASC LIMIT 100',
      [req.user.id]
    );
    res.json(history);
  } catch (error) {
    console.error('Get History Error:', error);
    res.status(500).json({ message: 'Error fetching chat history.' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message cannot be empty.' });
    }

    const cleanMessage = message.trim();
    const userId = req.user.id;

    console.log(`💬 User ${userId} says: ${cleanMessage}`);

    // Save user message
    await pool.query(
      'INSERT INTO chat_history (user_id, role, message) VALUES (?, ?, ?)',
      [userId, 'user', cleanMessage]
    );

    // Generate response
    const aiResponse = analyzeSymptoms(cleanMessage);

    // Save AI response
    await pool.query(
      'INSERT INTO chat_history (user_id, role, message) VALUES (?, ?, ?)',
      [userId, 'ai', aiResponse]
    );

    console.log(`✅ Response saved for user ${userId}`);
    res.json({ message: aiResponse });

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ message: 'Error processing your message.' });
  }
};

const clearChatHistory = async (req, res) => {
  try {
    await pool.query('DELETE FROM chat_history WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Chat history cleared.' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing chat history.' });
  }
};

module.exports = { getChatHistory, sendMessage, clearChatHistory };
