import { useState } from 'react';
import { HiXMark, HiBars3 } from 'react-icons/hi2'

function Layout({ children }: {children: JSX.Element | Array<JSX.Element>}) {
    const [menu, setMenu] = useState(false);

    return (
        <div className="w-screen h-screen bg-primary-200 flex flex-col md:flex-row text-primary-100">
            <div className="flex w-full md:w-auto items-center p-4 md:p-0">
                <HiBars3 onClick={() => setMenu(!menu)} className='w-8 h-8 md:hidden'></HiBars3>

                <div className={`fixed w-screen md:w-60 h-screen top-0 left-0 flex flex-col bg-primary-300 justify-center md:justify-around items-center transition-all md:static ${menu ? 'left-0' : '-left-full'}`}>
                    <div className='flex w-full items-center p-4 absolute top-0 left-0'>
                        <HiXMark onClick={() => setMenu(!menu)} className='w-8 h-8 md:hidden'></HiXMark>
                    </div>

                    <p style={{fontFamily: 'Bouncy'}} className='text-3xl hidden md:block'>LOGO</p>

                    <div className='flex flex-col gap-2  w-full justify-center items-center'>
                        <p>Test 1</p>
                        <p>Test 2</p>
                        <p>Test 3</p>
                        <p>Test 4</p>
                        <p>Test 5</p>
                    </div>
                </div>
            </div>
            <div className="w-full text-stone-50">
                {children}
            </div>
        </div>
    )
}

export default Layout;