import getData from './dataFetcher';

function init() {
  document.querySelector('button').addEventListener('click', () => {
    getData(document.querySelector('input').value);
  });
}

window.onload = init;
