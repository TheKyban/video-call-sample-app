let peer = new RTCPeerConnection();

const init = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true
    });

    document.getElementById("my").srcObject = stream;

    for (let track of stream.getTracks()) {
        peer.addTrack(track, stream);
    }

    const remoteStream = new MediaStream();
    document.getElementById("other").srcObject = remoteStream;
    peer.ontrack = (e) => {
        for (let track of e.streams[0].getTracks()) {
            remoteStream.addTrack(track);
        }
    };
};

const createOffer = async () => {

    peer.onicecandidate = (e) => {
        if (e.candidate) {
            document.getElementById("offer").value = JSON.stringify(peer.localDescription);
        }
    };
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
};


const createAnswer = async () => {
    const offer = document.getElementById("offer").value;

    peer.onicecandidate = (e) => {
        if (e.candidate) {
            document.getElementById("answer").value = JSON.stringify(peer.localDescription);
        }
    };

    if (offer.length > 10) {
        await peer.setRemoteDescription(JSON.parse(offer));
        const answer = await peer.createAnswer();
        peer.setLocalDescription(answer);
    }
};



const addAnswer = async () => {
    const answer = document.getElementById("answer").value;

    if (answer.length > 10) {
        peer.setRemoteDescription(JSON.parse(answer));
    }
};


document.getElementById("createOffer").onclick = async () => {
    await init();
    createOffer();
};
document.getElementById("createAnswer").onclick = async () => {
    await init();
    createAnswer();
};
document.getElementById("addAnswer").onclick = addAnswer;