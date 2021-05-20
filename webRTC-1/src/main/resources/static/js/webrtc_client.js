

function getContextPath() {
    var hostIndex = location.href.indexOf( location.host ) + location.host.length;
    return location.href.substring( hostIndex, location.href.indexOf('/', hostIndex + 1) );
}
const conn =new WebSocket("ws://" + window.location.host + getContextPath() + "/rtc/test");
//const conn =new WebSocket("ws://" + window.location.host +  "/rtc/test");
//var conn = new WebSocket("ws://" + window.location.host + "/rtc/test");



conn.onopen = function() {
    console.log("Connected to the signaling server");
    initialize();
};

conn.onmessage = function(msg) {
    console.log("Got message", msg.data);
    var content = JSON.parse(msg.data);
    var data = content.data;
    switch (content.event) {
    // when somebody wants to call us
    case "offer":
        handleOffer(data);
        break;
    case "answer":
        handleAnswer(data);
        break;
    // when a remote peer sends an ice candidate to us
    case "candidate":
        handleCandidate(data);
        break;
    default:
        break;
    }
};

function send(message) {
    conn.send(JSON.stringify(message));
}
//////////////////////////////////// 위 Websocket

var peerConnection;
var remotePeerConnection;
var dataChannel;
var input = document.getElementById("messageInput");
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo')


function initialize() {
    var configuration = {
    	    "iceServers" :  [
    	        {
    	            'urls': 'stun:stun.l.google.com:19302'
    	          },
    	          {
    	            'urls': 'turn:10.158.29.39:3478?transport=udp',
    	            'credential': 'XXXXXXXXXXXXX',
    	            'username': 'XXXXXXXXXXXXXXX'
    	          },
    	          {
    	            'urls': 'turn:10.158.29.39:3478?transport=tcp',
    	            'credential': 'XXXXXXXXXXXXX',
    	            'username': 'XXXXXXXXXXXXXXX'
    	          }
    	        ]};

    peerConnection = new RTCPeerConnection(configuration);
   
    // Setup ice handling
    peerConnection.onicecandidate = function(event) {
        if (event.candidate) {
            send({
                event : "candidate",
                data : event.candidate
            });
        }
    };

    // creating data channel
    dataChannel = peerConnection.createDataChannel("dataChannel", {
        reliable : true
    });

    dataChannel.onerror = function(error) {
        console.log("Error occured on datachannel:", error);
    };

    // when we receive a message from the other peer, printing it on the console
    dataChannel.onmessage = function(event) {
        console.log("message:", event.data);
    };

    dataChannel.onclose = function() {
        console.log("data channel is closed");
    };
  
  	peerConnection.ondatachannel = function (event) {
        dataChannel = event.channel;
  	};
  	peerConnection.onaddstream = function(event) {
  		remoteVideo.srcObject = event.stream;
  	};

    
}

function createOffer() {
    peerConnection.createOffer(function(offer) {
        send({
            event : "offer",
            data : offer
        });
        peerConnection.setLocalDescription(offer);
    }, function(error) {
        alert("오퍼 실패");
    });
}

function handleOffer(offer) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    // create and send an answer to an offer
    peerConnection.createAnswer(function(answer) {
        peerConnection.setLocalDescription(answer);
        send({
            event : "answer",
            data : answer
        });
    }, function(error) {
        alert("Error creating an answer");
    });

};

function handleCandidate(candidate) {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
};

function handleAnswer(answer) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log("connection established successfully!!");
};

function sendMessage() {
	console.log(input.value)
    dataChannel.send(input.value);
    input.value = "";
}



/*const constraints = {
	    video: true,audio : true
	};*/
var constraints = {
	    video : {
	        frameRate : {
	            ideal : 10,
	            max : 15
	        },
	        width : 1280,
	        height : 720,
	        facingMode : "user"
	    }
	};
navigator.mediaDevices.getUserMedia(constraints).
	  then(function(stream) { localVideo.srcObject = stream 
			                  peerConnection.addStream(stream);
	  						})
	    .catch(function(err) { /* handle the error */ });

/*peerConnection.onaddstream = function(event) {
	remoteVideo.srcObject = event.stream;
};
*/


function handlePeerConnection(message) {
    createPeerConnection();
    getMedia(mediaConstraints);
    if (message.data === "true") {
        myPeerConnection.onnegotiationneeded = handleNegotiationNeededEvent;
    }
}


