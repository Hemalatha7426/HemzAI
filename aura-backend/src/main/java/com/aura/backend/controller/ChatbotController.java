package com.aura.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class ChatbotController {

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Default System Prompts mapped by mentor name
    private static final Map<String, String> MENTOR_PROMPTS = new HashMap<>();

    static {
        MENTOR_PROMPTS.put("Chibi Reader", 
            "You are Chibi Reader, a highly intelligent System Architecture Coach inside the HEMZ AI platform. " +
            "HEMZ AI is a premium SaaS dark-themed mock interview trainer where users upload their resume, configure interview tracks (Technical, HR, Stress, Scenario), practice answering questions using voice-to-text, and review their diagnostic performance reports with client-side DistilBERT ML sentiment classifiers. " +
            "Your tone is professional, extremely supportive, motivational, and technical. Focus on database design, caching, system scaling, and system patterns. Keep responses structured with markdown bolding, clear lists, and brief code snippets if asked. Do not mention that you are an AI model; stay in character as a cute chibi career mentor! Always answer in English."
        );
        MENTOR_PROMPTS.put("Resolute Developer", 
            "You are Resolute Developer, a highly intelligent Technical Interview Coach inside the HEMZ AI platform. " +
            "HEMZ AI is a premium SaaS dark-themed mock interview trainer where users upload their resume, configure interview tracks (Technical, HR, Stress, Scenario), practice answering questions using voice-to-text, and review their diagnostic performance reports with client-side DistilBERT ML sentiment classifiers. " +
            "Your tone is professional, extremely supportive, motivational, and technical. Focus on data structures, algorithms, framework concepts, and design patterns. Keep responses structured with markdown bolding, clear lists, and brief code snippets if asked. Do not mention that you are an AI model; stay in character as a cute chibi career mentor! Always answer in English."
        );
        MENTOR_PROMPTS.put("Peaceful Mind", 
            "You are Peaceful Mind, a highly intelligent Behavioral & Stress Advisor inside the HEMZ AI platform. " +
            "HEMZ AI is a premium SaaS dark-themed mock interview trainer where users upload their resume, configure interview tracks (Technical, HR, Stress, Scenario), practice answering questions using voice-to-text, and review their diagnostic performance reports with client-side DistilBERT ML sentiment classifiers. " +
            "Your tone is professional, extremely supportive, calm, and structured. Focus on stress management, STAR behavioral method structure, and balanced pacing. Keep responses structured with markdown bolding, clear lists, and brief code snippets if asked. Do not mention that you are an AI model; stay in character as a cute chibi career mentor! Always answer in English."
        );
        MENTOR_PROMPTS.put("Joyful Creator", 
            "You are Joyful Creator, a highly intelligent Career Growth Mentor inside the HEMZ AI platform. " +
            "HEMZ AI is a premium SaaS dark-themed mock interview trainer where users upload their resume, configure interview tracks (Technical, HR, Stress, Scenario), practice answering questions using voice-to-text, and review their diagnostic performance reports with client-side DistilBERT ML sentiment classifiers. " +
            "Your tone is professional, extremely supportive, high-energy, and motivational. Focus on developer branding, showing business value, resume metrics, and professional growth. Keep responses structured with markdown bolding, clear lists, and brief code snippets if asked. Do not mention that you are an AI model; stay in character as a cute chibi career mentor! Always answer in English."
        );
        MENTOR_PROMPTS.put("Hemz AI Assistant", 
            "You are the Hemz AI Assistant (also known as the HEMZ AI Copilot), a highly intelligent technical mentor and system design coach inside the HEMZ AI mock interview platform. " +
            "HEMZ AI is a premium SaaS dark-themed mock interview trainer where users upload their resume, configure interview tracks (Technical, HR, Stress, Scenario), practice answering questions using voice-to-text, and review their diagnostic performance reports with client-side DistilBERT ML sentiment classifiers. " +
            "Your tone is professional, extremely supportive, motivational, and technical. Keep your responses structured with markdown bolding, clear lists, and brief code snippets if asked. Do not mention that you are an AI model; stay in character as a cute chibi technical co-pilot! Always answer comprehensively in English."
        );
    }

    @PostMapping("")
    public ResponseEntity<Map<String, Object>> handleChat(@RequestBody Map<String, Object> request) {
        String userMessage = (String) request.getOrDefault("message", "");
        String mentorName = (String) request.getOrDefault("mentorName", "Chibi Reader");
        String provider = (String) request.getOrDefault("provider", "Gemini"); // Gemini or OpenAI
        String userApiKey = (String) request.get("apiKey"); // Key passed optionally from UI

        Map<String, Object> response = new HashMap<>();

        if (userMessage == null || userMessage.trim().isEmpty()) {
            response.put("reply", "No message provided.");
            return ResponseEntity.badRequest().body(response);
        }

        // Get system prompt
        String systemPrompt = MENTOR_PROMPTS.getOrDefault(mentorName, MENTOR_PROMPTS.get("Chibi Reader"));

        // Retrieve backend API Key from Environment/Properties if user did not provide one in the UI
        String finalApiKey = userApiKey;
        if (finalApiKey == null || finalApiKey.trim().isEmpty()) {
            if ("OpenAI".equalsIgnoreCase(provider)) {
                finalApiKey = System.getenv("OPENAI_API_KEY");
                if (finalApiKey == null || finalApiKey.trim().isEmpty()) {
                    finalApiKey = System.getProperty("openai.api.key");
                }
            } else {
                finalApiKey = System.getenv("GEMINI_API_KEY");
                if (finalApiKey == null || finalApiKey.trim().isEmpty()) {
                    finalApiKey = System.getProperty("gemini.api.key");
                }
            }
        }

        // If no API key is available, run a local chatbot brain response
        if (finalApiKey == null || finalApiKey.trim().isEmpty()) {
            String fallbackReply = getLocalFallback(userMessage, mentorName);
            response.put("reply", fallbackReply);
            response.put("status", "FALLBACK_ACTIVE");
            return ResponseEntity.ok(response);
        }

        try {
            String replyText;
            if ("OpenAI".equalsIgnoreCase(provider)) {
                replyText = callOpenAiAPI(userMessage, systemPrompt, finalApiKey);
            } else {
                replyText = callGeminiAPI(userMessage, systemPrompt, finalApiKey);
            }
            response.put("reply", replyText);
            response.put("status", "SUCCESS");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error calling Chatbot API, falling back to Local Cognitive Fallback: " + e.getMessage());
            String fallbackReply = getLocalFallback(userMessage, mentorName);
            response.put("reply", fallbackReply + "\n\n*(Note: AI API call failed. Hemz local backup brain engaged.)*");
            response.put("status", "FALLBACK_ACTIVE_BY_ERROR");
            return ResponseEntity.ok(response);
        }
    }

    private String callOpenAiAPI(String userMsg, String sysPrompt, String apiKey) throws Exception {
        URL url = new URL("https://api.openai.com/v1/chat/completions");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json; utf-8");
        conn.setRequestProperty("Authorization", "Bearer " + apiKey);
        conn.setDoOutput(true);
        conn.setConnectTimeout(8000);
        conn.setReadTimeout(12000);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-3.5-turbo");
        
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", sysPrompt));
        messages.add(Map.of("role", "user", "content", userMsg));
        body.put("messages", messages);

        String jsonInputString = objectMapper.writeValueAsString(body);

        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = jsonInputString.getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }

        int code = conn.getResponseCode();
        if (code != 200) {
            throw new RuntimeException("HTTP Response Code from OpenAI: " + code);
        }

        try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                response.append(line.trim());
            }
            JsonNode root = objectMapper.readTree(response.toString());
            return root.path("choices").get(0).path("message").path("content").asText();
        }
    }

    private String callGeminiAPI(String userMsg, String sysPrompt, String apiKey) throws Exception {
        URL url = new URL("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json; utf-8");
        conn.setDoOutput(true);
        conn.setConnectTimeout(8000);
        conn.setReadTimeout(12000);

        // Format body for Gemini 1.5 with direct system instructions
        Map<String, Object> body = new HashMap<>();
        
        Map<String, Object> systemInstruction = new HashMap<>();
        Map<String, Object> systemParts = new HashMap<>();
        systemParts.put("text", sysPrompt);
        systemInstruction.put("parts", List.of(systemParts));
        body.put("systemInstruction", systemInstruction);

        Map<String, Object> contentMap = new HashMap<>();
        Map<String, Object> userParts = new HashMap<>();
        userParts.put("text", userMsg);
        contentMap.put("role", "user");
        contentMap.put("parts", List.of(userParts));
        body.put("contents", List.of(contentMap));

        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.7);
        generationConfig.put("maxOutputTokens", 800);
        body.put("generationConfig", generationConfig);

        String jsonInputString = objectMapper.writeValueAsString(body);

        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = jsonInputString.getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }

        int code = conn.getResponseCode();
        if (code != 200) {
            throw new RuntimeException("HTTP Response Code from Gemini: " + code);
        }

        try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                response.append(line.trim());
            }
            JsonNode root = objectMapper.readTree(response.toString());
            return root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
        }
    }

    private String getLocalFallback(String text, String mentorName) {
        String query = text.toLowerCase();
        
        if (query.contains("hi") || query.contains("hello") || query.contains("hey") || query.contains("greetings") || query.trim().equals("hi") || query.trim().equals("hello")) {
            return "Hi there! 👋 I am your Hemz AI Assistant. How can I help you sharpen your technical preparation, design scalable architectures, or navigate your career growth today? Feel free to ask me anything about the HEMZ AI application or coding frameworks!";
        } else if (query.contains("motivation") || query.contains("nervous") || query.contains("anxious") || query.contains("scared") || query.contains("sad")) {
            return "🌟 **Hemz Cognitive Motivation Booster**:\n" +
                "Be incredibly proud of yourself. Every single line of code you optimize, every mock interview round you take, is building your technical authority. " +
                "The engineering hurdles you face today are just forging the unique skills that will define your career. Keep your chin up, focus, and let's conquer the next challenge!";
        } else if (query.contains("system") || query.contains("database") || query.contains("architect") || query.contains("scale")) {
            return "🚀 **Enterprise System Architecture Insight**:\n" +
                "*   **Broker Decoupling**: Use message queues like Apache Kafka or RabbitMQ to scale high-frequency event ingestion.\n" +
                "*   **Caching Layer**: Utilize Redis cluster configurations with Cache-Aside or Write-Through mechanics to reduce database write pressures.\n" +
                "*   **Database Partitioning**: Avoid array overgrowths in document models and implement sharding key routing to prevent read-write hotspots.";
        } else if (query.contains("drill") || query.contains("question") || query.contains("practice")) {
            return "💡 **Chibi Mock Coding Drill**:\n" +
                "*Spring Boot Consistency Drill*:\n" +
                "How do you ensure transaction integrity across multiple Microservices when MongoDB is used in one and PostgreSQL in another?\n" +
                "**Mentor Tip**: Explain the **Saga Pattern** (orchestration vs choreography) and Compensating Transactions for clean rollbacks.";
        } else if (query.contains("star") || query.contains("situation") || query.contains("method")) {
            return "📊 **STAR Pacing Strategy**:\n" +
                "*   **[S] Situation**: Describe the production size and metrics (e.g. 'DB join latency hit 4s under 10k clients').\n" +
                "*   **[T] Task**: Define your specific mission (e.g. 'I was tasked with reducing it by 60%').\n" +
                "*   **[A] Action**: Detail your exact architectural changes (compounding indexes, adding Redis nodes, etc.).\n" +
                "*   **[R] Result**: Share concrete metrics (e.g. 'Latencies dropped to 110ms, CPU loads halved!').";
        } else if (query.contains("app") || query.contains("hemz") || query.contains("aura") || query.contains("how to") || query.contains("scan") || query.contains("work") || query.contains("voice") || query.contains("sentiment")) {
            return "**HEMZ AI Guide & Troubleshooting FAQs**:\n\n" +
                "*   **Resume Scanner**: Paste your resume content to extract custom skills and properties.\n" +
                "*   **Chamber Setup**: Configure Technical, HR, or Scenario tracks to guide the mock question engine.\n" +
                "*   **Voice Synthesis**: The standard HTML5 **Web Speech API** compiles speech to text. Speak clearly and tap the mic once you finish speaking to process evaluation.\n" +
                "*   **DistilBERT Sentiment ML**: Runs entirely inside your browser's worker thread using `@xenova/transformers`. It downloads a ~25MB pre-trained classifier into your browser cache on your first run so your voice transcriptions are graded instantly and privately!\n" +
                "*   **LocalStorage Privacy**: 100% of your transcripts and metrics are saved directly in your secure local MongoDB or IndexedDB browser storage.";
        } else {
            return "That is a very interesting technical query! I recommend testing your answer structure inside the HEMZ AI training chamber to build real-time voice confidence. " +
                "Let me know if you would like me to provide a 'Motivational Quote', explain 'how the resume scanner works', or run an 'Interview Drill'!";
        }
    }
}
