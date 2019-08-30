import once, { bus } from '../../';

const usersFn = once('clear.users', () => {
  console.warn('使用 fetch 获取数据', new Date());

  return fetch('/api/v1/users').then(v => v.json());
});

const container = document.querySelector('#olList');

document.querySelector('#btnWhite')
  .addEventListener('click', () => container.innerHTML = null);

document.querySelector('#btnClear')
  .addEventListener('click', () => {
    console.error('清除 once 缓存数据', new Date());

    bus.emit('clear.users')
  });

document.querySelector('#btnSend')
  .addEventListener('click', () => usersFn().then(v => {
    console.info('接收 once 缓存的数据', new Date());

    const li = document.createElement('li')
      , pre = document.createElement('pre');

    pre.innerText = JSON.stringify(v, null, ' ');
    li.appendChild(pre);

    container.appendChild(li);
  }));
