import { 
    // useTransition,     
    useSpring,
} from 'react-spring'

export const FadeIn = (speed) => useSpring({
    from: {
      opacity: 0,      
    },
    to: {
      opacity: 1,            
    },
    config:{ duration: speed }
})

export const FadeOut = (speed) => useSpring({
    from: {
      opacity: 1,      
    },
    to: {
      opacity: 0,      
    },
    config:{ duration: speed }
})

export const SlideFromLeft = (speed) => useSpring({
    from: {
        opacity: 0,
        x: -100,
    },
    to: {
        opacity: 1,
        x:0,      
    },
    config:{ duration: speed }
})

export const SlideFromRight = (speed) => useSpring({
    from: {
        opacity: 0,
        x: 100,
    },
    to: {
        opacity: 1,
        x:0,      
    },
    config:{ duration: speed }
})

export const SlideFromBottom = (speed) => useSpring({
    from: {
        opacity: 0,
        y: 100,
    },
    to: {
        opacity: 1,
        y:0,      
    },
    config:{ duration: speed }
})

export const SlideFromTop = (speed) => useSpring({
    from: {
        opacity: 0,
        y: -100,
    },
    to: {
        opacity: 1,
        y:0,      
    },
    config:{ duration: speed }
})