import React from 'react'

/* ------------------------------- Material UI ------------------------------ */
import { 
  Badge,
  Avatar
} from '@mui/material';

import { styled } from '@mui/material/styles';

/* ------------------------------- StyledBadge ------------------------------ */
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

/* -------------------------------------------------------------------------- */
/*                               UserContactCard                              */
/* -------------------------------------------------------------------------- */
const ContactCard = ({name, email, active, type, profilePicture, handleFunction}) => {

  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div
      onClick={ handleFunction }
      className={`
        flex 
        px-4 
        py-3 
        bg-white
        dark:bg-slate-900
        hover:bg-gray-100 
        dark:hover:bg-gray-700
        cursor-pointer
      `}
    >
      <div
        className={`relative`}
      >

        { 
          active 
          ? <div>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ 
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                variant="dot"
              >
                <Avatar 
                  alt={name}
                  src={
                    type === "website"
                    ? `${process.env.REACT_APP_BASE_URL}/profile/${profilePicture}`
                    : profilePicture
                  }
                />
              </StyledBadge>
            </div>
          : <div>
              <Avatar 
                alt={name}
                src={
                  type === "website"
                  ? `${process.env.REACT_APP_BASE_URL}/profile/${profilePicture}`
                  : profilePicture
                }
              />
            </div>
        }

      </div>

      <div className="w-full pl-3">
        
        <div 
          className={`
            text-gray-500 
            text-sm 
            mb-1.5 
            dark:text-gray-400
          `}
        >

          <span 
            className={`
              font-semibold 
              text-gray-900 
              dark:text-white
            `}
          >
            { name }
          </span>

          <p 
            className={`
              text-xs
              text-slate-500
              truncate
            `}
          >
            { email }
          </p>
          
        </div>

      </div>
    </div>
  )
}

export default ContactCard;