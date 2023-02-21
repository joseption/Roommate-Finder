import Svg, { Circle } from "react-native-svg"

const Dots = ({width, height, color}: any) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 90 17"
      fill="none"
    >
      <Circle cx={10} cy={10} r={10} fill={color} />
      <Circle cx={80} cy={10} r={10} fill={color} />
      <Circle cx={45} cy={10} r={10} fill={color} />
    </Svg>
  );
};

export default Dots;