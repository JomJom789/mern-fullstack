import { AiOutlineMobile } from 'react-icons/ai';
import { BsGlobe } from 'react-icons/bs';
import { IoMdContacts } from 'react-icons/io';
import { AiOutlineDashboard } from 'react-icons/ai';
// import {  } from 'react-icons/fc';
// import {  } from 'react-icons/fi';
// import {  } from 'react-icons/bi';
// import {  } from 'react-icons/ri';
// import {  } from 'react-icons/md';
// import {  } from 'react-icons/hi';
// import {  } from 'react-icons/ti';
// import {  } from 'react-icons/gi';
// import {  } from 'react-icons/gr';

// Font Awesome
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBars } from '@fortawesome/free-solid-svg-icons';


/* -------------------------------------------------------------------------- */
/*                                    Links                                   */
/* -------------------------------------------------------------------------- */
export const links = [    
    {
      title: 'Pages',
      links: [
        {
          name: 'dashboard',
          icon: <AiOutlineDashboard />,
        },
        {
          name: 'websites',
          icon: <BsGlobe />,
        },
        {
          name: 'mobiles',
          icon: <AiOutlineMobile />,
          },
        {
          name: 'users',
          icon: <IoMdContacts />,
        },        
      ],
    },
        
  ];