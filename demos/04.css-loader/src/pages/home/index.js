import './index.css';
import '@/styles/index.css'

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