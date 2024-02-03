import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
};

const timerElements = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

const startButton = document.querySelector('[data-start]');
let countdownInterval;

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function updateTimer(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);
  timerElements.days.textContent = addLeadingZero(days);
  timerElements.hours.textContent = addLeadingZero(hours);
  timerElements.minutes.textContent = addLeadingZero(minutes);
  timerElements.seconds.textContent = addLeadingZero(seconds);
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

function startCountdown(selectedDate) {
  const currentDate = new Date();
  if (selectedDate < currentDate) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
    });
    return;
  }
  clearInterval(countdownInterval);
  let ms = selectedDate - currentDate;
  countdownInterval = setInterval(() => {
    if (ms <= 0) {
      clearInterval(countdownInterval);
      iziToast.error({
        title: 'Error',
        message: 'Countdown finished',
      });
      flatpickrInstance.setDate(new Date());
      flatpickrInstance.close();
      return;
    }
    updateTimer(ms);
    ms -= 1000;
  }, 1000);
  document.querySelector('#datetime-picker').value = selectedDate
    .toISOString()
    .slice(0, 16);
}

const flatpickrInstance = flatpickr('#datetime-picker', options);

flatpickrInstance.config.onClose = selectedDates => {
  const selectedDate = selectedDates[0];
  if (selectedDate < new Date()) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
    });
    document.querySelector('[data-start]').disabled = true;
  } else {
    document.querySelector('[data-start]').disabled = false;
    flatpickrInstance.setDate(selectedDate);
    startCountdown(selectedDate);
  }
};

startButton.addEventListener('click', () => {
  const selectedDate = flatpickrInstance.selectedDates[0];
  startCountdown(selectedDate);
});
