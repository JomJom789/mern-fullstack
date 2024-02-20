// Design
import sdFigma from './../img/icons/design/sd-figma.png';
import sdHTML from './../img/icons/design/sd-html.png';
import sdCSS from './../img/icons/design/sd-css.png';
import sdTailwind from './../img/icons/design/sd-tailwind.png';
import sdMaterialUI from './../img/icons/design/sd-material-ui.png';

// Frontend
import sfReact from './../img/icons/frontend/sf-react.png';
import sfRedux from './../img/icons/frontend/sf-redux.png';

// Backend
import sbFirebase from './../img/icons/backend/sb-firebase.png';
import sbDjango from './../img/icons/backend/sb-django.png';
import sbExpress from './../img/icons/backend/sb-express-js.png';

// Database
import sdbSql from './../img/icons/database/sdb-sql.png';
import sdbMysql from './../img/icons/database/sdb-mysql.png';
import sdbPostgresql from './../img/icons/database/sdb-postgresql.png';
import sbMongo from './../img/icons/database/sdb-mongodb.png';

// Flutter
import smFlutter from './../img/icons/mobile-app/sm-flutter.png';
import smBloc from './../img/icons/mobile-app/sm-bloc.png';

export const design = [
    {
        id: 1,
        bgColor: 'md:bg-fuchsia-300',
        textColor: 'text-fuchsia-500',
        img: sdFigma,
        alt: 'sdFigma',
        title: 'Figma',
        percent: 34,
        progress: 'w-1/3 bg-gradient-to-r from-fuchsia-200 to-fuchsia-500'
    },
    {
        id: 2,
        bgColor: 'md:bg-orange-300',
        textColor: 'text-orange-500',
        img: sdHTML ,
        alt: 'sdHTML',
        title: 'HTML',
        percent: 90,
        progress: 'w-11/12 bg-gradient-to-r from-orange-200 to-orange-500'
    },
    {
        id: 3,
        bgColor: 'md:bg-indigo-300',
        textColor: 'text-indigo-500',
        img: sdCSS ,
        alt: 'sdCSS',
        title: 'CSS',
        percent: 55,
        progress: 'w-6/12 bg-gradient-to-r from-indigo-200 to-indigo-500'
    },
    {
        id: 4,
        bgColor: 'md:bg-cyan-300',
        textColor: 'text-cyan-500',
        img: sdTailwind,
        alt: 'sdTailwind',
        title: 'Tailwind',
        percent: 55,
        progress: 'w-6/12 bg-gradient-to-r from-cyan-200 to-cyan-500'
    },
    {
        id: 5,
        bgColor: 'md:bg-blue-300',
        textColor: 'text-blue-500',
        img: sdMaterialUI,
        alt: 'sdMaterialUI',
        title: 'Material UI',
        percent: 40,
        progress: 'w-5/12 bg-gradient-to-r from-blue-200 to-blue-500'
    },
];

export const frontend = [
    {
        id: 1,
        bgColor: 'md:bg-blue-300',
        textColor: 'text-blue-500',
        img: sfReact,
        alt: 'sfReact',
        title: 'React JS',
        percent: 69,
        progress: 'w-8/12 bg-gradient-to-r from-blue-200 to-blue-500'
    },
    {
        id: 2,
        bgColor: 'md:bg-purple-300',
        textColor: 'text-purple-500',
        img: sfRedux ,
        alt: 'sfRedux',
        title: 'Redux or Redux Toolkit Query',
        percent: 60,
        progress: 'w-7/12 bg-gradient-to-r from-purple-200 to-purple-500'
    }   
];

export const backend = [
    {
        id: 1,
        bgColor: 'md:bg-red-300',
        textColor: 'text-red-500',
        img: sbFirebase,
        alt: 'sbFirebase',
        title: 'Firebase',
        percent: 65,
        progress: 'w-7/12 bg-gradient-to-r from-red-200 to-red-500'
    },
    {
        id: 2,
        bgColor: 'md:bg-green-300',
        textColor: 'text-green-500',
        img: sbDjango ,
        alt: 'sbDjango',
        title: 'Django',
        percent: 50,
        progress: 'w-6/12 bg-gradient-to-r from-green-200 to-green-500'
    },
		{
			id: 3,
			bgColor: 'md:bg-gray-300',
			textColor: 'text-gray-500',
			img: sbExpress ,
			alt: 'sbExpress',
			title: 'Express.js',
			percent: 50,
			progress: 'w-6/12 bg-gradient-to-r from-gray-200 to-gray-500'
	}
];

export const database = [
    {
        id: 1,
        bgColor: 'md:bg-teal-300',
        textColor: 'text-teal-500',
        img: sdbSql,
        alt: 'sdbSql',
        title: 'SQL',
        percent: 70,
        progress: 'w-8/12 bg-gradient-to-r from-teal-200 to-teal-500'
    },
    {
        id: 2,
        bgColor: 'md:bg-cyan-300',
        textColor: 'text-cyan-500',
        img: sdbMysql ,
        alt: 'sdbMySQL',
        title: 'MySQL',
        percent: 80,
        progress: 'w-10/12 bg-gradient-to-r from-cyan-200 to-cyan-500'
    },  
    {
        id: 3,
        bgColor: 'md:bg-sky-300',
        textColor: 'text-sky-500',
        img: sdbPostgresql ,
        alt: 'sdbPostgreSQL',
        title: 'PostgreSQL',
        percent: 40,
        progress: 'w-5/12 bg-gradient-to-r from-sky-200 to-sky-500'
    },
    {
        id: 4,
        bgColor: 'md:bg-green-300',
        textColor: 'text-green-500',
        img: sbMongo ,
        alt: 'sbMongo',
        title: 'MongoDB',
        percent: 50,
        progress: 'w-6/12 bg-gradient-to-r from-green-200 to-green-500'
    },
];

export const app = [
    {
        id: 1,
        bgColor: 'md:bg-amber-300',
        textColor: 'text-amber-500',
        img: smFlutter,
        alt: 'smFlutter',
        title: 'Flutter',
        percent: 55,
        progress: 'w-6/12 bg-gradient-to-r from-amber-200 to-amber-500'
    },
    {
        id: 2,
        bgColor: 'md:bg-emerald-300',
        textColor: 'text-emerald-500',
        img: smBloc ,
        alt: 'smBloc',
        title: 'Bloc',
        percent: 40,
        progress: 'w-5/12 bg-gradient-to-r from-emerald-200 to-emerald-500'
    }   
];