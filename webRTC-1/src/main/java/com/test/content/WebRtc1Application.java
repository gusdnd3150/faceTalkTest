package com.test.content;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.socket.config.annotation.EnableWebSocket;

@SpringBootApplication
@EnableWebSocket
public class WebRtc1Application {

	public static void main(String[] args) {
		SpringApplication.run(WebRtc1Application.class, args);
	}

}
