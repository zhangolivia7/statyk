interface TVProps {
    color: string;
}

export default function TV({ color }: TVProps) {
    return (
        <svg width="844" height="598" viewBox="0 0 844 598" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1.26953" y="451" width="841" height="146" fill="rgba(12, 12, 12, 1)" stroke="#F3EDE5" strokeWidth="2" />
            <path d="M2.30762 449.533L76.2642 370.625H768.06L841.231 449.533H2.30762Z" stroke="#F3EDE5" strokeWidth="2" />
            <rect x="225.498" y="468.993" width="393.581" height="109.095" rx="9" fill="#0C0C0C" stroke="#F3EDE5" strokeWidth="2" />
            <path d="M752.983 11.6553L739.256 424.832H103.945L91.5923 11.6553H752.983Z" fill="#0C0C0C" stroke="#F3EDE5" strokeWidth="2" />
            <path d="M138.578 38.2418H706.252C714.723 38.2419 721.514 45.2523 721.244 53.7193L710.752 383.102C710.494 391.196 703.857 397.625 695.759 397.625H144.879C136.707 397.625 130.038 391.083 129.882 382.912L123.581 53.5289C123.42 45.134 130.182 38.242 138.578 38.2418Z" fill={color} stroke="#F3EDE5" strokeWidth="2" />
            <path d="M110.561 1L90.561 11.3449H754.017L732.637 1H110.561Z" fill="#0C0C0C" stroke="#F3EDE5" strokeWidth="2" />
            <text x="50%" y="50%"
                // dominant-baseline="middle"
                text-anchor="middle"
                fill="white"
                font-family="Arial, sans-serif"
                font-size="24"
                font-weight="bold">
                Your Overlay Text
            </text>
        </svg>
    );
}