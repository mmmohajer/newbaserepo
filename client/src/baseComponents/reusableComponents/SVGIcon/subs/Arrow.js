const Arrow = ({
  fill = "none",
  stroke = "#032456",
  width = 30,
  height = 30,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Longer body */}
    <line x1="5" y1="19" x2="21" y2="3" />
    {/* Shorter arrowhead */}
    <polyline points="15 3 21 3 21 9" />
  </svg>
);

export default Arrow;
