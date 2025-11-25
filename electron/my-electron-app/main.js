const { app, BrowserWindow } = require('electron')
// app 控制应用程序的事件生命周期
// BrowserWindow 创建和管理 app 的窗口

// 将页面加载到 BrowserWindow 实例中
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('index.html')
}

// 应用准备就绪时调用该函数，app 模块的 ready 事件触发后才能创建 BrowserWindow 实例。
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// 每个页面运行在单独进程中，这些进程称为渲染器。

app.on('window-all-closed', () => {
  console.log('window-all-closed')
  if (process.platform !== 'darwin') app.quit()
})