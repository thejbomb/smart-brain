import React from 'react';
import Tilt from 'react-tilt'
import './Logo.css'
import brain from './brain.png';

const Logo = () => {
    return (
        <nav className='ma4 mt0'>
            <Tilt className="Tilt " options={{ max : 55 }} style={{ height: 110, width: 110 }} >
                <div className="Tilt-inner pa3"> 
                    <img style={{paddingTop: '5px'}} alt='logo' src={brain}/>
                </div>
            </Tilt>
        </nav>
    )
}

export default Logo;