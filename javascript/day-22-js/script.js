/* ==========================================
   CHAIN DATA — what each prototype has
   ========================================== */
const chainData = {
  array: [
    {
      title: '[ ] Array instance',
      type: 'instance accent',
      methods: ['[0]', '[1]', '[2]', 'length']
    },
    {
      title: 'Array.prototype',
      type: 'proto yellow',
      methods: ['map()', 'filter()', 'forEach()', 'push()', 'pop()',
                'find()', 'reduce()', 'includes()', 'sort()', 'slice()']
    },
    {
      title: 'Object.prototype',
      type: 'object green',
      methods: ['toString()', 'hasOwnProperty()', 'valueOf()', 'constructor']
    },
    {
      title: 'null — end of chain',
      type: 'null muted',
      methods: []
    }
  ],

  string: [
    {
      title: '" " String instance',
      type: 'instance accent',
      methods: ['[0]', '[1]', 'length']
    },
    {
      title: 'String.prototype',
      type: 'proto yellow',
      methods: ['toUpperCase()', 'toLowerCase()', 'trim()', 'split()',
                'includes()', 'replace()', 'slice()', 'indexOf()', 'padStart()']
    },
    {
      title: 'Object.prototype',
      type: 'object green',
      methods: ['toString()', 'hasOwnProperty()', 'valueOf()']
    },
    {
      title: 'null — end of chain',
      type: 'null muted',
      methods: []
    }
  ],

  object: [
    {
      title: '{ } Object instance',
      type: 'instance accent',
      methods: ['your own properties']
    },
    {
      title: 'Object.prototype',
      type: 'object green',
      methods: ['toString()', 'hasOwnProperty()', 'valueOf()',
                'constructor', 'isPrototypeOf()']
    },
    {
      title: 'null — end of chain',
      type: 'null muted',
      methods: []
    }
  ],

  function: [
    {
      title: 'ƒ Function instance',
      type: 'instance accent',
      methods: ['your function code', 'name', 'length']
    },
    {
      title: 'Function.prototype',
      type: 'proto yellow',
      methods: ['call()', 'apply()', 'bind()', 'toString()']
    },
    {
      title: 'Object.prototype',
      type: 'object green',
      methods: ['toString()', 'hasOwnProperty()', 'valueOf()']
    },
    {
      title: 'null — end of chain',
      type: 'null muted',
      methods: []
    }
  ],

  map: [
    {
      title: 'Map instance',
      type: 'instance accent',
      methods: ['your key-value pairs']
    },
    {
      title: 'Map.prototype',
      type: 'proto yellow',
      methods: ['get()', 'set()', 'has()', 'delete()', 'clear()',
                'forEach()', 'keys()', 'values()', 'entries()', 'size']
    },
    {
      title: 'Object.prototype',
      type: 'object green',
      methods: ['toString()', 'hasOwnProperty()', 'valueOf()']
    },
    {
      title: 'null — end of chain',
      type: 'null muted',
      methods: []
    }
  ],

  set: [
    {
      title: 'Set instance',
      type: 'instance accent',
      methods: ['your unique values']
    },
    {
      title: 'Set.prototype',
      type: 'proto yellow',
      methods: ['add()', 'has()', 'delete()', 'clear()',
                'forEach()', 'values()', 'size']
    },
    {
      title: 'Object.prototype',
      type: 'object green',
      methods: ['toString()', 'hasOwnProperty()', 'valueOf()']
    },
    {
      title: 'null — end of chain',
      type: 'null muted',
      methods: []
    }
  ]
};

/* ==========================================
   RENDER CHAIN
   ========================================== */
function renderChain(type) {
  const display = document.getElementById('chain-display');
  display.innerHTML = '';

  const nodes = chainData[type];

  nodes.forEach((node, index) => {
    // arrow between nodes
    if (index > 0) {
      const arrow = document.createElement('div');
      arrow.className = 'chain-arrow';
      arrow.textContent = '↓ __proto__';
      display.appendChild(arrow);
    }

    const nodeEl = document.createElement('div');
    nodeEl.className = `chain-node`;

    const [, titleClass] = node.type.split(' ');

    nodeEl.innerHTML = `
      <div class="node-title ${titleClass}">${node.title}</div>
      <div class="node-methods">
        ${node.methods.map(m => `<span class="method-tag">${m}</span>`).join('')}
      </div>
    `;

    display.appendChild(nodeEl);
  });
}

// type buttons
document.querySelectorAll('.type-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderChain(btn.dataset.type);
  });
});

renderChain('array'); // default

/* ==========================================
   PROPERTY LOOKUP DEMO
   ========================================== */
