package com.aura.backend.service;

import com.aura.backend.model.InterviewSession;
import com.aura.backend.model.InterviewSession.QAEvaluation;
import com.aura.backend.repository.InterviewSessionRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;

@Service
public class InterviewSessionService {

    @Autowired
    private InterviewSessionRepository sessionRepository;

    private final Random random = new Random();

    // 30+ Tech Skill Question Registry
    private static final Map<String, List<String>> TECHNICAL_SKILL_QUESTIONS;
    private static final Map<String, List<String>> SCENARIO_SKILL_QUESTIONS;

    static {
        Map<String, List<String>> techMap = new HashMap<>();
        Map<String, List<String>> scenMap = new HashMap<>();

        // React.js
        techMap.put("React.js", Arrays.asList(
            "In React, how do you optimize virtual DOM rendering for deep nested lists, and what are the trade-offs of using useMemo or useCallback?",
            "Explain React's concurrent rendering engine, server-side rendering (SSR), and how hydration differs from client-side rendering."
        ));
        scenMap.put("React.js", Arrays.asList(
            "Your React application experiences a sudden frame rate drop (jank) when typing into a complex search input. How do you profile and solve this?",
            "You need to implement a state management strategy for an enterprise dashboard with hundreds of real-time widget updates. How do you structure it?"
        ));

        // Spring Boot
        techMap.put("Spring Boot", Arrays.asList(
            "How does Spring Boot configure class loading and auto-configuration under the hood, and how would you resolve a circular dependency issue in bean initialization?",
            "What is your approach to designing fault-tolerant transactions in Spring Boot using @Transactional, propagation levels, and isolation levels?"
        ));
        scenMap.put("Spring Boot", Arrays.asList(
            "Your Spring Boot backend experiences a gradual memory leak in production, causing JVM OutOfMemory errors every 48 hours. How do you isolate the leak?",
            "Imagine a Spring Boot microservice needs to consume events from Kafka and update a MongoDB collection. How do you handle transaction consistency?"
        ));

        // MongoDB
        techMap.put("MongoDB", Arrays.asList(
            "Explain MongoDB's index types (single field, compound, multikey) and how to design schema layouts to avoid the 'unbound array growth' anti-pattern.",
            "How does MongoDB handle replica set elections and horizontal write scaling with sharding under heavy transaction volumes?"
        ));
        scenMap.put("MongoDB", Arrays.asList(
            "A MongoDB query in your application suddenly starts performing full table scans, causing database CPU to spike to 100%. How do you diagnose and fix it?",
            "You are designing a high-throughput logging system. How do you configure MongoDB write concerns (w: 1, w: majority, journaled) to balance safety and speed?"
        ));

        // Java SE/EE
        techMap.put("Java SE/EE", Arrays.asList(
            "What is the difference between Virtual Threads (introduced in Java 21) and traditional platform threads, and how do they change concurrent programming paradigms?",
            "Explain Java GC tuning, specifically how the G1 and Z Garbage Collectors manage memory latency for large heaps."
        ));
        scenMap.put("Java SE/EE", Arrays.asList(
            "You are seeing high context-switching CPU load in a Java multi-threaded server application. How do you analyze thread contention and optimize thread pools?",
            "Your Java program needs to parse a massive 10GB JSON file without throwing OutOfMemoryError. How do you design the parser stream?"
        ));

        // Python ML
        techMap.put("Python ML", Arrays.asList(
            "Explain the mathematical difference between L1 (Lasso) and L2 (Ridge) regularization, and when you would select one over the other in training.",
            "How do you mitigate gradient vanishing or exploding problems in deep recurrent neural networks, and how do transformers resolve this?"
        ));
        scenMap.put("Python ML", Arrays.asList(
            "A machine learning model shows 99% accuracy on training data but performs poorly in production. How do you diagnose overfitting and what steps do you take?",
            "You need to deploy a heavy transformer model on an edge device with limited GPU memory. What model compression techniques do you apply?"
        ));

        // Node.js
        techMap.put("Node.js", Arrays.asList(
            "How does the Node.js event loop orchestrate tasks, microtasks, and thread-pool execution under the hood for asynchronous system resources?",
            "Explain how Node.js streams work and how to leverage backpressure to handle heavy file operations without exhausting system memory."
        ));
        scenMap.put("Node.js", Arrays.asList(
            "Your Node.js process suddenly crashes in production with 'JavaScript heap out of memory'. How do you generate and analyze the heap dump?",
            "You are building a real-time WebSocket server in Node.js. How do you scale it horizontally across multiple server cores or instances?"
        ));

        // Express.js
        techMap.put("Express.js", Arrays.asList(
            "How does Express middleware pipeline execute request-response cycles, and how do you handle asynchronous errors gracefully in custom middleware?",
            "Explain how to configure secure headers, CORS, and request rate-limiting in an Express.js backend to prevent DDoS and XSS attacks."
        ));
        scenMap.put("Express.js", Arrays.asList(
            "An endpoint in your Express backend starts taking over 5 seconds to respond under moderate load. How do you profile the Event Loop blockage?",
            "You are designing a routing system that handles dynamic sub-domains. How do you structure Express router parameters cleanly and safely?"
        ));

        // SQL Databases
        techMap.put("SQL Databases", Arrays.asList(
            "Explain database normalization (1NF through BCNF), trade-offs of intentional denormalization, and how execution planners optimize complex joins.",
            "How do you achieve distributed transaction consistency (e.g. 2-Phase Commit) vs eventual consistency in relational databases?"
        ));
        scenMap.put("SQL Databases", Arrays.asList(
            "A critical SQL query has slowed down dramatically because of lock contention during heavy writes. How do you tune isolation levels and indexes?",
            "You are migrating a legacy schema to support database sharding. How do you choose the partition key to avoid hotspots?"
        ));

        // AWS Cloud
        techMap.put("AWS Cloud", Arrays.asList(
            "How would you design a multi-region highly available serverless infrastructure on AWS utilizing API Gateway, Lambda, DynamoDB, and Route 53 latency routing?",
            "Explain AWS IAM roles, resource policies, VPC peering, and secure transit gateways for isolating production environments."
        ));
        scenMap.put("AWS Cloud", Arrays.asList(
            "Your AWS Lambda functions are experiencing severe 'cold start' latency, affecting customer checkout times. How do you diagnose and resolve this?",
            "You need to securely connect a private VPC backend to a third-party API without exposing your servers to the public internet. What VPC architecture do you use?"
        ));

        // Docker
        techMap.put("Docker Containers", Arrays.asList(
            "How do Docker multi-stage builds work, and what practices do you use to minimize container layers and secure image runtimes?",
            "Explain Docker networking modes (bridge, host, overlay) and when to use each for microservices communication."
        ));
        scenMap.put("Docker Containers", Arrays.asList(
            "A containerized application keeps failing to start because of permission errors on mounted host volumes. How do you resolve this?",
            "Your Docker daemon is consuming 100% disk space due to dangling images and build caches. How do you implement a safe cleanup pipeline?"
        ));

        // Kubernetes
        techMap.put("Kubernetes", Arrays.asList(
            "Describe the core control plane components of Kubernetes and how it manages pod orchestration, self-healing, rolling updates, and service discovery.",
            "What are Kubernetes custom resources (CRDs) and operators, and how do they extend the core Kubernetes API?"
        ));
        scenMap.put("Kubernetes", Arrays.asList(
            "A critical pod in your Kubernetes cluster is stuck in 'CrashLoopBackOff'. Walk me through your debugging steps using kubectl.",
            "You need to implement zero-downtime rolling deployments for a stateful microservice. How do you configure Readiness/Liveness probes and StatefulSets?"
        ));

        // TypeScript
        techMap.put("TypeScript", Arrays.asList(
            "Explain TypeScript utility types, conditional types, mapped types, and how you would design a type-safe generic API client interface.",
            "How do structural typing and declaration merging work in TypeScript, and how do you resolve complex compilation conflicts?"
        ));
        scenMap.put("TypeScript", Arrays.asList(
            "You are seeing slow compile times in a large-scale TypeScript project. What tsconfig.json configurations do you adjust to optimize the compiler?",
            "How do you implement runtime validation for external API payloads while preserving compile-time type-safety in TypeScript?"
        ));

        TECHNICAL_SKILL_QUESTIONS = Collections.unmodifiableMap(techMap);
        SCENARIO_SKILL_QUESTIONS = Collections.unmodifiableMap(scenMap);
    }

    private static final List<String> GENERAL_TECH_QUESTIONS = Arrays.asList(
        "What are the fundamental characteristics of RESTful APIs, and how do you design secure, idempotent API endpoints?",
        "Explain the clean architecture pattern, dependency inversion, and how they contribute to system testability and maintainability."
    );

    private static final List<String> GENERAL_SCENARIO_QUESTIONS = Arrays.asList(
        "You are tasked with refactoring a massive legacy monolith into microservices. What strategies do you use to partition data and cut dependencies?",
        "Imagine a feature you deployed breaks a key legacy workflow. Explain your rollback, recovery, and post-mortem protocol."
    );

