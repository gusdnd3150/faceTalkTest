package com.test.content.conf;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class SocketHandler extends TextWebSocketHandler {

	 private Map<String, WebSocketSession> user = new ConcurrentHashMap<String, WebSocketSession>(); 
	 
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		System.out.print("여길타나");
		user.put(session.getId(), session);
	}


	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		user.remove(session.getId());
	}
	
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		System.out.print("전달메시지:"+message.getPayload());
		for (WebSocketSession webSocketSession : user.values()) {
            if (webSocketSession.isOpen() && !session.getId().equals(webSocketSession.getId())) {
                webSocketSession.sendMessage(message);
            }
        }
	}

}
