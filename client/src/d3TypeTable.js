const d3 = require('d3');

module.exports = function renderTypeTable (type) {
  const title = (type) => `<div class="panel-heading">${type.entity} - <b>${type.id}</b></div>`;
  const row = (item) => `<li class="list-group-item">${item}</li>`

  document.querySelector('#js-type-panel').innerHTML = title(type) +
    "<ul class='list-group'>" +
    type.fields.map(row).join("\n") +
    "</ul>";
}

