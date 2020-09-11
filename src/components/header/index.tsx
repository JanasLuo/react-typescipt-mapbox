/* hooks组件 */

import React from 'react'

import { observer } from 'mobx-react-lite' // 6.x or mobx-react-lite@1.4.0

import userStore from 'src/stores/modules/user'
import styles from './header.styl'
import logout from '../../assets/logout.svg'
import police from '../../assets/police.svg'

import { history } from 'src/routers'
export interface HeaderProps {
  sigout: () => Promise<any>
  location: any
}

const Header = (props: HeaderProps) => {
  /* 集成Mobx测试 */
  // const back = useCallback(() => userStore.sigout(), [])
  /* 集成react-router测试 */
  // const history = useHistory();
  // function sigoutByRouter () {
  //   history.push('/login');
  // }
  function sigoutByMobx() {
    userStore.sigout()
  }

  const gohome = () => {
    history.replace('/main/home')
  }
  return (
    <div className={`${'header-main'} ${styles.header}`}>
      <div className="left-box" onClick={gohome}></div>
      <div className="right-box">
        <img className="police" src={police} alt="" />
        <p className="name">{userStore.getAccount().name || '警官'}</p>
        <p className="dept">{userStore.getAccount().org_name || '公安局'}</p>
        <img className="out" onClick={sigoutByMobx} src={logout} alt="" />
      </div>
    </div>
  )
}

export default observer(Header)
