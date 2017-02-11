
function renderTypeTable(type) {
  const title = ({ entity, id }) => `<div class="panel-heading">${entity} - <b>${id}</b></div>`;
  const row = item => `<li class="list-group-item">${item}</li>`;
  const fields = `<ul class="list-group"> ${type.fields.map(row).join('\n')} </ul>`;
  const table = `${title(type)}${fields}`;

  document.querySelector('#js-type-panel').innerHTML = table;
}


export { renderTypeTable as default };
