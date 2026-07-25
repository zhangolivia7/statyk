
interface TimerProps {
    pomodoro: boolean,
}

export default function Timer({ pomodoro }: TimerProps) {
    return (
        <div>
            <rect x="1.26953" y="451" width="841" height="146px" fill="#0C0C0C" stroke="#F3EDE5" stroke-width="2" />
            <p>)00:00</p>
        </div>
    )
}