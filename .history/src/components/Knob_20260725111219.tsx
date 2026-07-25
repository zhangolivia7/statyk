interface KnobProps {
    angle: Int16Array
}

export default function Knob() {
    return (
        <svg width="73" height="73" viewBox="0 0 73 73" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="36.5" cy="36.5" r="35.5" stroke="#F3EDE5" stroke-width="2" />
            <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: "36.5px 36.5px" }}>
    <path d="M37 5L37 20" stroke="#F3EDE5" strokeWidth="2" />
    <circle cx="36.5" cy="36.5" r="12.5" fill="#F3EDE5" />
  </g>
        </svg>
    )
}
