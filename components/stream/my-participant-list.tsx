import {
  ParticipantView,
  StreamVideoParticipant,
} from "@stream-io/video-react-sdk";

export const MyParticipantList = (props: {
  participants: StreamVideoParticipant[];
}) => {
  const {participants} = props;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "8px",
        width: "100vw",
      }}
    >
      {participants.map((participant) => (
        <ParticipantView
          muteAudio
          participant={participant}
          key={participant.sessionId}
        />
      ))}
    </div>
  );
};
