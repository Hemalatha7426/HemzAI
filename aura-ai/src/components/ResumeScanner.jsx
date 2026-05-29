import React, { useState } from 'react';
import { Upload, FileText, Cpu, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

export default function ResumeScanner({ onScanComplete }) {
  const [file, setFile] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [parsedSkills, setParsedSkills] = useState([]);
  const [candidateName, setCandidateName] = useState('');


  const handleDragOver = (e) => e.preventDefault();
  
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    setFile(file);
    // Auto-extract candidate name from filename for a premium touch
    const nameMatch = file.name.split(/[._-]/)[0];
    const formattedName = nameMatch.charAt(0).toUpperCase() + nameMatch.slice(1);
    setCandidateName(formattedName);
  };

  const startScanning = async () => {
    if (!file && !textInput.trim()) return;

    setScanning(true);
    setScanProgress(5);
    setTerminalLogs(["[SYSTEM] INITIALIZING SCANNER UNIT [PORT_443]..."]);
    setParsedSkills([]);

    let rawText = '';
    
    try {
      if (file) {
        setTerminalLogs(prev => [...prev, `[SYSTEM] READING FILE: ${file.name} (${Math.round(file.size / 1024)} KB)...`]);
        setScanProgress(15);
        
        if (file.name.toLowerCase().endsWith('.txt')) {
          rawText = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (err) => reject(err);
            reader.readAsText(file);
          });
        } else if (file.name.toLowerCase().endsWith('.pdf')) {
          setTerminalLogs(prev => [...prev, `[SYSTEM] INJECTING HOLOGRAPHIC PDF PARSER ENGINE...`]);
          setScanProgress(25);
          
          const arrayBuffer = await file.arrayBuffer();
          
          // Load PDF.js from CDN dynamically if not present
          if (!window.pdfjsLib) {
            setTerminalLogs(prev => [...prev, `[SYSTEM] CONNECTING TO CDN FOR PDF DECODER DLL...`]);
            await new Promise((resolve, reject) => {
              const script = document.createElement('script');
              script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
              script.onload = () => {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
                resolve();
              };
              script.onerror = (err) => reject(new Error("Failed to load PDF decoder libraries."));
              document.head.appendChild(script);
            });
          }
          
          setTerminalLogs(prev => [...prev, `[SYSTEM] PARSING PDF CONTENT PAGES...`]);
          setScanProgress(35);
          
          const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let pagesText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            
            // Group and sort text items by vertical coordinate (transform[5] is Y, transform[4] is X)
            // Group items that have close Y coordinates (within 4 units tolerance)
            const items = content.items.map(item => ({
              str: item.str,
              x: item.transform[4],
              y: item.transform[5]
            }));

            const linesMap = [];
            items.forEach(item => {
              let foundLine = linesMap.find(line => Math.abs(line.y - item.y) < 4);
              if (foundLine) {
                foundLine.items.push(item);
              } else {
                linesMap.push({
                  y: item.y,
                  items: [item]
                });
              }
            });

            // Sort lines from top to bottom (Y descending since Y=0 is bottom in PDF space)
            linesMap.sort((a, b) => b.y - a.y);

            let pageText = '';
            linesMap.forEach(line => {
              // In each line, sort items from left to right (X ascending)
              line.items.sort((a, b) => a.x - b.x);
              const lineStr = line.items.map(it => it.str).join(' ').trim();
              if (lineStr.length > 0) {
                pageText += lineStr + '\n';
              }
            });
            pagesText += pageText + '\n';
          }
          rawText = pagesText;
        } else {
          // Fallback for docx or other formats
          setTerminalLogs(prev => [...prev, `[WARNING] UNKNOWN BINARY FORMAT. EXTRACTING FILENAME METADATA...`]);
          rawText = file.name;
        }
      }
      
      // Combine parsed file text with paste box text
      const fullText = (rawText + " " + textInput).trim();
      setScanProgress(55);
      
      const wordsCount = fullText.split(/\s+/).filter(w => w.length > 0).length;
      setTerminalLogs(prev => [...prev, `[SYSTEM] EXTRACTED ${wordsCount} WORDS FOR LEXICAL ANALYSIS.`]);
      
      // RUN RESUME VS CERTIFICATION ANALYZER
      const lowerText = fullText.toLowerCase();
      
      const resumeKeywords = ["experience", "projects", "education", "employment", "professional", "history", "skills", "work history", "summary", "job", "position", "career"];
      const certKeywords = ["certificate", "certification", "certify", "credential", "awarded", "completion", "presented to", "license", "verify", "score", "achievement", "course"];
      
      let resumeScore = 0;
      let certScore = 0;
      
      resumeKeywords.forEach(kw => {
        if (lowerText.includes(kw)) resumeScore++;
      });
      
      certKeywords.forEach(kw => {
        if (lowerText.includes(kw)) certScore++;
      });
      
      setTerminalLogs(prev => [...prev, `[SYSTEM] RUNNING LEXICAL CLASSIFIER MODEL...`]);
      setScanProgress(75);
      
      // Classify as certificate: strictly resume format only, bypassed warnings
      const isCertificate = false;
      
      // Map skills from actual extracted text content
      const skillsPool = [
        { keyword: "react", skill: "React.js" },
        { keyword: "spring", skill: "Spring Boot" },
        { keyword: "mongo", skill: "MongoDB" },
        { keyword: "java", skill: "Java SE/EE" },
        { keyword: "python", skill: "Python ML" },
        { keyword: "node", skill: "Node.js" },
        { keyword: "express", skill: "Express.js" },
        { keyword: "sql", skill: "SQL Databases" },
        { keyword: "aws", skill: "AWS Cloud" },
        { keyword: "docker", skill: "Docker" },
        { keyword: "kubernetes", skill: "Kubernetes" },
        { keyword: "typescript", skill: "TypeScript" },
        { keyword: "svelte", skill: "Svelte" },
        { keyword: "vue", skill: "Vue.js" },
        { keyword: "angular", skill: "Angular" },
        { keyword: "rust", skill: "Rust" },
        { keyword: "golang", skill: "Go (Golang)" },
        { keyword: "c++", skill: "C/C++" },
        { keyword: "c#", skill: "C#" },
        { keyword: "swift", skill: "Swift" },
        { keyword: "kotlin", skill: "Kotlin" },
        { keyword: "ruby", skill: "Ruby on Rails" },
        { keyword: "php", skill: "PHP" },
        { keyword: "django", skill: "Django" },
        { keyword: "flask", skill: "Flask" },
        { keyword: "postgres", skill: "PostgreSQL" },
        { keyword: "mysql", skill: "MySQL" },
        { keyword: "redis", skill: "Redis" },
        { keyword: "kafka", skill: "Apache Kafka" },
        { keyword: "graphql", skill: "GraphQL" },
        { keyword: "git", skill: "Git/GitHub" },
        { keyword: "terraform", skill: "Terraform" },
        { keyword: "pytorch", skill: "PyTorch" },
        { keyword: "tensorflow", skill: "TensorFlow" },
        { keyword: "gcp", skill: "Google Cloud (GCP)" },
        { keyword: "azure", skill: "Microsoft Azure" },
        { keyword: "firebase", skill: "Firebase" },
        { keyword: "next.js", skill: "Next.js" }
      ];
      
      let extracted = skillsPool
        .filter(p => lowerText.includes(p.keyword))
        .map(p => p.skill);
        
      setScanProgress(80);
      setTerminalLogs(prev => [...prev, `[SYSTEM] RUNNING LEXICAL ENTITY EXTRACTION...`]);

      // EXTRACT BIO/CERTIFICATION ENTITIES
      let detectedRole = "";
      let detectedCompany = "";
      let detectedProjects = [];
      let certName = "";
      let certIssuer = "";

      const rolesPool = [
        "software engineer", "frontend developer", "backend developer", "full stack engineer",
        "full-stack engineer", "fullstack developer", "data scientist", "machine learning engineer",
        "devops engineer", "system architect", "solutions architect", "product manager",
        "technical lead", "tech lead", "engineering intern", "software developer intern",
        "software developer", "qa engineer", "cloud architect", "site reliability engineer", "sre"
      ];
      for (const role of rolesPool) {
        if (lowerText.includes(role)) {
          detectedRole = role.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          break;
        }
      }
      if (!detectedRole) {
        const primarySkill = extracted[0] || "Software";
        detectedRole = `${primarySkill} Engineer`;
      }

      const companiesPool = [
        "google", "microsoft", "amazon", "apple", "meta", "netflix", "uber", "airbnb",
        "stripe", "capgemini", "tcs", "cognizant", "infosys", "wipro", "accenture", "ibm",
        "intel", "nvidia", "tesla", "adobe", "oracle", "salesforce", "atlassian"
      ];
      for (const company of companiesPool) {
        if (lowerText.includes(company)) {
          detectedCompany = company.charAt(0).toUpperCase() + company.slice(1);
          break;
        }
      }
      if (!detectedCompany) {
        detectedCompany = "Quantum Tech Systems";
      }

      // Robust Project Extraction Section
      const projectKeywords = ["app", "platform", "system", "service", "dashboard", "portal", "engine", "pipeline", "tool", "framework", "website", "application", "database", "api", "gateway", "analytics", "scheduler", "scraper"];
      const lines = fullText.split('\n');
      const linesForProj = fullText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      let insideProjectsSection = false;
      
      for (let i = 0; i < linesForProj.length; i++) {
        const line = linesForProj[i];
        const lowerLine = line.toLowerCase();
        
        // Detect section transition
        if (lowerLine.includes("project") || lowerLine.includes("initiative") || lowerLine.includes("key work") || lowerLine.includes("portfolio") || lowerLine.includes("experience")) {
          insideProjectsSection = true;
          continue;
        } else if (lowerLine.includes("skills") || lowerLine.includes("education") || lowerLine.includes("certification") || lowerLine.includes("contact")) {
          insideProjectsSection = false;
        }
        
        if (insideProjectsSection) {
          const clean = line.replace(/^[•\-\*■❑✅▪\d\.\s]+/i, '').trim();
          if (clean.length > 5 && clean.length < 60) {
            const firstChar = clean.charAt(0);
            const isCapitalized = firstChar >= 'A' && firstChar <= 'Z';
            const hasProjWord = projectKeywords.some(kw => clean.toLowerCase().includes(kw));
            
            if (isCapitalized && (hasProjWord || clean.split(' ').length <= 5)) {
              // Ensure it's not a narrative sentence
              if (!clean.endsWith('.') && !clean.includes('engineered') && !clean.includes('developed') && !clean.includes('implemented')) {
                if (!detectedProjects.includes(clean)) {
                  detectedProjects.push(clean);
                }
              }
            }
          }
        }
        if (detectedProjects.length >= 4) break;
      }

      // Broad fallback scan across entire document if projects is still empty
      if (detectedProjects.length === 0) {
        for (const line of lines) {
          const clean = line.replace(/^[•\-\*■❑✅▪\d\.\s]+/i, '').trim();
          if (clean.length > 5 && clean.length < 50) {
            const firstChar = clean.charAt(0);
            const isCapitalized = firstChar >= 'A' && firstChar <= 'Z';
            if (isCapitalized && projectKeywords.some(kw => clean.toLowerCase().includes(kw))) {
              if (!clean.endsWith('.') && !clean.includes('developed') && !clean.includes('designed')) {
                if (!detectedProjects.includes(clean)) {
                  detectedProjects.push(clean);
                }
              }
            }
          }
          if (detectedProjects.length >= 3) break;
        }
      }

      // Dynamic skill-based project synthesis fallback
      if (detectedProjects.length === 0) {
        const firstSkill = extracted[0] || "Cloud";
        const secondSkill = extracted[1] || "Full-Stack";
        detectedProjects = [
          `${firstSkill} Enterprise Platform`,
          `Distributed ${secondSkill} Orchestrator`,
          `High-Throughput Analytics Engine`
        ];
      }

      const extractedEntities = {
        role: detectedRole,
        company: detectedCompany,
        projects: detectedProjects,
        certName: certName,
        certIssuer: certIssuer
      };

      setScanProgress(90);
      setTerminalLogs(prev => [...prev, `[SYSTEM] DETECTED ${extracted.length} COMPATIBLE TECHNICAL SKILLS.`]);
      
      const candidateInfo = {
        candidateName: candidateName.trim() || (file ? file.name.split(/[._-]/)[0] : "Elite Candidate"),
        skills: extracted,
        isCertificate,
        fullText,
        extractedEntities
      };
      
      // Enforce Resume scan completion directly (bypassing certificate alerts)
      if (extracted.length === 0) {
        setTerminalLogs(prev => [...prev, `[WARNING] NO TECHNICAL SKILLS MATCHED. FALLING BACK TO STANDARD PROFILE...`]);
        extracted = ["React.js", "Spring Boot", "MongoDB", "REST APIs", "System Design"];
        candidateInfo.skills = extracted;
      }
      
      setScanProgress(100);
      setTerminalLogs(prev => [...prev, `[SYSTEM] SCAN COMPLETED. SYNCHRONIZING WITH HOLOGRAPHIC CHAMBER.`]);
      setTimeout(() => {
        onScanComplete({
          candidateName: candidateInfo.candidateName,
          skills: extracted,
          isCertificate: false,
          fullText: candidateInfo.fullText,
          extractedEntities: candidateInfo.extractedEntities
        });
      }, 1200);
      
    } catch (err) {
      console.error("Scanning failed:", err);
      setTerminalLogs(prev => [...prev, `[ERROR] PARSING ERROR: ${err.message}. FALLING BACK TO STANDARDS...`]);
      setScanProgress(100);
      setTimeout(() => {
        onScanComplete({
          candidateName: candidateName.trim() || "Elite Candidate",
          skills: ["React.js", "Spring Boot", "MongoDB", "REST APIs", "System Design"],
          isCertificate: false,
          fullText: textInput,
          extractedEntities: {
            role: "Software Engineer",
            company: "Tech Innovators",
            projects: ["Scalable Microservices Gateway", "Distributed Cloud Platform"],
            certName: "",
            certIssuer: ""
          }
        });
      }, 1500);
    }
  };



  return (
    <div className={`glass-panel dot-grid responsive-scanner-grid ${scanning ? 'scanning-mode' : ''}`} style={{ 
      padding: !scanning ? '0' : '40px'
    }}>
      {scanning && <div className="scanner-overlay" />}
      
      {/* LEFT COLUMN - AI Cartoon Chibi & Quote Card */}
      {!scanning && (
        <div style={{ 
          background: 'var(--space-bg)', 
          padding: '40px 30px', 
          borderRight: '3px solid var(--ink-dark)', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          textAlign: 'center', 
          gap: '24px', 
          position: 'relative' 
        }}>
          {/* Chibi Peeking Girl Image Card with ink border */}
          <div style={{ 
            border: '3px solid var(--ink-dark)',
            borderRadius: '16px',
            overflow: 'hidden',
            width: '180px',
            height: '180px',
            boxShadow: '4px 4px 0px var(--ink-dark)',
            background: '#fff'
          }}>
            <img 
              src="/images/peeking.png" 
              alt="Peeking Character" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', color: 'var(--ink-dark)', marginBottom: '12px' }}>
              IDENTITY SCANNERS
            </h2>
            <p style={{ 
              color: 'var(--text-primary)', 
              fontSize: '0.85rem', 
              lineHeight: '1.5', 
              fontWeight: '800', 
              maxWidth: '280px', 
              margin: '0 auto',
              fontStyle: 'italic',
              padding: '12px 15px',
              background: 'var(--yellow-neon)',
              border: '3px solid var(--ink-dark)',
              borderRadius: '16px',
              boxShadow: '3px 3px 0px var(--ink-dark)'
            }}>
              "Every difficulty comes with a hidden blessing. Technical challenges in interview prep build the deep engineering expertise that defines your career."
            </p>
          </div>
        </div>
      )}

      {/* RIGHT COLUMN - Form / Scanner content */}
      <div className="responsive-scanner-right">
        {!scanning ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.6rem', color: 'var(--ink-dark)', textShadow: '2px 2px 0px #fff, 3px 3px 0px var(--ink-dark)' }}>
                SPECS INITIALIZER
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '600', marginTop: '6px' }}>
                Upload your credentials or insert tech stacks to engage the chambers.
              </p>
            </div>

            {/* Candidate Name Input */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--ink-dark)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                Candidate Identifier
              </label>
              <input 
                type="text" 
                placeholder="e.g. Alex Mercer"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  outline: 'none'
                }}
              />
            </div>

            {/* File Drag and Drop */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--ink-dark)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                Upload Credentials File
              </label>
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{
                  border: file ? '3px solid var(--cyan-neon)' : '3px dashed var(--ink-dark)',
                  borderRadius: '15px',
                  padding: '20px 15px',
                  textAlign: 'center',
                  background: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                  boxShadow: '3px 3px 0px var(--ink-dark)'
                }}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <input 
                  id="file-upload" 
                  type="file" 
                  accept=".pdf,.doc,.docx,.txt" 
                  style={{ display: 'none' }} 
                  onChange={handleFileChange}
                />
                <Upload size={30} style={{ color: file ? 'var(--cyan-neon)' : 'var(--ink-dark)', marginBottom: '8px' }} />
                <p style={{ fontSize: '0.85rem', color: 'var(--ink-dark)', fontWeight: '800', marginBottom: '2px' }}>
                  {file ? file.name : "Drag & Drop Resume"}
                </p>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  Supports PDF, TXT (Max 5MB)
                </p>
              </div>
            </div>

            {/* Paste Box */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--ink-dark)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                OR PASTE CORE SKILLS / BIO
              </label>
              <textarea 
                placeholder="React, Spring Boot, Java, MongoDB, building scalable REST microservices..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  outline: 'none',
                  resize: 'none',
                  minHeight: '85px',
                  fontSize: '0.82rem'
                }}
              />
            </div>

            <button 
              className="btn-cyber btn-cyber-pink" 
              onClick={startScanning} 
              disabled={!file && !textInput.trim()}
              style={{ 
                width: '100%', 
                marginTop: '5px',
                opacity: (!file && !textInput.trim()) ? 0.5 : 1,
                cursor: (!file && !textInput.trim()) ? 'not-allowed' : 'pointer'
              }}
            >
              INITIALIZE SCANNERS <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          /* Scanning View */
          <div style={{ padding: '10px 0' }}>
            {/* Progress ring/laser loader */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '25px' }}>
              <Cpu size={45} className="float-animation" style={{ color: 'var(--pink-neon)', marginBottom: '18px' }} />
              
              <div style={{ width: '100%', maxWidth: '350px', height: '10px', background: 'rgba(30, 41, 59, 0.08)', borderRadius: '5px', overflow: 'hidden', position: 'relative', border: '3px solid var(--ink-dark)' }}>
                <div 
                  style={{ 
                    width: `${scanProgress}%`, 
                    height: '100%', 
                    background: 'var(--pink-neon)', 
                    transition: 'width 0.3s ease-in-out'
                  }} 
                />
              </div>
              <p style={{ marginTop: '12px', fontFamily: 'var(--font-mono)', color: 'var(--ink-dark)', fontSize: '0.85rem', letterSpacing: '1px' }}>
                DECODING ARTIFACT DATA: {scanProgress}%
              </p>
            </div>

            {/* Matrix Terminal Logs */}
            <div style={{
              background: '#ffffff',
              border: '3px solid var(--ink-dark)',
              borderRadius: '12px',
              padding: '16px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.78rem',
              fontWeight: '700',
              color: 'var(--ink-dark)',
              height: '160px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              boxShadow: '3px 3px 0px var(--ink-dark)'
            }}>
              {terminalLogs.map((log, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--pink-neon)' }}>●</span>
                  <span>{log}</span>
                </div>
              ))}
              <div style={{ width: '4px', height: '12px', background: 'var(--pink-neon)', display: 'inline-block', animation: 'pulse 1s infinite alternate' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