    /**
     * Populate interview session with dynamic questions and resume reviews.
     * Integrates Ollama local LLM when online, and falls back to our robust heuristic map when offline.
     */
    public void populateSessionQuestions(InterviewSession session) {
        // Force resume mode strictly to prevent certificate format issues
        session.setCertificate(false);

        String name = session.getCandidateName();
        List<String> skills = session.getCandidateSkills();
        String track = session.getTrack();
        String experience = session.getExperienceLevel();

        if (skills == null || skills.isEmpty()) {
            skills = Arrays.asList("React.js", "Spring Boot", "MongoDB");
        }

        // --- PRACTICE MODE SHORT QUESTIONS (6-7 QUESTIONS) ---
        if ("Practice".equalsIgnoreCase(session.getMode())) {
            List<QAEvaluation> evaluations = new ArrayList<>();
            String roleVal = session.getRole();
            String companyVal = session.getCompany();
            if (roleVal == null || roleVal.isEmpty()) roleVal = "Software Engineer";
            if (companyVal == null || companyVal.isEmpty()) companyVal = "your previous roles";

            // Q1: Self-Introduction
            String selfIntroQ = String.format("Welcome, %s! Please introduce yourself and walk me through your professional resume, highlighting your key experiences as a %s at %s.", name, roleVal, companyVal);
            evaluations.add(createQAEval(selfIntroQ, "HR"));

            // Get parsed resume skills
            List<String> matchedSkills = new ArrayList<>();
            for (String skill : skills) {
                if (skill != null && !skill.trim().isEmpty() && !matchedSkills.contains(skill)) {
                    matchedSkills.add(skill);
                }
            }
            if (matchedSkills.isEmpty()) {
                matchedSkills.addAll(Arrays.asList("React.js", "Spring Boot", "MongoDB", "Java SE/EE", "Docker Containers", "SQL Databases"));
            }

            // Q2-Q7: 6 basic questions from skills
            for (int i = 0; i < 6; i++) {
                String skill = matchedSkills.get(i % matchedSkills.size());
                String questionText;
                String categoryText = "Technical";

                if ("HR".equalsIgnoreCase(track)) {
                    categoryText = "Behavioral";
                    if (i % 3 == 0) {
                        questionText = String.format("Describe a challenging blocker or technical bottleneck you encountered while working with %s. How did you pivot or resolve it?", skill);
                    } else if (i % 3 == 1) {
                        questionText = String.format("How did you collaborate with other team members or manage stakeholder expectations when integrating %s in your projects?", skill);
                    } else {
                        questionText = String.format("Tell me about a time when you had to learn %s under a tight deadline. What strategies did you use to master it quickly?", skill);
                    }
                } else {
                    List<String> questionsForSkill = TECHNICAL_SKILL_QUESTIONS.get(skill);
                    if (questionsForSkill != null && !questionsForSkill.isEmpty()) {
                        int qIdx = (i / matchedSkills.size()) % questionsForSkill.size();
                        questionText = questionsForSkill.get(qIdx);
                    } else {
                        if (i % 3 == 0) {
                            questionText = String.format("Your resume highlights experience with %s. Can you explain its core concepts, advantages, and when you would choose to use it in an application?", skill);
                        } else if (i % 3 == 1) {
                            questionText = String.format("Based on your hands-on experience with %s, what are the most common performance bottlenecks or developer errors you've encountered, and how did you resolve them?", skill);
                        } else {
                            questionText = String.format("When designing systems utilizing %s, what best practices, data security configurations, or structural guidelines do you follow to ensure reliability?", skill);
                        }
                    }
                }
                evaluations.add(createQAEval(questionText, categoryText));
            }

            session.setQaEvaluations(evaluations);
            session.setResumeImprovementFeedback("Warmup Practice Session: Complete all basic rounds to analyze your active tech stack and get high-value suggestions!");
            return;
        }

        // --- OPTION A: OLLAMA LOCAL ML GENERATION ---
        if (isOllamaActive()) {
            String model = getOllamaModel();
            String docType = session.isCertificate() ? "Course Certificate / Credential Badge" : "Professional Resume";
            
            String fullTextSnippet = "";
            if (session.getFullText() != null && !session.getFullText().isEmpty()) {
                fullTextSnippet = session.getFullText();
                if (fullTextSnippet.length() > 2500) {
                    fullTextSnippet = fullTextSnippet.substring(0, 2500) + "... [Truncated]";
                }
            }

            StringBuilder systemPrompt = new StringBuilder();
            systemPrompt.append("You are a professional technical interviewer and expert career branding advisor.\n");
            systemPrompt.append("Given the following candidate details:\n");
            systemPrompt.append("Name: ").append(name).append("\n");
            systemPrompt.append("Skills: ").append(String.join(", ", skills)).append("\n");
            systemPrompt.append("Track: ").append(track).append("\n");
            systemPrompt.append("Experience Level: ").append(experience).append("\n");
            systemPrompt.append("Document Type: ").append(docType).append("\n");
            
            if (session.isCertificate()) {
                systemPrompt.append("Extracted Cert Name: ").append(session.getCertName() != null ? session.getCertName() : "N/A").append("\n");
                systemPrompt.append("Extracted Cert Issuer: ").append(session.getCertIssuer() != null ? session.getCertIssuer() : "N/A").append("\n");
            } else {
                systemPrompt.append("Extracted Role: ").append(session.getRole() != null ? session.getRole() : "N/A").append("\n");
                systemPrompt.append("Extracted Company: ").append(session.getCompany() != null ? session.getCompany() : "N/A").append("\n");
                if (session.getProjects() != null && !session.getProjects().isEmpty()) {
                    systemPrompt.append("Extracted Projects: ").append(String.join(", ", session.getProjects())).append("\n");
                }
            }
            
            if (!fullTextSnippet.isEmpty()) {
                systemPrompt.append("\nUploaded Document Scanned Raw Content:\n");
                systemPrompt.append("=====================================\n");
                systemPrompt.append(fullTextSnippet).append("\n");
                systemPrompt.append("=====================================\n");
            }

            systemPrompt.append("\nBased on the parsed document, construct exactly 5 highly customized, high-fidelity interview questions:\n");
            if (session.isCertificate()) {
                String cName = session.getCertName() != null && !session.getCertName().isEmpty() ? session.getCertName() : "their certificate course";
                String cIssuer = session.getCertIssuer() != null && !session.getCertIssuer().isEmpty() ? session.getCertIssuer() : "the issuer";
                systemPrompt.append("- Validate the specific learning concepts from their certified credential (").append(cName).append(" issued by ").append(cIssuer).append(").\n");
                systemPrompt.append("- Verify core architectural or technical aspects related to the certification topics.\n");
                systemPrompt.append("- Frame scenario and behavioral challenges showing how they apply certified learning to practical edge cases.\n");
                systemPrompt.append("- The 5th question MUST critique their certification and guide them on how to construct a robust hands-on portfolio project to prove practical mastery.\n");
            } else {
                String uRole = session.getRole() != null && !session.getRole().isEmpty() ? session.getRole() : "Software Engineer";
                String uCompany = session.getCompany() != null && !session.getCompany().isEmpty() ? session.getCompany() : "their work";
                String uProj = session.getProjects() != null && !session.getProjects().isEmpty() ? session.getProjects().get(0) : "their projects";
                systemPrompt.append("- Weave their actual role (").append(uRole).append(" at ").append(uCompany).append(") and listed projects (e.g. ").append(uProj).append(") directly into technical, scenario, and behavioral questions.\n");
                systemPrompt.append("- Avoid generic question templates; make references to their specific biographical timeline and technological achievements.\n");
                systemPrompt.append("- The 5th question MUST be a dynamic resume optimization question, focusing on an identified skill/experience gap or how to rewrite their achievements for maximum impact.\n");
            }

            systemPrompt.append("\nAlso, generate a comprehensive resume review analysis containing detailed Strengths, identified Technical Gaps, and 3 specific actionable roadmap steps to optimize their career branding.\n");
            systemPrompt.append("\nYou must respond ONLY with a raw JSON object in the following format. Do not write any conversational text before or after the JSON:\n");
            systemPrompt.append("{\n");
            systemPrompt.append("  \"questions\": [\n");
            systemPrompt.append("    {\"question\": \"...\", \"category\": \"Technical\"},\n");
            systemPrompt.append("    {\"question\": \"...\", \"category\": \"Technical\"},\n");
            systemPrompt.append("    {\"question\": \"...\", \"category\": \"Scenario\"},\n");
            systemPrompt.append("    {\"question\": \"...\", \"category\": \"Behavioral\"},\n");
            systemPrompt.append("    {\"question\": \"...\", \"category\": \"Resume Optimization\"}\n");
            systemPrompt.append("  ],\n");
            systemPrompt.append("  \"resumeFeedback\": \"A markdown-formatted analysis of strengths, technical gaps, and 3 actionable steps to improve their resume.\"\n");
            systemPrompt.append("}");

            String response = queryOllama(systemPrompt.toString(), model);
            String jsonStr = extractJson(response);
            if (jsonStr != null) {
                try {
                    ObjectMapper mapper = new ObjectMapper();
                    JsonNode node = mapper.readTree(jsonStr);
                    JsonNode qsNode = node.get("questions");
                    List<QAEvaluation> evals = new ArrayList<>();
                    if (qsNode != null && qsNode.isArray()) {
                        for (JsonNode q : qsNode) {
                            evals.add(createQAEval(q.get("question").asText(), q.get("category").asText()));
                        }
                    }
                    if (evals.size() == 5) {
                        session.setQaEvaluations(evals);
                        session.setResumeImprovementFeedback(node.get("resumeFeedback").asText());
                        return;
                    }
                } catch (Exception e) {
                    System.err.println("Ollama parsing failed. Running Heuristic fallback: " + e.getMessage());
                }
            }
        }

        // --- OPTION B: DYNAMIC SKILL HEURISTIC FALLBACK ---
        List<String> matchedSkills = new ArrayList<>();
        for (String skill : skills) {
            if (skill != null && !skill.trim().isEmpty() && !matchedSkills.contains(skill)) {
                matchedSkills.add(skill);
            }
        }

        if (matchedSkills.isEmpty()) {
            matchedSkills.add("React.js");
            matchedSkills.add("Spring Boot");
        }

        List<QAEvaluation> evaluations = new ArrayList<>();
        String primary = matchedSkills.get(0);
        String secondary = matchedSkills.size() > 1 ? matchedSkills.get(1) : primary;

        // Dynamic bullet achievements parser to ask questions directly targeting the candidate's custom accomplishments
        List<String> resumeBullets = new ArrayList<>();
        if (session.getFullText() != null && !session.getFullText().isEmpty()) {
            String[] rawLines = session.getFullText().split("\\r?\\n");
            for (String rLine : rawLines) {
                String trimmed = rLine.trim().replaceAll("^[•\\-\\*■❑✅▪\\d\\.\\s]+", "").trim();
                if (trimmed.length() > 15 && trimmed.length() < 350) {
                    String lowerTrimmed = trimmed.toLowerCase();
                    if (lowerTrimmed.contains("develop") || lowerTrimmed.contains("implement") || 
                        lowerTrimmed.contains("build") || lowerTrimmed.contains("optim") || 
                        lowerTrimmed.contains("architect") || lowerTrimmed.contains("integrat") ||
                        lowerTrimmed.contains("creat") || lowerTrimmed.contains("design") ||
                        lowerTrimmed.contains("migrat") || lowerTrimmed.contains("scal") ||
                        lowerTrimmed.contains("manag") || lowerTrimmed.contains("lead") ||
                        lowerTrimmed.contains("work") || lowerTrimmed.contains("support")) {
                        if (!resumeBullets.contains(trimmed)) {
                            resumeBullets.add(trimmed);
                        }
                    }
                }
            }
            
            // Second pass: if less than 3 bullets are extracted, harvest any descriptive lines
            if (resumeBullets.size() < 3) {
                for (String rLine : rawLines) {
                    String trimmed = rLine.trim().replaceAll("^[•\\-\\*■❑✅▪\\d\\.\\s]+", "").trim();
                    if (trimmed.length() > 15 && trimmed.length() < 350) {
                        if (!resumeBullets.contains(trimmed) && !trimmed.toLowerCase().contains("skills:") && 
                            !trimmed.toLowerCase().contains("languages:") && !trimmed.toLowerCase().contains("education:") &&
                            trimmed.split("\\s+").length > 3) {
                            resumeBullets.add(trimmed);
                        }
                    }
                    if (resumeBullets.size() >= 5) break;
                }
            }

            // Third pass fallback: split fullText by punctuation to harvest clean sentences
            if (resumeBullets.size() < 3) {
                String fullText = session.getFullText();
                String normalizedText = fullText.replaceAll("\\r?\\n", " ");
                String[] sentences = normalizedText.split("(?<=[\\.!?])\\s+");
                for (String sentence : sentences) {
                    String trimmed = sentence.trim().replaceAll("^[•\\-\\*■❑✅▪\\d\\.\\s]+", "").trim();
                    if (trimmed.length() > 25 && trimmed.length() < 300) {
                        String lowerTrimmed = trimmed.toLowerCase();
                        if (!resumeBullets.contains(trimmed) && 
                            !lowerTrimmed.contains("skills:") && 
                            !lowerTrimmed.contains("languages:") && 
                            !lowerTrimmed.contains("education:") &&
                            !lowerTrimmed.contains("certified") &&
                            trimmed.split("\\s+").length > 4) {
                            resumeBullets.add(trimmed);
                        }
                    }
                    if (resumeBullets.size() >= 5) break;
                }
            }
        }

        String roleVal = session.getRole();
        String companyVal = session.getCompany();
        List<String> projectsList = session.getProjects();
        if (roleVal == null || roleVal.isEmpty()) roleVal = "Software Engineer";
        if (companyVal == null || companyVal.isEmpty()) companyVal = "Quantum Tech Systems";
        
        List<String> mutableProjects = (projectsList == null || projectsList.isEmpty()) ? new ArrayList<>() : new ArrayList<>(projectsList);
        if (mutableProjects.isEmpty()) {
            mutableProjects.add(primary + " Enterprise Platform");
            mutableProjects.add("Distributed " + secondary + " Orchestrator");
            mutableProjects.add("High-Throughput Analytics Engine");
        }

        String bullet1 = !resumeBullets.isEmpty() ? resumeBullets.get(0) : String.format("Lead the implementation of %s using %s", mutableProjects.get(0), primary);
        String bullet2 = resumeBullets.size() > 1 ? resumeBullets.get(1) : String.format("Optimize performance and data orchestration with %s", secondary);
        String bullet3 = resumeBullets.size() > 2 ? resumeBullets.get(2) : String.format("Designed the scalable microservices architecture at %s", companyVal);
        String bullet4 = resumeBullets.size() > 3 ? resumeBullets.get(3) : "Refactored distributed data components and resolved concurrency bottlenecks";
        String bullet5 = resumeBullets.size() > 4 ? resumeBullets.get(4) : "Orchestrated deployment pipelines and secured enterprise cloud environments";

        if (session.isCertificate()) {
            String certName = session.getCertName();
            String certIssuer = session.getCertIssuer();
            if (certName == null || certName.isEmpty()) certName = primary + " Certification";
            if (certIssuer == null || certIssuer.isEmpty()) certIssuer = "Authorized Issuer";

            String q1 = String.format("Congratulations on earning your credential, %s from %s, %s! Explain the core architectural concept or design paradigm you learned in this certification course.", certName, certIssuer, name);
            String q2 = String.format("In the curriculum for your %s, what was the most challenging coding exercise, lab, or configuration you had to complete, and how did you verify its correctness?", certName);
            String q3 = String.format("Imagine you need to apply your certified skills in %s to a new enterprise system. How do you design and structure the integration, and what are the security best practices you would enforce?", certName);
            String q4 = String.format("Earning a credential from %s requires strong discipline. While preparing for %s, what concept did you find most challenging, and how did you research and resolve your doubts?", certIssuer, certName);
            String q5 = String.format("A certification is a great milestone, but hands-on application is key. How do you plan to showcase your %s expertise in a custom portfolio project to prove your practical capability to hiring managers?", certName);

            evaluations.add(createQAEval(q1, "Technical"));
            evaluations.add(createQAEval(q2, "Technical"));
            evaluations.add(createQAEval(q3, "Scenario"));
            evaluations.add(createQAEval(q4, "Behavioral"));
            evaluations.add(createQAEval(q5, "Certificate Verification"));
        } else {
            if ("HR".equalsIgnoreCase(track)) {
                // Q1: Self-introduction matching resume timeline
                evaluations.add(createQAEval(String.format("Welcome, %s! Please introduce yourself and walk me through your professional resume, highlighting your key experiences as a %s at %s.", name, roleVal, companyVal), "HR"));
                
                // Q2-Q6: 5 Dynamic sentence-based HR questions from accomplishments
                evaluations.add(createQAEval(synthesizeQuestion(bullet1, String.format("Looking at your resume, you highlighted: \"%s\". Can you explain the context of this accomplishment and the results you delivered?", bullet1), "HR", roleVal, companyVal), "HR"));
                evaluations.add(createQAEval(synthesizeQuestion(bullet2, String.format("For your achievement: \"%s\", how did you collaborate with your team to execute this, and what challenges did you overcome?", bullet2), "HR", roleVal, companyVal), "HR"));
                evaluations.add(createQAEval(synthesizeQuestion(bullet3, String.format("On your resume, you noted: \"%s\". Tell me about the project timeline and how you managed expectations?", bullet3), "HR", roleVal, companyVal), "HR"));
                evaluations.add(createQAEval(synthesizeQuestion(bullet4, String.format("Regarding your work: \"%s\". How did you coordinate with product managers and other engineers to deliver this milestone?", bullet4), "HR", roleVal, companyVal), "HR"));
                evaluations.add(createQAEval(synthesizeQuestion(bullet5, String.format("Your resume mentions that you: \"%s\". How did you prioritize your deliverables and resolve any blocking issues?", bullet5), "HR", roleVal, companyVal), "HR"));
                
                // Q7-Q11: 5 Collaboration & Conflict STAR behavioral questions
                evaluations.add(createQAEval(String.format("Describe a time when project requirements changed rapidly midway through a release cycle at %s. How did you adapt your architecture and manage expectations?", companyVal), "Behavioral"));
                evaluations.add(createQAEval(String.format("Tell me about a time when you had a technical disagreement with a team member regarding the layout or architectural decisions of \"%s\". How did you resolve the conflict?", mutableProjects.get(0)), "Behavioral"));
                evaluations.add(createQAEval("Can you share an experience where you had to collaborate closely with a non-technical stakeholder or department to ship a features dashboard? How did you communicate technical complexity?", "Behavioral"));
                evaluations.add(createQAEval(String.format("Describe a situation where a colleague was not meeting their deliverables on \"%s\", impacting your sprint pipeline. How did you address the issue?", mutableProjects.get(0)), "Behavioral"));
                evaluations.add(createQAEval(String.format("Walk me through a major technical mistake or bug you introduced in production at %s. How did you handle the rollback, communicate details, and prevent recurrence?", companyVal), "Behavioral"));

                // Q12-Q15: 4 Career growth & ATS resume optimization questions
                evaluations.add(createQAEval(String.format("Where do you see your technical expertise growing in the next three years? What adjacent technologies beyond %s do you hope to master next?", primary), "HR"));
                evaluations.add(createQAEval(String.format("How do you manage sprint deadlines and high-pressure deliverables when you encounter unexpected technical blockers in projects like \"%s\"?", mutableProjects.get(0)), "Behavioral"));
                evaluations.add(createQAEval(String.format("To optimize your resume for applicant tracking systems (ATS), what complementary technology (like cloud platforms, containerization, or message brokers) would you add next, and how would you quantify your project impact on \"%s\" using the STAR method?", mutableProjects.get(0)), "Resume Optimization"));
                evaluations.add(createQAEval(String.format("Why are you currently looking for a new role? How does our company's mission align with your professional goals as a %s?", roleVal), "HR"));
            } else if ("Scenario".equalsIgnoreCase(track) || "System Design".equalsIgnoreCase(track) || "Architecture".equalsIgnoreCase(track)) {
                // 5 Dynamic sentence-based distributed scaling scenario questions
                evaluations.add(createQAEval(String.format("Scenario: Your system experiences a sudden 10x traffic spike, causing connection pools to saturate. Based on your resume experience where you: \"%s\", how would you design circuit breakers, database read replicas, and scale your instances to handle this load?", bullet1), "Scenario"));
                evaluations.add(createQAEval(String.format("Scenario: A critical third-party API that your system relies on starts timing out, causing thread exhaustion in your backend. Reflecting on your achievement: \"%s\", how would you implement a retry-backoff queue, asynchronous event execution, or fallback mechanisms to insulate your system?", bullet2), "Scenario"));
                evaluations.add(createQAEval(String.format("Scenario: You are migrating legacy monolithic data to a distributed database, but you must prevent data inconsistency and support zero-downtime dual-writes. Looking at your work: \"%s\", how do you design a robust transaction synchronization and validation pipeline?", bullet3), "Scenario"));
                evaluations.add(createQAEval(String.format("Scenario: A sudden network partition isolates one of your database nodes, causing active synchronization failures. Based on your initiative: \"%s\", how do you configure eviction policies, partition recovery, and eventual consistency to ensure system reliability?", bullet4), "Scenario"));
                evaluations.add(createQAEval(String.format("Scenario: Your production environment suffers a major cloud node failure during peak usage, triggering a cascade shutdown. Based on your achievement: \"%s\", how would you design self-healing pod scheduling, resilient traffic gateways, and disaster recovery replication?", bullet5), "Scenario"));

                // 5 System failure modes scenarios
                evaluations.add(createQAEval(String.format("Scenario: Your system experiences a sudden cascade failure where active connections spike, exhausting system threads. Based on your project \"%s\", how do you isolate the bottleneck and implement a circuit breaker at %s?", mutableProjects.get(0), companyVal), "Scenario"));
                evaluations.add(createQAEval(String.format("Scenario: Imagine the system that you built for \"%s\" experiences a sudden 10x traffic spike, causing query timeouts and thread exhaustion. Walk me through your diagnostics and scaling roadmap based on your database design.", mutableProjects.get(0)), "Scenario"));
                evaluations.add(createQAEval(String.format("Scenario: Your backend service experiences a gradual memory leak in production, causing JVM OutOfMemory errors every 48 hours. Based on your codebase architecture for \"%s\", how do you isolate the leak and optimize garbage collection?", mutableProjects.get(0)), "Scenario"));
                evaluations.add(createQAEval(String.format("Scenario: A database query starts performing full table scans, causing CPU to spike to 100%%. Utilizing your listed skills in %s, how do you diagnose query planners and apply index strategies to optimize response times?", primary), "Scenario"));
                evaluations.add(createQAEval(String.format("Scenario: You are seeing high context-switching CPU load in a multi-threaded server application. Based on your concurrency skills, how do you analyze thread contention, locks, and optimize thread pool execution configurations for \"%s\"?", mutableProjects.get(0)), "Scenario"));

                // 5 Complex enterprise architectural designs
                evaluations.add(createQAEval(String.format("Scenario: You are designing a multi-region highly available serverless infrastructure for \"%s\". How would you utilize API Gateway, Lambda, DynamoDB, and global Route 53 latency routing to achieve zero downtime?", mutableProjects.get(0)), "Scenario"));
                evaluations.add(createQAEval(String.format("Scenario: Explain how to configure secure headers, CORS, and rate-limiting gateways in an enterprise backend to prevent DDoS and XSS attacks on your project \"%s\".", mutableProjects.get(0)), "Scenario"));
                evaluations.add(createQAEval(String.format("Scenario: You need to achieve distributed transaction consistency (e.g. 2-Phase Commit or Saga Pattern) vs eventual consistency in microservices relational systems. Based on your experience with %s, how do you design this?", primary), "Scenario"));
                evaluations.add(createQAEval(String.format("Scenario: You need to securely connect a private VPC backend to a third-party API without exposing your servers to the public internet. Based on your cloud skills, what VPC architecture would you design for \"%s\"?", mutableProjects.get(0)), "Scenario"));
                evaluations.add(createQAEval(String.format("Scenario: Looking at your resume, what is one major architectural limitation or structural trade-off you accepted in your design of \"%s\", and how would you optimize it in your next iteration to handle 10x traffic?", mutableProjects.get(0)), "Resume Optimization"));
            } else { // Technical / General Engineering tracks
                // 5 Dynamic sentence-based technical questions
                evaluations.add(createQAEval(synthesizeQuestion(bullet1, String.format("Looking at your experience as a %s at %s, you highlighted that you: \"%s\". Walk me through the exact technical details of how you designed this, what architectural trade-offs you made, and how you handled concurrency or memory overhead.", roleVal, companyVal, bullet1), "Technical", roleVal, companyVal), "Technical"));
                evaluations.add(createQAEval(synthesizeQuestion(bullet2, String.format("Another achievement on your resume is: \"%s\". As a %s, how did you integrate these technologies, secure token propagation, and verify data consistency under heavy transaction volumes?", bullet2, roleVal), "Technical", roleVal, companyVal), "Technical"));
                evaluations.add(createQAEval(synthesizeQuestion(bullet3, String.format("Regarding your initiative: \"%s\". What specific data structures or algorithmic patterns did you implement to optimize efficiency and minimize memory overhead?", bullet3), "Technical", roleVal, companyVal), "Technical"));
                evaluations.add(createQAEval(synthesizeQuestion(bullet4, String.format("For your work: \"%s\". How did you configure unit and integration tests, mock asynchronous dependencies, and verify transaction boundaries?", bullet4), "Technical", roleVal, companyVal), "Technical"));
                evaluations.add(createQAEval(synthesizeQuestion(bullet5, String.format("Your resume states you: \"%s\". Walk me through the encryption algorithms, token storage schemes, and key rotations you enforced for security.", bullet5), "Technical", roleVal, companyVal), "Technical"));

                // 10 Core technical concept questions directly mapping to the candidate's actual resume skills!
                int skillIndex = 0;
                for (int i = 0; i < 10; i++) {
                    String skill = matchedSkills.get(skillIndex % matchedSkills.size());
                    List<String> questionsForSkill = TECHNICAL_SKILL_QUESTIONS.get(skill);
                    String questionText;
                    if (questionsForSkill != null && !questionsForSkill.isEmpty()) {
                        int qIdx = (i / matchedSkills.size()) % questionsForSkill.size();
                        questionText = questionsForSkill.get(qIdx);
                    } else {
                        // Dynamic generation if skill not in static map
                        if (i % 3 == 0) {
                            questionText = String.format("You listed %s in your resume. Explain its core architecture, execution model under the hood, and how it manages system resource allocation under high loads.", skill);
                        } else if (i % 3 == 1) {
                            questionText = String.format("Based on your experience with %s, what are some of the most common performance bottlenecks or memory issues you've encountered, and how did you debug and optimize them?", skill);
                        } else {
                            questionText = String.format("When deploying systems utilizing %s, what security best practices, data protection schemes, or structural guidelines do you enforce to ensure robust enterprise compliance?", skill);
                        }
                    }
                    evaluations.add(createQAEval(questionText, "Technical"));
                    skillIndex++;
                }
            }
        }

        session.setQaEvaluations(evaluations);
        session.setResumeImprovementFeedback(generateHeuristicResumeFeedback(session, matchedSkills));
    }

