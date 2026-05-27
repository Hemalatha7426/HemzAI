package com.aura.backend.controller;

import com.aura.backend.model.InterviewSession;
import com.aura.backend.model.InterviewSession.QAEvaluation;
import com.aura.backend.service.InterviewSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interviews")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS, RequestMethod.DELETE})
public class InterviewController {

    @Autowired
    private InterviewSessionService sessionService;

    /**
     * Endpoint to initialize/generate custom interview questions based on candidate criteria.
     * Request body can contain: skills (list of strings), track, experienceLevel, candidateName
     */
    @PostMapping("/start")
    public ResponseEntity<InterviewSession> startInterview(@RequestBody Map<String, Object> request) {
        String name = (String) request.getOrDefault("candidateName", "Anonymous Candidate");
        String track = (String) request.getOrDefault("track", "Technical");
        String experience = (String) request.getOrDefault("experienceLevel", "Mid");
        String mode = (String) request.getOrDefault("mode", "Mock");
        boolean isCertificate = false;
        if (request.containsKey("isCertificate")) {
            Object val = request.get("isCertificate");
            if (val instanceof Boolean) {
                isCertificate = (Boolean) val;
            }
        }
        
        @SuppressWarnings("unchecked")
        List<String> skills = (List<String>) request.get("skills");

        InterviewSession session = new InterviewSession();
        session.setCandidateName(name);
        session.setCandidateSkills(skills);
        session.setTrack(track);
        session.setExperienceLevel(experience);
        session.setCertificate(isCertificate);
        session.setMode(mode);

        String fullText = (String) request.get("fullText");
        session.setFullText(fullText);

        if (request.containsKey("extractedEntities")) {
            @SuppressWarnings("unchecked")
            Map<String, Object> entities = (Map<String, Object>) request.get("extractedEntities");
            if (entities != null) {
                session.setRole((String) entities.get("role"));
                session.setCompany((String) entities.get("company"));
                session.setCertName((String) entities.get("certName"));
                session.setCertIssuer((String) entities.get("certIssuer"));
                if (entities.containsKey("projects")) {
                    @SuppressWarnings("unchecked")
                    List<String> projects = (List<String>) entities.get("projects");
                    session.setProjects(projects);
                }
            }
        }

        sessionService.populateSessionQuestions(session);

        return ResponseEntity.ok(session);
    }

    /**
     * Endpoint to evaluate spoken responses and save the interview to MongoDB.
     */
    @PostMapping("/evaluate")
    public ResponseEntity<InterviewSession> evaluateInterview(@RequestBody InterviewSession session) {
        InterviewSession evaluated = sessionService.evaluateSession(session);
        return ResponseEntity.ok(evaluated);
    }

    /**
     * Fetch historical reports for the diagnostic main hub.
     */
    @GetMapping("/history")
    public ResponseEntity<List<InterviewSession>> getHistory() {
        return ResponseEntity.ok(sessionService.getSessionHistory());
    }

    /**
     * Fetch details of a specific past session.
     */
    @GetMapping("/session/{id}")
    public ResponseEntity<InterviewSession> getSessionById(@PathVariable String id) {
        InterviewSession session = sessionService.getSessionById(id);
        if (session == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(session);
    }

    /**
     * Endpoint to delete a specific past session.
     */
    @DeleteMapping("/session/{id}")
    public ResponseEntity<Map<String, Object>> deleteSession(@PathVariable String id) {
        boolean deleted = sessionService.deleteSession(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of("success", true, "message", "Session deleted successfully"));
    }
}
