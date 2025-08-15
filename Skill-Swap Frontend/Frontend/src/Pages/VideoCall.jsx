import React, { useEffect, useRef } from "react";

// Zego UIKit script will be loaded dynamically
export default function VideoCall({ roomID, userName }) {
  const rootRef = useRef(null);

  useEffect(() => {
    // Load Zego SDK
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@zegocloud/zego-uikit-prebuilt/zego-uikit-prebuilt.js";
    script.async = true;
    script.onload = () => {
      if (window.ZegoUIKitPrebuilt) {
        initZego();
      }
    };
    document.body.appendChild(script);

    function initZego() {
      const appID = parseInt(import.meta.env.VITE_ZEGO_APP_ID, 10);
      const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

      // Random user ID if not provided
      const userID = Math.floor(Math.random() * 10000) + "";
      const displayName = userName || `userName${userID}`;

      // Generate token (Note: for production, generate token from backend)
      const kitToken = window.ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID || Math.floor(Math.random() * 10000) + "",
        userID,
        displayName
      );

      const zp = window.ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: rootRef.current,
        sharedLinks: [
          {
            name: "Personal link",
            url:
              window.location.protocol +
              "//" +
              window.location.host +
              window.location.pathname +
              "?roomID=" +
              roomID,
          },
        ],
        scenario: {
          mode: window.ZegoUIKitPrebuilt.VideoConference,
        },
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: true,
        showMyCameraToggleButton: true,
        showMyMicrophoneToggleButton: true,
        showAudioVideoSettingsButton: true,
        showScreenSharingButton: true,
        showTextChat: true,
        showUserList: true,
        maxUsers: 2,
        layout: "Auto",
        showLayoutButton: false,
      });
    }
  }, [roomID, userName]);

  return (
    <div
      ref={rootRef}
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
