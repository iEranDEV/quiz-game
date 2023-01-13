import { useState } from "react";

type SelectListProps = {
    onChange: Function,
    values: Array<{ name: string, value: string }>,
}

function SelectList({ onChange, values } : SelectListProps) {
    const [menu, setMenu] = useState(false);
    const [current, setCurrent] = useState(values[0].value);

    const handleValueChange = (val: string) => {
        onChange(val);
        setCurrent(val);
        setMenu(false);
    }   

    return (
        <div className='relative w-full'>
            <select value={current} onChange={() => {}} onClick={() => setMenu(!menu)} onMouseDown={(e) => e.preventDefault()} className="cursor-pointer w-full appearance-none rounded-xl p-2 text-stone-50 bg-primary-200 border border-primary-300">
                {values.map((item) => {
                    return (
                        <option key={item.value} value={item.value}>{item.name}</option>
                    )
                })}
            </select>

            <div className={`w-full absolute transition-all flex flex-col py-2 overflow-auto bg-primary-300 rounded-xl ${menu ? 'h-40': 'h-0 py-0'}`}>
                <div className={`w-full h-full flex flex-col transition-none ${menu ? 'inline-block' : 'hidden'}`}>
                    {values.map((item) => {
                        return (
                            <p onClick={() => handleValueChange(item.value)} key={item.value} className={`w-full cursor-pointer p-1 ${current === item.value && 'bg-primary-400'}`}>{item.name}</p>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default SelectList;