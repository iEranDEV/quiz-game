import { HiXMark } from "react-icons/hi2";

function Modal({ toggleMenu, children }: {toggleMenu: Function, children: JSX.Element} ) {

    const handleClick = () => {
        toggleMenu()
    }

    return (
        <div onClick={handleClick} className="fixed top-0 left-0 w-screen h-screen z-50 bg-primary-400/50 backdrop-blur-[2px] flex justify-center items-center">
            <div onClick={(e) => e.stopPropagation()} className="bg-primary-200 text-primary-100 p-4 rounded-xl w-96 flex flex-col justify-center items-center gap-4">
                <div className="w-full flex justify-end items-center">
                    <HiXMark onClick={handleClick} className='w-8 h-8 cursor-pointer'></HiXMark>
                </div>
                {children}
            </div>
        </div>
    )
}

export default Modal;