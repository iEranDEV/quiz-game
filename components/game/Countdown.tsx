import { useEffect, useRef } from "react";

type CountdownProps = {
    questions: Array<Question>,
    setQuestions: Function,
    mode: 'quiz' | 'results',
    setMode: Function
}

function Countdown({ questions, setQuestions, mode, setMode }: CountdownProps) {

    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => {
            setMode('results');
        }, 7000)
    }, [questions]);

    useEffect(() => {
        const target = barRef.current;
        if(target && mode === 'quiz') {
            target.classList.remove('animate-progress');
            target.offsetWidth;
            target.classList.add('animate-progress');
        }
    }, [mode]);

    return (
        <div ref={barRef} className="w-full animate-progress bg-green-500 h-2">
        </div>
    )
}   

export default Countdown;