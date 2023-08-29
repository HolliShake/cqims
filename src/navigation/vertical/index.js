
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
    title: 'Finance',
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
    title: 'Registrar',
    icon: { icon: 'tabler-user' },
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
        title: 'Instruments',
        to: { name: 'system-instruments' },
        icon: { icon: 'tabler-building-arch', size: SUB_ICON_SIZE },
        subject: 'Auth',
        action: 'read',
      },
    ],
  },
]
