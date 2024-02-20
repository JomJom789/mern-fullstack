import React, {useState} from 'react'

/* -------------------------------------------------------------------------- */
/*                                  Animation                                 */
/* -------------------------------------------------------------------------- */
import { 
  SlideFromLeft,
  SlideFromRight,
  // SlideFromTop,
  // SlideFromBottom,
  // FadeIn,
  // FadeOut,
} from './../../animations/customAnimate';

import {     
    animated,     
} from 'react-spring'

//* -------------------------------------------------------------------------- */
//*                                ProjectPhotos                               */
//* -------------------------------------------------------------------------- */
const ProjectPhotos = (props) => {
  
  // * Logs
  // console.log(props.imgs);
  // console.log(props.project);

  /* -------------------------------------------------------------------------- */
  /*                                 Main Image                                 */
  /* -------------------------------------------------------------------------- */
  let imgName;
  const [img, setImg] = useState();
 
  /* -------------------------------------------------------------------------- */
  /*                              Handle the Speed                              */
  /* -------------------------------------------------------------------------- */
  function speed(sp) {    
    
    // console.log(sp)
    let speed ;
    let animateSpeed = sp;
    let speedDefault = '00';

    if (animateSpeed === undefined) {
      animateSpeed = '100';
    } else {
      animateSpeed = animateSpeed.toString();
    }

    // console.log(speed);
    speed = animateSpeed + speedDefault;
    return speed;

  }

  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <section 
      id='project-photo'
      className={`
        w-full
        pt-10 
        pb-14 
        justify-evenly
        bg-white
        dark:bg-slate-900
      `}
    >
      <div 
        className={`
          lg:flex
          container
          mx-auto
          
        `}
      >
        {/* ---------------------------------- Left ---------------------------------- */}
        <div 
          className={`
            lg:w-1/2 
            md:pt-10 
            lg:mx-10'
            px-5
          `}

        >
          <animated.img
            style={ SlideFromLeft(500) }
            alt={ imgName }
            src={
              img 
              ? `${process.env.REACT_APP_BASE_URL}/${props.project === "app" ? `mobiles`: `websites`}/${img}`
              : `${process.env.REACT_APP_BASE_URL}/${props.project === "app" ? `mobiles`: `websites`}/${props.imgCover}`
            }
            className={`
              w-full 
              h-full 
              bg-gray-50 
              dark:bg-white 
              rounded-lg
            `}
          />
        </div>

        {/* ---------------------------------- Right --------------------------------- */}
        <div 
          className={`
            lg:w-1/2 
            lg:grid 
            lg:grid-cols-2 
            lg:mx-10'
          `}        
        >
          {
            props.imgs.map((item, index) => (
              <animated.img
                style={ SlideFromRight(speed(index)) }
                key={ index }
                alt={ props.title + index }
                src={`${process.env.REACT_APP_BASE_URL}/${props.project === "app" ? `mobiles`: `websites`}/${item}`}
                onClick={ () => setImg(item) }
                className={`
                  lg:w-72
                  lg:object-contain 
                  flex-col 
                  mt-10 
                `}
              />
            ))
          }

        </div>
      </div>
    </section>
  )
}

export default ProjectPhotos;
