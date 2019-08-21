import './sass/index.scss';
import './less/index.less';
import '@/assets/fonts/iconfont.css'


function component() {
    var element = document.createElement('div');
    var app = document.getElementById('app')

    // Lodash（目前通过一个 script 脚本引入）对于执行这一行是必需的
    // element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    app.innerHTML = `
      <div class="main-content" id="main-content">
          <div class="platform-welcome platform-common right-content-common">
              <div class="welcome-content  clearfix"><img class="banner" src=${require('@/assets/images/console-platform-welcome.png')} alt="">
                  <div class="banner-content">
                      <div class="center">
                          <p class="title">Hi，：）</p>
                          <p class="content">欢迎进入产品共享服务平台</p>
                          <i class="iconfont icon-chenggong"></i><i class="iconfont icon-danxuankuang1"></i><i class="iconfont icon-xingxing"></i>
                      </div>
                  </div>
              </div>
          </div>

          </br>
          <h4>样式背景测试</h4>
          <p class="img-bg"></p>

          </br>
          <h4>视频测试</h4>
          <video controls="" autoplay="" name="media"><source src=${require('@/assets/videos/banner4-1.mp4')} type="video/mp4"></video>

          </br>
          <h4>svg文件测试</h4>
          <embed src=${require('@/assets/images/gen.svg')} type="image/svg+xml"/>
      </div>
    `;

    return element;
}

document.body.appendChild(component());