const lookupMap = {
  // Array own
  'length':  { found: 'Array instance', level: 0 },
  '0':       { found: 'Array instance', level: 0 },
  // Array.prototype
  'map':     { found: 'Array.prototype', level: 1 },
  'filter':  { found: 'Array.prototype', level: 1 },
  'forEach': { found: 'Array.prototype', level: 1 },
  'push':    { found: 'Array.prototype', level: 1 },
  'find':    { found: 'Array.prototype', level: 1 },
  'reduce':  { found: 'Array.prototype', level: 1 },
  'includes':{ found: 'Array.prototype', level: 1 },
  'sort':    { found: 'Array.prototype', level: 1 },
  // Object.prototype
  'toString':       { found: 'Object.prototype', level: 2 },
  'hasOwnProperty': { found: 'Object.prototype', level: 2 },
  'valueOf':        { found: 'Object.prototype', level: 2 },
  'constructor':    { found: 'Object.prototype', level: 2 },
};

const searchLevels = [
  'Array instance',
  'Array.prototype',
  'Object.prototype',
  'null — not found!'
];

async function runLookup() {
  const prop    = document.getElementById('lookup-prop').value.trim().toLowerCase();
  const result  = document.getElementById('lookup-result');
  result.innerHTML = '';

  if (!prop) return;

  const found = lookupMap[prop];
  const stopAt = found ? found.level + 1 : searchLevels.length;

  for (let i = 0; i < stopAt; i++) {
    await new Promise(r => setTimeout(r, 400));

    const step = document.createElement('div');

    if (i < stopAt - 1 || !found) {
      step.className = found && i === found.level ? 'lookup-step found' : 'lookup-step searching';

      if (found && i === found.level) {
        step.textContent = `✅ Found "${prop}" on ${searchLevels[i]}!`;
      } else {
        step.textContent = `🔍 Looking in ${searchLevels[i]}... not here`;
      }
    } else {
      step.className = 'lookup-step notfound';
      step.textContent = `❌ "${prop}" not found anywhere → TypeError`;
    }

    result.appendChild(step);
  }
}

document.getElementById('lookup-prop').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') runLookup();
});

/* ==========================================
   BUILD YOUR OWN CHAIN DEMO
   ========================================== */
class Animal {
  constructor(name) {
    this.name = name;
  }
  breathe() {
    return `${this.name} is breathing through Animal.prototype`;
  }
}

class Dog extends Animal {
  bark() {
    return `${this.name} says Woof! from Dog.prototype`;
  }
}

class Puppy extends Dog {
  play() {
    return `${this.name} is playing! from Puppy.prototype`;
  }
}

async function runChainDemo() {
  const log = document.getElementById('chain-log');
  log.innerHTML = '';

  const puppy = new Puppy('Bruno');

  const steps = [
    { el: 'breathe-output',       text: puppy.breathe(),  label: 'Animal.breathe()' },
    { el: 'bark-output',          text: puppy.bark(),     label: 'Dog.bark()' },
    { el: 'play-output',          text: puppy.play(),     label: 'Puppy.play()' },
    { el: 'puppy-bark-output',    text: puppy.bark(),     label: 'Puppy inherits bark from Dog' },
    { el: 'puppy-breathe-output', text: puppy.breathe(),  label: 'Puppy inherits breathe from Animal' },
  ];

  for (const step of steps) {
    await new Promise(r => setTimeout(r, 500));

    document.getElementById(step.el).textContent = step.text;

    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = `> ${step.label}: "${step.text}"`;
    log.appendChild(entry);
  }
}

/* ==========================================
   hasOwnProperty DEMO
   ========================================== */
const dog = { name: 'Bruno', age: 3 };

const propsToCheck = [
  { key: 'name',            value: '"Bruno"' },
  { key: 'age',             value: '3' },
  { key: 'toString',        value: 'ƒ toString()' },
  { key: 'hasOwnProperty',  value: 'ƒ hasOwnProperty()' },
  { key: 'map',             value: 'undefined' },
];

const ownPropsEl = document.getElementById('own-props');

propsToCheck.forEach(prop => {
  const isOwn = dog.hasOwnProperty(prop.key);

  const row = document.createElement('div');
  row.className = 'own-row';
  row.innerHTML = `
    <span class="own-key">${prop.key}</span>
    <span>${prop.value}</span>
    <span class="own-badge ${isOwn ? 'own' : 'inherited'}">
      ${isOwn ? '✅ own property' : '⬆ inherited'}
    </span>
  `;
  ownPropsEl.appendChild(row);
});