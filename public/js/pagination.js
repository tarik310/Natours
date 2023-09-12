/* eslint-disable*/
const { totalPagesN } = document.querySelector('.pagination_container').dataset;

if (totalPagesN === '1') {
  const paginationContainer = document.querySelector('.pagination_container');
  paginationContainer.parentNode.removeChild(paginationContainer);
} else {
  const url = window.location.search;
  const queryParams = new URLSearchParams(url);

  const params = {};
  for (const [key, value] of queryParams) {
    params[key] = value;
  }

  const element = document.querySelector('.pagination ul');
  let totalPages = totalPagesN;
  let page = params.page * 1 || 1;

  element.innerHTML = createPagination(totalPages, page);

  function createPagination(totalPages, page) {
    const existingParams = new URLSearchParams(window.location.search);
    let liTag = '';
    let active;
    let beforePage = Math.max(page - 1, 1);
    let afterPage = Math.min(page + 1, totalPages);
    existingParams.delete('page');

    if (page > 1) {
      existingParams.set('page', page - 1);
      liTag += `<li class="prev" onclick="createPagination(totalPages, ${
        page - 1
      })"><a href='?${existingParams.toString()}'><img style='width:30px' src='.././img/left-arrow.svg' /></a></li>`;
      existingParams.delete('page');
    }

    if (page > 2) {
      existingParams.set('page', 1);
      liTag += `<li class="first numb" onclick="createPagination(totalPages, 1)"><a href='?${existingParams.toString()}'>${1}</a></li>`;
      existingParams.delete('page');

      if (page > 3) {
        liTag += `<li class="dots"><span>...</span></li>`;
      }
    }

    for (let plength = beforePage; plength <= afterPage; plength++) {
      if (plength > totalPages || plength <= 0) {
        continue;
      }
      if (page === plength) {
        active = 'active';
      } else {
        active = '';
      }
      existingParams.set('page', plength);
      liTag += `<li class="numb ${active}" onclick="createPagination(totalPages, ${plength})"><a href='?${existingParams.toString()}'>${plength}</a></li>`;
      existingParams.delete('page');
    }

    if (page < totalPages - 1) {
      if (page < totalPages - 2) {
        existingParams.set('page', totalPages);
        liTag += `<li class="dots"><span>...</span></li>`;
        existingParams.delete('page');
      }
      existingParams.set('page', totalPages);
      liTag += `<li class="last numb" onclick="createPagination(totalPages, ${totalPages})"><a href='?${existingParams.toString()}'>${totalPages}</a></li>`;
      existingParams.delete('page');
    }

    if (page < totalPages) {
      existingParams.set('page', page + 1);
      liTag += `<li class="next" onclick="createPagination(totalPages, ${
        page + 1
      })"><a href='?${existingParams.toString()}'><img style='width:30px' src='.././img/right-arrow.svg' /></a></li>`;
    }

    element.innerHTML = liTag;
    return liTag;
  }
}
