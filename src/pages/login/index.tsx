import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { Form, Icon, Input, Button, Checkbox } from 'antd'
import { RouteComponentProps } from 'react-router'
import { UserService } from 'src/services/user'
import { UserStore } from 'src/stores/modules/user'
import styl from './index.styl'
export interface LoginProps extends RouteComponentProps<{}> {
  form: any
  userService: UserService
  userStore: UserStore
}

@inject('userService', 'userStore')
@observer
class Login extends React.Component<LoginProps, {}> {
  public userService: UserService
  public userStore: UserStore

  constructor(props: any) {
    super(props)
    this.userService = props.userService
    this.userStore = props.userStore
  }

  public login = async (e: any): Promise<any> => {
    e.preventDefault()
    this.userStore.login({
      access_token:
        'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI5TXhvT212UGd0RCIsImV4cCI6MTU5OTI2MzYwNywidWlkIjoiMSIsInN5c19yb2xlIjoxfQ.o6wY8NL312-RpbOGQhdX8TXO_lRMkdarM7IJMv4u4XE',
      expires_in: 43200000,
      name: '市局长',
      org_code: '360100000000',
      org_level: 1,
      org_name: '市公安局',
      police_category: '刑侦',
      refresh_token: '9KQTWxcjM6J',
      sys_role: 1,
      token_type: 'Bearer',
      user_id: '1',
      username: 'shiju'
    })
    this.props.history.replace('/main/home')
  }

  public render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div className={styl['login-menu']}>
        <div className="back"></div>
        <div className="color"></div>
        <div className="login-box">
          <p className="con">欢迎登录</p>
          <Form className="form-con" onSubmit={this.login}>
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [
                  {
                    message: '用户名不能为空',
                    required: true
                  }
                ]
              })(
                <Input
                  prefix={<Icon type="user" className="placeholder-color" />}
                  placeholder="请输入用户名"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [
                  {
                    message: '密码不能为空',
                    required: true
                  }
                ]
              })(
                <Input
                  prefix={<Icon type="lock" className="placeholder-color" />}
                  type="password"
                  placeholder="请输入密码"
                />
              )}
            </Form.Item>
            <Form.Item>
              <div className="forgot-box">
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true
                })(<Checkbox>记住密码</Checkbox>)}
              </div>
              <div className="sub-box">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-btn-submit"
                >
                  登录
                </Button>
                {/* <Button type="primary" className="login-btn-submit">
                  PKI登录
                </Button> */}
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}

export default Form.create()(Login)
