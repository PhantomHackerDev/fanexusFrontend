import Vue from 'vue';

const timeFormat = {
  hourSystem: 12,
  minuteSystem: 10,
  am: 'a.m.',
  pm: 'p.m.'
};

const isDate = date => !!(date instanceof Date || typeof date === 'string');

export const isValidDate = date =>
  !!(date && isDate(date) && !isNaN(new Date(date)));

const formatAMPM = date => {
  const { hourSystem, minuteSystem, am, pm } = timeFormat;
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= hourSystem ? pm : am;
  hours = hours % hourSystem;
  hours = hours ? hours : hourSystem;
  minutes = minutes < minuteSystem ? `0${minutes}` : minutes;

  return `${hours}:${minutes} ${ampm}`;
};

Vue.filter('dateFormat', function(dateToFilter) {
  const date = new Date(dateToFilter);
  const time = formatAMPM(date);
  const year = date.getFullYear();
  const month = date.toLocaleString('default', {
    month: 'long',
    day: 'numeric'
  });

  return `${time}, ${month}, ${year}`;
});
