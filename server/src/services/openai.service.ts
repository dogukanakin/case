import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// OpenAI API anahtarını kontrol et
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('OPENAI_API_KEY is not set in the environment variables.');
}

// OpenAI istemcisini yapılandır
const openai = new OpenAI({
  apiKey,
});

/**
 * Kullanıcının dilini tespit etmek için OpenAI'ya sorgu yapar
 * @param text Kullanıcının metni
 * @returns Tespit edilen dil kodu (örn. "tr", "en")
 */
async function detectLanguage(text: string): Promise<string> {
  try {
    if (!apiKey) return 'en'; // API anahtarı yoksa varsayılan olarak İngilizce kullan
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are a language detector. Respond with only the ISO language code (e.g., 'en', 'tr', 'fr', 'es', etc.) of the language the text is written in." 
        },
        { role: "user", content: text }
      ],
      max_tokens: 10,
      temperature: 0,
    });
    
    const languageCode = completion.choices[0]?.message?.content?.trim().toLowerCase() || 'en';
    return languageCode;
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'en'; // Hata durumunda İngilizce'ye dön
  }
}

/**
 * Todo içeriğine dayanarak ChatGPT'den öneriler alır
 * @param title Todo başlığı
 * @param description Todo açıklaması
 * @param priority Todo önceliği
 * @param tags Todo etiketleri
 * @returns ChatGPT'den alınan öneri metni
 */
export const generateTodoRecommendation = async (
  title: string,
  description: string,
  priority: string,
  tags: string[]
): Promise<string> => {
  try {
    // Eğer API anahtarı yoksa boş string döndür
    if (!apiKey) {
      console.warn('OpenAI API key is missing, skipping recommendation generation');
      return 'No AI recommendations available. Please add an OpenAI API key to enable this feature.';
    }

    // Kullanıcının dilini tespit et (başlık ve açıklama içeriğinden)
    const userContent = `${title} ${description}`;
    const languageCode = await detectLanguage(userContent);
    
    // Dilin adını belirle
    let languageName = "English";
    let promptLanguage = "English";
    
    if (languageCode === "tr") {
      languageName = "Türkçe";
      promptLanguage = "Turkish";
    } else if (languageCode === "fr") {
      languageName = "Français";
      promptLanguage = "French";
    } else if (languageCode === "es") {
      languageName = "Español";
      promptLanguage = "Spanish";
    } else if (languageCode === "de") {
      languageName = "Deutsch";
      promptLanguage = "German";
    }
    
    // Todo'nun içeriğinden bir prompt oluştur
    const prompt = `
    I have a todo task with the following details:
    Title: ${title}
    Description: ${description || 'No description provided'}
    Priority: ${priority}
    Tags: ${tags?.length > 0 ? tags.join(', ') : 'No tags'}
    
    Please provide a concise suggestion (maximum 3 sentences) on how to approach this task, including:
    - A time management tip based on its priority
    - A suggestion for breaking it down if it seems complex
    - Any relevant productivity advice
    
    Keep your response short and actionable. Respond in ${promptLanguage} language only.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          "role": "system", 
          "content": `You are a helpful productivity assistant that provides concise and actionable recommendations for todo tasks. Always respond in ${promptLanguage} language only.` 
        },
        { "role": "user", "content": prompt }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });
      
    return completion.choices[0]?.message?.content?.trim() || 'No recommendation available.';
    
  } catch (error) {
    console.error('Error generating recommendation with OpenAI:', error);
    
    // Daha ayrıntılı hata mesajı
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    
    return 'Sorry, could not generate a recommendation right now. Please try again later.';
  }
};

export default { generateTodoRecommendation }; 