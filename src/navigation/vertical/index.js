
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
    title: 'Second page',
    to: { name: 'second-page' },
    icon: { icon: 'tabler-file' },
    subject: 'Auth',
    action: 'read',
  },
  {
    title: 'System',
    icon: { icon: 'tabler-adjustments-cog' },
    children: [
      {
        title: 'School',
        to: { name: 'system-school' },
        icon: { icon: 'tabler-building-arch', size: SUB_ICON_SIZE },
        subject: 'Auth',
        action: 'read',
      },
      {
        title: 'Instruments',
        to: { name: 'system-instruments' },
        icon: { icon: 'tabler-building-arch', size: SUB_ICON_SIZE },
        subject: 'Auth',
        action: 'read',
      },
    ],
  },
]