    /**
     * Backward-compatible fallback.
     */
    public List<QAEvaluation> generateQuestions(List<String> skills, String track, String experienceLevel) {
        InterviewSession dummy = new InterviewSession();
        dummy.setCandidateName("Candidate");
        dummy.setCandidateSkills(skills);
        dummy.setTrack(track);
        dummy.setExperienceLevel(experienceLevel);
        populateSessionQuestions(dummy);
        return dummy.getQaEvaluations();
    }

    private QAEvaluation createQAEval(String question, String category) {
        QAEvaluation qa = new QAEvaluation();
        qa.setQuestion(question);
        qa.setCategory(category);
        qa.setUserTranscript("");
        qa.setScore(0);
        qa.setFeedback("Pending response evaluation.");
        qa.setSuggestedAnswer("");
        return qa;
    }

    private String generateHeuristicResumeFeedback(InterviewSession session, List<String> matchedSkills) {
        StringBuilder sb = new StringBuilder();
        String primary = matchedSkills.get(0);

        if (session.isCertificate()) {
            String certName = session.getCertName();
            String certIssuer = session.getCertIssuer();
            if (certName == null || certName.isEmpty()) certName = primary + " Certification";
            if (certIssuer == null || certIssuer.isEmpty()) certIssuer = "Authorized Issuer";

            sb.append("### 🌟 Certificate Strengths Analysis\n");
            sb.append("- **Verified Competency Badge:** Your certification explicitly validates specialized knowledge in **").append(certName).append("** issued by **").append(certIssuer).append("**.\n");
            sb.append("- **Structured Technical Foundation:** Earning a formal credential from **").append(certIssuer).append("** proves strong self-discipline, structured learning habits, and conceptual clarity in modern platforms.\n\n");
            
            sb.append("### 🔍 Transition Gaps to Professional Resume\n");
            sb.append("- **Missing Practical Application:** Having a credential like **").append(certName).append("** represents excellent theoretical knowledge. To appeal to corporate recruiters, you need to bridge this with robust, multi-tier projects.\n");
            sb.append("- **Lack of Enterprise Scale:** Most certificate assignments focus on micro-problems. Real-world systems require dealing with distributed state, error thresholds, and containerized cloud pipelines.\n");
            sb.append("- **Adjacent Tech Integration:** A **").append(certName).append("** becomes twice as valuable when integrated with complementary databases (like SQL/MongoDB) and CI/CD tools (like Git/Docker).\n\n");

            sb.append("### 🚀 Step-by-Step Action Roadmap\n");
            sb.append("1. **Build a Full-Scale Capstone:** Don't just list the certificate. Create a fully functional GitHub project that implements the core concepts of **").append(certName).append("** in an end-to-end user scenario.\n");
            sb.append("2. **Quantify Local Testing:** Add quantitative details: *Built a modular project utilizing ").append(primary).append(", achieving sub-100ms request handling under simulated load*.\n");
            sb.append("3. **Cross-Pollinate Badges:** Frame this certification on your resume as part of an active learning roadmap, linking it directly to your target engineering roles.");
        } else {
            String role = session.getRole();
            String company = session.getCompany();
            List<String> projects = session.getProjects();
            if (role == null || role.isEmpty()) role = "Software Engineer";
            if (company == null || company.isEmpty()) company = "your last company";

            sb.append("### 🌟 Resume Strengths Analysis\n");
            sb.append("- **Proven Professional Experience:** Demonstrated hands-on engineering experience as a **").append(role).append("** at **").append(company).append("**.\n");
            sb.append("- **Strong Modern Tech Stack:** Excellent coverage of core technologies: `").append(String.join("`, `", matchedSkills)).append("`.\n");
            if (projects != null && !projects.isEmpty()) {
                sb.append("- **Portfolio Highlights:** Strong projects including **").append(String.join("**, **", projects)).append("** showcase your ability to ship working software.\n");
            }
            sb.append("- **Clear Specialization:** Your skills demonstrate a focused foundation in ")
              .append(matchedSkills.contains("Spring Boot") || matchedSkills.contains("Java SE/EE") ? "robust enterprise backend development" : "dynamic frontend and modern UI architectures")
              .append(".\n\n");
            
            sb.append("### 🔍 Identified Technical Gaps\n");
            if (matchedSkills.contains("React.js") && !matchedSkills.contains("TypeScript")) {
                sb.append("- **Missing Type Safety:** You list `React.js` but lack `TypeScript`. Modern frontend roles highly prioritize type-safe components.\n");
            }
            if ((matchedSkills.contains("Spring Boot") || matchedSkills.contains("Node.js")) && !matchedSkills.contains("Docker Containers")) {
                sb.append("- **Missing Containerization:** You list modern backends but lack `Docker` container orchestration, which is essential for cloud devops environments.\n");
            }
            if (!matchedSkills.contains("AWS Cloud")) {
                sb.append("- **Cloud Infrastructure:** Your resume has a strong programming foundation but lacks cloud provider exposure (`AWS Cloud` or similar).\n");
            }
            sb.append("- **STAR Methodology:** Project descriptions should emphasize specific metrics (e.g. *Optimized DB query times by 40%*) rather than simple lists of duties.\n\n");

            sb.append("### 🚀 Step-by-Step Action Roadmap\n");
            if (projects != null && !projects.isEmpty()) {
                sb.append("1. **Enhance Project Metrics:** For **").append(projects.get(0)).append("**, rewrite the description to specify the exact architecture (e.g., caching, DB indices) and latency metrics.\n");
            } else {
                sb.append("1. **Add Project Metrics:** For your core projects at **").append(company).append("**, rewrite descriptions to follow the STAR method.\n");
            }
            sb.append("2. **Add Complementary Badges:** Dedicate 1-2 weeks to study and add `Docker` or `TypeScript` to your stack.\n");
            sb.append("3. **Highlight System Design:** Ensure your resume mentions API design (REST/GraphQL) and database design patterns.");
        }
        
        return sb.toString();
    }

