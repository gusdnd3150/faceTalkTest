package com.test.content.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {
	
	@GetMapping("/")
	public String test() {
		return "test2";
	}
	
	@GetMapping("/test2")
	public String test2() {
		return "test2";
	}

}
