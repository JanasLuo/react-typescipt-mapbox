export default class Bean {
  public static COOP_STATUS_MAP = {
    0: '发起',
    1: '已接收',
    2: '已反馈',
    3: '已完成'
  }
  public static CENTER = [116.023483, 28.647418]
  public static ZOOM = 9.285782070032383

  public static MAP_THEME = {
    light: '/gaodemap',
    darkblue: '/darkblue'
  }
  public static COLOR_RANGE = [
    'rgb(89, 211, 220)',
    'rgb(1, 152, 189)',
    'rgb(225, 232, 52)',
    'rgb(239, 138, 28)',
    'rgb(255, 0, 0)'
  ]
}