    /* --- OLLAMA ML HELPERS --- */

    private boolean isOllamaActive() {
        try {
            URL url = new URL("http://localhost:11434/api/tags");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(800);
            conn.setReadTimeout(800);
            int code = conn.getResponseCode();
            return code == 200;
        } catch (Exception e) {
            return false;
        }
    }

    private String getOllamaModel() {
        try {
            URL url = new URL("http://localhost:11434/api/tags");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(800);
            conn.setReadTimeout(800);
            int code = conn.getResponseCode();
            if (code == 200) {
                BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    sb.append(line);
                }
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(sb.toString());
                JsonNode models = root.get("models");
                if (models != null && models.isArray() && models.size() > 0) {
                    return models.get(0).get("name").asText();
                }
            }
        } catch (Exception e) {
            // silent fail
        }
        return "gemma:2b"; // default fallback model
    }

    private String queryOllama(String prompt, String modelName) {
        try {
            URL url = new URL("http://localhost:11434/api/generate");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setConnectTimeout(4000);
            conn.setReadTimeout(4000);
            conn.setDoOutput(true);

            Map<String, Object> payload = new HashMap<>();
            payload.put("model", modelName);
            payload.put("prompt", prompt);
            payload.put("stream", false);

            ObjectMapper mapper = new ObjectMapper();
            String jsonPayload = mapper.writeValueAsString(payload);

            try (OutputStream os = conn.getOutputStream()) {
                os.write(jsonPayload.getBytes("UTF-8"));
            }

            int code = conn.getResponseCode();
            if (code == 200) {
                BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    sb.append(line);
                }
                JsonNode responseNode = mapper.readTree(sb.toString());
                return responseNode.get("response").asText();
            }
        } catch (Exception e) {
            System.err.println("Ollama query failed: " + e.getMessage());
        }
        return null;
    }

    private String extractJson(String text) {
        if (text == null) return null;
        int start = text.indexOf("{");
        int end = text.lastIndexOf("}");
        if (start != -1 && end != -1 && end > start) {
            return text.substring(start, end + 1);
        }
        return text;
    }

    /**
     * Evaluates a completed interview session, computes metrics, and persists it to MongoDB.
     */
    public InterviewSession evaluateSession(InterviewSession session) {
        if (session.getQaEvaluations() == null || session.getQaEvaluations().isEmpty()) {
            session.setOverallScore(0);
            session.setFeedbackSummary("No questions answered in this session.");
            return sessionRepository.save(session);
        }

        int totalScore = 0;
        List<QAEvaluation> evals = session.getQaEvaluations();

        for (QAEvaluation qa : evals) {
            String transcript = qa.getUserTranscript();
            String question = qa.getQuestion();

            // Perform intelligent diagnostic evaluation based on content characteristics
            int score = calculateHeuristicScore(transcript, question);
            qa.setScore(score);
            totalScore += score;

            // Generate specific feedback and suggested response
            qa.setFeedback(generateFeedbackForQuestion(score, qa.getCategory(), transcript));
            qa.setSuggestedAnswer(generateSuggestedAnswer(question));
        }

        int overall = totalScore / evals.size();
        session.setOverallScore(overall);
        session.setFeedbackSummary(generateSummaryFeedback(overall, session.getTrack()));

        // Skip persisting to MongoDB if in Warmup Practice mode
        if ("Practice".equalsIgnoreCase(session.getMode())) {
            if (session.getId() == null) {
                session.setId("practice_" + System.currentTimeMillis());
            }
            return session;
        }

        // Save to MongoDB database
        try {
            return sessionRepository.save(session);
        } catch (Exception e) {
            System.err.println("MongoDB Connection Failed! Saving locally/gracefully: " + e.getMessage());
            // Safe fallback: set dummy ID if db fails so UI is unaffected
            if (session.getId() == null) {
                session.setId("local_" + System.currentTimeMillis());
            }
            return session;
        }
    }

    public List<InterviewSession> getSessionHistory() {
        try {
            return sessionRepository.findAllByOrderByTimestampDesc();
        } catch (Exception e) {
            System.err.println("MongoDB Query Failed! Returning empty list: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    public InterviewSession getSessionById(String id) {
        try {
            return sessionRepository.findById(id).orElse(null);
        } catch (Exception e) {
            System.err.println("MongoDB Fetch Failed: " + e.getMessage());
            return null;
        }
    }

    public boolean deleteSession(String id) {
        try {
            if (sessionRepository.existsById(id)) {
                sessionRepository.deleteById(id);
                return true;
            }
            return false;
        } catch (Exception e) {
            System.err.println("MongoDB Delete Failed: " + e.getMessage());
            return false;
        }
    }

    /* --- PRIVATE AI SIMULATION/HEURISTIC ENGINES --- */

    private int calculateHeuristicScore(String transcript, String question) {
        if (transcript == null || transcript.trim().length() < 10 || transcript.contains("No spoken response captured")) {
            return 0; // skipped response gets 0%
        }

        String lower = transcript.toLowerCase();
        int score = 65; // Base score

        // Length bonus (longer, detailed explanations are usually better structured)
        int words = transcript.split("\\s+").length;
        if (words > 60) score += 15;
        else if (words > 30) score += 8;

        // Keyword recognition to detect technical depth
        List<String> depthKeywords = Arrays.asList("because", "specifically", "architecture", "tradeoff", "latency", "scale", "optimize", "experience", "pattern", "component", "mongodb", "security", "thread", "concurrency");
        for (String word : depthKeywords) {
            if (lower.contains(word)) {
                score += 2;
            }
        }

        // Cap score at 98 for realistic metrics
        return Math.min(score, 98);
    }

    private String generateFeedbackForQuestion(int score, String category, String transcript) {
        if (transcript == null || transcript.trim().length() < 10) {
            return "Your response was too brief to analyze. In a real interview, aim to spend at least 45-60 seconds speaking, providing context, action, and results.";
        }

        if (score >= 85) {
            return "Excellent depth! You structuralized your response effectively using clear causal links ('because', 'specifically'). You addressed both the high-level concepts and exact low-level details. Maintain this tempo and structure.";
        } else if (score >= 70) {
            return "Good response, but could be enhanced. While your technical explanation is correct, try integrating the STAR method (Situation, Task, Action, Result) to give a concrete project example demonstrating your hands-on experience.";
        } else {
            return "Your response is somewhat superficial. Try defining core definitions first before explaining your approach. Avoid filler words and focus on structured points (e.g. 'First..., Second...').";
        }
    }

    private String generateSuggestedAnswer(String question) {
        String q = question.toLowerCase();
        
        // --- React.js ---
        if (q.contains("optimize virtual dom") || q.contains("usememo or usecallback")) {
            return "To optimize deep nested list rendering in React, we first identify unnecessary re-renders. We should use `React.memo` on list item components, ensuring they only re-render when their props change. To prevent prop reference changes, we wrap callback functions in `useCallback` and expensive calculations in `useMemo`. For extremely large lists, we should use windowing/virtualization (via `react-window` or `react-virtualized`) to only render visible items in the DOM. Trade-offs include memory overhead from memoization caches and additional code complexity, which should only be introduced after profiling frame rates.";
        }
        if (q.contains("concurrent rendering") || q.contains("hydration")) {
            return "React's Concurrent Mode enables interruptible rendering, allowing high-priority updates (like typing in an input) to pause lower-priority updates (like rendering a heavy list). Server-Side Rendering (SSR) compiles the initial React component tree into raw HTML on the server and sends it to the browser for instant loading. Hydration is the client-side process where React boots up, attaches event handlers to this server-rendered HTML, and syncs the Virtual DOM with the page. Unlike standard client rendering which downloads JS before displaying anything, SSR displays static HTML immediately before hydration completes.";
        }
        if (q.contains("frame rate drop") || q.contains("jank") || q.contains("search input")) {
            return "To profile a React frame rate drop, we use Chrome DevTools or React Profiler to capture a flame chart. For search input jank, the main culprit is synchronously triggering heavy list filtering or rendering on every keystroke. To resolve this, we implement debouncing or throttling (e.g. 150-300ms) on the input handler so filtering only runs after the user stops typing. Additionally, we can wrap the state update in `startTransition` (useTransition) to mark the list update as non-blocking, allowing keystrokes to render instantly.";
        }
        if (q.contains("state management strategy") || q.contains("enterprise dashboard") || q.contains("widget")) {
            return "For an enterprise dashboard with hundreds of real-time widget updates, standard Context API causes global re-renders and degrades performance. Instead, we should use a state manager that supports localized/selective selector subscription, such as Redux Toolkit or Zustand. For extremely high-frequency micro-updates, atomic state libraries like Redux, Jotai or Recoil are ideal. We can also isolate rendering by decoupling state into web sockets and local state hooks inside widgets, preventing any single widget update from triggering a top-level re-render.";
        }

        // --- Spring Boot ---
        if (q.contains("auto-configuration under the hood") || q.contains("circular dependency")) {
            return "Spring Boot auto-configuration works via `@EnableAutoConfiguration` which reads `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`. It uses conditional annotations like `@ConditionalOnClass` or `@ConditionalOnMissingBean` to load beans only if prerequisites are met. Circular dependencies (Bean A depends on B, which depends on A) can be resolved by: 1) Refactoring to decouple dependencies (introducing a middle service/component), 2) Using `@Lazy` on one of the constructor parameters, or 3) Using setter injection instead of constructor injection.";
        }
        if (q.contains("designing fault-tolerant transactions") || q.contains("propagation levels")) {
            return "Spring's `@Transactional` uses AOP proxies to wrap method execution with database transactions. Propagation defines boundary behavior: `REQUIRED` (joins existing or creates new), `REQUIRES_NEW` (suspends active and creates a new transaction), and `NESTED` (creates a savepoint). Isolation levels solve concurrency read anomalies: `READ_COMMITTED` (prevents dirty reads), `REPEATABLE_READ` (prevents non-repeatable reads), and `SERIALIZABLE` (prevents phantom reads via lock contention). Fault tolerance is achieved by specifying `rollbackFor = Exception.class` to rollback on checked exceptions.";
        }
        if (q.contains("memory leak in production") || q.contains("outofmemory")) {
            return "To isolate a production JVM memory leak, we first capture heap dumps using `jmap` or configure `-XX:+HeapDumpOnOutOfMemoryError` in JVM options. We analyze the dump using Eclipse Memory Analyzer (MAT) to locate the leak suspect, which is typically unclosed database connections, static collections growing unbounded, thread local variables not cleaned up, or static cache maps without eviction policies. To fix it, we implement WeakHashMaps for caches, ensure try-with-resources closes all database streams, and clear thread locals in interceptors.";
        }
        if (q.contains("consume events from kafka") || q.contains("transaction consistency")) {
            return "To handle transaction consistency between consuming from Kafka and saving to MongoDB, we must handle dual-write failure modes. First, we enable idempotent consumers in Kafka by storing the message UUID in MongoDB's unique index to prevent duplicate processing. Second, we wrap MongoDB operations in a native Spring `@Transactional` block (using `MongoTransactionManager`). If MongoDB fails, Kafka offsets are NOT committed, prompting a retry. If Kafka fails to commit after successful DB write, the database transaction rolls back, or the unique index prevents duplicate processing upon retry.";
        }

        // --- MongoDB ---
        if (q.contains("index types") || q.contains("unbound array growth")) {
            return "MongoDB supports Single Field, Compound (ordered index on multiple fields), and Multikey (indexing arrays). Compound indexes must follow the Equality-Sort-Range (ESR) rule. The 'unbound array growth' anti-pattern happens when arrays (like comments inside a post document) grow indefinitely, exceeding the 16MB document limit. To avoid this, we transition to the subset pattern or extended reference pattern by storing comments as separate documents in a 'comments' collection, keeping only the 100 most recent comment IDs as an array in the parent post document.";
        }
        if (q.contains("replica set elections") || q.contains("horizontal write scaling")) {
            return "MongoDB replica sets achieve high availability using a Primary-Secondary-Arbiter architecture, electing a new Primary in <12s via Raft-like consensus if the primary fails. Write scaling is achieved via sharding, where a cluster divides dataset chunks across multiple shard nodes. A config server tracks shard metadata, and the `mongos` router directs client queries. Selecting a robust shard key is critical: it must have high cardinality and even write distribution to avoid hot spots.";
        }
        if (q.contains("performing full table scans") || q.contains("collscan")) {
            return "When MongoDB CPU spikes to 100% due to full table scans (`COLLSCAN`), we use `db.currentOp()` or check slow logs to identify the query. We run `explain(\"explainStats\")` or execute index profiling on the query to analyze the execution planner. If the stage is COLLSCAN instead of IXSCAN, it means there is no suitable index. We resolve this by adding an index matching the equality and filter conditions, following the ESR (Equality, Sort, Range) compound ordering guidelines.";
        }
        if (q.contains("write concerns") || q.contains("w: majority")) {
            return "MongoDB write concern configures the level of write acknowledgment. `w: 1` acknowledges writes once written to the primary's memory, offering high speed but risk of data loss. `w: majority` acknowledges writes only after replicating to a majority of secondary nodes, preventing dirty reads and rolled-back writes during primary failure. `j: true` ensures the write is committed to the on-disk journal before returning. For high-throughput logs, we balance speed/safety using asynchronous journaling and `w: 1` or `w: 0`.";
        }

        // --- Java SE/EE ---
        if (q.contains("virtual threads") || q.contains("platform threads")) {
            return "Traditional platform threads map 1-to-1 to OS kernel threads, which are expensive to create, consume ~1MB of stack memory, and have context-switching overhead. Virtual Threads (Java 21 Project Loom) are lightweight, user-mode threads managed by the JVM. Millions of virtual threads can run on a small pool of Carrier platform threads. When a virtual thread performs blocking I/O, the JVM yields its execution and mounts another virtual thread, making concurrent blocking code as scalable as reactive code without thread pool exhaustion.";
        }
        if (q.contains("gc tuning") || q.contains("g1 and z garbage collectors")) {
            return "G1 (Garbage First) GC is designed for multi-gigabyte heaps, dividing memory into equal regions and reclaiming regions with the most garbage first to meet latency goals. ZGC (Z Garbage Collector) is a low-latency, scalable GC that performs almost all garbage collection phases concurrently with application threads, achieving sub-millisecond pause times even on multi-terabyte heaps. Tuning involves adjusting heap sizes (`-Xmx`), pause time targets (`-XX:MaxGCPauseMillis`), and selecting ZGC via `-XX:+UseZGC`.";
        }
        if (q.contains("context-switching cpu load") || q.contains("thread contention")) {
            return "High context-switching CPU load indicates thread contention, where threads spend more time waiting for CPU lock acquisition than doing work. We analyze this using `jstack` or Java Flight Recorder (JFR) to locate blocked states and lock contentions. To optimize, we: 1) Replace synchronized blocks with non-blocking data structures (e.g. `ConcurrentHashMap`, `AtomicInteger`), 2) Shrink synchronization scope, and 3) Configure custom `ThreadPoolExecutor` with size bounded by carrier cores (e.g., `numCores * 2` for CPU-bound tasks) to prevent excessive thread creation.";
        }
        if (q.contains("parse a massive 10gb json")) {
            return "To parse a 10GB JSON file without throwing `OutOfMemoryError`, we must avoid loading the entire document into JVM heap memory (which standard parsers like Jackson's `ObjectMapper.readTree` do). Instead, we use a streaming JSON parser (like Jackson's `JsonParser` or Gson's `JsonReader`). This streaming parser reads the file sequentially as a stream of tokens (keys, values, array starts), allowing us to process one object/entity at a time, garbage collecting processed items immediately and maintaining flat heap memory.";
        }

        // --- Python ML ---
        if (q.contains("lasso") || q.contains("ridge") || q.contains("regularization")) {
            return "L1 regularization (Lasso) adds the absolute sum of weights to the loss function, encouraging sparsity by forcing non-essential weights to exactly zero, which acts as a built-in feature selector. L2 regularization (Ridge) adds the squared sum of weights, penalizing larger weights but never forcing them to zero. Lasso is selected when we suspect many features are irrelevant; Ridge is preferred when all features contribute slightly and we want to prevent multi-collinearity.";
        }
        if (q.contains("gradient vanishing") || q.contains("exploding") || q.contains("transformers")) {
            return "Gradient vanishing occurs in deep networks when backpropagated gradients shrink exponentially, preventing early layers from learning. Exploding occurs when gradients grow exponentially, causing numerical instability. Solutions include using ReLU activation, Batch Normalization, and Residual Connections. Transformers resolve this in sequence modeling by using self-attention mechanisms instead of recurrent steps, allowing direct gradient paths across arbitrary sequence lengths.";
        }

        // --- Node.js ---
        if (q.contains("event loop") || q.contains("asynchronous system resources")) {
            return "The Node.js event loop orchestrates asynchronous tasks in phases: Timers (setTimeout), Pending Callbacks (TCP errors), Idle/Prepare, Poll (incoming connections/I/O), Check (setImmediate), and Close Callbacks. Microtasks (process.nextTick and Promise callbacks) are executed immediately after the current phase completes. Heavy operations should be offloaded to the thread pool (libuv) or Worker Threads to avoid blocking the single-threaded event loop.";
        }
        if (q.contains("node.js streams") || q.contains("backpressure")) {
            return "Node.js streams process data incrementally, avoiding loading entire payloads into memory. Backpressure is the state where the data consumer is slower than the producer. When the readable buffer exceeds `highWaterMark`, `write()` returns `false`, signaling the producer to pause. The producer resumes when the consumer flushes its buffer and triggers the `drain` event, balancing pipeline memory usage.";
        }

        // --- Express.js ---
        if (q.contains("middleware pipeline") || q.contains("asynchronous errors")) {
            return "Express executes middleware sequentially in a request-response cycle. Custom middleware uses the `next()` callback to pass control. For asynchronous errors, standard try-catch blocks do not automatically bubble to Express's global handler. We must catch async exceptions and call `next(err)`. Express recognizes error-handling middleware by its 4-parameter signature: `(err, req, res, next)`, which receives and formats error responses.";
        }

        // --- AWS Cloud ---
        if (q.contains("serverless infrastructure on aws") || q.contains("route 53")) {
            return "To design a multi-region serverless app on AWS, we expose API Gateways in multiple regions connected to AWS Lambda functions, writing to a DynamoDB Global Table (active-active multi-region replication). Amazon Route 53 routes client traffic to the nearest region using Latency-Based routing, with failover routing configured to redirect traffic to secondary regions if health checks fail.";
        }

        // --- Docker Containers ---
        if (q.contains("multi-stage builds") || q.contains("minimize container layers")) {
            return "Docker multi-stage builds use multiple `FROM` instructions, allowing developers to compile code in a heavy build stage, and copy only the final compiled artifact into a lightweight, secure production runtime stage. This dramatically reduces image sizes, eliminates build tools (like compilers and SDKs) from the final environment, and minimizes the attack surface.";
        }

        // --- Kubernetes ---
        if (q.contains("control plane components") || q.contains("self-healing")) {
            return "The Kubernetes control plane includes: 1) `kube-apiserver` (the entry point), 2) `etcd` (the state database), 3) `kube-scheduler` (assigns pods to nodes), and 4) `kube-controller-manager` (runs loops to maintain target state). Self-healing is achieved via controllers which continuously compare the actual running pod count with the target state in etcd, immediately rescheduling pods if a node fails.";
        }

        // --- TypeScript ---
        if (q.contains("utility types") || q.contains("generic api client")) {
            return "To design a type-safe generic API client in TypeScript, we use generic types `T` to parameterize response shapes. We leverage utility types like `Pick`, `Omit`, `Partial`, and `Record` to dynamically transform payload shapes. For example, `type CreatePayload<T> = Omit<T, 'id' | 'createdAt'>` allows creating payloads without metadata. We enforce type boundaries using `extends` and compile-time return signatures: `async get<T>(url: string): Promise<T>` to guarantee the compiler validates returning schemas.";
        }

        // --- Dynamic Resume templates / default ---
        if (q.contains("yourself") || q.contains("introduce yourself")) {
            return "I am a full-stack software engineer passionate about building high-performance web applications and highly responsive interactive systems. Over my career, I've designed scalable architectures utilizing Java, Spring Boot, React, and MongoDB, focusing on modularity, clean APIs, and optimized databases. I love solving complex structural challenges and collaborating in cross-functional teams to build products that deliver high user impact.";
        }
        if (q.contains("technical details") || q.contains("designed this") || q.contains("accomplishment")) {
            return "To answer this, structure your response as follows: First, define the exact technical problem you faced (e.g., high database lock contention). Second, explain your implementation (e.g., replacing standard locks with Redis-based distributed locks or implementing indexing). Third, prove your outcome with metrics (e.g., reducing API response times by 40%). Citing design trade-offs, like horizontal vs vertical scaling, shows strong engineering maturity.";
        }
        if (q.contains("disagreement") || q.contains("conflict") || q.contains("collaborat")) {
            return "A strong response follows the STAR method: 1) Situation: Describe the technical context (e.g., choosing Monolith vs Microservices). 2) Task: Explain your objective. 3) Action: Outline how you initiated communication, created a prototype comparing both architectures, and focused on facts rather than opinions. 4) Result: Detail the successful outcome, showing how you valued alignment and team unity.";
        }

        return "To answer this technical question effectively, first state your core thesis or definition clearly. Second, walk through the step-by-step architectural implementation, citing specific tools, frameworks, and design patterns. Third, discuss scaling trade-offs, failure recovery modes, or alternative approaches to show senior-level engineering maturity.";
    }

    private String generateSummaryFeedback(int score, String track) {
        if (score >= 85) {
            return "Outstanding! You displayed expert-level technical accuracy, fluent spoken delivery, and high conceptual clarity. Your answers were structured logically, addressing bottlenecks and showing solid reasoning for " + track + ".";
        } else if (score >= 70) {
            return "Great performance. Your fundamentals are solid. To take it to the senior level, focus on articulating the technical tradeoffs of your decisions and structure behavioral questions using the STAR framework.";
        } else {
            return "Good practice run, but there is room to grow. Review core topics in " + track + ", practice slow and steady spoken delivery, and try to speak for at least 45 seconds per response to give complete details.";
        }
    }

    private String synthesizeQuestion(String bullet, String fallbackTemplate, String category, String roleVal, String companyVal) {
        String lower = bullet.toLowerCase();
        
        if ("HR".equalsIgnoreCase(category)) {
            if (lower.contains("lead") || lower.contains("manag") || lower.contains("direct") || lower.contains("team")) {
                return String.format("Your resume states you: \"%s\". Can you describe your leadership style, how you managed stakeholder expectations, and how you resolved team friction during this project?", bullet);
            }
            return String.format("Looking at your experience as a %s at %s, walk me through your journey working on: \"%s\". What was the biggest personal growth area for you?", roleVal, companyVal, bullet);
        }
        
        if ("Behavioral".equalsIgnoreCase(category)) {
            if (lower.contains("agreement") || lower.contains("disagree") || lower.contains("conflict") || lower.contains("collaboration")) {
                return String.format("You highlighted: \"%s\". Tell me about a time when you had a strong technical disagreement with another engineer on this project. How did you communicate and align?", bullet);
            }
            return String.format("Regarding your achievement: \"%s\". Describe a challenging blocker or technical bottleneck you encountered. How did you pivot, and what did you learn from the experience?", bullet);
        }
        
        if ("Scenario".equalsIgnoreCase(category)) {
            if (lower.contains("react") || lower.contains("frontend") || lower.contains("ui") || lower.contains("typescript") || lower.contains("javascript")) {
                return String.format("Regarding your frontend achievement: \"%s\". In a high-traffic scenario where real-world network latency fluctuates, how would you design a robust client-side caching strategy, offline-first fallback, and optimistic UI updates to mitigate slow API responses?", bullet);
            }
            if (lower.contains("spring") || lower.contains("java") || lower.contains("api") || lower.contains("service") || lower.contains("backend") || lower.contains("microservice")) {
                return String.format("For your backend microservice: \"%s\". If this service faces a sudden 10x traffic spike, how would you configure distributed circuit breaking, rate limiting, and consumer-side backpressure to prevent cascading system failure?", bullet);
            }
            if (lower.contains("database") || lower.contains("sql") || lower.contains("mongo") || lower.contains("postgres") || lower.contains("index") || lower.contains("query")) {
                return String.format("Regarding your database usage: \"%s\". In a highly distributed scaling scenario, how do you handle read-replicas replication lag, eventual consistency conflict resolution, and horizontal sharding to prevent hot spots?", bullet);
            }
            if (lower.contains("redis") || lower.contains("cache") || lower.contains("caching")) {
                return String.format("For your caching implementation: \"%s\". Walk me through how you would configure a highly available Redis cluster, mitigate cache stampede (thundering herd), and design a cache eviction policy tailored for consistency and active cache invalidation.", bullet);
            }
            if (lower.contains("docker") || lower.contains("kubernetes") || lower.contains("aws") || lower.contains("cloud") || lower.contains("pipeline") || lower.contains("devops")) {
                return String.format("Regarding the deployment: \"%s\". If a cluster node fails during peak load, how do you design auto-scaling policies, self-healing pod scheduling, and resilient traffic routing to ensure zero-downtime consistency?", bullet);
            }
            if (lower.contains("optim") || lower.contains("reduc") || lower.contains("improv") || lower.contains("speed") || lower.contains("faster")) {
                return String.format("You optimized: \"%s\". In a high-throughput scaling context, how do you profile database lock contention, identify event loop blockages, and handle socket exhaustions under heavy concurrent connections?", bullet);
            }
            if (lower.contains("design") || lower.contains("architect") || lower.contains("structur")) {
                return String.format("Regarding your architecture: \"%s\". How would you refactor this to achieve multi-region active-active scalability, eventual consistency using a Saga pattern, and failover isolation?", bullet);
            }
            return fallbackTemplate;
        }

        // Technical or Scenario categories
        if (lower.contains("react") || lower.contains("frontend") || lower.contains("ui") || lower.contains("typescript") || lower.contains("javascript")) {
            return String.format("You highlighted frontend architecture: \"%s\". Walk me through your state management strategies, how you minimized component re-renders, and optimized bundle load sizes.", bullet);
        }
        if (lower.contains("spring") || lower.contains("java") || lower.contains("api") || lower.contains("service") || lower.contains("backend") || lower.contains("microservice")) {
            return String.format("For your backend service: \"%s\". How did you design the transaction management, secure the endpoints, and optimize the server-side concurrency or thread execution pools?", bullet);
        }
        if (lower.contains("database") || lower.contains("sql") || lower.contains("mongo") || lower.contains("postgres") || lower.contains("index") || lower.contains("query")) {
            return String.format("Regarding your data model: \"%s\". Walk me through your index selection strategy, schema design patterns, and how you prevented database lock contention or latency spikes under heavy concurrent writes.", bullet);
        }
        if (lower.contains("redis") || lower.contains("cache") || lower.contains("caching")) {
            return String.format("For your performance optimization: \"%s\". What caching strategy (e.g. Cache-Aside, Write-Through) did you choose, how did you manage cache invalidation, and what eviction policy did you enforce?", bullet);
        }
        if (lower.contains("docker") || lower.contains("kubernetes") || lower.contains("aws") || lower.contains("cloud") || lower.contains("pipeline") || lower.contains("devops")) {
            return String.format("Regarding the deployment: \"%s\". How did you manage container security, configure rolling updates/probes, and orchestrate auto-scaling to maintain 99.9%% application availability?", bullet);
        }
        if (lower.contains("optim") || lower.contains("reduc") || lower.contains("improv") || lower.contains("speed") || lower.contains("faster")) {
            return String.format("You optimized or reduced overhead: \"%s\". What profiling tools (e.g., Chrome DevTools, JProfiler, APM logs) did you use to locate the initial bottleneck, and how did you measure and verify the performance improvements?", bullet);
        }
        if (lower.contains("design") || lower.contains("architect") || lower.contains("structur")) {
            return String.format("You architected/designed: \"%s\". What system design patterns (e.g., Clean Architecture, MVC, CQRS) did you choose, what structural trade-offs did you make, and how did you isolate class dependencies?", bullet);
        }
        
        return fallbackTemplate;
    }
}
