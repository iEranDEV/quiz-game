type ButtonProps = {
    bgColor: string,
    shadowColor: string,
    children: JSX.Element | Array<JSX.Element>,
    width: string | null,
    onClick?: Function
}

function Button({bgColor, shadowColor, children, width, onClick}: ButtonProps) {


    return (
        <>
            {onClick === undefined ?
                <button type="submit" className={`text-stone-50 py-2 px-4 shadow rounded-xl hover:shadow-none flex justify-center items-center gap-4 hover:translate-y-[5px] transition-all ${bgColor} ${shadowColor} ${width}`}>
                    {children}
                </button>    
            :
                <button onClick={(e) => onClick(e)} type="submit" className={`text-stone-50 py-2 px-4 shadow rounded-xl hover:shadow-none flex justify-center items-center gap-4 hover:translate-y-[5px] transition-all ${bgColor} ${shadowColor} ${width}`}>
                    {children}
                </button>
            }
        </>
    )
}

export default Button;