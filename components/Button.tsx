type ButtonProps = {
    bgColor: string,
    shadowColor: string,
    children: JSX.Element | Array<JSX.Element>,
    width: string | null
}

function Button({bgColor, shadowColor, children, width}: ButtonProps) {


    return (
        <button type="submit" className={`text-stone-50 py-2 px-4 shadow rounded-xl hover:shadow-none flex justify-center items-center gap-4 hover:translate-y-[5px] transition-all ${bgColor} ${shadowColor} ${width}`}>
            {children}
        </button>
    )
}

export default Button;