import React from 'react'

import BackIcon from 'src/assets/back.svg'
import home from 'src/assets/home.svg'
import { history } from 'src/routers'
const Back = () => {
  function goBack() {
    history.go(-1)
  }
  function goHome() {
    history.push('/main/home')
  }
  return (
    <div className="back-content">
      <div className="btn button-zh-back" onClick={goBack}>
        <img src={BackIcon} alt="" />
        <span>返回</span>
      </div>
      <img src={home} alt="" />
      <div className="route-list">
        <div onClick={goHome}>社区管理平台</div>
      </div>
    </div>
  )
}

export default Back
