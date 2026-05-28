import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, SkipForward, Power, Play, RefreshCw, MessageSquare, Video, VideoOff, Sparkles } from 'lucide-react';

export default function InterviewChamber({ parsedData, configData, onSessionComplete, onQuit }) {
  const [session, setSession] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [chamberState, setChamberState] = useState('PREPARING'); // PREPARING -> SPEAKING -> LISTENING -> THINKING
  const [transcript, setTranscript] = useState('');
  const [speechActive, setSpeechActive] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(90);
  const [hasStartedSpeech, setHasStartedSpeech] = useState(false);

  // References for Speech and Audio
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Camera States and Refs
  const [videoActive, setVideoActive] = useState(false);
  const videoRef = useRef(null);
  const videoStreamRef = useRef(null);
  const [cameraWarning, setCameraWarning] = useState(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 400, height: 300, facingMode: "user" }, 
        audio: false 
      });
      videoStreamRef.current = stream;
      setVideoActive(true);
    } catch (err) {
      console.warn("Webcam access blocked or hardware busy: ", err);
      alert("Could not access camera. Please check browser media permissions.");
    }
  };

  const stopCamera = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(track => track.stop());
      videoStreamRef.current = null;
    }
    setVideoActive(false);
  };

  // Symmetrical callback ref to bulletproof video element mounting in React
  const setVideoRef = (el) => {
    videoRef.current = el;
    if (el && videoStreamRef.current) {
      try {
        if (el.srcObject !== videoStreamRef.current) {
          el.srcObject = videoStreamRef.current;
          el.play().catch(e => console.warn("Callback video play failed:", e));
        }
      } catch (err) {
        console.warn("Callback error assigning stream:", err);
      }
    }
  };

  // Sync camera feed once element is fully layed out and visible in the DOM
  useEffect(() => {
    if (videoActive && videoRef.current && videoStreamRef.current) {
      try {
        if (videoRef.current.srcObject !== videoStreamRef.current) {
          videoRef.current.srcObject = videoStreamRef.current;
          videoRef.current.play().catch(e => console.warn("Video play failed:", e));
        }
      } catch (err) {
        console.warn("Error assigning stream to video element:", err);
      }
    }
  }, [videoActive]);

  // Telemetry AI checker: high-speed 300ms real-time canvas pixel analyzer for instant occlusion/blockage warnings
  useEffect(() => {
    let interval;
    if (videoActive) {
      // Create offscreen canvas once
      const canvas = document.createElement('canvas');
      canvas.width = 80; // small dimensions for instant processing and zero CPU overhead
      canvas.height = 60;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      interval = setInterval(() => {
        // 1. Real Hardware Check: If tracks are muted, disabled, or ended, warn instantly!
        if (videoStreamRef.current) {
          const tracks = videoStreamRef.current.getVideoTracks();
          if (tracks.length === 0 || !tracks[0].enabled || tracks[0].readyState === 'ended' || tracks[0].muted) {
            setCameraWarning("CAMERA FEED INTERRUPTED OR MUTED");
            return;
          }
        }

        // 2. Real Pixel Analysis for instant physical occlusion / covered lens / blocked feed / face detection
        if (videoRef.current && videoRef.current.readyState >= 2) {
          try {
            // Draw current frame to offscreen canvas
            ctx.drawImage(videoRef.current, 0, 0, 80, 60);
            const imgData = ctx.getImageData(0, 0, 80, 60);
            const data = imgData.data;

            let totalBrightness = 0;
            let skinPixels = 0;
            const pixelCount = 80 * 60;
            const lumaValues = new Uint8Array(pixelCount);
            
            // 4x4 grid counts for spatial distribution analysis to distinguish a localized face from a flat backdrop
            const blockCounts = new Array(16).fill(0);
            const skinLumas = [];

            // Calculate Luma and skin tones for each pixel
            for (let y = 0; y < 60; y++) {
              for (let x = 0; x < 80; x++) {
                const idx = (y * 80 + x) * 4;
                const r = data[idx];
                const g = data[idx+1];
                const b = data[idx+2];
                
                // Standard Luma formula
                const luma = 0.299 * r + 0.587 * g + 0.114 * b;
                totalBrightness += luma;
                lumaValues[y * 80 + x] = luma;

                // Skin Color Segmentation Rule (supports all human skin tones and ambient camera white balances)
                if (r > 50 && g > 35 && b > 20 && r > g && (r - g) > 6 && Math.abs(r - b) > 6) {
                  skinPixels++;
                  skinLumas.push(luma);
                  
                  // Map to 4x4 grid (columns 0-3, rows 0-3)
                  const col = Math.min(3, Math.floor(x / 20));
                  const row = Math.min(3, Math.floor(y / 15));
                  const blockIdx = row * 4 + col;
                  blockCounts[blockIdx]++;
                }
              }
            }

            const avgBrightness = totalBrightness / pixelCount;
            const skinPercent = (skinPixels / pixelCount) * 100;

            // Calculate standard deviation of whole frame (overall contrast check)
            let sumSqDiff = 0;
            for (let i = 0; i < pixelCount; i++) {
              const diff = lumaValues[i] - avgBrightness;
              sumSqDiff += diff * diff;
            }
            const stdDev = Math.sqrt(sumSqDiff / pixelCount);

            // Calculate standard deviation of skin pixels specifically (homogeneity check)
            let skinStdDev = 0;
            if (skinLumas.length > 0) {
              let skinLumaSum = 0;
              for (let i = 0; i < skinLumas.length; i++) skinLumaSum += skinLumas[i];
              const avgSkinLuma = skinLumaSum / skinLumas.length;
              let skinSumSqDiff = 0;
              for (let i = 0; i < skinLumas.length; i++) {
                const diff = skinLumas[i] - avgSkinLuma;
                skinSumSqDiff += diff * diff;
              }
              skinStdDev = Math.sqrt(skinSumSqDiff / skinLumas.length);
            }

            // Calculate spatial distribution block-level standard deviation (clustering check)
            const avgBlockCount = skinPixels / 16;
            let blockVariance = 0;
            for (let b = 0; b < 16; b++) {
              const diff = blockCounts[b] - avgBlockCount;
              blockVariance += diff * diff;
            }
            blockVariance /= 16;
            const blockStdDev = Math.sqrt(blockVariance);
            const relativeBlockStdDev = blockStdDev / (avgBlockCount + 0.001);

            // Calculate micro-contrast/edges specifically in skin-tone pixels
            let skinGradientSum = 0;
            let skinGradientCount = 0;
            for (let y = 1; y < 59; y++) {
              for (let x = 1; x < 79; x++) {
                const idx = (y * 80 + x) * 4;
                const r = data[idx];
                const g = data[idx+1];
                const b = data[idx+2];
                // Check if the current pixel is skin-tone
                if (r > 50 && g > 35 && b > 20 && r > g && (r - g) > 6 && Math.abs(r - b) > 6) {
                  const idxRight = (y * 80 + (x + 1)) * 4;
                  const idxDown = ((y + 1) * 80 + x) * 4;
                  const lumaSelf = 0.299 * r + 0.587 * g + 0.114 * b;
                  
                  const rR = data[idxRight]; const gR = data[idxRight+1]; const bR = data[idxRight+2];
                  const lumaR = 0.299 * rR + 0.587 * gR + 0.114 * bR;
                  
                  const rD = data[idxDown]; const gD = data[idxDown+1]; const bD = data[idxDown+2];
                  const lumaD = 0.299 * rD + 0.587 * gD + 0.114 * bD;
                  
                  skinGradientSum += Math.abs(lumaSelf - lumaR) + Math.abs(lumaSelf - lumaD);
                  skinGradientCount += 2;
                }
              }
            }
            const avgSkinGradient = skinGradientCount > 0 ? (skinGradientSum / skinGradientCount) : 0;

            // Heuristics:
            // A. Camera Lens Covered (homogeneous colors, extremely low overall contrast)
            if (stdDev < 4.5) {
              setCameraWarning("WARNING: CAMERA COVERED OR BLOCKED");
            }
            // B. Camera Blocked / OBSCURED / Low Light (Pitch dark luma values)
            else if (avgBrightness < 8.0) {
              setCameraWarning("WARNING: CAMERA OBSCURED OR PITCH BLACK");
            }
            // C. Face Presence Check (calibrated to prevent false warnings on smooth laptop webcams/varying lighting conditions):
            // 1. Skin percentage is too low (less than 1.5% of frame is skin)
            // 2. Skin percentage is too high and too uniform (indicates flat wall/door covering the camera, e.g. skinPercent > 85% and relativeBlockStdDev is very uniform/low)
            // 3. Average spatial color gradient in skin region is too flat (e.g. wall/door has avgSkinGradient < 0.8, whereas human faces have features creating high micro-gradients)
            // 4. Standard deviation of skin pixels is extremely low (completely uniform color, e.g. skinStdDev < 4.5, whereas face has lighting highlights/shadows)
            else if (
              skinPercent < 1.5 || 
              (skinPercent > 85.0 && relativeBlockStdDev < 0.15) ||
              (skinPercent > 5.0 && avgSkinGradient < 0.8) ||
              (skinPercent > 5.0 && skinStdDev < 4.5)
            ) {
              setCameraWarning("FACE NOT DETECTED IN FRAME");
            }
            // D. All Clear
            else {
              setCameraWarning(null);
            }
          } catch (e) {
            console.warn("Failed to capture video pixel telemetry:", e);
          }
        }
      }, 300); // Check every 300ms for instant real-time reaction!
    } else {
      setCameraWarning(null);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [videoActive]);

  // 1. Fetch Questions / Initialize Session on Mount
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      if ('onvoiceschanged' in window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }

    const initializeChamber = async () => {
      setChamberState('PREPARING');
      
      // Auto-start camera if enabled in config page
      if (configData.startWithCamera) {
        startCamera();
      }

      try {
        const response = await fetch('http://localhost:8080/api/interviews/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            candidateName: parsedData.candidateName,
            skills: parsedData.skills,
            track: configData.track,
            experienceLevel: configData.experienceLevel,
            isCertificate: parsedData.isCertificate || false,
            fullText: parsedData.fullText || "",
            extractedEntities: parsedData.extractedEntities || null,
            mode: configData.mode
          })
        });

        if (response.ok) {
          const sessionData = await response.json();
          setSession(sessionData);
          setChamberState('SPEAKING');
        } else {
          throw new Error("Failed to start session.");
        }
      } catch (err) {
        console.error("Backend offline, running in local-fallback mode: ", err);
        // Fallback simulated questions if backend is not started/running
        const dummyQuestions = getDummyQuestions(
          configData.track, 
          parsedData.skills, 
          parsedData.isCertificate, 
          parsedData.extractedEntities,
          configData.mode
        );
        const fallbackSession = {
          candidateName: parsedData.candidateName,
          candidateSkills: parsedData.skills,
          track: configData.track,
          experienceLevel: configData.experienceLevel,
          isCertificate: parsedData.isCertificate || false,
          qaEvaluations: dummyQuestions
        };
        setSession(fallbackSession);
        setChamberState('SPEAKING');
      }
    };

    initializeChamber();
    setupCanvas();

    return () => {
      cleanupSpeech();
      cleanupAudio();
      if (videoStreamRef.current) {
        try {
          videoStreamRef.current.getTracks().forEach(track => track.stop());
        } catch (e) {}
      }
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Helpers for Mock Fallback Questions
  const getDummyQuestions = (track, skills, isCertificate, extractedEntities, mode) => {
    const skillsList = skills && skills.length > 0 ? skills : ["React.js", "Spring Boot"];
    const name = parsedData.candidateName || "Elite Candidate";
    
    // 30+ Skill Database in Frontend Fallback
    const TECHNICAL_SKILL_QUESTIONS = {
      "React.js": [
        "In React, how do you optimize virtual DOM rendering for deep nested lists, and what are the trade-offs of using useMemo or useCallback?",
        "Explain React's concurrent rendering engine, server-side rendering (SSR), and how hydration differs from client-side rendering."
      ],
      "Spring Boot": [
        "How does Spring Boot configure class loading and auto-configuration under the hood, and how would you resolve a circular dependency issue in bean initialization?",
        "What is your approach to designing fault-tolerant transactions in Spring Boot using @Transactional, propagation levels, and isolation levels?"
      ],
      "MongoDB": [
        "Explain MongoDB's index types (single field, compound, multikey) and how to design schema layouts to avoid the 'unbound array growth' anti-pattern.",
        "How does MongoDB handle replica set elections and horizontal write scaling with sharding under heavy transaction volumes?"
      ],
      "Java SE/EE": [
        "What is the difference between Virtual Threads (introduced in Java 21) and traditional platform threads, and how do they change concurrent programming paradigms?",
        "Explain Java GC tuning, specifically how the G1 and Z Garbage Collectors manage memory latency for large heaps."
      ],
      "Python ML": [
        "Explain the mathematical difference between L1 (Lasso) and L2 (Ridge) regularization, and when you would select one over the other in training.",
        "How do you mitigate gradient vanishing or exploding problems in deep recurrent neural networks, and how do transformers resolve this?"
      ],
      "Node.js": [
        "How does the Node.js event loop orchestrate tasks, microtasks, and thread-pool execution under the hood for asynchronous system resources?",
        "Explain how Node.js streams work and how to leverage backpressure to handle heavy file operations without exhausting system memory."
      ],
      "Express.js": [
        "How does Express middleware pipeline execute request-response cycles, and how do you handle asynchronous errors gracefully in custom middleware?",
        "Explain how to configure secure headers, CORS, and request rate-limiting in an Express.js backend to prevent DDoS and XSS attacks."
      ],
      "SQL Databases": [
        "Explain database normalization (1NF through BCNF), trade-offs of intentional denormalization, and how execution planners optimize complex joins.",
        "How do you achieve distributed transaction consistency (e.g. 2-Phase Commit) vs eventual consistency in relational databases?"
      ],
      "AWS Cloud": [
        "How would you design a multi-region highly available serverless infrastructure on AWS utilizing API Gateway, Lambda, DynamoDB, and Route 53 latency routing?",
        "Explain AWS IAM roles, resource policies, VPC peering, and secure transit gateways for isolating production environments."
      ],
      "Docker Containers": [
        "How do Docker multi-stage builds work, and what practices do you use to minimize container layers and secure image runtimes?",
        "Explain Docker networking modes (bridge, host, overlay) and when to use each for microservices communication."
      ],
      "Kubernetes": [
        "Describe the core control plane components of Kubernetes and how it manages pod orchestration, self-healing, rolling updates, and service discovery.",
        "What are Kubernetes custom resources (CRDs) and operators, and how do they extend the core Kubernetes API?"
      ],
      "TypeScript": [
        "Explain TypeScript utility types, conditional types, mapped types, and how you would design a type-safe generic API client interface.",
        "How do structural typing and declaration merging work in TypeScript, and how do you resolve complex compilation conflicts?"
      ]
    };

    const SCENARIO_SKILL_QUESTIONS = {
      "React.js": [
        "Your React application experiences a sudden frame rate drop (jank) when typing into a complex search input. How do you profile and solve this?",
        "You need to implement a state management strategy for an enterprise dashboard with hundreds of real-time widget updates. How do you structure it?"
      ],
      "Spring Boot": [
        "Your Spring Boot backend experiences a gradual memory leak in production, causing JVM OutOfMemory errors every 48 hours. How do you isolate the leak?",
        "Imagine a Spring Boot microservice needs to consume events from Kafka and update a MongoDB collection. How do you handle transaction consistency?"
      ],
      "MongoDB": [
        "A MongoDB query in your application suddenly starts performing full table scans, causing database CPU to spike to 100%. How do you diagnose and fix it?",
        "You are designing a high-throughput logging system. How do you configure MongoDB write concerns (w: 1, w: majority, journaled) to balance safety and speed?"
      ],
      "Java SE/EE": [
        "You are seeing high context-switching CPU load in a Java multi-threaded server application. How do you analyze thread contention and optimize thread pools?",
        "Your Java program needs to parse a massive 10GB JSON file without throwing OutOfMemoryError. How do you design the parser stream?"
      ],
      "Python ML": [
        "A machine learning model shows 99% accuracy on training data but performs poorly in production. How do you diagnose overfitting and what steps do you take?",
        "You need to deploy a heavy transformer model on an edge device with limited GPU memory. What model compression techniques do you apply?"
      ],
      "Node.js": [
        "Your Node.js process suddenly crashes in production with 'JavaScript heap out of memory'. How do you generate and analyze the heap dump?",
        "You are building a real-time WebSocket server in Node.js. How do you scale it horizontally across multiple server cores or instances?"
      ],
      "Express.js": [
        "An endpoint in your Express backend starts taking over 5 seconds to respond under moderate load. How do you profile the Event Loop blockage?",
        "You are designing a routing system that handles dynamic sub-domains. How do you structure Express router parameters cleanly and safely?"
      ],
      "SQL Databases": [
        "A critical SQL query has slowed down dramatically because of lock contention during heavy writes. How do you tune isolation levels and indexes?",
        "You are migrating a legacy schema to support database sharding. How do you choose the partition key to avoid hotspots?"
      ],
      "AWS Cloud": [
        "Your AWS Lambda functions are experiencing severe 'cold start' latency, affecting customer checkout times. How do you diagnose and resolve this?",
        "You need to securely connect a private VPC backend to a third-party API without exposing your servers to the public internet. What VPC architecture do you use?"
      ],
      "Docker Containers": [
        "A containerized application keeps failing to start because of permission errors on mounted host volumes. How do you resolve this?",
        "Your Docker daemon is consuming 100% disk space due to dangling images and build caches. How do you implement a safe cleanup pipeline?"
      ],
      "Kubernetes": [
        "A critical pod in your Kubernetes cluster is stuck in 'CrashLoopBackOff'. Walk me through your debugging steps using kubectl.",
        "You need to implement zero-downtime rolling deployments for a stateful microservice. How do you configure Readiness/Liveness probes and StatefulSets?"
      ],
      "TypeScript": [
        "You are seeing slow compile times in a large-scale TypeScript project. What tsconfig.json configurations do you adjust to optimize the compiler?",
        "How do you implement runtime validation for external API payloads while preserving compile-time type-safety in TypeScript?"
      ]
    };

    const GENERAL_TECH_QUESTIONS = [
      "What are the fundamental characteristics of RESTful APIs, and how do you design secure, idempotent API endpoints?",
      "Explain the clean architecture pattern, dependency inversion, and how they contribute to system testability and maintainability."
    ];

    const GENERAL_SCENARIO_QUESTIONS = [
      "You are tasked with refactoring a massive legacy monolith into microservices. What strategies do you use to partition data and cut dependencies?",
      "Imagine a feature you deployed breaks a key legacy workflow. Explain your rollback, recovery, and post-mortem protocol."
    ];

    // Find matched keys
    const matchedSkills = [];
    skillsList.forEach(skill => {
      Object.keys(TECHNICAL_SKILL_QUESTIONS).forEach(key => {
        if (skill.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(skill.toLowerCase())) {
          if (!matchedSkills.includes(key)) {
            matchedSkills.push(key);
          }
        }
      });
    });

    if (matchedSkills.length === 0) {
      matchedSkills.push("React.js");
      matchedSkills.push("Spring Boot");
    }

    const primary = matchedSkills[0];
    const secondary = matchedSkills[1] || primary;

    const createQAEval = (question, category) => ({
      question,
      category,
      userTranscript: "",
      score: 0,
      feedback: "Pending response evaluation.",
      suggestedAnswer: ""
    });

    // --- FRONTEND PRACTICE MODE SHORT FALLBACK GENERATOR ---
    if (mode === 'Practice') {
      const entities = extractedEntities || {
        role: "Software Engineer",
        company: "Tech Innovators"
      };
      const roleVal = entities.role || "Software Engineer";
      const companyVal = entities.company || "Tech Innovators";

      // Q1: Self-introduction
      const selfIntroQ = `Welcome, ${name}! Please introduce yourself and walk me through your professional resume, highlighting your key experiences as a ${roleVal} at ${companyVal}.`;
      
      const qas = [
        createQAEval(selfIntroQ, "HR")
      ];

      // Q2-Q7: 6 skills-based basic questions
      for (let i = 0; i < 6; i++) {
        const skill = matchedSkills[i % matchedSkills.length];
        let questionText;
        let categoryText = "Technical";

        if (track === 'HR') {
          categoryText = "Behavioral";
          if (i % 3 === 0) {
            questionText = `Describe a challenging blocker or technical bottleneck you encountered while working with ${skill}. How did you pivot or resolve it?`;
          } else if (i % 3 === 1) {
            questionText = `How did you collaborate with other team members or manage stakeholder expectations when integrating ${skill} in your projects?`;
          } else {
            questionText = `Tell me about a time when you had to learn ${skill} under a tight deadline. What strategies did you use to master it quickly?`;
          }
        } else {
          const questionsForSkill = TECHNICAL_SKILL_QUESTIONS[skill];
          if (questionsForSkill && questionsForSkill.length > 0) {
            const qIdx = Math.floor(i / matchedSkills.length) % questionsForSkill.length;
            questionText = questionsForSkill[qIdx];
          } else {
            if (i % 3 === 0) {
              questionText = `Your resume highlights experience with ${skill}. Can you explain its core concepts, advantages, and when you would choose to use it in an application?`;
            } else if (i % 3 === 1) {
              questionText = `Based on your hands-on experience with ${skill}, what are the most common performance bottlenecks or developer errors you've encountered, and how did you resolve them?`;
            } else {
              questionText = `When designing systems utilizing ${skill}, what best practices, data security configurations, or structural guidelines do you follow to ensure reliability?`;
            }
          }
        }
        qas.push(createQAEval(questionText, categoryText));
      }
      return qas;
    }

    // Extract actual technical bullet sentences from fullText dynamically
    const resumeBullets = [];
    if (parsedData && parsedData.fullText) {
      const rawLines = parsedData.fullText.split(/\r?\n/);
      rawLines.forEach(rLine => {
        let trimmed = rLine.trim().replace(/^[•\-\*■❑✅▪\d\.\s]+/, "").trim();
        if (trimmed.length > 15 && trimmed.length < 350) {
          const lowerTrimmed = trimmed.toLowerCase();
          if (lowerTrimmed.includes("develop") || lowerTrimmed.includes("implement") || 
              lowerTrimmed.includes("build") || lowerTrimmed.includes("optim") || 
              lowerTrimmed.includes("architect") || lowerTrimmed.includes("integrat") ||
              lowerTrimmed.includes("creat") || lowerTrimmed.includes("design") ||
              lowerTrimmed.includes("migrat") || lowerTrimmed.includes("scal") ||
              lowerTrimmed.includes("manag") || lowerTrimmed.includes("lead") ||
              lowerTrimmed.includes("work") || lowerTrimmed.includes("support")) {
            if (!resumeBullets.includes(trimmed)) {
              resumeBullets.push(trimmed);
            }
          }
        }
      });

      // Second pass fallback for generic descriptives
      if (resumeBullets.length < 3) {
        rawLines.forEach(rLine => {
          let trimmed = rLine.trim().replace(/^[•\-\*■❑✅▪\d\.\s]+/, "").trim();
          if (trimmed.length > 15 && trimmed.length < 350) {
            if (!resumeBullets.includes(trimmed) && !trimmed.toLowerCase().includes("skills:") && 
                !trimmed.toLowerCase().includes("languages:") && !trimmed.toLowerCase().includes("education:") &&
                trimmed.split(/\s+/).length > 3) {
              resumeBullets.push(trimmed);
            }
          }
        });
      }

      // Third pass fallback: split fullText by punctuation to harvest clean sentences
      if (resumeBullets.length < 3) {
        const normalizedText = parsedData.fullText.replace(/\r?\n/g, ' ');
        const sentences = normalizedText.split(/(?<=[\.!?])\s+/);
        sentences.forEach(sentence => {
          let trimmed = sentence.trim().replace(/^[•\-\*■❑✅▪\d\.\s]+/, "").trim();
          if (trimmed.length > 25 && trimmed.length < 300) {
            const lowerTrimmed = trimmed.toLowerCase();
            if (!resumeBullets.includes(trimmed) && 
                !lowerTrimmed.includes("skills:") && 
                !lowerTrimmed.includes("languages:") && 
                !lowerTrimmed.includes("education:") &&
                !lowerTrimmed.includes("certified") &&
                trimmed.split(/\s+/).length > 4) {
              resumeBullets.push(trimmed);
            }
          }
        });
      }
    }

    const entities = extractedEntities || {
      role: "Software Engineer",
      company: "Tech Innovators",
      projects: ["Scalable Microservices Gateway", "Distributed Cloud Platform"],
      certName: "",
      certIssuer: ""
    };
    
    const roleVal = entities.role || "Software Engineer";
    const companyVal = entities.company || "Tech Innovators";
    let projectsList = entities.projects && entities.projects.length > 0 
      ? entities.projects 
      : [];

    if (projectsList.length === 0) {
      const primarySkill = skillsList[0] || "Technical";
      const secondarySkill = skillsList[1] || primarySkill;
      projectsList = [
        `${primarySkill} Cloud Platform`,
        `Distributed ${secondarySkill} Gateway`,
        `High-Throughput Analytics Engine`
      ];
    }

    const bullet1 = resumeBullets[0] || `Lead the implementation of ${projectsList[0]} using ${primary}`;
    const bullet2 = resumeBullets[1] || `Optimize performance and data orchestration with ${secondary}`;
    const bullet3 = resumeBullets[2] || `Designed the scalable microservices architecture at ${companyVal}`;
    const bullet4 = resumeBullets[3] || `Refactored distributed data components and resolved concurrency bottlenecks`;
    const bullet5 = resumeBullets[4] || `Orchestrated deployment pipelines and secured enterprise cloud environments`;

    const synthesizeQuestion = (bullet, fallbackTemplate, category) => {
      const lower = bullet.toLowerCase();
      
      if (category === "HR") {
        if (lower.includes("lead") || lower.includes("manag") || lower.includes("direct") || lower.includes("team")) {
          return `Your resume states you: "${bullet}". Can you describe your leadership style, how you managed stakeholder expectations, and how you resolved team friction during this project?`;
        }
        return `Looking at your experience as a ${roleVal} at ${companyVal}, walk me through your journey working on: "${bullet}". What was the biggest personal growth area for you?`;
      }
      
      if (category === "Behavioral") {
        if (lower.includes("agreement") || lower.includes("disagree") || lower.includes("conflict") || lower.includes("collaboration")) {
          return `You highlighted: "${bullet}". Tell me about a time when you had a strong technical disagreement with another engineer on this project. How did you communicate and align?`;
        }
        return `Regarding your achievement: "${bullet}". Describe a challenging blocker or technical bottleneck you encountered. How did you pivot, and what did you learn from the experience?`;
      }
      
      if (category === "Scenario") {
        if (lower.includes("react") || lower.includes("frontend") || lower.includes("ui") || lower.includes("typescript") || lower.includes("javascript")) {
          return `Regarding your frontend achievement: "${bullet}". In a high-traffic scenario where real-world network latency fluctuates, how would you design a robust client-side caching strategy, offline-first fallback, and optimistic UI updates to mitigate slow API responses?`;
        }
        if (lower.includes("spring") || lower.includes("java") || lower.includes("api") || lower.includes("service") || lower.includes("backend") || lower.includes("microservice")) {
          return `For your backend microservice: "${bullet}". If this service faces a sudden 10x traffic spike, how would you configure distributed circuit breaking, rate limiting, and consumer-side backpressure to prevent cascading system failure?`;
        }
        if (lower.includes("database") || lower.includes("sql") || lower.includes("mongo") || lower.includes("postgres") || lower.includes("index") || lower.includes("query")) {
          return `Regarding your database usage: "${bullet}". In a highly distributed scaling scenario, how do you handle read-replicas replication lag, eventual consistency conflict resolution, and horizontal sharding to prevent hot spots?`;
        }
        if (lower.includes("redis") || lower.includes("cache") || lower.includes("caching")) {
          return `For your caching implementation: "${bullet}". Walk me through how you would configure a highly available Redis cluster, mitigate cache stampede (thundering herd), and design a cache eviction policy tailored for consistency and active cache invalidation.`;
        }
        if (lower.includes("docker") || lower.includes("kubernetes") || lower.includes("aws") || lower.includes("cloud") || lower.includes("pipeline") || lower.includes("devops")) {
          return `Regarding the deployment: "${bullet}". If a cluster node fails during peak load, how do you design auto-scaling policies, self-healing pod scheduling, and resilient traffic routing to ensure zero-downtime consistency?`;
        }
        if (lower.includes("optim") || lower.includes("reduc") || lower.includes("improv") || lower.includes("speed") || lower.includes("faster")) {
          return `You optimized: "${bullet}". In a high-throughput scaling context, how do you profile database lock contention, identify event loop blockages, and handle socket exhaustions under heavy concurrent connections?`;
        }
        if (lower.includes("design") || lower.includes("architect") || lower.includes("structur")) {
          return `Regarding your architecture: "${bullet}". How would you refactor this to achieve multi-region active-active scalability, eventual consistency using a Saga pattern, and failover isolation?`;
        }
        return fallbackTemplate;
      }

      // Technical or Scenario categories
      if (lower.includes("react") || lower.includes("frontend") || lower.includes("ui") || lower.includes("typescript") || lower.includes("javascript")) {
        return `You highlighted frontend architecture: "${bullet}". Walk me through your state management strategies, how you minimized component re-renders, and optimized bundle load sizes.`;
      }
      if (lower.includes("spring") || lower.includes("java") || lower.includes("api") || lower.includes("service") || lower.includes("backend") || lower.includes("microservice")) {
        return `For your backend service: "${bullet}". How did you design the transaction management, secure the endpoints, and optimize the server-side concurrency or thread execution pools?`;
      }
      if (lower.includes("database") || lower.includes("sql") || lower.includes("mongo") || lower.includes("postgres") || lower.includes("index") || lower.includes("query")) {
        return `Regarding your data model: "${bullet}". Walk me through your index selection strategy, schema design patterns, and how you prevented database lock contention or latency spikes under heavy concurrent writes.`;
      }
      if (lower.includes("redis") || lower.includes("cache") || lower.includes("caching")) {
        return `For your performance optimization: "${bullet}". What caching strategy (e.g. Cache-Aside, Write-Through) did you choose, how did you manage cache invalidation, and what eviction policy did you enforce?`;
      }
      if (lower.includes("docker") || lower.includes("kubernetes") || lower.includes("aws") || lower.includes("cloud") || lower.includes("pipeline") || lower.includes("devops")) {
        return `Regarding the deployment: "${bullet}". How did you manage container security, configure rolling updates/probes, and orchestrate auto-scaling to maintain 99.9% application availability?`;
      }
      if (lower.includes("optim") || lower.includes("reduc") || lower.includes("improv") || lower.includes("speed") || lower.includes("faster")) {
        return `You optimized or reduced overhead: "${bullet}". What profiling tools (e.g., Chrome DevTools, JProfiler, APM logs) did you use to locate the initial bottleneck, and how did you measure and verify the performance improvements?`;
      }
      if (lower.includes("design") || lower.includes("architect") || lower.includes("structur")) {
        return `You architected/designed: "${bullet}". What system design patterns (e.g., Clean Architecture, MVC, CQRS) did you choose, what structural trade-offs did you make, and how did you isolate class dependencies?`;
      }
      
      return fallbackTemplate;
    };

    if (track === 'HR') {
      return [
        // Q1: Self-introduction matching resume timeline
        createQAEval(`Welcome, ${name}! Please introduce yourself and walk me through your professional resume, highlighting your key experiences as a ${roleVal} at ${companyVal}.`, "HR"),
        
        // Q2-Q6: 5 Dynamic sentence-based HR questions from accomplishments
        createQAEval(synthesizeQuestion(bullet1, `Looking at your resume, you highlighted: "${bullet1}". Can you explain the context of this accomplishment and the results you delivered?`, "HR"), "HR"),
        createQAEval(synthesizeQuestion(bullet2, `For your achievement: "${bullet2}", how did you collaborate with your team to execute this, and what challenges did you overcome?`, "HR"), "HR"),
        createQAEval(synthesizeQuestion(bullet3, `On your resume, you noted: "${bullet3}". Tell me about the project timeline and how you managed expectations?`, "HR"), "HR"),
        createQAEval(synthesizeQuestion(bullet4, `Regarding your work: "${bullet4}". How did you coordinate with product managers and other engineers to deliver this milestone?`, "HR"), "HR"),
        createQAEval(synthesizeQuestion(bullet5, `Your resume mentions that you: "${bullet5}". How did you prioritize your deliverables and resolve any blocking issues?`, "HR"), "HR"),
        
        // Q7-Q11: 5 Collaboration & Conflict STAR behavioral questions
        createQAEval(`Describe a time when project requirements changed rapidly midway through a release cycle at ${companyVal}. How did you adapt your architecture and manage expectations?`, "Behavioral"),
        createQAEval(`Tell me about a time when you had a technical disagreement with a team member regarding the layout or architectural decisions of "${projectsList[0]}". How did you resolve the conflict?`, "Behavioral"),
        createQAEval(`Can you share an experience where you had to collaborate closely with a non-technical stakeholder or department to ship a features dashboard? How did you communicate technical complexity?`, "Behavioral"),
        createQAEval(`Describe a situation where a colleague was not meeting their deliverables on "${projectsList[0]}", impacting your sprint pipeline. How did you address the issue?`, "Behavioral"),
        createQAEval(`Walk me through a major technical mistake or bug you introduced in production at ${companyVal}. How did you handle the rollback, communicate details, and prevent recurrence?`, "Behavioral"),

        // Q12-Q15: 4 Career growth & ATS resume optimization questions
        createQAEval(`Where do you see your technical expertise growing in the next three years? What adjacent technologies beyond ${primary} do you hope to master next?`, "HR"),
        createQAEval(`How do you manage sprint deadlines and high-pressure deliverables when you encounter unexpected technical blockers in projects like "${projectsList[0]}"?`, "Behavioral"),
        createQAEval(`To optimize your resume for applicant tracking systems (ATS), what complementary technology (like cloud platforms, containerization, or message brokers) would you add next, and how would you quantify your project impact on "${projectsList[0]}" using the STAR method?`, "Resume Optimization"),
        createQAEval(`Why are you currently looking for a new role? How does our company's mission align with your professional goals as a ${roleVal}?`, "HR")
      ];
    } else if (track === 'Scenario' || track === 'System Design' || track === 'Architecture') {
      return [
        // 5 Dynamic sentence-based distributed scaling scenario questions
        createQAEval(`Scenario: Your system experiences a sudden 10x traffic spike, causing connection pools to saturate. Based on your resume experience where you: "${bullet1}", how would you design circuit breakers, database read replicas, and scale your instances to handle this load?`, "Scenario"),
        createQAEval(`Scenario: A critical third-party API that your system relies on starts timing out, causing thread exhaustion in your backend. Reflecting on your achievement: "${bullet2}", how would you implement a retry-backoff queue, asynchronous event execution, or fallback mechanisms to insulate your system?`, "Scenario"),
        createQAEval(`Scenario: You are migrating legacy monolithic data to a distributed database, but you must prevent data inconsistency and support zero-downtime dual-writes. Looking at your work: "${bullet3}", how do you design a robust transaction synchronization and validation pipeline?`, "Scenario"),
        createQAEval(`Scenario: A sudden network partition isolates one of your database nodes, causing active synchronization failures. Based on your initiative: "${bullet4}", how do you configure eviction policies, partition recovery, and eventual consistency to ensure system reliability?`, "Scenario"),
        createQAEval(`Scenario: Your production environment suffers a major cloud node failure during peak usage, triggering a cascade shutdown. Based on your achievement: "${bullet5}", how would you design self-healing pod scheduling, resilient traffic gateways, and disaster recovery replication?`, "Scenario"),

        // 5 System failure modes scenarios
        createQAEval(`Scenario: Your system experiences a sudden cascade failure where active connections spike, exhausting system threads. Based on your project "${projectsList[0]}", how do you isolate the bottleneck and implement a circuit breaker at ${companyVal}?`, "Scenario"),
        createQAEval(`Scenario: Imagine the system that you built for "${projectsList[0]}" experiences a sudden 10x traffic spike, causing query timeouts and thread exhaustion. Walk me through your diagnostics and scaling roadmap based on your database design.`, "Scenario"),
        createQAEval(`Scenario: Your backend service experiences a gradual memory leak in production, causing JVM OutOfMemory errors every 48 hours. Based on your codebase architecture for "${projectsList[0]}", how do you isolate the leak and optimize garbage collection?`, "Scenario"),
        createQAEval(`Scenario: A database query starts performing full table scans, causing CPU to spike to 100%. Utilizing your listed skills in ${primary}, how do you diagnose query planners and apply index strategies to optimize response times?`, "Scenario"),
        createQAEval(`Scenario: You are seeing high context-switching CPU load in a multi-threaded server application. Based on your concurrency skills, how do you analyze thread contention, locks, and optimize thread pool execution configurations for "${projectsList[0]}"?`, "Scenario"),

        // 5 Complex enterprise architectural designs
        createQAEval(`Scenario: You are designing a multi-region highly available serverless infrastructure for "${projectsList[0]}". How would you utilize API Gateway, Lambda, DynamoDB, and global Route 53 latency routing to achieve zero downtime?`, "Scenario"),
        createQAEval(`Scenario: Explain how to configure secure headers, CORS, and rate-limiting gateways in an enterprise backend to prevent DDoS and XSS attacks on your project "${projectsList[0]}".`, "Scenario"),
        createQAEval(`Scenario: You need to achieve distributed transaction consistency (e.g. 2-Phase Commit or Saga Pattern) vs eventual consistency in microservices relational systems. Based on your experience with ${primary}, how do you design this?`, "Scenario"),
        createQAEval(`Scenario: You need to securely connect a private VPC backend to a third-party API without exposing your servers to the public internet. Based on your cloud skills, what VPC architecture would you design for "${projectsList[0]}"?`, "Scenario"),
        createQAEval(`Scenario: Looking at your resume, what is one major architectural limitation or structural trade-off you accepted in your design of "${projectsList[0]}", and how would you optimize it in your next iteration to handle 10x traffic?`, "Resume Optimization")
      ];
    } else { // Technical / General Engineering tracks
      return [
        // 5 Dynamic sentence-based technical questions
        createQAEval(synthesizeQuestion(bullet1, `Looking at your experience as a ${roleVal} at ${companyVal}, you highlighted that you: "${bullet1}". Walk me through the exact technical details of how you designed this, what architectural trade-offs you made, and how you handled concurrency or memory overhead.`, "Technical"), "Technical"),
        createQAEval(synthesizeQuestion(bullet2, `Another achievement on your resume is: "${bullet2}". As a ${roleVal}, how did you integrate these technologies, secure token propagation, and verify data consistency under heavy transaction volumes?`, "Technical"), "Technical"),
        createQAEval(synthesizeQuestion(bullet3, `Regarding your initiative: "${bullet3}". What specific data structures or algorithmic patterns did you implement to optimize efficiency and minimize memory overhead?`, "Technical"), "Technical"),
        createQAEval(synthesizeQuestion(bullet4, `For your work: "${bullet4}". How did you configure unit and integration tests, mock asynchronous dependencies, and verify transaction boundaries?`, "Technical"), "Technical"),
        createQAEval(synthesizeQuestion(bullet5, `Your resume states you: "${bullet5}". Walk me through the encryption algorithms, token storage schemes, and key rotations you enforced for security.`, "Technical"), "Technical"),

        // 10 Core technical concept questions directly mapping to the candidate's actual resume skills!
        ...Array.from({ length: 10 }).map((_, i) => {
          const skill = matchedSkills[i % matchedSkills.length];
          const questionsForSkill = TECHNICAL_SKILL_QUESTIONS[skill];
          let questionText;
          if (questionsForSkill && questionsForSkill.length > 0) {
            const qIdx = Math.floor(i / matchedSkills.length) % questionsForSkill.length;
            questionText = questionsForSkill[qIdx];
          } else {
            // Dynamic generation if skill not in static map
            if (i % 3 === 0) {
              questionText = `You listed ${skill} in your resume. Explain its core architecture, execution model under the hood, and how it manages system resource allocation under high loads.`;
            } else if (i % 3 === 1) {
              questionText = `Based on your experience with ${skill}, what are some of the most common performance bottlenecks or memory issues you've encountered, and how did you debug and optimize them?`;
            } else {
              questionText = `When deploying systems utilizing ${skill}, what security best practices, data protection schemes, or structural guidelines do you enforce to ensure robust enterprise compliance?`;
            }
          }
          return createQAEval(questionText, "Technical");
        })
      ];
    }
  };

  // 2. State Machine Effect: Speaks current question, then starts listening
  useEffect(() => {
    if (!session) return;
    
    if (chamberState === 'SPEAKING') {
      if (currentRound > 0) {
        speakQuestion();
      }
    } else if (chamberState === 'LISTENING') {
      startListening();
    } else if (chamberState === 'THINKING') {
      processRoundTransition();
    }
  }, [chamberState, currentRound, session]);

  // Timer Effect
  useEffect(() => {
    if (chamberState === 'LISTENING') {
      setSecondsRemaining(90);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      
      timerIntervalRef.current = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            handleNextRound(); // Auto-next when timer runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  }, [chamberState]);

  // 3. Speech Synthesis: Speak the Question
  const speakQuestion = () => {
    cleanupSpeech();
    setSpeechActive(true);

    const question = session.qaEvaluations[currentRound].question;
    const utterance = new SpeechSynthesisUtterance(question);
    
    // Choose a premium sounding voice if available
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Natural"));

    // Load Vocal Preferences from LocalStorage if configured
    const savedConfig = localStorage.getItem('hemz_tts_pref');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        if (parsed.volume !== undefined) utterance.volume = parsed.volume;
        if (parsed.speed !== undefined) utterance.rate = parsed.speed;
        if (parsed.pitch !== undefined) utterance.pitch = parsed.pitch;
        if (parsed.gender !== undefined) {
          const genderVoice = voices.find(v => 
            parsed.gender === 'female' 
              ? v.name.includes("Google US English") || v.name.includes("Zira") 
              : v.name.includes("David") || v.name.includes("Male")
          );
          if (genderVoice) {
            utterance.voice = genderVoice;
          } else if (premiumVoice) {
            utterance.voice = premiumVoice;
          }
        } else if (premiumVoice) {
          utterance.voice = premiumVoice;
        }
      } catch (e) {
        if (premiumVoice) utterance.voice = premiumVoice;
        utterance.rate = 1.0;
        utterance.pitch = 1.05;
      }
    } else {
      if (premiumVoice) utterance.voice = premiumVoice;
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
    }

    utterance.onend = () => {
      setSpeechActive(false);
      // Give a tiny buffer, then switch to listening state
      setTimeout(() => {
        setChamberState('LISTENING');
      }, 400);
    };

    utterance.onerror = (e) => {
      console.error("Speech Synthesis Error: ", e);
      setSpeechActive(false);
      setChamberState('LISTENING');
    };

    window.speechSynthesis.speak(utterance);
  };

  // 4. Speech Recognition: Capture Candidate Answer
  const startListening = () => {
    cleanupSpeech();
    setTranscript('');
    setMicActive(true);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("SpeechRecognition API not supported in this browser.");
      setTranscript("[Browser lacks speech recognition support. Speak aloud anyway; we will mock transcribe for you.]");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (e) => {
      let currentResult = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        currentResult += e.results[i][0].transcript;
      }
      setTranscript(currentResult);
    };

    recognition.onerror = (e) => {
      console.error("Recognition Error: ", e);
    };

    recognition.onend = () => {
      setMicActive(false);
    };

    try {
      recognition.start();
      setupMicrophoneAccess();
    } catch (e) {
      console.error(e);
    }
  };

  // 5. Connect Microphones to paint Visual waves
  const setupMicrophoneAccess = async () => {
    try {
      if (streamRef.current) return; // Already setup

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 256;

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
    } catch (err) {
      console.warn("Microphone hardware access denied or unavailable. Falling back to smooth canvas cycles.", err);
    }
  };

  // 6. Mathematical Soundwave Painter
  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Scale canvas resolution
    canvas.width = canvas.parentElement.clientWidth * window.devicePixelRatio;
    canvas.height = 180 * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    let phase = 0;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      ctx.clearRect(0, 0, width, height);

      // Determine visual parameters based on interview chamber states
      let amplitude = 0;
      let frequency = 0.015;
      let speed = 0.08;
      let strokeColor = 'rgba(0, 242, 254, 0.7)'; // Cyan default
      let shadowColor = 'rgba(0, 242, 254, 0.4)';

      if (chamberState === 'SPEAKING') {
        amplitude = 25;
        speed = 0.12;
        frequency = 0.02;
        strokeColor = 'rgba(255, 0, 127, 0.85)'; // Neon Pink for AI
        shadowColor = 'rgba(255, 0, 127, 0.5)';
      } else if (chamberState === 'LISTENING') {
        // Read from mic analyser if available, otherwise idle breathe
        if (analyserRef.current && dataArrayRef.current) {
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          let sum = 0;
          for (let i = 0; i < dataArrayRef.current.length; i++) {
            sum += dataArrayRef.current[i];
          }
          const avg = sum / dataArrayRef.current.length;
          amplitude = Math.max(5, avg * 0.8); // Responsive amplitude
          speed = 0.05 + (avg * 0.002);
          frequency = 0.01 + (avg * 0.0001);
        } else {
          amplitude = transcript.length > 0 ? 15 : 6; // Low breathe if silent
          speed = transcript.length > 0 ? 0.08 : 0.03;
        }
        strokeColor = 'rgba(0, 242, 254, 0.85)'; // Neon Cyan for candidate
        shadowColor = 'rgba(0, 242, 254, 0.5)';
      } else if (chamberState === 'THINKING') {
        amplitude = 12;
        speed = 0.18;
        frequency = 0.03;
        strokeColor = 'rgba(127, 0, 255, 0.85)'; // Purple thinking cycles
        shadowColor = 'rgba(127, 0, 255, 0.5)';
      }

      phase += speed;

      // Draw multi-layered glowing curves
      ctx.shadowBlur = 12;
      ctx.shadowColor = shadowColor;

      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        ctx.lineWidth = layer === 0 ? 3.5 : layer === 1 ? 2 : 1;
        ctx.strokeStyle = layer === 0 ? strokeColor : layer === 1 ? strokeColor.replace('0.85', '0.4').replace('0.7', '0.3') : strokeColor.replace('0.85', '0.15');

        for (let x = 0; x < width; x++) {
          // Beautiful fading envelope towards the edges so the wave pinches out
          const envelope = Math.sin((x / width) * Math.PI);
          const y = height / 2 + Math.sin(x * frequency + phase + (layer * 45)) * amplitude * envelope;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      ctx.shadowBlur = 0; // Reset
    };

    draw();
  };

  // 7. Cleanup routines to release hardware & synthesize engines safely
  const cleanupSpeech = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch (e) {}
    }
  };

  const cleanupAudio = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    dataArrayRef.current = null;
  };

  // 8. Session State management for transitioning between rounds
  const handleNextRound = () => {
    cleanupSpeech();
    cleanupAudio();
    
    // Save response transcript in our session state
    const updatedEvaluations = [...session.qaEvaluations];
    
    // If browser lacked STT support or candidate spoke nothing, mock something relevant
    let candidateResponse = transcript.trim();
    if (!candidateResponse) {
      candidateResponse = "[No spoken response captured. User requested to skip or time elapsed.]";
    }
    
    updatedEvaluations[currentRound].userTranscript = candidateResponse;
    setSession(prev => ({
      ...prev,
      qaEvaluations: updatedEvaluations
    }));

    setChamberState('THINKING');
  };

  const processRoundTransition = () => {
    if (currentRound < session.qaEvaluations.length - 1) {
      // Advance to next round
      setTimeout(() => {
        setCurrentRound(prev => prev + 1);
        setChamberState('SPEAKING');
      }, 1000);
    } else {
      // Completed all rounds! Automatically turn off camera immediately
      stopCamera();
      // Post to server for evaluation
      evaluateAndFinish();
    }
  };

  const evaluateAndFinish = async () => {
    try {
      // Post all user transcripts to express backend for evaluations
      const response = await fetch('http://localhost:8080/api/interviews/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session)
      });

      if (response.ok) {
        const finalReport = await response.json();
        onSessionComplete(finalReport);
      } else {
        throw new Error("Evaluation endpoint failed.");
      }
    } catch (e) {
      console.warn("Backend evaluation offline. Calculating details locally: ", e);
      // Fallback local simulation evaluator
      simulateLocalEvaluation();
    }
  };

  const simulateLocalEvaluation = () => {
    const localSession = JSON.parse(JSON.stringify(session));
    let totalScore = 0;
    
    localSession.qaEvaluations.forEach(qa => {
      const resp = qa.userTranscript;
      let score = 0;
      
      if (resp && resp.length > 20 && !resp.includes("No spoken response captured")) {
        score = 55; // Base
        const words = resp.split(/\s+/).length;
        if (words > 50) score += 25;
        else if (words > 25) score += 15;
        
        const lower = resp.toLowerCase();
        if (lower.includes("because") || lower.includes("specifically")) score += 8;
        if (lower.includes("scale") || lower.includes("design") || lower.includes("optimize")) score += 8;
      } else {
        score = 0; // skipped response gets 0%
      }
      
      score = Math.min(score, 96);
      qa.score = score;
      totalScore += score;

      // Local mock feedback
      if (score >= 80) {
        qa.feedback = "Excellent technical precision and structured vocabulary! Your pacing was fluent and logical.";
      } else if (score >= 60) {
        qa.feedback = "Solid answer, but try applying the STAR method (Situation, Task, Action, Result) to supply a clearer architectural context.";
      } else {
        qa.feedback = "Answer is shallow or skipped. Review this technical topic, aiming to speak for at least 45 seconds to cover details.";
      }

      // Local mock suggested answers
      const getMockSuggestedAnswer = (question) => {
        const q = question.toLowerCase();
        
        // --- React.js ---
        if (q.includes("optimize virtual dom") || q.includes("usememo or usecallback")) {
          return "To optimize deep nested list rendering in React, we first identify unnecessary re-renders. We should use `React.memo` on list item components, ensuring they only re-render when their props change. To prevent prop reference changes, we wrap callback functions in `useCallback` and expensive calculations in `useMemo`. For extremely large lists, we should use windowing/virtualization (via `react-window` or `react-virtualized`) to only render visible items in the DOM. Trade-offs include memory overhead from memoization caches and additional code complexity, which should only be introduced after profiling frame rates.";
        }
        if (q.includes("concurrent rendering") || q.includes("hydration")) {
          return "React's Concurrent Mode enables interruptible rendering, allowing high-priority updates (like typing in an input) to pause lower-priority updates (like rendering a heavy list). Server-Side Rendering (SSR) compiles the initial React component tree into raw HTML on the server and sends it to the browser for instant loading. Hydration is the client-side process where React boots up, attaches event handlers to this server-rendered HTML, and syncs the Virtual DOM with the page. Unlike standard client rendering which downloads JS before displaying anything, SSR displays static HTML immediately before hydration completes.";
        }
        if (q.includes("frame rate drop") || q.includes("jank") || q.includes("search input")) {
          return "To profile a React frame rate drop, we use Chrome DevTools or React Profiler to capture a flame chart. For search input jank, the main culprit is synchronously triggering heavy list filtering or rendering on every keystroke. To resolve this, we implement debouncing or throttling (e.g. 150-300ms) on the input handler so filtering only runs after the user stops typing. Additionally, we can wrap the state update in `startTransition` (useTransition) to mark the list update as non-blocking, allowing keystrokes to render instantly.";
        }
        if (q.includes("state management strategy") || q.includes("enterprise dashboard") || q.includes("widget")) {
          return "For an enterprise dashboard with hundreds of real-time widget updates, standard Context API causes global re-renders and degrades performance. Instead, we should use a state manager that supports localized/selective selector subscription, such as Redux Toolkit or Zustand. For extremely high-frequency micro-updates, atomic state libraries like Redux, Jotai or Recoil are ideal. We can also isolate rendering by decoupling state into web sockets and local state hooks inside widgets, preventing any single widget update from triggering a top-level re-render.";
        }

        // --- Spring Boot ---
        if (q.includes("auto-configuration under the hood") || q.includes("circular dependency")) {
          return "Spring Boot auto-configuration works via `@EnableAutoConfiguration` which reads `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`. It uses conditional annotations like `@ConditionalOnClass` or `@ConditionalOnMissingBean` to load beans only if prerequisites are met. Circular dependencies (Bean A depends on B, which depends on A) can be resolved by: 1) Refactoring to decouple dependencies (introducing a middle service/component), 2) Using `@Lazy` on one of the constructor parameters, or 3) Using setter injection instead of constructor injection.";
        }
        if (q.includes("designing fault-tolerant transactions") || q.includes("propagation levels")) {
          return "Spring's `@Transactional` uses AOP proxies to wrap method execution with database transactions. Propagation defines boundary behavior: `REQUIRED` (joins existing or creates new), `REQUIRES_NEW` (suspends active and creates a new transaction), and `NESTED` (creates a savepoint). Isolation levels solve concurrency read anomalies: `READ_COMMITTED` (prevents dirty reads), `REPEATABLE_READ` (prevents non-repeatable reads), and `SERIALIZABLE` (prevents phantom reads via lock contention). Fault tolerance is achieved by specifying `rollbackFor = Exception.class` to rollback on checked exceptions.";
        }
        if (q.includes("memory leak in production") || q.includes("outofmemory")) {
          return "To isolate a production JVM memory leak, we first capture heap dumps using `jmap` or configure `-XX:+HeapDumpOnOutOfMemoryError` in JVM options. We analyze the dump using Eclipse Memory Analyzer (MAT) to locate the leak suspect, which is typically unclosed database connections, static collections growing unbounded, thread local variables not cleaned up, or static cache maps without eviction policies. To fix it, we implement WeakHashMaps for caches, ensure try-with-resources closes all database streams, and clear thread locals in interceptors.";
        }
        if (q.includes("consume events from kafka") || q.includes("transaction consistency")) {
          return "To handle transaction consistency between consuming from Kafka and saving to MongoDB, we must handle dual-write failure modes. First, we enable idempotent consumers in Kafka by storing the message UUID in MongoDB's unique index to prevent duplicate processing. Second, we wrap MongoDB operations in a native Spring `@Transactional` block (using `MongoTransactionManager`). If MongoDB fails, Kafka offsets are NOT committed, prompting a retry. If Kafka fails to commit after successful DB write, the database transaction rolls back, or the unique index prevents duplicate processing upon retry.";
        }

        // --- MongoDB ---
        if (q.includes("index types") || q.includes("unbound array growth")) {
          return "MongoDB supports Single Field, Compound (ordered index on multiple fields), and Multikey (indexing arrays). Compound indexes must follow the Equality-Sort-Range (ESR) rule. The 'unbound array growth' anti-pattern happens when arrays (like comments inside a post document) grow indefinitely, exceeding the 16MB document limit. To avoid this, we transition to the subset pattern or extended reference pattern by storing comments as separate documents in a 'comments' collection, keeping only the 100 most recent comment IDs as an array in the parent post document.";
        }
        if (q.includes("replica set elections") || q.includes("horizontal write scaling")) {
          return "MongoDB replica sets achieve high availability using a Primary-Secondary-Arbiter architecture, electing a new Primary in <12s via Raft-like consensus if the primary fails. Write scaling is achieved via sharding, where a cluster divides dataset chunks across multiple shard nodes. A config server tracks shard metadata, and the `mongos` router directs client queries. Selecting a robust shard key is critical: it must have high cardinality and even write distribution to avoid hot spots.";
        }
        if (q.includes("performing full table scans") || q.includes("collscan")) {
          return "When MongoDB CPU spikes to 100% due to full table scans (`COLLSCAN`), we use `db.currentOp()` or check slow logs to identify the query. We run `explain(\"explainStats\")` on the query to analyze the execution planner. If `stage` is `COLLSCAN` instead of `IXSCAN`, it means there is no suitable index. We resolve this by adding an index matching the equality and filter conditions. If it's a compound index, we order fields following the ESR (Equality, Sort, Range) rule to minimize index key scans.";
        }
        if (q.includes("write concerns") || q.includes("w: majority")) {
          return "MongoDB write concern configures the level of write acknowledgment. `w: 1` acknowledges writes once written to the primary's memory, offering high speed but risk of data loss. `w: majority` acknowledges writes only after replicating to a majority of secondary nodes, preventing dirty reads and rolled-back writes during primary failure. `j: true` ensures the write is committed to the on-disk journal before returning. For high-throughput logs, we balance speed/safety using asynchronous journaling and `w: 1` or `w: 0`.";
        }

        // --- Java SE/EE ---
        if (q.includes("virtual threads") || q.includes("platform threads")) {
          return "Traditional platform threads map 1-to-1 to OS kernel threads, which are expensive to create, consume ~1MB of stack memory, and have context-switching overhead. Virtual Threads (Java 21 Project Loom) are lightweight, user-mode threads managed by the JVM. Millions of virtual threads can run on a small pool of Carrier platform threads. When a virtual thread performs blocking I/O, the JVM yields its execution and mounts another virtual thread, making concurrent blocking code as scalable as reactive code without thread pool exhaustion.";
        }
        if (q.includes("gc tuning") || q.includes("g1 and z garbage collectors")) {
          return "G1 (Garbage First) GC is designed for multi-gigabyte heaps, dividing memory into equal regions and reclaiming regions with the most garbage first to meet latency goals. ZGC (Z Garbage Collector) is a low-latency, scalable GC that performs almost all garbage collection phases concurrently with application threads, achieving sub-millisecond pause times even on multi-terabyte heaps. Tuning involves adjusting heap sizes (`-Xmx`), pause time targets (`-XX:MaxGCPauseMillis`), and selecting ZGC via `-XX:+UseZGC`.";
        }
        if (q.includes("context-switching cpu load") || q.includes("thread contention")) {
          return "High context-switching CPU load indicates thread contention, where threads spend more time waiting for CPU lock acquisition than doing work. We analyze this using `jstack` or Java Flight Recorder (JFR) to locate blocked states and lock contentions. To optimize, we: 1) Replace synchronized blocks with non-blocking data structures (e.g. `ConcurrentHashMap`, `AtomicInteger`), 2) Shrink synchronization scope, and 3) Configure custom `ThreadPoolExecutor` with size bounded by carrier cores (e.g., `numCores * 2` for CPU-bound tasks) to prevent excessive thread creation.";
        }
        if (q.includes("parse a massive 10gb json")) {
          return "To parse a 10GB JSON file without throwing `OutOfMemoryError`, we must avoid loading the entire document into JVM heap memory (which standard parsers like Jackson's `ObjectMapper.readTree` do). Instead, we use a streaming JSON parser (like Jackson's `JsonParser` or Gson's `JsonReader`). This streaming parser reads the file sequentially as a stream of tokens (keys, values, array starts), allowing us to process one object/entity at a time, garbage collecting processed items immediately and maintaining flat heap memory.";
        }

        // --- Python ML ---
        if (q.includes("lasso") || q.includes("ridge") || q.includes("regularization")) {
          return "L1 regularization (Lasso) adds the absolute sum of weights to the loss function, encouraging sparsity by forcing non-essential weights to exactly zero, which acts as a built-in feature selector. L2 regularization (Ridge) adds the squared sum of weights, penalizing larger weights but never forcing them to zero. Lasso is selected when we suspect many features are irrelevant; Ridge is preferred when all features contribute slightly and we want to prevent multi-collinearity.";
        }
        if (q.includes("gradient vanishing") || q.includes("exploding") || q.includes("transformers")) {
          return "Gradient vanishing occurs in deep networks when backpropagated gradients shrink exponentially, preventing early layers from learning. Exploding occurs when gradients grow exponentially, causing numerical instability. Solutions include using ReLU activation, Batch Normalization, and Residual Connections. Transformers resolve this in sequence modeling by using self-attention mechanisms instead of recurrent steps, allowing direct gradient paths across arbitrary sequence lengths.";
        }

        // --- Node.js ---
        if (q.includes("event loop") || q.includes("asynchronous system resources")) {
          return "The Node.js event loop orchestrates asynchronous tasks in phases: Timers (setTimeout), Pending Callbacks (TCP errors), Idle/Prepare, Poll (incoming connections/I/O), Check (setImmediate), and Close Callbacks. Microtasks (process.nextTick and Promise callbacks) are executed immediately after the current phase completes. Heavy operations should be offloaded to the thread pool (libuv) or Worker Threads to avoid blocking the single-threaded event loop.";
        }
        if (q.includes("node.js streams") || q.includes("backpressure")) {
          return "Node.js streams process data incrementally, avoiding loading entire payloads into memory. Backpressure is the state where the data consumer is slower than the producer. When the readable buffer exceeds `highWaterMark`, `write()` returns `false`, signaling the producer to pause. The producer resumes when the consumer flushes its buffer and triggers the `drain` event, balancing pipeline memory usage.";
        }

        // --- Express.js ---
        if (q.includes("middleware pipeline") || q.includes("asynchronous errors")) {
          return "Express executes middleware sequentially in a request-response cycle. Custom middleware uses the `next()` callback to pass control. For asynchronous errors, standard try-catch blocks do not automatically bubble to Express's global handler. We must catch async exceptions and call `next(err)`. Express recognizes error-handling middleware by its 4-parameter signature: `(err, req, res, next)`, which receives and formats error responses.";
        }

        // --- AWS Cloud ---
        if (q.includes("serverless infrastructure on aws") || q.includes("route 53")) {
          return "To design a multi-region serverless app on AWS, we expose API Gateways in multiple regions connected to AWS Lambda functions, writing to a DynamoDB Global Table (active-active multi-region replication). Amazon Route 53 routes client traffic to the nearest region using Latency-Based routing, with failover routing configured to redirect traffic to secondary regions if health checks fail.";
        }

        // --- Docker Containers ---
        if (q.includes("multi-stage builds") || q.includes("minimize container layers")) {
          return "Docker multi-stage builds use multiple `FROM` instructions, allowing developers to compile code in a heavy build stage, and copy only the final compiled artifact into a lightweight, secure production runtime stage. This dramatically reduces image sizes, eliminates build tools (like compilers and SDKs) from the final environment, and minimizes the attack surface.";
        }

        // --- Kubernetes ---
        if (q.includes("control plane components") || q.includes("self-healing")) {
          return "The Kubernetes control plane includes: 1) `kube-apiserver` (the entry point), 2) `etcd` (the state database), 3) `kube-scheduler` (assigns pods to nodes), and 4) `kube-controller-manager` (runs loops to maintain target state). Self-healing is achieved via controllers which continuously compare the actual running pod count with the target state in etcd, immediately rescheduling pods if a node fails.";
        }

        // --- TypeScript ---
        if (q.includes("utility types") || q.includes("generic api client")) {
          return "To design a type-safe generic API client in TypeScript, we use generic types `T` to parameterize response shapes. We leverage utility types like `Pick`, `Omit`, `Partial`, and `Record` to dynamically transform payload shapes. For example, `type CreatePayload<T> = Omit<T, 'id' | 'createdAt'>` allows creating payloads without metadata. We enforce type boundaries using `extends` and compile-time return signatures: `async get<T>(url: string): Promise<T>` to guarantee the compiler validates returning schemas.";
        }

        // --- Dynamic Resume templates / default ---
        if (q.includes("yourself") || q.includes("introduce yourself")) {
          return "I am a full-stack software engineer passionate about building high-performance web applications and highly responsive interactive systems. Over my career, I've designed scalable architectures utilizing Java, Spring Boot, React, and MongoDB, focusing on modularity, clean APIs, and optimized databases. I love solving complex structural challenges and collaborating in cross-functional teams to build products that deliver high user impact.";
        }
        if (q.includes("technical details") || q.includes("designed this") || q.includes("accomplishment")) {
          return "To answer this, structure your response as follows: First, define the exact technical problem you faced (e.g., high database lock contention). Second, explain your implementation (e.g., replacing standard locks with Redis-based distributed locks or implementing indexing). Third, prove your outcome with metrics (e.g., reducing API response times by 40%). Citing design trade-offs, like horizontal vs vertical scaling, shows strong engineering maturity.";
        }
        if (q.includes("disagreement") || q.includes("conflict") || q.includes("collaborat")) {
          return "A strong response follows the STAR method: 1) Situation: Describe the technical context (e.g., choosing Monolith vs Microservices). 2) Task: Explain your objective. 3) Action: Outline how you initiated communication, created a prototype comparing both architectures, and focused on facts rather than opinions. 4) Result: Detail the successful outcome, showing how you valued alignment and team unity.";
        }

        return "To answer this technical question effectively, first state your core thesis or definition clearly. Second, walk through the step-by-step architectural implementation, citing specific tools, frameworks, and design patterns. Third, discuss scaling trade-offs, failure recovery modes, or alternative approaches to show senior-level engineering maturity.";
      };
      qa.suggestedAnswer = getMockSuggestedAnswer(qa.question);
    });

    const finalScore = Math.round(totalScore / localSession.qaEvaluations.length);
    localSession.overallScore = finalScore;
    
    if (finalScore >= 80) {
      localSession.feedbackSummary = "Excellent performance! You exhibited excellent pacing, vocabulary depth, and conceptual precision. Standout technical authority.";
    } else if (finalScore >= 60) {
      localSession.feedbackSummary = "Solid effort. Fundamentals are sound. To advance to senior tiers, articulate complex tradeoffs and behavioral conflicts with deeper granularity.";
    } else {
      localSession.feedbackSummary = "A productive practice sandbox. Study high-level architectures and practice reading aloud to improve spoken consistency.";
    }

    // Set a mock history session id
    localSession.id = "local_sess_" + Date.now();
    
    // Add to localStorage so it stays in dashboard history! (skip for Practice mode)
    if (configData.mode !== 'Practice') {
      try {
        const history = JSON.parse(localStorage.getItem('aura_history') || '[]');
        history.unshift(localSession);
        localStorage.setItem('aura_history', JSON.stringify(history));
      } catch(e) {}
    }

    setTimeout(() => {
      onSessionComplete(localSession);
    }, 1500);
  };

  // Helper for Chamber Status Messages
  const getStatusMessage = () => {
    switch (chamberState) {
      case 'PREPARING': return 'INITIALIZING DIGITAL CHAMBER ORBITS...';
      case 'SPEAKING': return 'AI INTERVIEWER IS TRANSMITTING...';
      case 'LISTENING': return 'MIC CAPTURE ONLINE. ENGAGE VOCAL FIELD.';
      case 'THINKING': return 'EVALUATING WAVEFORMS & ENCODING AUDIO...';
      default: return 'ONLINE';
    }
  };

  const getStatusColor = () => {
    switch (chamberState) {
      case 'SPEAKING': return 'var(--pink-neon)';
      case 'LISTENING': return 'var(--cyan-neon)';
      case 'THINKING': return 'var(--purple-neon)';
      default: return 'var(--text-secondary)';
    }
  };

  const activeQuestion = session?.qaEvaluations[currentRound]?.question || "...";

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '80vh', display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 1 }}>
      
      {/* 1. Sleek Glassmorphic Category Header Bar with Left Glowing Accent */}
      <div style={{
        width: '100%',
        background: 'rgba(17, 24, 39, 0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderLeft: '4px solid var(--pink-neon)',
        padding: '12px 30px',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.25), 0 0 15px rgba(236, 72, 153, 0.1)',
        marginBottom: '10px'
      }}>
        {/* Category Round Title */}
        <h2 className="text-glow-pink" style={{
          margin: 0,
          fontFamily: 'var(--font-sans)',
          fontSize: '1.25rem',
          fontWeight: '800',
          color: '#fff',
          letterSpacing: '0.5px'
        }}>
          {session?.qaEvaluations[currentRound]?.category || 'General'} Round
        </h2>
        
        {/* Start Again / Exit pills in top right */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => {
              cleanupSpeech();
              cleanupAudio();
              setTranscript('');
              setCurrentRound(0);
              setChamberState('SPEAKING');
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '6px 16px',
              color: 'var(--text-primary)',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            Start Again
          </button>
          <button 
            onClick={onQuit}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '6px 16px',
              color: 'var(--text-primary)',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            Exit
          </button>
        </div>
      </div>

      {chamberState === 'PREPARING' ? (
        <div className="glass-panel dot-grid" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '380px', padding: '40px' }}>
          <RefreshCw size={40} className="float-animation" style={{ color: 'var(--pink-neon)', animation: 'spin 3s linear infinite', marginBottom: '20px' }} />
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--pink-neon)', letterSpacing: '2px' }}>
            CONNECTING INTERCONNECTS...
          </p>
        </div>
      ) : (
        <div style={{ position: 'relative', width: '100%' }}>
          
          {/* Main Card with Left and Right Columns */}
          <div className="glass-panel dot-grid" style={{
            padding: '40px',
            width: '100%',
            background: 'rgba(17, 24, 39, 0.65)',
            minHeight: '380px',
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '30px',
            position: 'relative'
          }}>
            
            {/* Top-Left Question Counter */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '25px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              color: 'var(--text-secondary)'
            }}>
              {currentRound + 1}/{session?.qaEvaluations?.length || 5}
            </div>

            {/* LEFT COLUMN: Hologram Robot Avatar, Equalizers, Subtitle */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRight: '1px solid var(--glass-border)',
              paddingRight: '20px',
              gap: '12px',
              textAlign: 'center',
              minWidth: '220px'
            }}>
              {/* Animated Cute Straw Hat Girl in Circular Aura */}
              <div className="float-animation" style={{ 
                width: videoActive ? '80px' : '130px', 
                height: videoActive ? '80px' : '130px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 75%)',
                border: '1px solid rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 30px rgba(6, 182, 212, 0.15), inset 0 0 15px rgba(6, 182, 212, 0.05)',
                padding: '4px',
                overflow: 'hidden',
                transition: 'all 0.4s ease-in-out'
              }}>
                <img 
                  src="/images/straw_hat_girl.png" 
                  alt="Hemz AI Interviewer"
                  style={{ width: '92%', height: '92%', objectFit: 'cover', borderRadius: '50%' }}
                />
              </div>

              {/* Dynamic Soundwave Equalizer Lines directly underneath */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '16px', margin: '2px 0' }}>
                <span className="wave-bar" style={{ height: '6px', animationDelay: '0s' }} />
                <span className="wave-bar" style={{ height: '12px', animationDelay: '0.2s' }} />
                <span className="wave-bar" style={{ height: '9px', animationDelay: '0.4s' }} />
                <span className="wave-bar" style={{ height: '16px', animationDelay: '0.6s' }} />
                <span className="wave-bar" style={{ height: '10px', animationDelay: '0.8s' }} />
                <span className="wave-bar" style={{ height: '5px', animationDelay: '1.0s' }} />
              </div>

              {/* Robot Active subtitling */}
              <p style={{
                fontSize: '0.74rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.3',
                maxWidth: '180px',
                margin: '0 auto',
                fontWeight: '500'
              }}>
                {chamberState === 'SPEAKING' 
                  ? 'Hi, Hemz AI here! Listen carefully to the question.' 
                  : 'Hi, Hemz AI here! Start speaking when you are ready.'
                }
              </p>

              {/* Live Webcam video preview card under AI avatar */}
              <div style={{
                position: 'relative',
                width: '200px',
                height: '135px',
                borderRadius: '12px',
                border: cameraWarning ? '2.5px solid #ff4d4d' : '2.5px solid var(--cyan-neon)',
                overflow: 'hidden',
                boxShadow: cameraWarning ? '0 0 20px rgba(255, 77, 77, 0.45)' : '0 0 20px rgba(6, 182, 212, 0.3)',
                background: '#000',
                marginTop: '8px',
                display: videoActive ? 'block' : 'none',
                transition: 'all 0.3s'
              }}>
                <video 
                  ref={setVideoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                {/* Flashing AI warning message overlay */}
                {cameraWarning && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(239, 68, 68, 0.55)',
                    backdropFilter: 'blur(1px)',
                    WebkitBackdropFilter: 'blur(1px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px',
                    textAlign: 'center',
                    animation: 'flashWarning 0.8s infinite alternate',
                    zIndex: 2,
                    pointerEvents: 'none'
                  }}>
                    <span style={{ fontSize: '1.25rem', marginBottom: '4px' }}>⚠️</span>
                    <span style={{ 
                      fontSize: '0.6rem', 
                      fontWeight: '900', 
                      color: '#fff', 
                      fontFamily: 'var(--font-mono)',
                      textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                      letterSpacing: '0.2px',
                      lineHeight: '1.3'
                    }}>
                      {cameraWarning}
                    </span>
                  </div>
                )}
                
                {/* Blinking Live recording dot */}
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  background: 'rgba(5, 8, 20, 0.75)',
                  padding: '3px 8px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.62rem',
                  fontWeight: '800',
                  color: '#ff4d4d',
                  fontFamily: 'var(--font-mono)',
                  border: '1px solid rgba(255, 77, 77, 0.3)'
                }}>
                  <span className="live-dot" /> LIVE
                </div>

                {/* Scanning cyan HUD line */}
                <div className="laser-scanline" />
              </div>

              {/* Inspirational Chibi Learning Quote - only show when video is off to preserve space */}
              {!videoActive && (
                <p className="text-glow-pink" style={{
                  fontSize: '0.7rem',
                  fontStyle: 'italic',
                  color: 'var(--pink-neon)',
                  lineHeight: '1.35',
                  maxWidth: '170px',
                  margin: '10px auto 0 auto',
                  fontWeight: '600',
                  opacity: 0.95,
                  letterSpacing: '0.2px'
                }}>
                  "The opposite of winning is not losing—it is learning! Happy to start!"
                </p>
              )}
            </div>

            {/* RIGHT COLUMN: Question Intercept Box and transcript field */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '20px'
            }}>
              
              {!hasStartedSpeech && currentRound === 0 ? (
                /* Beautiful Direct Interaction Panel to Bypass Browser Autoplay Policies */
                <div className="glass-panel" style={{
                  padding: '30px',
                  border: '2px solid var(--pink-neon) !important',
                  background: 'rgba(5, 6, 15, 0.4)',
                  boxShadow: '0 0 25px rgba(236, 72, 153, 0.15)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                  animation: 'fadeIn 0.3s ease-out',
                  borderRadius: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} style={{ color: 'var(--pink-neon)' }} />
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--pink-neon)', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      VOCAL SYNCHRONIZATION ESTABLISHED
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                    Activate AI Voice Fields
                  </h3>

                  <div style={{ 
                    background: 'rgba(245, 158, 11, 0.06)',
                    borderLeft: '4px solid var(--yellow-neon)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    textAlign: 'left',
                    width: '100%'
                  }}>
                    <p style={{ margin: 0, fontStyle: 'italic', fontWeight: '600', fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                      "Your calm mind is the ultimate weapon against your challenges. So relax!"
                    </p>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                    Tap below to initialize Speech Synthesis and start your first mock question.
                  </p>

                  <button 
                    onClick={() => {
                      setHasStartedSpeech(true);
                      speakQuestion();
                    }}
                    className="btn-cyber btn-cyber-pink"
                    style={{ width: '100%', padding: '12px 24px', fontSize: '0.82rem', fontWeight: 'bold' }}
                  >
                    START VOCAL RUN
                  </button>
                </div>
              ) : (
                /* Question bubble Card */
                <div className="speech-bubble" style={{ borderLeftColor: 'var(--pink-neon) !important' }}>
                  <p style={{
                    fontSize: '1.15rem',
                    fontWeight: '800',
                    lineHeight: '1.5',
                    color: 'var(--text-primary)',
                    margin: 0
                  }}>
                    Q{currentRound + 1}. {activeQuestion}
                  </p>
                </div>
              )}

              {/* Hidden canvas context wrapper to preserve audio analysis logic */}
              <div style={{ display: 'none' }}>
                <canvas ref={canvasRef} />
              </div>

              {/* Live transcript text block shown when listening */}
              {chamberState === 'LISTENING' && (
                <div style={{
                  background: 'rgba(17, 24, 39, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderLeft: '4px solid var(--cyan-neon)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem',
                  lineHeight: '1.5',
                  minHeight: '80px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                }}>
                  <MessageSquare size={16} style={{ color: 'var(--cyan-neon)', marginTop: '3px', flexShrink: 0 }} />
                  <p style={{ margin: 0, fontStyle: transcript ? 'normal' : 'italic', color: transcript ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {transcript || "Speak clearly into your microphone... transcripts will render here in real-time."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 3. Center-Bottom Controller Dashboard Action Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            marginTop: '25px',
            width: '100%'
          }}>
            {/* Center Button: Big circular Glowing Pink Mic Button */}
            <button
              onClick={() => {
                if (chamberState === 'SPEAKING') {
                  setChamberState('LISTENING');
                } else if (chamberState === 'LISTENING') {
                  handleNextRound();
                }
              }}
              title={chamberState === 'LISTENING' ? "Submit Answer" : "Open Microphone"}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--pink-neon), var(--purple-neon))',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(236, 72, 153, 0.4), inset 0 2px 2px rgba(255,255,255,0.2)',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.boxShadow = '0 0 28px rgba(236, 72, 153, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(236, 72, 153, 0.4)';
              }}
            >
              {chamberState === 'LISTENING' ? (
                // Stop/Square Icon when capturing
                <div style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '3px' }} />
              ) : (
                // Microphone Icon when talking/paused
                <Mic size={24} style={{ color: '#fff' }} />
              )}
            </button>

            {/* Right Button: Skip / Next Round Button */}
            <button
              onClick={handleNextRound}
              title="Skip Question"
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1.5px solid rgba(255, 255, 255, 0.12)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1)',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.boxShadow = '0 0 12px rgba(255, 255, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <SkipForward size={22} />
            </button>
          </div>
        </div>
      )}

      {/* 4. Fullscreen Thinking Overlay Modal: "Analyzing Your Interview" */}
      {chamberState === 'THINKING' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(5, 8, 20, 0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.3s ease-out',
          padding: '20px'
        }}>
          {/* Subtle cosmic aura background */}
          <div style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0
          }} />

          <div className="glass-panel float-animation" style={{
            padding: '40px 30px',
            textAlign: 'center',
            maxWidth: '430px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            background: 'rgba(17, 24, 39, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 35px rgba(6, 182, 212, 0.15)',
            borderRadius: '24px',
            zIndex: 1
          }}>
            {/* Chibi Character Portrait with Glowing Violet/Indigo Ring */}
            <div style={{ 
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '50%',
              overflow: 'hidden',
              width: '150px',
              height: '150px',
              boxShadow: '0 0 25px rgba(139, 92, 246, 0.35)',
              background: 'rgba(17, 24, 39, 0.8)',
              padding: '6px'
            }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
                <img 
                  src="/images/success.png" 
                  alt="Analyzing Character" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
            
            <div>
              <h3 style={{ 
                fontSize: '1.8rem', 
                fontWeight: '900', 
                color: 'var(--text-primary)', 
                fontFamily: 'var(--font-mono)', 
                textShadow: '0 0 10px rgba(6, 182, 212, 0.4)' 
              }}>
                EVALUATING WAVEFORMS
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500', marginTop: '6px' }}>
                Hemz ML engine is processing your transcripts...
              </p>
            </div>

            {/* Motivational Speech Bubble */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderLeft: '4px solid var(--yellow-neon)',
              borderRadius: '12px',
              padding: '14px 18px',
              width: '100%',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.05)'
            }}>
              <p style={{ 
                margin: 0, 
                fontStyle: 'italic', 
                fontWeight: '600', 
                fontSize: '0.82rem', 
                color: '#ffdf80', 
                lineHeight: '1.5' 
              }}>
                "Don't wait to find opportunities. Create them, every single day through deliberate practice, coding resilience, and structured learning."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Waving & Blinking Arm CSS Animations */}
      <style>{`
        @keyframes wavingArm {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-35deg); }
        }
        @keyframes blinkEye {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes liveDotBlink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes laserScan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        @keyframes flashWarning {
          0% { background-color: rgba(239, 68, 68, 0.25); }
          100% { background-color: rgba(239, 68, 68, 0.7); }
        }
        .live-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: #ff4d4d;
          box-shadow: 0 0 8px #ff4d4d;
          animation: liveDotBlink 1.5s infinite;
        }
        .laser-scanline {
          position: absolute;
          left: 0;
          width: 100%;
          height: 2.5px;
          background: linear-gradient(to right, transparent, var(--cyan-neon), transparent);
          box-shadow: 0 0 10px var(--cyan-neon);
          opacity: 0.7;
          pointer-events: none;
          animation: laserScan 4s linear infinite;
        }
      `}</style>
    </div>
  );
}
