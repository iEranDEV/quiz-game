import { useRef, useState } from "react";

type SelectListProps = {
    onChange: Function,
    values: Array<{ name: string, value: string }>,
}

function SelectList({ onChange, values } : SelectListProps) {
    const [menu, setMenu] = useState(false);
    const [current, setCurrent] = useState(values[0].value);

    const selector = useRef<HTMLSelectElement>(null);

    const handleValueChange = (val: string) => {
        onChange(val);
        setCurrent(val);
        setMenu(false);
    }

    return (
        <div className='relative w-full'>
            <select ref={selector} value={current} onChange={() => {}} onClick={() => setMenu(!menu)} onMouseDown={(e) => e.preventDefault()} className="cursor-pointer w-full appearance-none rounded-xl p-2 text-stone-50 bg-primary-200 border border-primary-300">
                {values.map((item) => {
                    return (
                        <option key={item.value} value={item.value}>{item.name}</option>
                    )
                })}
            </select>

            <div onClick={(e) => setMenu(false)} className={`w-screen h-screen fixed top-0 left-0 z-50 ${!menu && 'hidden'}`}>
                <div onClick={(e) => e.stopPropagation()} 
                    className={`absolute transition-all delay-500 flex flex-col py-2 overflow-auto bg-primary-300 text-primary-100 rounded-xl ${menu ? 'h-60': 'h-0 py-0'}`}
                    style={{top: selector.current?.getBoundingClientRect().top, left: selector.current?.getBoundingClientRect().left, width: selector.current?.clientWidth}}>
                    <div className={`w-full h-full flex flex-col transition-none ${menu ? 'inline-block' : 'hidden'}`}>
                        {values.map((item) => {
                            return (
                                <p onClick={() => handleValueChange(item.value)} key={item.value} className={`w-full hover:bg-primary-400/50 cursor-pointer p-2 ${current === item.value && 'bg-primary-400'}`}>{item.name}</p>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectList;