package com.aura.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "interview_sessions")
public class InterviewSession {

    @Id
    private String id;
    private String candidateName;
    private List<String> candidateSkills;
    private String track; // Tech, HR, System Design, PM, custom
    private String experienceLevel; // Intern, Mid, Senior, Lead
    private int overallScore; // 0-100
    private String feedbackSummary;
    private String resumeImprovementFeedback;
    private LocalDateTime timestamp;
    private List<QAEvaluation> qaEvaluations;
    private boolean isCertificate;
    private String fullText;
    private String role;
    private String company;
    private List<String> projects;
    private String certName;
    private String certIssuer;
    private String mode; // Mock vs Practice

    // Default constructor
    public InterviewSession() {
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public boolean isCertificate() {
        return isCertificate;
    }

    public void setCertificate(boolean isCertificate) {
        this.isCertificate = isCertificate;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public List<String> getCandidateSkills() {
        return candidateSkills;
    }

    public void setCandidateSkills(List<String> candidateSkills) {
        this.candidateSkills = candidateSkills;
    }

    public String getTrack() {
        return track;
    }

    public void setTrack(String track) {
        this.track = track;
    }

    public String getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(String experienceLevel) {
        this.experienceLevel = experienceLevel;
    }

    public int getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(int overallScore) {
        this.overallScore = overallScore;
    }

    public String getFeedbackSummary() {
        return feedbackSummary;
    }

    public void setFeedbackSummary(String feedbackSummary) {
        this.feedbackSummary = feedbackSummary;
    }

    public String getResumeImprovementFeedback() {
        return resumeImprovementFeedback;
    }

    public void setResumeImprovementFeedback(String resumeImprovementFeedback) {
        this.resumeImprovementFeedback = resumeImprovementFeedback;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public List<QAEvaluation> getQaEvaluations() {
        return qaEvaluations;
    }

    public void setQaEvaluations(List<QAEvaluation> qaEvaluations) {
        this.qaEvaluations = qaEvaluations;
    }

    public String getFullText() {
        return fullText;
    }

    public void setFullText(String fullText) {
        this.fullText = fullText;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public List<String> getProjects() {
        return projects;
    }

    public void setProjects(List<String> projects) {
        this.projects = projects;
    }

    public String getCertName() {
        return certName;
    }

    public void setCertName(String certName) {
        this.certName = certName;
    }

    public String getCertIssuer() {
        return certIssuer;
    }

    public void setCertIssuer(String certIssuer) {
        this.certIssuer = certIssuer;
    }

    public static class QAEvaluation {
        private String question;
        private String category; // Technical, Scenario, Behavioral
        private String userTranscript;
        private int score; // 0-100
        private String feedback;
        private String suggestedAnswer;

        // Getters and Setters
        public String getQuestion() {
            return question;
        }

        public void setQuestion(String question) {
            this.question = question;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public String getUserTranscript() {
            return userTranscript;
        }

        public void setUserTranscript(String userTranscript) {
            this.userTranscript = userTranscript;
        }

        public int getScore() {
            return score;
        }

        public void setScore(int score) {
            this.score = score;
        }

        public String getFeedback() {
            return feedback;
        }

        public void setFeedback(String feedback) {
            this.feedback = feedback;
        }

        public String getSuggestedAnswer() {
            return suggestedAnswer;
        }

        public void setSuggestedAnswer(String suggestedAnswer) {
            this.suggestedAnswer = suggestedAnswer;
        }
    }
}
