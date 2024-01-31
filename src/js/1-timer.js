import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const input = document.createElement('input');
input.type = 'text';
input.id = 'datetime-picker';
input.placeholder = 'Select a date';
const startBtn = document.createElement('button');
startBtn.id = 'start-btn';
startBtn.textContent = 'Start';
startBtn.disabled = true;
const timer = document.createElement('div');
timer.id = 'timer';
const days = document.createElement('span');
days.id = 'days';
days.textContent = '00';
const hours = document.createElement('span');
hours.id = 'hours';
hours.textContent = '00';
const minutes = document.createElement('span');
minutes.id = 'minutes';
minutes.textContent = '00';
const seconds = document.createElement('span');
seconds.id = 'seconds';
seconds.textContent = '00';
timer.appendChild(days);
timer.appendChild(document.createTextNode(':'));
timer.appendChild(hours);
timer.appendChild(document.createTextNode(':'));
timer.appendChild(minutes);
timer.appendChild(document.createTextNode(':'));
timer.appendChild(seconds);
document.body.appendChild(input);
document.body.appendChild(startBtn);
document.body.appendChild(timer);
const flatpickr = document.querySelector('#datetime-picker');
const startBtnEl = document.querySelector('#start-btn');
const daysEl = document.querySelector('#days');
const hoursEl = document.querySelector('#hours');
const minutesEl = document.querySelector('#minutes');
const secondsEl = document.querySelector('#seconds');

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate < new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      document.getElementById('start-btn').disabled = true;
    } else {
      document.getElementById('start-btn').disabled = false;
    }
  },
};

flatpickr('#datetime-picker', options);

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function updateTimer(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);
  document.getElementById('days').textContent = addLeadingZero(days);
  document.getElementById('hours').textContent = addLeadingZero(hours);
  document.getElementById('minutes').textContent = addLeadingZero(minutes);
  document.getElementById('seconds').textContent = addLeadingZero(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

document.getElementById('start-btn').addEventListener('click', () => {
  const selectedDate = flatpickr('#datetime-picker').selectedDates[0];
  const currentDate = new Date();
  const ms = selectedDate - currentDate;
  const intervalId = setInterval(() => {
    updateTimer(ms);
    if (ms <= 0) {
      clearInterval(intervalId);
      iziToast.success({
        title: 'Success',
        message: 'Countdown finished',
      });
    }
  }, 1000);
});
