import Svg, { Circle } from "react-native-svg"

const Dots = ({width, height}: any) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 87 17"
      fill="none"
    >
      <Circle cx={8.5} cy={8.5} r={8.5} fill="#000" />
      <Circle cx={78.5} cy={8.5} r={8.5} fill="#000" />
      <Circle cx={43.5} cy={8.5} r={8.5} fill="#000" />
    </Svg>
  );
};

export default Dots;