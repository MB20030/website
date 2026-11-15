(() => {
  const section = document.getElementById('crossword');
  if (!section) return;

  // Spaces are omitted in the grid. Clue numbers follow grid reading order.
  const entries = [
    { id: 1, number: 8, clue: 'Swiss party', answer: 'GLP', length: '3', row: 9, col: 2, direction: 'across' },
    { id: 2, number: 6, clue: 'Major', answer: 'ECONOMICS', length: '9', row: 4, col: 2, direction: 'across' },
    { id: 3, number: 7, clue: 'Favourite author', answer: 'SUTER', length: '5', row: 5, col: 0, direction: 'down' },
    { id: 4, number: 4, clue: 'Favourite Nobel Prize winner', answer: 'KAHNEMAN', length: '8', row: 1, col: 5, direction: 'down' },
    { id: 5, number: 7, clue: 'Winter sport', answer: 'SKI', length: '3', row: 5, col: 0, direction: 'across' },
    { id: 6, number: 2, clue: 'Football club', answer: 'SCFREIBURG', length: '2, 8', row: 0, col: 2, direction: 'down' },
    { id: 7, number: 1, clue: 'University', answer: 'HSG', length: '3', row: 0, col: 1, direction: 'across' },
    { id: 8, number: 3, clue: 'Secret hobby', answer: 'CROSSWORDS', length: '10', row: 0, col: 10, direction: 'down' },
    { id: 9, number: 5, clue: 'Leo', answer: 'ZODIACSIGN', length: '6, 4', row: 1, col: 8, direction: 'down' }
  ];
  const extraction = [
    { id: 2, index: 5 }, // M
    { id: 8, index: 2 }, // O
    { id: 6, index: 3 }, // R
    { id: 5, index: 2 }, // I
    { id: 3, index: 2 }, // T
    { id: 9, index: 0 }  // Z
  ];
  const grid = section.querySelector('.crossword-grid');
  const status = section.querySelector('.crossword-status');
  const cells = new Map();
  const clueButtons = new Map();
  let activeEntry;

  function cellKey(row, col) {
    return `${row},${col}`;
  }

  entries.forEach(entry => {
    entry.cells = [...entry.answer].map((letter, index) => {
      const row = entry.row + (entry.direction === 'down' ? index : 0);
      const col = entry.col + (entry.direction === 'across' ? index : 0);
      const key = cellKey(row, col);
      if (!cells.has(key)) cells.set(key, { row, col, letter, entries: [] });
      const cell = cells.get(key);
      cell.entries.push(entry);
      if (index === 0) cell.number = entry.number;
      return cell;
    });
  });

  const solutionCells = extraction.map(({ id, index }, position) => {
    const cell = entries.find(entry => entry.id === id).cells[index];
    cell.solutionNumber = position + 1;
    return cell;
  });

  const solutionSlots = solutionCells.map((cell, index) => {
    const slot = document.createElement('span');
    slot.className = 'crossword-solution-letter';
    const number = document.createElement('small');
    number.textContent = index + 1;
    number.setAttribute('aria-hidden', 'true');
    const letter = document.createElement('span');
    letter.textContent = '·';
    slot.append(number, letter);
    slot.setAttribute('aria-label', `Hidden name letter ${index + 1}, empty`);
    section.querySelector('.crossword-solution').append(slot);
    return { slot, letter };
  });

  function selectEntry(entry, cell, focus = true) {
    activeEntry = entry;
    cells.forEach(item => item.element.classList.toggle('is-active', entry.cells.includes(item)));
    clueButtons.forEach((button, id) => button.setAttribute('aria-pressed', String(id === entry.id)));
    if (focus) {
      const target = cell || entry.cells.find(item => !item.input.value) || entry.cells[0];
      target.input.focus({ preventScroll: true });
      target.input.select();
    }
  }

  function updateProgress() {
    let solved = 0;
    entries.forEach(entry => {
      const correct = entry.cells.every(cell => cell.input.value === cell.letter);
      clueButtons.get(entry.id).classList.toggle('is-solved', correct);
      if (correct) solved++;
    });
    solutionCells.forEach((cell, index) => {
      const value = cell.input.value;
      solutionSlots[index].letter.textContent = value || '·';
      solutionSlots[index].slot.setAttribute('aria-label', `Hidden name letter ${index + 1}, ${value || 'empty'}`);
    });
    section.classList.toggle('is-complete', solved === entries.length);
    status.textContent = solved === entries.length
      ? 'All nine clues solved. The hidden name is MORITZ!'
      : `${solved} of ${entries.length} clues solved`;
  }

  function clearFeedback(cell) {
    cell.element.classList.remove('is-incorrect', 'is-correct');
    cell.input.removeAttribute('aria-invalid');
  }

  function moveInEntry(cell, offset) {
    const index = activeEntry.cells.indexOf(cell);
    const next = activeEntry.cells[index + offset];
    if (next) next.input.focus({ preventScroll: true });
  }

  function enterLetters(cell, text) {
    const letters = text.toUpperCase().replace(/[^A-Z]/g, '');
    if (!letters) {
      cell.input.value = '';
      clearFeedback(cell);
      updateProgress();
      return;
    }
    const start = activeEntry.cells.indexOf(cell);
    const targets = activeEntry.cells.slice(start, start + letters.length);
    targets.forEach((target, index) => {
      target.input.value = letters[index];
      clearFeedback(target);
    });
    updateProgress();
    const next = activeEntry.cells[Math.min(start + letters.length, activeEntry.cells.length - 1)];
    next.input.focus({ preventScroll: true });
    next.input.select();
  }

  for (let row = 0; row < 11; row++) {
    for (let col = 0; col < 11; col++) {
      const cell = cells.get(cellKey(row, col));
      const element = document.createElement('div');
      element.className = 'crossword-cell';
      grid.append(element);
      if (!cell) {
        element.classList.add('is-block');
        element.setAttribute('aria-hidden', 'true');
        continue;
      }
      cell.element = element;
      if (cell.number) {
        const number = document.createElement('span');
        number.className = 'crossword-cell-number';
        number.textContent = cell.number;
        number.setAttribute('aria-hidden', 'true');
        element.append(number);
      }
      if (cell.solutionNumber) {
        element.classList.add('is-marked');
        const marker = document.createElement('span');
        marker.className = 'crossword-cell-marker';
        marker.textContent = cell.solutionNumber;
        marker.setAttribute('aria-hidden', 'true');
        element.append(marker);
      }
      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 1;
      input.autocomplete = 'off';
      input.autocapitalize = 'characters';
      input.spellcheck = false;
      input.setAttribute('inputmode', 'text');
      const labels = cell.entries.map(entry => `${entry.number} ${entry.direction}, ${entry.clue}, letter ${entry.cells.indexOf(cell) + 1}`);
      if (cell.solutionNumber) labels.push(`hidden name letter ${cell.solutionNumber}`);
      input.setAttribute('aria-label', labels.join('. '));
      cell.input = input;
      element.append(input);

      input.addEventListener('focus', () => {
        if (!cell.entries.includes(activeEntry)) selectEntry(cell.entries[0], cell, false);
        input.select();
      });
      input.addEventListener('pointerdown', () => {
        if (document.activeElement === input && cell.entries.length > 1) {
          selectEntry(cell.entries.find(entry => entry !== activeEntry), cell, false);
        }
      });
      input.addEventListener('input', event => {
        if (!event.isComposing) enterLetters(cell, input.value);
      });
      input.addEventListener('compositionend', () => enterLetters(cell, input.value));
      input.addEventListener('paste', event => {
        event.preventDefault();
        enterLetters(cell, event.clipboardData.getData('text'));
      });
      input.addEventListener('keydown', event => {
        if (event.key.startsWith('Arrow')) {
          const movement = {
            ArrowLeft: [0, -1, 'across'], ArrowRight: [0, 1, 'across'],
            ArrowUp: [-1, 0, 'down'], ArrowDown: [1, 0, 'down']
          }[event.key];
          if (!movement) return;
          event.preventDefault();
          const [dr, dc, direction] = movement;
          const entry = cell.entries.find(item => item.direction === direction);
          if (entry) selectEntry(entry, cell, false);
          const next = cells.get(cellKey(cell.row + dr, cell.col + dc));
          if (next) next.input.focus({ preventScroll: true });
        } else if (event.key === 'Backspace') {
          event.preventDefault();
          if (input.value) {
            input.value = '';
            clearFeedback(cell);
            updateProgress();
          } else {
            moveInEntry(cell, -1);
          }
        } else if (event.key === 'Enter') {
          event.preventDefault();
          const ordered = [...entries].sort((a, b) => a.number - b.number || a.direction.localeCompare(b.direction));
          selectEntry(ordered[(ordered.indexOf(activeEntry) + 1) % ordered.length]);
        }
      });
    }
  }

  [...entries].sort((a, b) => a.number - b.number).forEach(entry => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-controls', 'crossword-grid');
    button.setAttribute('aria-pressed', 'false');
    const number = document.createElement('span');
    number.className = 'crossword-clue-number';
    number.textContent = entry.number;
    const text = document.createElement('span');
    text.textContent = entry.clue;
    const length = document.createElement('small');
    length.textContent = `(${entry.length})`;
    button.append(number, text, length);
    button.addEventListener('click', () => selectEntry(entry));
    clueButtons.set(entry.id, button);
    item.append(button);
    section.querySelector(`#crossword-${entry.direction}`).append(item);
  });

  section.querySelector('#crossword-check').addEventListener('click', () => {
    let incorrect = 0;
    let filled = 0;
    cells.forEach(cell => {
      const hasValue = Boolean(cell.input.value);
      const wrong = hasValue && cell.input.value !== cell.letter;
      cell.element.classList.toggle('is-incorrect', wrong);
      cell.element.classList.toggle('is-correct', hasValue && !wrong);
      if (wrong) cell.input.setAttribute('aria-invalid', 'true');
      else cell.input.removeAttribute('aria-invalid');
      if (wrong) incorrect++;
      if (hasValue) filled++;
    });
    updateProgress();
    if (incorrect) status.textContent = `${incorrect} ${incorrect === 1 ? 'letter needs' : 'letters need'} another look. Incorrect letters are marked in red.`;
    else if (filled === 0) status.textContent = 'Select a clue and enter a few letters to begin.';
    else if (filled < cells.size) status.textContent = 'Every letter entered is correct so far. Keep going!';
  });

  section.querySelector('#crossword-reveal').addEventListener('click', () => {
    cells.forEach(cell => {
      cell.input.value = cell.letter;
      clearFeedback(cell);
    });
    updateProgress();
    status.textContent = 'Full solution revealed. The hidden name is MORITZ.';
  });

  section.querySelector('#crossword-reset').addEventListener('click', () => {
    cells.forEach(cell => {
      cell.input.value = '';
      clearFeedback(cell);
    });
    updateProgress();
    selectEntry(entries.find(entry => entry.number === 1));
    status.textContent = 'Crossword cleared. Ready for another try.';
  });

  section.querySelector('.crossword-game').hidden = false;
  selectEntry(entries.find(entry => entry.number === 1), null, false);
  updateProgress();
})();
