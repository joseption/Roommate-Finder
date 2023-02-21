import Svg, { Circle, G, Path, Defs, ClipPath } from "react-native-svg";

function UnblockChat() {
  return (
    <Svg
      width={30}
      height={30}
      viewBox="0 0 30 30"
      fill="none"
    >
      <Circle cx={15} cy={15} r={15} fill="#E4E6EB" />
      <Path
        d="M24.245 21.184l-8-5.9c1.468-.496 2.525-1.815 2.525-3.384 0-1.989-1.688-3.6-3.771-3.6-1.977 0-3.58 1.457-3.74 3.302L6.912 8.395a.488.488 0 00-.663.08l-.577.708a.435.435 0 00.082.63L23.09 22.6c.206.152.5.118.663-.078l.577-.712a.432.432 0 00-.085-.627zM8.399 20.18v1.17c0 .745.633 1.35 1.414 1.35h10.319l-8.45-6.235c-1.863.309-3.283 1.847-3.283 3.715z"
        fill="#050505"
      />
      <Defs>
        <Path fill="#E4E6EB" transform="translate(7 5)" d="M0 0H22V21H0z" />
      </Defs>
    </Svg>
  );
};

export default UnblockChat;