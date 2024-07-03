import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Home',
    icon: 'home-outline',
    link: '/pages/home',
    home: true,
  },

  {
    title: 'Recruitment',
    icon: 'briefcase-outline',
    link: '/pages/recruitment',
    children: [
      {
        title: 'Job Listings',
        link: '/pages/recruitment/job-listings',
      },
      {
        title: 'Applicants',
        link: '/pages/recruitment/applicants',
      },
      {
        title: 'My Actions',
        link: '/pages/recruitment/my-actions',
      },
    ],
  },
  {
    title: 'Auth',
    icon: 'lock-outline',
    link: '/auth',
    children: [
      {
        title: 'Register',
        link: '/auth/register',
      }
    ]
  },
  {
    title: 'Not found',
    icon: 'close-circle-outline',
    link: '/pages/whatever',
  }
];
