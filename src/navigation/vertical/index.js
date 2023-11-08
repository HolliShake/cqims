
const SUB_ICON_SIZE = 16

export default [
  {
    title: 'Home',
    to: { name: 'index' },
    icon: { icon: 'tabler-smart-home' },
    subject: 'Auth',
    action: 'read',
  },
  {
    title: 'Accounting',
    icon: { icon: 'tabler-cash' },
    children: [
      {
        title: 'Fees',
        to: { name: 'finance-fees' },
        icon: { icon: 'tabler-receipt-2', size: SUB_ICON_SIZE },
        subject: 'Auth',
        action: 'read',
      },
    ],
  },
  {
    title: 'Courses',
    icon: { icon: 'tabler-school' },
    children: [
      {
        title: 'Course',
        to: { name: 'courses-courses' },
        icon: { icon: 'mdi-list-box-outline', size: SUB_ICON_SIZE },
        subject: 'Auth',
        action: 'read',
      },
      {
        title: 'Course Catalogue',
        to: { name: 'courses-course-catalogue' },
        icon: { icon: 'mdi-list-status', size: SUB_ICON_SIZE },
        subject: 'Auth',
        action: 'read',
      },
    ],
  },
  {
    title: 'Students',
    icon: { icon: 'tabler-users' },
    children: [
      {
        title: 'Students',
        to: { name: 'students-students' },
        icon: { icon: 'tabler-user', size: SUB_ICON_SIZE },
        subject: 'Auth',
        action: 'read',
      },

      // {
      //   title: 'Admissions',
      //   to: { name: 'students-admissions' },
      //   icon: { icon: 'tabler-user-plus', size: SUB_ICON_SIZE },
      //   subject: 'Auth',
      //   action: 'read',
      // },
      // {
      //   title: 'Enrollments',
      //   to: { name: 'students-enrollments' },
      //   icon: { icon: 'tabler-user-check', size: SUB_ICON_SIZE },
      //   subject: 'Auth',
      //   action: 'read',
      // },
    ],
  },
  {
    title: 'System',
    icon: { icon: 'tabler-adjustments-cog' },
    children: [
      {
        title: 'Schools',
        to: { name: 'system-schools' },
        icon: { icon: 'tabler-building-arch', size: SUB_ICON_SIZE },
        subject: 'Auth',
        action: 'read',
      },
      {
        title: 'Configuration',
        to: { name: 'system-configurations' },
        icon: { icon: 'tabler-tool', size: SUB_ICON_SIZE },
        subject: 'Auth',
        action: 'read',
      },
    ],
  },
]
