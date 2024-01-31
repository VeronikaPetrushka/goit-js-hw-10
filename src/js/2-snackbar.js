import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', event => {
  event.preventDefault();

  const delay = Number(form.delay.value);
  const state = form.state.value;

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  promise
    .then(value => {
      console.log(`✅ Fulfilled promise in ${value}ms`);
      iziToast.success({
        title: 'Success',
        message: `✅ Fulfilled promise in ${value}ms`,
      });
    })
    .catch(value => {
      console.log(`❌ Rejected promise in ${value}ms`);
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${value}ms`,
      });
    });
});
