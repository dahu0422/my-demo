import './index.css';
import '@/styles/index.css'
import _ from 'lodash';

import logo from '@assets/image.png';

console.log(_);


const img = new Image()
img.src = logo
const header = document.querySelector('.header')
header.appendChild(img)


const arrowFunc = () => {
  console.log('Arrow function')
}

arrowFunc();

class MyClass {
  constructor() {
    this.name = 'MyClass';
    console.log(`${this.name}constructor`);
  }
}

const myClassInstance = new MyClass();

const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Promise resolved');
  }, 1000);
})

async function asyncFunc() {
  const result = await promise;
  console.log(result);
}
asyncFunc();