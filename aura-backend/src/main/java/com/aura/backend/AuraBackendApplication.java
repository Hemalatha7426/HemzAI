package com.aura.backend;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AuraBackendApplication {

	@Value("${spring.data.mongodb.uri}")
	private String mongoUri;

	public static void main(String[] args) {
		SpringApplication.run(AuraBackendApplication.class, args);
	}

	@PostConstruct
	public void init() {
		if (mongoUri != null) {
			// Redact password for security in logs
			String redactedUri = mongoUri.replaceAll("(?<=://)[^@]+@", "******@");
			System.out.println("=================================================");
			System.out.println("AURA BACKEND: Connecting to MongoDB at: " + redactedUri);
			System.out.println("=================================================");
		} else {
			System.out.println("AURA BACKEND: spring.data.mongodb.uri is NOT configured!");
		}
	}

}
